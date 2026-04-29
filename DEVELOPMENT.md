# 开发文档

## 项目概述

这是一个基于 Electron + React + TypeScript 的桌面应用程序，集成了多窗口管理、多语言服务、商品采集等功能。

## 技术栈

- **Electron**: 桌面应用框架
- **React**: 前端UI框架
- **TypeScript**: 类型安全的JavaScript
- **Vite**: 快速的构建工具
- **Tailwind CSS**: 实用工具优先的CSS框架

## 项目结构

```
my-app/
├── src/
│   ├── main/           # 主进程代码
│   │   ├── index.ts    # 主进程入口
│   │   ├── windowManager.ts  # 窗口管理器
│   │   └── ipc/        # IPC通信处理
│   ├── preload/        # 预加载脚本
│   │   ├── index.ts    # 预加载入口
│   │   └── api/        # API定义
│   └── renderer/       # 渲染进程代码
│       └── src/
│           ├── components/  # React组件
│           ├── hooks/       # 自定义Hooks
│           ├── pages/       # 页面组件
│           └── App.tsx      # 应用入口
├── out/                # 编译输出
└── package.json        # 项目配置
```

## 核心功能

### 多窗口管理系统

应用程序实现了完整的窗口管理系统，支持创建、控制和管理多个独立窗口。

#### 使用方法

```typescript
// 创建新窗口
await window.wm.createWindow({
  id: 'my-window',
  route: '/workflow',
  title: '我的窗口',
  width: 800,
  height: 600
})

// 获取所有窗口
const result = await window.wm.getAllWindows()
console.log(result.windows)

// 关闭窗口
await window.wm.closeWindow('my-window')

// 窗口控制
await window.wm.minimize()
await window.wm.maximize()
await window.wm.focus()
```

#### 预定义窗口配置

```typescript
import { WindowPresets } from '@/hooks/useWindowManager'

// 使用预定义配置
await window.wm.createWindow(WindowPresets.workflowEditor)
```

### 多语言服务

集成了Python AI服务和Go爬虫服务，提供图像分析、文本翻译、商品采集等功能。

#### API使用示例

```typescript
// 图像分析
const result = await window.multilang.analyzeImage('/path/to/image.jpg')

// 文本翻译
const translated = await window.multilang.translate('Hello', 'zh')

// 商品爬取
const product = await window.multilang.crawlProduct('https://example.com/product')
```

## 重要技术决策

### API命名约定

**关键原则**: 避免使用浏览器保留的属性名称

#### 问题案例

最初的实现使用 `'window'` 作为窗口管理API的名称：

```typescript
// ❌ 错误的做法
contextBridge.exposeInMainWorld('window', windowAPI)
```

这导致了严重的命名冲突，因为浏览器原生Window对象有 `window.window` 自引用属性。

#### 解决方案

使用 `'wm'` (window manager) 作为API名称：

```typescript
// ✅ 正确的做法
contextBridge.exposeInMainWorld('wm', windowAPI)
```

#### 受影响的文件

修改了以下文件来适应新的API名称：

1. **src/preload/index.ts** - API暴露
2. **src/preload/index.d.ts** - TypeScript类型定义
3. **src/renderer/src/components/SimpleWindowTest.tsx** - 测试组件
4. **src/renderer/src/hooks/useWindowManager.ts** - React Hook

#### 浏览器保留名称列表

避免使用以下属性名称：
- `window.window` - 浏览器自引用
- `window.document` - DOM文档对象
- `window.location` - 位置信息
- `window.history` - 浏览历史
- `window.navigator` - 浏览器信息
- `window.screen` - 屏幕信息

### IPC通信协议

应用程序使用标准的IPC通信模式：

**主进程 → 渲染进程**:
```typescript
// 主进程发送
mainWindow.webContents.send('channel-name', data)

// 渲染进程接收
window.electron.ipcRenderer.on('channel-name', (event, data) => {
  console.log(data)
})
```

**渲染进程 → 主进程**:
```typescript
// 渲染进程调用
const result = await window.electron.ipcRenderer.invoke('channel-name', params)

// 主进程处理
ipcMain.handle('channel-name', async (event, params) => {
  return { success: true, data: 'result' }
})
```

### 错误处理规范

所有API调用都应该包含错误处理：

```typescript
try {
  const result = await window.wm.createWindow(config)
  if (result.success) {
    console.log('窗口创建成功')
  } else {
    console.error('创建失败:', result.error)
  }
} catch (error) {
  console.error('调用异常:', error)
}
```

## 开发指南

### 添加新的窗口类型

1. **定义窗口预设** (在 `useWindowManager.ts` 中):
```typescript
export const WindowPresets = {
  myNewWindow: {
    id: 'my-new-window',
    route: '/my-route',
    title: '新窗口',
    width: 800,
    height: 600
  }
}
```

2. **创建路由页面** (在路由配置中):
```typescript
{
  path: '/my-route',
  component: MyComponent
}
```

3. **使用窗口**:
```typescript
const { createWindow } = useWindowManager()
await createWindow(WindowPresets.myNewWindow)
```

### 添加新的IPC通信

1. **定义IPC处理器** (在 `src/main/ipc/` 中):
```typescript
ipcMain.handle('my-feature:action', async (event, params) => {
  // 处理逻辑
  return { success: true, data: result }
})
```

2. **暴露API** (在 `src/preload/api/` 中):
```typescript
const myAPI = {
  async action(params) {
    return electron.ipcRenderer.invoke('my-feature:action', params)
  }
}
```

3. **类型定义** (在 `src/preload/index.d.ts` 中):
```typescript
interface MyAPI {
  action(params: any): Promise<any>
}
```

## 故障排除

### 常见问题

**Q: 窗口创建失败，提示"createWindow is not a function"**
- A: 检查是否使用了正确的API名称 `window.wm` 而不是 `window.window`

**Q: IPC通信错误"Attempted to register a second handler"**
- A: 确保没有重复注册相同的IPC channel名称

**Q: TypeScript类型错误**
- A: 确保 `src/preload/index.d.ts` 中的类型定义与实际API一致

### 调试技巧

1. **启用开发工具**: 按 F12 打开开发者工具
2. **查看主进程日志**: 在命令行中查看主进程输出
3. **使用console.log**: 在关键位置添加日志输出
4. **检查窗口状态**: 使用 `window.wm.getAllWindows()` 查看所有窗口

## 构建和部署

### 开发模式
```bash
npm run dev
```

### 生产构建
```bash
# Windows
npm run build:win

# macOS  
npm run build:mac

# Linux
npm run build:linux
```

### 构建输出
构建完成后，安装包将在 `release/` 目录中。

## 最佳实践

1. **类型安全**: 始终使用TypeScript类型定义
2. **错误处理**: 所有异步操作都应包含错误处理
3. **资源清理**: 在组件卸载时清理监听器和定时器
4. **性能优化**: 避免频繁的IPC通信，考虑批量操作
5. **安全性**: 使用contextBridge进行安全的API暴露

## 更新日志

### 2026-04-27
- **修复**: 解决了 `window.window` API命名冲突问题
- **变更**: 将窗口管理API从 `window.window` 重命名为 `window.wm`
- **影响**: 更新了所有相关组件和类型定义
- **验证**: 多窗口创建功能现已正常工作

---

*本文档随项目发展持续更新*