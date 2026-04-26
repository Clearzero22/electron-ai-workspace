/**
 * 窗口管理Hook
 * 在React组件中方便地管理窗口
 */

import { useState, useEffect, useCallback } from 'react'

/**
 * 使用窗口管理
 */
export function useWindowManager() {
  const [windowInfo, setWindowInfo] = useState<any>(null)
  const [allWindows, setAllWindows] = useState<any[]>([])

  // 获取当前窗口信息
  const refreshWindowInfo = useCallback(async () => {
    try {
      const info = await window.window.getWindowInfo()
      setWindowInfo(info)
    } catch (error) {
      console.error('Failed to get window info:', error)
    }
  }, [])

  // 获取所有窗口信息
  const refreshAllWindows = useCallback(async () => {
    try {
      const result = await window.window.getAllWindows()
      if (result.success) {
        setAllWindows(result.windows || [])
      }
    } catch (error) {
      console.error('Failed to get all windows:', error)
    }
  }, [])

  // 创建新窗口
  const createWindow = useCallback(
    async (config: {
      id: string
      route?: string
      title?: string
      width?: number
      height?: number
      minWidth?: number
      minHeight?: number
      modal?: boolean
      alwaysOnTop?: boolean
    }) => {
      try {
        const result = await window.window.createWindow(config)
        if (result.success) {
          // 刷新窗口列表
          setTimeout(() => refreshAllWindows(), 100)
        }
        return result
      } catch (error) {
        console.error('Failed to create window:', error)
        return { success: false, error: String(error) }
      }
    },
    [refreshAllWindows]
  )

  // 关闭窗口
  const closeWindow = useCallback(
    async (windowId: string) => {
      try {
        const result = await window.window.closeWindow(windowId)
        if (result.success) {
          // 刷新窗口列表
          setTimeout(() => refreshAllWindows(), 100)
        }
        return result
      } catch (error) {
        console.error('Failed to close window:', error)
        return { success: false, error: String(error) }
      }
    },
    [refreshAllWindows]
  )

  // 广播消息
  const broadcast = useCallback(async (channel: string, ...args: any[]) => {
    try {
      return await window.window.broadcast(channel, ...args)
    } catch (error) {
      console.error('Failed to broadcast:', error)
      return { success: false, error: String(error) }
    }
  }, [])

  // 发送消息到指定窗口
  const sendToWindow = useCallback(async (windowId: string, channel: string, ...args: any[]) => {
    try {
      return await window.window.sendToWindow(windowId, channel, ...args)
    } catch (error) {
      console.error('Failed to send to window:', error)
      return { success: false, error: String(error) }
    }
  }, [])

  // 窗口控制
  const minimize = useCallback(async () => {
    return await window.window.minimize()
  }, [])

  const maximize = useCallback(async () => {
    return await window.window.maximize()
  }, [])

  const hide = useCallback(async () => {
    return await window.window.hide()
  }, [])

  const show = useCallback(async () => {
    return await window.window.show()
  }, [])

  const focus = useCallback(async () => {
    return await window.window.focus()
  }, [])

  // 初始化
  useEffect(() => {
    refreshWindowInfo()
    refreshAllWindows()
  }, [refreshWindowInfo, refreshAllWindows])

  return {
    windowInfo,
    allWindows,
    createWindow,
    closeWindow,
    broadcast,
    sendToWindow,
    minimize,
    maximize,
    hide,
    show,
    focus,
    refreshWindowInfo,
    refreshAllWindows
  }
}

/**
 * 使用窗口间通信
 */
export function useWindowCommunication(channel: string, callback: (...args: any[]) => void) {
  useEffect(() => {
    const handleMessage = (_event: any, ...args: any[]) => {
      callback(...args)
    }

    window.window.onWindowMessage(channel, handleMessage)

    return () => {
      window.window.removeWindowMessageListener(channel, handleMessage)
    }
  }, [channel, callback])
}

/**
 * 预定义的窗口配置
 */
export const WindowPresets = {
  // 工作流编辑器窗口
  workflowEditor: {
    id: 'workflow-editor',
    route: '/workflow',
    title: '工作流编辑器',
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700
  },

  // 设置窗口
  settings: {
    id: 'settings',
    route: '/settings',
    title: '设置',
    width: 700,
    height: 500,
    modal: true,
    resizable: false
  },

  // 多语言服务窗口
  multilang: {
    id: 'multilang-service',
    route: '/multilang',
    title: '多语言服务',
    width: 1000,
    height: 700
  },

  // 预览窗口
  preview: {
    id: 'preview',
    route: '/preview',
    title: '预览',
    width: 600,
    height: 400,
    alwaysOnTop: true,
    frame: false
  },

  // 关于窗口
  about: {
    id: 'about',
    route: '/about',
    title: '关于',
    width: 400,
    height: 300,
    modal: true,
    resizable: false
  }
}
