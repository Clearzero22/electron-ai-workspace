// Electron主进程 - Python服务集成
import { spawn, ChildProcess } from 'child_process'
import { join } from 'path'
import { app, ipcMain } from 'electron'
import { Logger } from '../../utils/logger'

/**
 * Python服务请求接口
 */
export interface PythonRequest {
  id?: number
  method: string
  params: Record<string, any>
}

/**
 * Python服务响应接口
 */
export interface PythonResponse {
  id: number
  success: boolean
  data?: any
  error?: string
  timestamp: string
}

/**
 * Python服务类
 * 负责与Python子进程通信
 */
export class PythonService {
  private process: ChildProcess | null = null
  private requestId = 0
  private pendingRequests = new Map<number, {
    resolve: (value: any) => void
    reject: (error: Error) => void
    timeout: NodeJS.Timeout
  }>()
  private logger = new Logger('PythonService')
  private reconnectAttempts = 0
  private maxReconnectAttempts = 3

  constructor() {
    this.initialize()
  }

  /**
   * 初始化Python子进程
   */
  private initialize() {
    const pythonPath = this.getPythonPath()
    const scriptPath = join(__dirname, '../../../services/python/ai_service.py')

    this.logger.info(`Initializing Python service: ${pythonPath}`)
    this.logger.info(`Script path: ${scriptPath}`)

    this.process = spawn(pythonPath, [scriptPath], {
      env: {
        ...process.env,
        PYTHONUNBUFFERED: '1', // 禁用Python输出缓冲
        PYTHONIOENCODING: 'utf-8'
      },
      stdio: ['pipe', 'pipe', 'pipe']
    })

    this.setupEventHandlers()
    this.startHeartbeat()
  }

  /**
   * 获取Python可执行文件路径
   */
  private getPythonPath(): string {
    // 开发环境使用系统Python
    if (process.env.NODE_ENV === 'development') {
      return process.platform === 'win32' ? 'python' : 'python3'
    }

    // 生产环境使用打包的Python
    if (process.platform === 'win32') {
      return join(process.resourcesPath, 'python', 'python.exe')
    } else {
      return join(process.resourcesPath, 'python', 'bin', 'python3')
    }
  }

  /**
   * 设置事件处理器
   */
  private setupEventHandlers() {
    if (!this.process) return

    // 处理标准输出
    this.process.stdout?.on('data', (data) => {
      try {
        const responses = data.toString()
          .split('\n')
          .filter(line => line.trim().length > 0)

        for (const line of responses) {
          try {
            const response = JSON.parse(line) as PythonResponse

            // 处理日志消息
            if ((response as any).type === 'log' || (response as any).type === 'request' || (response as any).type === 'response' || (response as any).type === 'error') {
              this.logger.debug(`Python: ${(response as any).message || (response as any).type}`)
              continue
            }

            // 处理响应
            const callback = this.pendingRequests.get(response.id)
            if (callback) {
              clearTimeout(callback.timeout)
              if (response.success) {
                callback.resolve(response.data)
              } else {
                callback.reject(new Error(response.error || 'Unknown error'))
              }
              this.pendingRequests.delete(response.id)
            } else {
              this.logger.warn(`Received response for unknown request: ${response.id}`)
            }
          } catch (parseError) {
            this.logger.error(`Failed to parse Python response: ${parseError}`)
          }
        }
      } catch (error) {
        this.logger.error(`Error processing stdout: ${error}`)
      }
    })

    // 处理标准错误
    this.process.stderr?.on('data', (data) => {
      this.logger.error(`Python stderr: ${data.toString()}`)
    })

    // 处理进程错误
    this.process.on('error', (error) => {
      this.logger.error(`Python process error: ${error.message}`)
      this.handleProcessError()
    })

    // 处理进程退出
    this.process.on('exit', (code, signal) => {
      this.logger.info(`Python process exited with code ${code}, signal ${signal}`)
      this.handleProcessExit()
    })
  }

