# Electron 多窗口功能快速开始指南

## 🚀 快速使用

### 1. 在组件中导入Hook

```typescript
import { useWindowManager, WindowPresets } from '@/hooks/useWindowManager'
```

### 2. 在组件中使用

```typescript
function MyComponent() {
  const { createWindow, closeWindow, broadcast, allWindows } = useWindowManager()

  // 打开新窗口
  const openSettings = () => {
    createWindow(WindowPresets.settings)
  }

  // 或自定义配置
  const openCustomWindow = () => {
    createWindow({
      id: 'my-window',
      route: '/custom',
      title: '我的窗口',
      width: 800,
      height: 600
    })
  }

  // 广播消息到所有窗口
  const sendMessage = () => {
    broadcast('my:channel', { data: 'Hello!' })
  }

  return (
    <div>
      <button onClick={openSettings}>打开设置</button>
      <div>
        {allWindows.map(win => (
          <div key={win.id}>
            {win.title}
            <button onClick={() => closeWindow(win.id)}>关闭</button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 3. 监听窗口间消息

```typescript
import { useWindowCommunication } from '@/hooks/useWindowManager'

function MyComponent() {
  useWindowCommunication('my:channel', (data) => {
    console.log('收到消息:', data)
  })

  return <div>监听消息中...</div>
}
```

## 📝 常用预设窗口

```typescript
// 工作流编辑器
WindowPresets.workflowEditor

// 设置对话框
WindowPresets.settings

// 多语言服务
WindowPresets.multilang

// 预览窗口
WindowPresets.preview

// 关于窗口
WindowPresets.about
```

## 🎯 实际应用场景

1. **工具窗口**：打开颜色选择器、预览窗口等浮动工具
2. **独立编辑器**：为复杂编辑器（如工作流编辑器）打开独立窗口
3. **模态对话框**：设置、关于、确认对话框
4. **多任务处理**：同时处理多个文档或任务

## 💡 最佳实践

- 使用预设配置保持窗口样式一致
- 为不同功能使用不同的窗口ID
- 及时关闭不需要的窗口避免内存泄漏
- 使用窗口间通信同步状态
- 考虑使用状态管理（Redux/Zustand）管理跨窗口状态

## 🔧 API参考

详细API文档请查看：`docs/electron-multiple-windows.md`
