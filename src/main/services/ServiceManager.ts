/**
 * 服务管理器
 * 统一管理所有外部语言服务
 */

import { getPythonService, destroyPythonService } from './python'
import { getGoService, destroyGoService } from './go'
import { Logger } from '../utils/logger'

/**
 * 服务类型枚举
 */
export enum ServiceType {
  PYTHON = 'python',
  GO = 'go',
  RUST = 'rust',
  WASM = 'wasm'
}

/**
 * 服务状态
 */
export interface ServiceStatus {
  type: ServiceType
  running: boolean
  healthy: boolean
  lastCheck: Date
}

/**
 * 服务管理器类
 */
export class ServiceManager {
  private static instance: ServiceManager | null = null
  private logger = new Logger('ServiceManager')
  private services = new Map<ServiceType, any>()
  private healthCheckInterval: NodeJS.Timeout | null = null

  private constructor() {
    this.initialize()
  }

  /**
   * 获取单例实例
   */
  static getInstance(): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager()
    }
    return ServiceManager.instance
  }

  /**
   * 初始化所有服务
   */
  private initialize() {
    this.logger.info('Initializing ServiceManager...')

    // 初始化Python服务
    try {
      this.services.set(ServiceType.PYTHON, getPythonService())
      this.logger.info('Python service initialized')
    } catch (error) {
      this.logger.error('Failed to initialize Python service:', error)
    }

    // 初始化Go服务
    try {
      this.services.set(ServiceType.GO, getGoService())
      this.logger.info('Go service initialized')
    } catch (error) {
      this.logger.error('Failed to initialize Go service:', error)
    }

    // 启动健康检查
    this.startHealthCheck()
  }

  /**
   * 获取服务实例
   */
  getService<T = any>(type: ServiceType): T | null {
    return this.services.get(type) || null
  }

  /**
   * 检查服务健康状态
   */
  async checkServiceHealth(type: ServiceType): Promise<boolean> {
    const service = this.getService(type)

    if (!service) {
      return false
    }

    try {
      switch (type) {
        case ServiceType.PYTHON:
          return await service.healthCheck()
        case ServiceType.GO:
          return await service.healthCheck()
        default:
          return false
      }
    } catch (error) {
      this.logger.error(`Health check failed for ${type}:`, error)
      return false
    }
  }

  /**
   * 获取所有服务状态
   */
  async getAllServiceStatus(): Promise<ServiceStatus[]> {
    const statuses: ServiceStatus[] = []

    for (const [type] of this.services) {
      const healthy = await this.checkServiceHealth(type)
      statuses.push({
        type,
        running: true,
        healthy,
        lastCheck: new Date()
      })
    }

    return statuses
  }

  /**
   * 启动定期健康检查
   */
  private startHealthCheck() {
    this.healthCheckInterval = setInterval(async () => {
      const statuses = await this.getAllServiceStatus()

      for (const status of statuses) {
        if (!status.healthy) {
          this.logger.warn(`Service ${status.type} is unhealthy`)
          // 可以在这里添加自动重启逻辑
        }
      }
    }, 60000) // 每分钟检查一次
  }

  /**
   * 停止健康检查
   */
  private stopHealthCheck() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
      this.healthCheckInterval = null
    }
  }

  /**
   * 重启服务
   */
  async restartService(type: ServiceType): Promise<boolean> {
    this.logger.info(`Restarting service: ${type}`)

    try {
      // 销毁旧服务
      await this.stopService(type)

      // 启动新服务
      switch (type) {
        case ServiceType.PYTHON:
          this.services.set(type, getPythonService())
          break
        case ServiceType.GO:
          this.services.set(type, getGoService())
          break
        default:
          this.logger.error(`Unknown service type: ${type}`)
          return false
      }

      // 等待服务启动
      await new Promise(resolve => setTimeout(resolve, 2000))

      // 健康检查
      const healthy = await this.checkServiceHealth(type)
      if (healthy) {
        this.logger.info(`Service ${type} restarted successfully`)
        return true
      } else {
        this.logger.error(`Service ${type} failed health check after restart`)
        return false
      }
    } catch (error) {
      this.logger.error(`Failed to restart service ${type}:`, error)
      return false
    }
  }

  /**
   * 停止服务
   */
  async stopService(type: ServiceType): Promise<void> {
    const service = this.services.get(type)

    if (service) {
      switch (type) {
        case ServiceType.PYTHON:
          destroyPythonService()
          break
        case ServiceType.GO:
          destroyGoService()
          break
        default:
          this.logger.error(`Unknown service type: ${type}`)
      }

      this.services.delete(type)
      this.logger.info(`Service ${type} stopped`)
    }
  }

  /**
   * 销毁所有服务
   */
  async destroyAll(): Promise<void> {
    this.logger.info('Destroying all services...')

    this.stopHealthCheck()

    // 停止所有服务
    for (const type of this.services.keys()) {
      await this.stopService(type)
    }

    this.services.clear()
    this.logger.info('All services destroyed')
  }

  // ========== 便捷方法 ==========

  /**
   * Python AI服务
   */
  get python() {
    return this.getService(ServiceType.PYTHON)
  }

  /**
   * Go爬虫服务
   */
  get go() {
    return this.getService(ServiceType.GO)
  }
}

// ========== 导出便捷函数 ==========

/**
 * 获取服务管理器实例
 */
export function getServiceManager(): ServiceManager {
  return ServiceManager.getInstance()
}

// ========== 应用退出时清理 ==========

/**
 * 在应用退出时清理所有服务
 */
export function cleanupServices() {
  getServiceManager().destroyAll()
}