  /**
   * 启动心跳检测
   */
  private startHeartbeat() {
    setInterval(() => {
      if (this.process && this.process.connected) {
        // 发送心跳请求
        this.call('health_check', {}, 5000).catch(() => {
          this.logger.warn('Python service health check failed')
        })
      }
    }, 30000) // 每30秒检查一次
  }

  /**
   * 处理进程错误
   */
  private handleProcessError() {
    this.reconnectAttempts++
    if (this.reconnectAttempts <= this.maxReconnectAttempts) {
      this.logger.info(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      setTimeout(() => {
        this.initialize()
      }, 2000 * this.reconnectAttempts)
    } else {
      this.logger.error('Max reconnection attempts reached')
    }
  }

  /**
   * 处理进程退出
   */
  private handleProcessExit() {
    // 拒绝所有待处理的请求
    for (const [id, callback] of this.pendingRequests) {
      clearTimeout(callback.timeout)
      callback.reject(new Error('Python service disconnected'))
    }
    this.pendingRequests.clear()
  }

  /**
   * 调用Python服务方法
   */
  private async call(method: string, params: Record<string, any> = {}, timeout: number = 30000): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = ++this.requestId

      // 设置超时
      const timer = setTimeout(() => {
        this.pendingRequests.delete(id)
        reject(new Error(`Request timeout: ${method}`))
      }, timeout)

      this.pendingRequests.set(id, {
        resolve,
        reject,
        timeout: timer
      })

      const request: PythonRequest = {
        id,
        method,
        params
      }

      try {
        this.process?.stdin.write(JSON.stringify(request) + '\n')
        this.logger.debug(`Sent request: ${method} (id: ${id})`)
      } catch (error) {
        clearTimeout(timer)
        this.pendingRequests.delete(id)
        reject(new Error(`Failed to send request: ${error}`))
      }
    })
  }

  // ========== 公开API ==========

  /**
   * 图像分析
   */
  async analyzeImage(imagePath: string): Promise<any> {
    return this.call('analyze_image', { image_path: imagePath })
  }

  /**
   * 生成商品描述
   */
  async generateDescription(product: Record<string, any>): Promise<any> {
    return this.call('generate_description', { product })
  }

  /**
   * 翻译文本
   */
  async translate(text: string, targetLang: string): Promise<any> {
    return this.call('translate', { text, target_lang: targetLang })
  }

  /**
   * 提取关键词
   */
  async extractKeywords(text: string, maxKeywords: number = 10): Promise<any> {
    return this.call('extract_keywords', { text, max_keywords: maxKeywords })
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.call('health_check', {}, 5000)
      return true
    } catch {
      return false
    }
  }

  /**
   * 销毁服务
   */
  destroy() {
    this.logger.info('Destroying Python service')
    this.process?.kill()
    this.process = null
  }
}

// ========== 单例模式 ==========

let pythonServiceInstance: PythonService | null = null

/**
 * 获取Python服务实例
 */
export function getPythonService(): PythonService {
  if (!pythonServiceInstance) {
    pythonServiceInstance = new PythonService()
  }
  return pythonServiceInstance
}

/**
 * 销毁Python服务实例
 */
export function destroyPythonService() {
  if (pythonServiceInstance) {
    pythonServiceInstance.destroy()
    pythonServiceInstance = null
  }
}

// ========== IPC处理器 ==========

/**
 * 注册Python服务的IPC处理器
 */
export function registerPythonIPCHandlers() {
  ipcMain.handle('python:analyzeImage', async (_event, imagePath: string) => {
    return getPythonService().analyzeImage(imagePath)
  })

  ipcMain.handle('python:generateDescription', async (_event, product: Record<string, any>) => {
    return getPythonService().generateDescription(product)
  })

  ipcMain.handle('python:translate', async (_event, text: string, targetLang: string) => {
    return getPythonService().translate(text, targetLang)
  })

  ipcMain.handle('python:extractKeywords', async (_event, text: string, maxKeywords: number) => {
    return getPythonService().extractKeywords(text, maxKeywords)
  })

  ipcMain.handle('python:healthCheck', async () => {
    return getPythonService().healthCheck()
  })
}
