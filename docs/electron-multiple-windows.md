# Electron 多窗口和多页面实现指南

## 📋 目录
1. [多窗口管理](#多窗口管理)
2. [多页面方案](#多页面方案)
3. [窗口间通信](#窗口间通信)
4. [最佳实践](#最佳实践)

---

## 1. 多窗口管理

### 1.1 创建窗口管理器

创建一个专门的窗口管理器来统一管理所有窗口：

```typescript
// src/main/windowManager.ts
import { BrowserWindow, app } from 'electron'
import { join } from 'path'

export interface WindowConfig {
  id: string
  route?: string
  title?: string
  width?: number
  height?: number
  parent?: BrowserWindow
  modal?: boolean
}

class WindowManager {
  private windows: Map<string, BrowserWindow> = new Map()

  /**
   * 创建新窗口
   */
  createWindow(config: WindowConfig): BrowserWindow {
    const { id, route = '/', title = 'Electron App', width = 900, height = 670, parent, modal = false } = config

    // 检查窗口是否已存在
    const existingWindow = this.windows.get(id)
    if (existingWindow && !existingWindow.isDestroyed()) {
      existingWindow.focus()
      return existingWindow
    }

    // 创建新窗口
    const mainWindow = new BrowserWindow({
      width,
      height,
      show: false,
      autoHideMenuBar: true,
      parent: parent || undefined,
      modal: modal,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        nodeIntegration: false,
        contextIsolation: true
      }
    })

    // 窗口标题
    mainWindow.setTitle(title)

    // 加载页面
    if (process.env.NODE_ENV === 'development') {
      mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL + '#' + route)
      mainWindow.webContents.openDevTools()
    } else {
      mainWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: route })
    }

    // 窗口准备好后显示
    mainWindow.once('ready-to-show', () => {
      mainWindow.show()
    })

    // 窗口关闭时从管理器中移除
    mainWindow.on('closed', () => {
      this.windows.delete(id)
    })

    // 保存窗口引用
    this.windows.set(id, mainWindow)

    return mainWindow
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
    return Array.from(this.windows.values()).filter(w => !w.isDestroyed())
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
}

// 导出单例
export const windowManager = new WindowManager()
```

### 1.2 在主进程使用窗口管理器

```typescript
// src/main/index.ts
import { windowManager } from './windowManager'

app.whenReady().then(() => {
  // 创建主窗口
  windowManager.createWindow({
    id: 'main',
    route: '/',
    title: '跨境电商工作台'
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      windowManager.createWindow({
        id: 'main',
        route: '/'
      })
    }
  })
})

// IPC处理器：创建新窗口
ipcMain.handle('window:create', async (event, config: WindowConfig) => {
  const window = windowManager.createWindow(config)
  return { success: true, windowId: config.id }
})

// IPC处理器：关闭窗口
ipcMain.handle('window:close', async (event, windowId: string) => {
  windowManager.closeWindow(windowId)
  return { success: true }
})

// IPC处理器：获取所有窗口
ipcMain.handle('window:getAll', async () => {
  return windowManager.getAllWindows().map(w => ({
    id: w.webContents.id,
    title: w.getTitle()
  }))
})
```

---

## 2. 多页面方案

### 2.1 使用 React Router（推荐）

在渲染进程中使用React Router实现多页面：

```typescript
// src/renderer/src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Workspace from './pages/Workspace'
import WorkflowEditor from './components/WorkflowEditor'
import MultilangTestPage from './components/MultilangTestPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Workspace />} />
        <Route path="/workflow" element={<WorkflowEditor />} />
        <Route path="/multilang" element={<MultilangTestPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
```

### 2.2 窗口间打开不同路由

```typescript
// 在渲染进程中打开新窗口并导航到特定路由
const openNewWindow = (route: string) => {
  window.electron.ipcRenderer.invoke('window:create', {
    id: 'secondary-' + Date.now(),
    route: route,
    title: '新窗口',
    width: 800,
    height: 600
  })
}

// 使用示例
<button onClick={() => openNewWindow('/settings')}>打开设置</button>
```

---

## 3. 窗口间通信

### 3.1 主进程转发通信

```typescript
// src/main/ipc/window.ts
import { ipcMain } from 'electron'
import { windowManager } from '../windowManager'

/**
 * 窗口间通信
 */
export function setupWindowIPC() {
  // 发送消息到指定窗口
  ipcMain.handle('window:send', (event, windowId: string, channel: string, ...args: any[]) => {
    const targetWindow = windowManager.getWindow(windowId)
    if (targetWindow && !targetWindow.isDestroyed()) {
      targetWindow.webContents.send(channel, ...args)
      return { success: true }
    }
    return { success: false, error: 'Window not found' }
  })

  // 广播消息到所有窗口
  ipcMain.handle('window:broadcast', (event, channel: string, ...args: any[]) => {
    windowManager.broadcast(channel, ...args)
    return { success: true }
  })

  // 获取窗口信息
  ipcMain.handle('window:getInfo', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) {
      return {
        id: win.id,
        title: win.getTitle(),
        isFocused: win.isFocused(),
        isMinimized: win.isMinimized(),
        isMaximized: win.isMaximized(),
        isFullScreen: win.isFullScreen(),
        bounds: win.getBounds()
      }
    }
    return null
  })
}
```

### 3.2 渲染进程使用通信API

```typescript
// src/preload/api/window.ts
export const windowAPI = {
  /**
   * 创建新窗口
   */
  async createWindow(config: {
    id?: string
    route?: string
    title?: string
    width?: number
    height?: number
    modal?: boolean
  }): Promise<{ success: boolean; windowId?: string }> {
    return ipcRenderer.invoke('window:create', config)
  },

  /**
   * 关闭窗口
   */
  async closeWindow(windowId: string): Promise<{ success: boolean }> {
    return ipcRenderer.invoke('window:close', windowId)
  },

  /**
   * 发送消息到其他窗口
   */
  async sendToWindow(windowId: string, channel: string, ...args: any[]): Promise<{ success: boolean }> {
    return ipcRenderer.invoke('window:send', windowId, channel, ...args)
  },

  /**
   * 广播消息到所有窗口
   */
  async broadcast(channel: string, ...args: any[]): Promise<{ success: boolean }> {
    return ipcRenderer.invoke('window:broadcast', channel, ...args)
  },

  /**
   * 获取当前窗口信息
   */
  async getWindowInfo(): Promise<any> {
    return ipcRenderer.invoke('window:getInfo')
  },

  /**
   * 监听来自其他窗口的消息
   */
  onWindowMessage(channel: string, callback: (...args: any[]) => void) {
    ipcRenderer.on(channel, callback)
  },

  /**
   * 移除监听器
   */
  removeWindowMessageListener(channel: string, callback: (...args: any[]) => void) {
    ipcRenderer.removeListener(channel, callback)
  }
}
```

### 3.3 使用示例

```typescript
// 在组件中使用窗口通信
import { useEffect, useState } from 'react'

function MyComponent() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    // 监听来自其他窗口的消息
    const handleMessage = (event, data) => {
      setMessages(prev => [...prev, data])
    }

    window.electron.onWindowMessage('window:communication', handleMessage)

    return () => {
      window.electron.removeWindowMessageListener('window:communication', handleMessage)
    }
  }, [])

  // 发送消息到所有窗口
  const broadcastMessage = () => {
    window.electron.broadcast('window:communication', {
      from: 'current-window',
      message: 'Hello from Window 1',
      timestamp: Date.now()
    })
  }

  // 打开新窗口
  const openNewWindow = () => {
    window.electron.createWindow({
      id: 'window-2',
      route: '/workflow',
      title: '工作流编辑器'
    })
  }

  return (
    <div>
      <button onClick={openNewWindow}>打开新窗口</button>
      <button onClick={broadcastMessage}>广播消息</button>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{JSON.stringify(msg)}</li>
        ))}
      </ul>
    </div>
  )
}
```

---

## 4. 最佳实践

### 4.1 窗口类型设计

```typescript
// 定义不同类型的窗口配置
export const WindowTypes = {
  MAIN: {
    id: 'main',
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600
  },
  WORKFLOW_EDITOR: {
    id: 'workflow-editor',
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700
  },
  SETTINGS: {
    id: 'settings',
    width: 700,
    height: 500,
    modal: true,
    resizable: false
  },
  PREVIEW: {
    id: 'preview',
    width: 600,
    height: 400,
    alwaysOnTop: true
  }
}
```

### 4.2 窗口生命周期管理

```typescript
// 监听窗口事件
mainWindow.on('focus', () => {
  console.log('Window focused')
})

mainWindow.on('blur', () => {
  console.log('Window blurred')
})

mainWindow.on('minimize', () => {
  console.log('Window minimized')
})

mainWindow.on('maximize', () => {
  console.log('Window maximized')
})

mainWindow.on('unmaximize', () => {
  console.log('Window unmaximized')
})
```

### 4.3 窗口状态持久化

```typescript
// 保存窗口状态
const saveWindowState = (window: BrowserWindow, id: string) => {
  const bounds = window.getBounds()
  const state = {
    bounds,
    isMaximized: window.isMaximized(),
    isFullScreen: window.isFullScreen()
  }
  localStorage.setItem(`window-state-${id}`, JSON.stringify(state))
}

// 恢复窗口状态
const restoreWindowState = (id: string) => {
  const saved = localStorage.getItem(`window-state-${id}`)
  if (saved) {
    return JSON.parse(saved)
  }
  return null
}
```

### 4.4 安全考虑

```typescript
// 安全的窗口配置
const secureWindowConfig = {
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    sandbox: true,
    preload: join(__dirname, '../preload/index.js'),
    webSecurity: true,
    allowRunningInsecureContent: false
  }
}
```

---

## 5. 实际应用示例

### 5.1 打开独立工具窗口

```typescript
// 打开一个浮动工具窗口
const openToolWindow = () => {
  window.electron.createWindow({
    id: 'color-picker',
    route: '/tools/color-picker',
    title: '颜色选择器',
    width: 300,
    height: 400,
    alwaysOnTop: true,
    frame: false,
    transparent: true
  })
}
```

### 5.2 打开模态对话框

```typescript
// 打开设置对话框
const openSettings = () => {
  window.electron.createWindow({
    id: 'settings',
    route: '/settings',
    title: '设置',
    width: 600,
    height: 500,
    modal: true,
    parent: 'main',
    resizable: false
  })
}
```

### 5.3 打开多实例窗口

```typescript
// 为每个文档打开独立窗口
const openDocumentWindow = (documentId: string) => {
  window.electron.createWindow({
    id: `document-${documentId}`,
    route: `/document/${documentId}`,
    title: `文档 ${documentId}`,
    width: 800,
    height: 600
  })
}
```

---

## 6. 调试技巧

### 6.1 查看所有窗口

```typescript
// 开发者工具中查看所有窗口
console.log('All windows:', BrowserWindow.getAllWindows().map(w => ({
  id: w.id,
  title: w.getTitle(),
  url: w.webContents.getURL()
})))
```

### 6.2 窗口性能监控

```typescript
// 监控窗口性能
mainWindow.webContents.on('did-finish-load', () => {
  const metrics = mainWindow.webContents.getPerformanceMetrics()
  console.log('Performance metrics:', metrics)
})
```

---

## 总结

Electron多窗口和多页面的核心要点：

1. **使用窗口管理器**：统一管理所有窗口的生命周期
2. **React Router多页面**：在单个窗口内实现多页面导航
3. **IPC通信**：实现窗口间数据传递和同步
4. **状态管理**：考虑使用Redux或MobX管理跨窗口状态
5. **性能优化**：合理控制窗口数量，避免内存泄漏

这种架构适合复杂的企业级应用，如你的跨境电商工作台系统。
