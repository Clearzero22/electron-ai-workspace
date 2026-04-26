// Electron主进程 - Go服务集成
import { spawn, ChildProcess } from 'child_process'
import { join } from 'path'
import { app, ipcMain } from 'electron'
import { Logger } from '../../utils/logger'

/**
 * Go服务请求接口
 */
export interface GoRequest {
  id?: number
  method: string
  params: Record<string, any>
}

/**
 * Go服务响应接口
 */
export interface GoResponse {
  id: number
  success: boolean
  data?: any
  error?: string
  timestamp: string
}

/**
 * Go服务类
 * 负责与Go子进程通信
 */
export class GoService {
  private process: ChildProcess | null = null
  private requestId = 0
  private pendingRequests = new Map<number, {
    resolve: (value: any) => void
    reject: (error: Error) => void
    timeout: NodeJS.Timeout
  }>()
  private logger = new Logger('GoService')

  constructor() {
    this.initialize()
  }

  /**
   * 初始化Go子进程
   */
  private initialize() {
    const executablePath = this.getExecutablePath()

    this.logger.info(`Initializing Go service: ${executablePath}`)

    this.process = spawn(executablePath, [], {
      env: {
        ...process.env
      },
      stdio: ['pipe', 'pipe', 'pipe']
    })

    this.setupEventHandlers()
  }

  /**
   * 获取Go可执行文件路径
   */
  private getExecutablePath(): string {
    const execName = process.platform === 'win32' ? 'crawler.exe' : 'crawler'

    // 开发环境
    if (process.env.NODE_ENV === 'development') {
      return join(__dirname, '../../../services/go', execName)
    }

    // 生产环境
    return join(process.resourcesPath, 'go', execName)
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
            const response = JSON.parse(line) as GoResponse
            this.handleResponse(response)
          } catch (parseError) {
            this.logger.error(`Failed to parse Go response: ${parseError}`)
          }
        }
      } catch (error) {
        this.logger.error(`Error processing stdout: ${error}`)
      }
    })

    // 处理标准错误
    this.process.stderr?.on('data', (data) => {
      this.logger.error(`Go stderr: ${data.toString()}`)
    })

    // 处理进程错误
    this.process.on('error', (error) => {
      this.logger.error(`Go process error: ${error.message}`)
    })

    // 处理进程退出
    this.process.on('exit', (code, signal) => {
      this.logger.info(`Go process exited with code ${code}, signal ${signal}`)
    })
  }

  /**
   * 处理响应
   */
  private handleResponse(response: GoResponse) {
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
  }

  /**
   * 调用Go服务方法
   */
  private async call(method: string, params: Record<string, any> = {}, timeout: number = 60000): Promise<any> {
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

      const request: GoRequest = {
        id,
        method,
        params
      }

      try {
        this.process?.stdin.write(JSON.stringify(request) + '\n')
        this.logger.debug(`Sent Go request: ${method} (id: ${id})`)
      } catch (error) {
        clearTimeout(timer)
        this.pendingRequests.delete(id)
        reject(new Error(`Failed to send Go request: ${error}`))
      }
    })
  }

  // ========== 公开API ==========

  /**
   * 爬取商品
   */
  async crawlProduct(url: string): Promise<any> {
    return this.call('crawl_product', { url })
  }

  /**
   * 批量爬取
   */
  async batchCrawl(urls: string[]): Promise<any> {
    return this.call('batch_crawl', { urls })
  }

  /**
   * 监控价格
   */
  async monitorPrice(url: string): Promise<any> {
    return this.call('monitor_price', { url })
  }

  /**
   * 爬取竞品
   */
  async crawlCompetitors(productName: string): Promise<any> {
    return this.call('crawl_competitors', { product_name: productName })
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<boolean> {
    try {
      // 发送一个简单的测试请求
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
    this.logger.info('Destroying Go service')
    this.process?.kill()
    this.process = null
  }
}

// ========== 单例模式 ==========

let goServiceInstance: GoService | null = null

/**
 * 获取Go服务实例
 */
export function getGoService(): GoService {
  if (!goServiceInstance) {
    goServiceInstance = new GoService()
  }
  return goServiceInstance
}

/**
 * 销毁Go服务实例
 */
export function destroyGoService() {
  if (goServiceInstance) {
    goServiceInstance.destroy()
    goServiceInstance = null
  }
}

// ========== IPC处理器 ==========

/**
 * 注册Go服务的IPC处理器
 */
export function registerGoIPCHandlers() {
  ipcMain.handle('go:crawlProduct', async (_event, url: string) => {
    return getGoService().crawlProduct(url)
  })

  ipcMain.handle('go:batchCrawl', async (_event, urls: string[]) => {
    return getGoService().batchCrawl(urls)
  })

  ipcMain.handle('go:monitorPrice', async (_event, url: string) => {
    return getGoService().monitorPrice(url)
  })

  ipcMain.handle('go:crawlCompetitors', async (_event, productName: string) => {
    return getGoService().crawlCompetitors(productName)
  })

  ipcMain.handle('go:healthCheck', async () => {
    return getGoService().healthCheck()
  })
}
