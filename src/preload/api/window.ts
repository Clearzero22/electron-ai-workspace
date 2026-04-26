/**
 * 预加载脚本 - 窗口管理API
 * 暴露给渲染进程的安全窗口操作API
 */

import { ipcRenderer } from 'electron'

/**
 * 窗口管理API
 */
export const windowAPI = {
  /**
   * 创建新窗口
   */
  async createWindow(config: {
    id: string
    route?: string
    title?: string
    width?: number
    height?: number
    minWidth?: number
    minHeight?: number
    modal?: boolean
    resizable?: boolean
    parent?: string
    alwaysOnTop?: boolean
    frame?: boolean
    transparent?: boolean
  }): Promise<{ success: boolean; windowId?: string; error?: string }> {
    return ipcRenderer.invoke('window:create', config)
  },

  /**
   * 关闭指定窗口
   */
  async closeWindow(windowId: string): Promise<{ success: boolean; error?: string }> {
    return ipcRenderer.invoke('window:close', windowId)
  },

  /**
   * 获取当前窗口信息
   */
  async getWindowInfo(): Promise<any> {
    return ipcRenderer.invoke('window:getInfo')
  },

  /**
   * 获取所有窗口信息
   */
  async getAllWindows(): Promise<{ success: boolean; windows: any[]; error?: string }> {
    return ipcRenderer.invoke('window:getAll')
  },

  /**
   * 发送消息到指定窗口
   */
  async sendToWindow(
    windowId: string,
    channel: string,
    ...args: any[]
  ): Promise<{ success: boolean; error?: string }> {
    return ipcRenderer.invoke('window:send', windowId, channel, ...args)
  },

  /**
   * 广播消息到所有窗口
   */
  async broadcast(channel: string, ...args: any[]): Promise<{ success: boolean; error?: string }> {
    return ipcRenderer.invoke('window:broadcast', channel, ...args)
  },

  /**
   * 窗口控制操作
   */
  async minimize(): Promise<{ success: boolean }> {
    return ipcRenderer.invoke('window:minimize')
  },

  async maximize(): Promise<{ success: boolean }> {
    return ipcRenderer.invoke('window:maximize')
  },

  async hide(): Promise<{ success: boolean }> {
    return ipcRenderer.invoke('window:hideWindow')
  },

  async show(): Promise<{ success: boolean }> {
    return ipcRenderer.invoke('window:showWindow')
  },

  async focus(): Promise<{ success: boolean }> {
    return ipcRenderer.invoke('window:focus')
  },

  async blur(): Promise<{ success: boolean }> {
    return ipcRenderer.invoke('window:blur')
  },

  /**
   * 窗口设置
   */
  async setTitle(title: string): Promise<{ success: boolean }> {
    return ipcRenderer.invoke('window:setTitle', title)
  },

  async setSize(width: number, height: number): Promise<{ success: boolean }> {
    return ipcRenderer.invoke('window:setSize', width, height)
  },

  async setPosition(x: number, y: number): Promise<{ success: boolean }> {
    return ipcRenderer.invoke('window:setPosition', x, y)
  },

  async center(): Promise<{ success: boolean }> {
    return ipcRenderer.invoke('window:center')
  },

  /**
   * 监听来自其他窗口的消息
   */
  onWindowMessage(channel: string, callback: (...args: any[]) => void): void {
    ipcRenderer.on(channel, callback)
  },

  /**
   * 移除监听器
   */
  removeWindowMessageListener(channel: string, callback: (...args: any[]) => void): void {
    ipcRenderer.removeListener(channel, callback)
  },

  /**
   * 监听一次性消息
   */
  onceWindowMessage(channel: string, callback: (...args: any[]) => void): void {
    ipcRenderer.once(channel, callback)
  }
}
