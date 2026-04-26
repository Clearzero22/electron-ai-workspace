# Electron 应用开发深度指南

## 🔒 安全性 considerations

### 1. Context Isolation (上下文隔离)

**当前项目状态：✅ 已正确配置**

```typescript
// src/main/windowManager.ts
webPreferences: {
  preload: join(__dirname, '../preload/index.js'),
  sandbox: false,          // ⚠️ 当前禁用沙箱
  nodeIntegration: false,  // ✅ 已禁用Node集成
  contextIsolation: true   // ✅ 已启用上下文隔离
}
```

**安全性建议：**
- ✅ **保持 contextIsolation: true** - 防止渲染进程访问Node.js API
- ⚠️ **考虑启用 sandbox: true** - 进一步限制渲染进程权限
- ✅ **保持 nodeIntegration: false** - 防止XSS攻击执行Node代码

**沙箱模式配置：**
```typescript
webPreferences: {
  sandbox: true,
  contextIsolation: true,
  nodeIntegration: false,
  preload: join(__dirname, '../preload/index.js')
}
```

### 2. IPC 通信安全

**当前实现：✅ 基本安全**

```typescript
// src/main/ipc/index.ts
ipcMain.handle('python:analyzeImage', async (_event, imagePath) => {
  // ⚠️ 缺少参数验证
  return getPythonService().analyzeImage(imagePath)
})
```

**安全增强建议：**
```typescript
ipcMain.handle('python:analyzeImage', async (_event, imagePath) => {
  // ✅ 添加参数验证
  if (typeof imagePath !== 'string') {
    throw new Error('Invalid image path')
  }

  // ✅ 路径安全检查
  const normalizedPath = normalize(imagePath)
  if (!normalizedPath.startsWith(allowedDirectory)) {
    throw new Error('Access denied')
  }

  return getPythonService().analyzeImage(imagePath)
})
```

### 3. CSP (Content Security Policy)

**当前状态：❌ 未配置**

**建议添加CSP：**
```html
<!-- src/renderer/index.html -->
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self';
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               connect-src 'self' https://api.example.com;">
```

### 4. 代码混淆和保护

**当前状态：✅ 已实现**

```typescript
// vite.plugins.ts
const obfuscationResult = JavaScriptObfuscator.obfuscate(file.code, {
  compact: true,
  controlFlowFlattening: true,
  deadCodeInjection: true,
  disableConsoleOutput: true,
  selfDefending: true,
  stringArrayEncoding: ['base64']
})
```

**评估：**
- ✅ 使用了强混淆算法
- ✅ 禁用了控制台输出
- ✅ 自我保护机制

## 🚀 性能优化

### 1. 内存管理

**当前问题：⚠️ 潜在内存泄漏**

```typescript
// src/main/services/python/index.ts
private pendingRequests = new Map<number, {
  resolve: (value: any) => void
  reject: (error: Error) => void
  timeout: NodeJS.Timeout
}>()

// ⚠️ 问题：如果请求超时，Map会无限增长
```

**优化建议：**
```typescript
// ✅ 添加定期清理
setInterval(() => {
  const now = Date.now()
  for (const [id, callback] of this.pendingRequests) {
    if (callback.timeout._destroyed) {
      this.pendingRequests.delete(id)
    }
  }
}, 60000) // 每分钟清理一次
```

### 2. 进程通信优化

**当前状态：✅ 良好**

```typescript
// ✅ 使用 invoke/handle 而非 send/on
ipcMain.handle('python:analyzeImage', async () => {
  // 返回Promise，支持异步
})
```

**性能建议：**
- ✅ 使用 `invoke/handle` 替代 `send/on`（已做到）
- ✅ 批量操作减少IPC调用频率
- ✅ 考虑使用 `Buffer` 传递大数据

### 3. 渲染进程性能

**潜在问题：**
```typescript
// src/renderer/src/pages/Workspace.tsx
const renderPage = () => {
  switch (currentPage) {
    // ⚠️ 每次切换都重新创建组件
    case 'workflow': return <WorkflowEditor />
  }
}
```

