/**
 * 窗口管理相关的IPC处理器
 */

import { ipcMain, BrowserWindow } from 'electron'
import { windowManager } from '../windowManager'
import type { WindowConfig } from '../windowManager'

/**
 * 注册窗口管理相关的IPC处理器
 */
export function registerWindowIPCHandlers() {
  /**
   * 创建新窗口
   */
  ipcMain.handle('window:create', async (_event, config: WindowConfig) => {
    try {
      windowManager.createWindow(config)
      return {
        success: true,
        windowId: config.id
      }
    } catch (error) {
      console.error('Failed to create window:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })

  /**
   * 关闭窗口
   */
  ipcMain.handle('window:close', async (_event, windowId: string) => {
    try {
      windowManager.closeWindow(windowId)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })

  /**
   * 获取窗口信息
   */
  ipcMain.handle('window:getInfo', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) {
      // 找到对应的窗口ID
      const windowId = Array.from(windowManager['windows'].entries()).find(([_, w]) => w === win)?.[0]
      if (windowId) {
        return windowManager.getWindowInfo(windowId)
      }
    }
    return null
  })

  /**
   * 获取所有窗口信息
   */
  ipcMain.handle('window:getAll', async () => {
    try {
      return {
        success: true,
        windows: windowManager.getAllWindowsInfo()
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        windows: []
      }
    }
  })

  /**
   * 发送消息到指定窗口
   */
  ipcMain.handle('window:send', async (_event, windowId: string, channel: string, ...args: any[]) => {
    try {
      const success = windowManager.sendToWindow(windowId, channel, ...args)
      return { success }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })

  /**
   * 广播消息到所有窗口
   */
  ipcMain.handle('window:broadcast', async (_event, channel: string, ...args: any[]) => {
    try {
      windowManager.broadcast(channel, ...args)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })

  /**
   * 窗口控制操作
   */
  ipcMain.handle('window:minimize', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) {
      win.minimize()
      return { success: true }
    }
    return { success: false }
  })

  ipcMain.handle('window:maximize', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) {
      if (win.isMaximized()) {
        win.unmaximize()
      } else {
        win.maximize()
      }
      return { success: true }
    }
    return { success: false }
  })

  ipcMain.handle('window:hideWindow', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) {
      win.hide()
      return { success: true }
    }
    return { success: false }
  })

  ipcMain.handle('window:showWindow', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) {
      win.show()
      return { success: true }
    }
    return { success: false }
  })

  /**
   * 窗口焦点控制
   */
  ipcMain.handle('window:focus', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) {
      win.focus()
      return { success: true }
    }
    return { success: false }
  })

  ipcMain.handle('window:blur', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) {
      win.blur()
      return { success: true }
    }
    return { success: false }
  })

  /**
   * 设置窗口标题
   */
  ipcMain.handle('window:setTitle', async (event, title: string) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) {
      win.setTitle(title)
      return { success: true }
    }
    return { success: false }
  })

  /**
   * 设置窗口大小
   */
  ipcMain.handle('window:setSize', async (event, width: number, height: number) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) {
      win.setSize(width, height)
      return { success: true }
    }
    return { success: false }
  })

  /**
   * 设置窗口位置
   */
  ipcMain.handle('window:setPosition', async (event, x: number, y: number) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) {
      win.setPosition(x, y)
      return { success: true }
    }
    return { success: false }
  })

  /**
   * 窗口居中
   */
  ipcMain.handle('window:center', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) {
      win.center()
      return { success: true }
    }
    return { success: false }
  })

  console.log('Window IPC handlers registered successfully')
}
