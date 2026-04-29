/**
 * 多窗口功能演示组件
 * 展示如何使用窗口管理功能
 */

import { useState, useEffect } from 'react'
import { useWindowManager, useWindowCommunication, WindowPresets } from '../hooks/useWindowManager'

export default function WindowDemo() {
  const [, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { allWindows, createWindow, closeWindow, broadcast, windowInfo } =
    useWindowManager()

  const [message, setMessage] = useState('')
  const [receivedMessages, setReceivedMessages] = useState<any[]>([])

  // 检查API是否可用
  useEffect(() => {
    try {
      if (window.window) {
        setIsReady(true)
        console.log('Window API available:', window.window)
      } else {
        setError('窗口API不可用')
        console.error('Window API not found on window object')
      }
    } catch (err) {
      setError(String(err))
      console.error('Error initializing window demo:', err)
    }
  }, [])

  // 监听来自其他窗口的消息
  useWindowCommunication('window:demo:message', (data) => {
    console.log('Received message:', data)
    setReceivedMessages((prev) => [...prev, { ...data, timestamp: new Date().toLocaleTimeString() }])
  })

  // 打开工作流编辑器窗口
  const openWorkflowEditor = () => {
    createWindow(WindowPresets.workflowEditor)
  }

  // 打开设置窗口
  const openSettings = () => {
    createWindow(WindowPresets.settings)
  }

  // 打开多语言服务窗口
  const openMultilangService = () => {
    createWindow(WindowPresets.multilang)
  }

  // 打开预览窗口
  const openPreview = () => {
    createWindow(WindowPresets.preview)
  }

  // 广播消息到所有窗口
  const handleBroadcast = () => {
    if (message.trim()) {
      broadcast('window:demo:message', {
        from: windowInfo?.id || 'unknown',
        message: message.trim(),
        timestamp: Date.now()
      })
      setMessage('')
    }
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">多窗口管理演示</h2>

      {/* 调试信息 */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-xs">
        <div className="font-mono text-gray-700 dark:text-gray-300">
          <div>API可用: {String(!!window.window)}</div>
          <div>multilang可用: {String(!!window.multilang)}</div>
          <div>electron可用: {String(!!window.electron)}</div>
          <div>Keys: {Object.keys(window).filter(k => k.startsWith('window') || k === 'multilang').join(', ')}</div>
        </div>
      </div>

      {/* 错误显示 */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="text-sm text-red-800 dark:text-red-300">
            ⚠️ {error}
          </div>
        </div>
      )}

      {/* 当前窗口信息 */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-300 mb-2">当前窗口信息</h3>
        <div className="text-xs text-blue-800 dark:text-blue-400">
          <div>ID: {windowInfo?.id || 'N/A'}</div>
          <div>标题: {windowInfo?.title || 'N/A'}</div>
          <div>聚焦: {windowInfo?.isFocused ? '是' : '否'}</div>
          <div>最小化: {windowInfo?.isMinimized ? '是' : '否'}</div>
          <div>最大化: {windowInfo?.isMaximized ? '是' : '否'}</div>
        </div>
      </div>

      {/* 打开新窗口按钮 */}
      <div className="mb-6">
        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3">打开新窗口</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={openWorkflowEditor}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            ⚙️ 工作流编辑器
          </button>
          <button
            onClick={openSettings}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
          >
            🔧 设置
          </button>
          <button
            onClick={openMultilangService}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
          >
            🌍 多语言服务
          </button>
          <button
            onClick={openPreview}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
          >
            👁️ 预览窗口
          </button>
        </div>
      </div>

      {/* 所有窗口列表 */}
      {allWindows.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3">
            所有窗口 ({allWindows.length})
          </h3>
          <div className="space-y-2">
            {allWindows.map((win) => (
              <div
                key={win.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">🪟</span>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{win.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">ID: {win.id}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {win.isFocused && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">聚焦</span>
                  )}
                  <button
                    onClick={() => closeWindow(win.id)}
                    className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                  >
                    关闭
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 窗口间通信 */}
      <div className="mb-6">
        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3">窗口间通信</h3>
        <div className="flex gap-3 mb-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="输入消息..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleBroadcast()
              }
            }}
          />
          <button
            onClick={handleBroadcast}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            广播
          </button>
        </div>

        {/* 接收的消息 */}
        {receivedMessages.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">接收到的消息</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {receivedMessages.map((msg, index) => (
                <div
                  key={index}
                  className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-green-800 dark:text-green-300">
                      来自: {msg.from}
                    </span>
                    <span className="text-xs text-green-600 dark:text-green-400">{msg.timestamp}</span>
                  </div>
                  <div className="text-sm text-green-900 dark:text-green-200">{msg.message}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 使用说明 */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">使用说明</h4>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• 点击上方按钮可打开不同类型的新窗口</li>
          <li>• 所有窗口共享同一应用状态</li>
          <li>• 可以在窗口间发送和接收消息</li>
          <li>• 关闭窗口后会自动从列表中移除</li>
          <li>• 窗口信息会实时更新</li>
        </ul>
      </div>
    </div>
  )
}
