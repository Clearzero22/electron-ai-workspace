/**
 * IPC 通信模块
 * 注册所有IPC处理器
 */

import { ipcMain } from 'electron'
import { registerPythonIPCHandlers } from '../services/python'
import { registerGoIPCHandlers } from '../services/go'
import { getServiceManager } from '../services/ServiceManager'

/**
 * 初始化所有IPC处理器
 */
export function registerIPCHandlers() {
  console.log('Registering IPC handlers...')

  // 注册Python服务处理器
  registerPythonIPCHandlers()

  // 注册Go服务处理器
  registerGoIPCHandlers()

  // 注册服务管理处理器
  registerServiceManagerHandlers()

  console.log('All IPC handlers registered successfully')
}

/**
 * 注册服务管理处理器
 */
function registerServiceManagerHandlers() {
  ipcMain.handle('services:getStatus', async () => {
    const manager = getServiceManager()
    return await manager.getAllServiceStatus()
  })

  ipcMain.handle('services:restart', async (_event, serviceType: string) => {
    const manager = getServiceManager()
    return await manager.restartService(serviceType as any)
  })

  ipcMain.handle('services:healthCheck', async (_event, serviceType?: string) => {
    const manager = getServiceManager()
    if (serviceType) {
      return await manager.checkServiceHealth(serviceType as any)
    } else {
      const statuses = await manager.getAllServiceStatus()
      return Object.fromEntries(
        statuses.map(s => [s.type, s.healthy])
      )
    }
  })
}
