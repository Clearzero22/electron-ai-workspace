/**
 * 窗口管理器
 * 统一管理应用中的所有窗口
 */

import { BrowserWindow, app } from 'electron'
import { join } from 'path'

export interface WindowConfig {
  id: string
  route?: string
  title?: string
  width?: number
  height?: number
  minWidth?: number
  minHeight?: number
  parent?: BrowserWindow | string
  modal?: boolean
  resizable?: boolean
  frame?: boolean
  transparent?: boolean
  alwaysOnTop?: boolean
}

class WindowManager {
  private windows: Map<string, BrowserWindow> = new Map()

  /**
   * 创建新窗口
   */
  createWindow(config: WindowConfig): BrowserWindow {
    const {
      id,
      route = '/',
      title = 'AI CrossBorder',
      width = 900,
      height = 670,
      minWidth,
      minHeight,
      parent,
      modal = false,
      resizable = true,
      frame = true,
      transparent = false,
      alwaysOnTop = false
    } = config

    // 检查窗口是否已存在
    const existingWindow = this.windows.get(id)
    if (existingWindow && !existingWindow.isDestroyed()) {
      existingWindow.focus()
      return existingWindow
    }

    // 获取父窗口
    let parentWindow: BrowserWindow | undefined
    if (typeof parent === 'string') {
      parentWindow = this.windows.get(parent)
    } else if (parent) {
      parentWindow = parent
    }

    // 创建新窗口
    const newWindow = new BrowserWindow({
      width,
      height,
      minWidth,
      minHeight,
      show: false,
      autoHideMenuBar: true,
      parent: parentWindow,
      modal,
      resizable,
      frame,
      transparent,
      alwaysOnTop,
      ...(process.platform === 'linux' ? { icon: join(process.resourcesPath || '', 'icon.png') } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        nodeIntegration: false,
        contextIsolation: true
      }
    })

    // 设置窗口标题
    newWindow.setTitle(title)

    // 加载页面
    if (process.env.NODE_ENV === 'development' && process.env.ELECTRON_RENDERER_URL) {
      newWindow.loadURL(process.env.ELECTRON_RENDERER_URL + '#' + route)
      // 开发环境下打开开发者工具
      // newWindow.webContents.openDevTools()
    } else {
      newWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: route })
    }

    // 窗口准备好后显示
    newWindow.once('ready-to-show', () => {
      newWindow.show()
    })

    // 窗口关闭时从管理器中移除
    newWindow.on('closed', () => {
      this.windows.delete(id)
      console.log(`Window ${id} closed`)
    })

    // 保存窗口引用
    this.windows.set(id, newWindow)

    console.log(`Window ${id} created with route: ${route}`)

    return newWindow
  }

  /**
   * 获取窗口
   */
  getWindow(id: string): BrowserWindow | undefined {
    return this.windows.get(id)
  }

  /**
   * 关闭窗口
   */
  closeWindow(id: string): void {
    const window = this.windows.get(id)
    if (window && !window.isDestroyed()) {
      window.close()
    }
  }

  /**
   * 关闭所有窗口
   */
  closeAllWindows(): void {
    this.windows.forEach((window) => {
      if (!window.isDestroyed()) {
        window.close()
      }
    })
    this.windows.clear()
  }

  /**
   * 获取所有窗口
   */
  getAllWindows(): BrowserWindow[] {
    return Array.from(this.windows.values()).filter((w) => !w.isDestroyed())
  }

  /**
   * 广播消息到所有窗口
   */
  broadcast(channel: string, ...args: any[]): void {
    this.getAllWindows().forEach((window) => {
      if (!window.isDestroyed()) {
        window.webContents.send(channel, ...args)
      }
    })
  }

  /**
   * 发送消息到指定窗口
   */
  sendToWindow(windowId: string, channel: string, ...args: any[]): boolean {
    const targetWindow = this.getWindow(windowId)
    if (targetWindow && !targetWindow.isDestroyed()) {
      targetWindow.webContents.send(channel, ...args)
      return true
    }
    return false
  }

  /**
   * 获取窗口信息
   */
  getWindowInfo(id: string): any {
    const window = this.getWindow(id)
    if (window && !window.isDestroyed()) {
      return {
        id,
        title: window.getTitle(),
        isFocused: window.isFocused(),
        isMinimized: window.isMinimized(),
        isMaximized: window.isMaximized(),
        isFullScreen: window.isFullScreen(),
        bounds: window.getBounds(),
        isVisible: window.isVisible()
      }
    }
    return null
  }

  /**
   * 获取所有窗口信息
   */
  getAllWindowsInfo(): any[] {
    return this.getAllWindows().map((window) => {
      const id = Array.from(this.windows.entries()).find(([_, w]) => w === window)?.[0]
      return {
        id,
        title: window.getTitle(),
        isFocused: window.isFocused(),
        isMinimized: window.isMinimized(),
        isMaximized: window.isMaximized(),
        bounds: window.getBounds()
      }
    })
  }
}

// 导出单例
export const windowManager = new WindowManager()