**优化建议：**
```typescript
// ✅ 使用React.memo和懒加载
const WorkflowEditor = lazy(() => import('./components/WorkflowEditor'))

// ✅ 组件缓存
const memoizedWorkflow = useMemo(() => <WorkflowEditor />, [dependencies])
```

## 🛠️ 开发体验

### 1. TypeScript 配置

**当前配置：✅ 良好**

```json
{
  "references": [
    { "path": "./tsconfig.node.json" },
    { "path": "./tsconfig.web.json" }
  ]
}
```

**优点：**
- ✅ 分离主进程和渲染进程配置
- ✅ 项目引用提高编译速度
- ✅ 类型安全跨进程通信

### 2. 环境变量管理

**当前状态：⚠️ 缺少配置**

**建议添加：**
```typescript
// .env.development
VITE_API_BASE_URL=http://localhost:3000
VITE_ENABLE_DEV_TOOLS=true

// .env.production
VITE_API_BASE_URL=https://api.example.com
VITE_ENABLE_DEV_TOOLS=false

// 使用
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

### 3. 日志系统

**当前状态：✅ 已实现**

```typescript
// src/main/utils/logger.ts
export class Logger {
  info(message: string) { /* ... */ }
  error(message: string) { /* ... */ }
  debug(message: string) { /* ... */ }
}
```

**改进建议：**
```typescript
// ✅ 添加日志级别控制
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

// ✅ 添加文件日志
export class Logger {
  private fileTransport: FileTransport
  private logLevel: LogLevel
}
```

## 📦 打包和分发

### 1. 应用签名

**当前状态：⚠️ Windows未配置**

**electron-builder.yml 配置：**
```yaml
win:
  target: nsis
  icon: resources/icon.png
  artifactName: ${productName}-${version}.${ext}

# ✅ 添加签名
afterSign: scripts/afterSign.js
# mac:
#   identity: "Developer ID Application: Your Name"
```

### 2. 自动更新

**当前状态：✅ 已配置**

```json
{
  "dependencies": {
    "electron-updater": "^6.3.9"
  }
}
```

**实现建议：**
```typescript
// src/main/index.ts
import { autoUpdater } from 'electron-updater'

if (process.env.NODE_ENV === 'production') {
  autoUpdater.checkForUpdatesAndNotify()

  autoUpdater.on('update-available', () => {
    // 通知用户
  })

  autoUpdater.on('update-downloaded', () => {
    // 提示安装
  })
}
```

### 3. 资源管理

**当前问题：⚠️ Python路径硬编码**

```typescript
// src/main/services/python/index.ts
private getPythonPath(): string {
  if (process.platform === 'win32') {
    return join(process.resourcesPath, 'python', 'python.exe')
  }
  // ⚠️ 生产环境需要确保Python文件存在
}
```

**解决方案：**
```typescript
// ✅ 添加资源检查
private getPythonPath(): string {
  const pythonPath = join(process.resourcesPath, 'python', 'python.exe')

  if (!fs.existsSync(pythonPath)) {
    throw new Error(`Python not found at ${pythonPath}`)
  }

  return pythonPath
}
```

## 🔧 调试和错误处理

### 1. 错误处理

**当前状态：⚠️ 部分实现**

```typescript
// src/main/services/python/index.ts
process.on('error', (error) => {
  this.logger.error(`Python process error: ${error.message}`)
  // ✅ 有日志，但缺少用户通知
})
```

**改进建议：**
```typescript
// ✅ 添加全局错误处理
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error)
  // 通知用户
  mainWindow?.webContents.send('app:error', {
    type: 'critical',
    message: error.message
  })
})

// ✅ 渲染进程错误处理
window.addEventListener('error', (event) => {
  console.error('Render error:', event.error)
  // 上报错误到主进程
  window.electron.ipcRenderer.invoke('app:reportError', {
    message: event.error.message,
    stack: event.error.stack
  })
})
```

### 2. DevTools 配置

**当前状态：⚠️ 注释掉的开发工具**

```typescript
// src/main/windowManager.ts
// newWindow.webContents.openDevTools()
```

**建议改进：**
```typescript
// ✅ 条件性启用
if (process.env.NODE_ENV === 'development' ||
    process.env.VITE_ENABLE_DEV_TOOLS === 'true') {
  newWindow.webContents.openDevTools()
}

// ✅ 快捷键切换
app.on('browser-window-focus', (_, window) => {
  window.webContents.on('before-input-event', (_, input) => {
    if (input.key === 'F12' && input.control) {
      window.webContents.toggleDevTools()
    }
  })
})
```

## 🌐 跨平台兼容性

### 1. 平台特定代码

**当前状态：✅ 良好**

```typescript
// ✅ 正确使用平台检测
if (process.platform === 'win32') {
  return 'python'
} else {
  return 'python3'
}
```

### 2. 路径处理

**当前状态：✅ 正确使用path模块**

```typescript
import { join } from 'path'

// ✅ 跨平台路径
const scriptPath = join(__dirname, '../../../services/python/ai_service.py')
```

### 3. 原生模块

**潜在问题：⚠️ 架构兼容性**

```json
{
  "dependencies": {
    // ⚠️ 某些原生模块可能需要为不同平台编译
  }
}
```

**建议：**
```json
{
  "build": {
    "include": [
      "node_modules/**/*",
      // ✅ 明确包含需要打包的模块
    ]
  }
}
```

## 📊 监控和分析

### 1. 性能监控

**建议添加：**
```typescript
// src/main/utils/performance.ts
export class PerformanceMonitor {
  private metrics = new Map<string, number[]>()

  measure(name: string, fn: () => Promise<any>) {
    const start = performance.now()
    return fn().finally(() => {
      const duration = performance.now() - start
      this.record(name, duration)
    })
  }

  private record(name: string, duration: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    this.metrics.get(name)!.push(duration)
  }

  getStats(name: string) {
    const times = this.metrics.get(name) || []
    return {
      avg: times.reduce((a, b) => a + b, 0) / times.length,
      min: Math.min(...times),
      max: Math.max(...times)
    }
  }
}
```

### 2. 用户行为分析

**建议添加：**
```typescript
// src/main/utils/analytics.ts
export class Analytics {
  trackEvent(event: string, properties?: Record<string, any>) {
    // 发送到分析服务
    this.send('track', {
      event,
      properties,
      timestamp: Date.now(),
      version: app.getVersion()
    })
  }

  trackError(error: Error, context?: Record<string, any>) {
    this.send('error', {
      message: error.message,
      stack: error.stack,
      context
    })
  }
}
```

## 🧪 测试策略

### 1. 单元测试

**建议配置：**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "jest": "^29.5.0",
    "electron-renderer-jest": "^0.6.0"
  }
}
```

### 2. E2E测试

**建议使用Playwright：**
```typescript
// tests/e2e/window.spec.ts
import { test, expect } from '@playwright/test'

test('窗口创建和切换', async ({ page }) => {
  await page.goto('http://localhost:5173')

  // 点击工作流按钮
  await page.click('[data-testid="workflow-button"]')

  // 验证页面切换
  await expect(page.locator('[data-testid="workflow-editor"]')).toBeVisible()
})
```

## 📱 用户体验

### 1. 启动优化

**当前状态：⚠️ 可优化**

```typescript
// ✅ 使用splash screen
app.on('ready', () => {
  // 先显示启动画面
  const splash = new BrowserWindow({
    width: 400,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true
  })

  splash.loadFile('splash.html')

  // 后台初始化
  initializeServices().then(() => {
    splash.close()
    createMainWindow()
  })
})
```

### 2. 窗口状态保持

**建议添加：**
```typescript
// src/main/utils/windowState.ts
export classWindowStateManager {
  saveState(window: BrowserWindow, id: string) {
    const state = {
      bounds: window.getBounds(),
      isMaximized: window.isMaximized(),
      isFullScreen: window.isFullScreen()
    }
    store.set(`window-${id}`, state)
  }

  restoreState(window: BrowserWindow, id: string) {
    const state = store.get(`window-${id}`)
    if (state) {
      window.setBounds(state.bounds)
      if (state.isMaximized) window.maximize()
    }
  }
}
```

## 🔐 数据保护

### 1. 敏感数据存储

**建议使用electron-store：**
```typescript
// ✅ 加密存储
import Store from 'electron-store'
import { safeStorage } from 'electron'

const secureStore = new Store({
  name: 'secure-data',
  encryptionKey: 'your-secret-key'
})

// 存储敏感数据
secureStore.set('api-token', encryptedToken)
```

### 2. 用户隐私

**建议实现：**
```typescript
// src/main/utils/privacy.ts
export class PrivacyManager {
  clearUserData() {
    // 清除所有用户数据
    session.defaultSession.clearStorageData({
      storages: ['cookies', 'localstorage', 'indexdb']
    })
  }

  exportUserData() {
    // 导出用户数据（GDPR合规）
  }
}
```

## 📋 发布检查清单

### 发布前必须检查

- [ ] **安全性**
  - [ ] 启用context isolation
  - [ ] 禁用node integration in renderer
  - [ ] 配置CSP策略
  - [ ] 移除开发工具
  - [ ] 代码混淆

- [ ] **性能**
  - [ ] 内存泄漏检查
  - [ ] 启动时间优化
  - [ ] 渲染性能优化
  - [ ] IPC通信优化

- [ ] **兼容性**
  - [ ] Windows测试
  - [ ] macOS测试（如果支持）
  - [ ] Linux测试（如果支持）
  - [ ] 不同分辨率测试

- [ ] **用户体验**
  - [ ] 错误处理完善
  - [ ] 加载状态提示
  - [ ] 窗口状态保持
  - [ ] 快捷键支持

- [ ] **法律合规**
  - [ ] 许可证文件
  - [ ] 隐私政策
  - [ ] 用户协议
  - [ ] 数据保护

## 🚨 常见陷阱和解决方案

### 1. ASAR包问题

**问题：**
```typescript
// ❌ 错误：无法访问ASAR内的文件
fs.readFileSync(__dirname + '/file.txt')
```

**解决：**
```typescript
// ✅ 正确：使用特殊API
const path = require('path')
fs.readFile(path.join(__dirname, 'file.txt'))
```

### 2. 路径问题

**问题：**
```typescript
// ❌ 相对路径在生产环境失败
const scriptPath = './services/python/ai_service.py'
```

**解决：**
```typescript
// ✅ 使用绝对路径
const scriptPath = join(__dirname, '../../../services/python/ai_service.py')
```

### 3. 进程通信死锁

**问题：**
```typescript
// ❌ 可能导致死锁
ipcMain.on('sync-message', (event) => {
  event.sender.send('response')
})
```

**解决：**
```typescript
// ✅ 使用异步模式
ipcMain.handle('async-message', async () => {
  return { data: 'response' }
})
```

## 📚 推荐资源

### 官方文档
- [Electron官方文档](https://www.electronjs.org/docs)
- [Electron安全指南](https://www.electronjs.org/docs/latest/tutorial/security)
- [electron-builder文档](https://www.electron.build/)

### 社区资源
- [Electron React Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)
- [Electron用户指南](https://slarker.me/electron-user-guide/)

### 工具推荐
- **调试**: electron-devtools-installer
- **构建**: electron-builder, electron-forge
- **更新**: electron-updater
- **安全**: electron-shield
- **监控**: electron-metrics

---

*本文档会持续更新，建议定期查看最新版本。*

## 🎯 快速问题解决指南

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 应用无法启动 | ASAR路径问题 | 检查文件路径，使用__dirname |
| 内存持续增长 | 内存泄漏 | 检查事件监听器清理 |
| IPC通信失败 | Context隔离 | 确保使用contextBridge |
| 打包后功能异常 | 资源文件缺失 | 检查extraResources配置 |
| 性能下降 | 主进程阻塞 | 将耗时操作移到worker |
| 安全警告 | 配置不当 | 检查webPreferences设置 |

---

*最后更新: 2026-04-27*