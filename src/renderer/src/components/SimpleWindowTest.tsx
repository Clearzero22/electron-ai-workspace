/**
 * 简单的多窗口测试组件
 * 用于快速验证API是否正常工作
 */

import { useEffect, useState } from 'react'

export default function SimpleWindowTest() {
  const [status, setStatus] = useState<string>('检查中...')
  const [windowCount, setWindowCount] = useState(0)

  useEffect(() => {
    // 检查API是否可用
    const checkAPI = () => {
      console.log('=== API检查开始 ===')
      console.log('完整window对象:', window)
      console.log('window.electron:', (window as any).electron)
      console.log('window.multilang:', (window as any).multilang)
      console.log('window.wm:', (window as any).wm)

      // 列出所有以wm开头的属性
      const wmKeys = Object.keys(window).filter(k => k.startsWith('wm'))
      console.log('以wm开头的属性:', wmKeys)

      // 检查我们的API
      if ((window as any).multilang) {
        console.log('✅ multilang API 可用')
      } else {
        console.log('❌ multilang API 不可用')
      }

      // 检查window API
      const winAPI = (window as any).wm
      console.log('提取的windowAPI:', winAPI)
      console.log('windowAPI类型:', typeof winAPI)
      console.log('windowAPI.createWindow类型:', typeof winAPI?.createWindow)

      if (winAPI && typeof winAPI.createWindow === 'function') {
        setStatus('✅ Window API 可用')
        return true
      } else {
        setStatus('❌ Window API 不可用 - createWindow不是函数')
        return false
      }
    }

    checkAPI()
  }, [])

  const openNewWindow = async () => {
    try {
      console.log('尝试打开窗口...')
      console.log('window对象:', window)
      console.log('window.wm:', (window as any).wm)
      console.log('window.wm类型:', typeof (window as any).wm)

      // 检查API是否存在
      if (! (window as any).wm) {
        setStatus('❌ window.wm 不存在')
        return
      }

      if (typeof (window as any).wm.createWindow !== 'function') {
        setStatus('❌ createWindow 不是一个函数')
        console.log('createWindow类型:', typeof (window as any).wm.createWindow)
        console.log('createWindow:', (window as any).wm.createWindow)
        return
      }

      const result = await (window as any).wm.createWindow({
        id: 'test-window-' + Date.now(),
        route: '/workflow',
        title: '测试窗口',
        width: 800,
        height: 600
      })
      console.log('窗口创建结果:', result)
      setStatus('✅ 窗口创建成功!')
      setWindowCount(prev => prev + 1)
    } catch (error) {
      console.error('创建窗口失败:', error)
      setStatus('❌ 创建窗口失败: ' + error)
    }
  }

  const getAllWindows = async () => {
    try {
      const result = await (window as any).wm.getAllWindows()
      console.log('所有窗口:', result)
      setWindowCount(result.windows?.length || 0)
      setStatus(`📊 当前有 ${result.windows?.length || 0} 个窗口`)
    } catch (error) {
      console.error('获取窗口失败:', error)
      setStatus('❌ 获取窗口失败: ' + error)
    }
  }

  return (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        🪟 多窗口API测试
      </h1>

      {/* 状态显示 */}
      <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">当前状态</div>
        <div className="text-blue-800 dark:text-blue-400">{status}</div>
      </div>

      {/* API检查 */}
      <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">API可用性检查:</div>
        <div className="space-y-1 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400">window.electron:</span>
            <span className={typeof window.electron !== 'undefined' ? 'text-green-600' : 'text-red-600'}>
              {typeof window.electron !== 'undefined' ? '✓ 可用' : '✗ 不可用'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400">window.multilang:</span>
            <span className={typeof window.multilang !== 'undefined' ? 'text-green-600' : 'text-red-600'}>
              {typeof window.multilang !== 'undefined' ? '✓ 可用' : '✗ 不可用'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400">window.wm:</span>
            <span className={typeof (window as any).wm !== 'undefined' ? 'text-green-600' : 'text-red-600'}>
              {typeof (window as any).wm !== 'undefined' ? '✓ 可用' : '✗ 不可用'}
            </span>
          </div>
        </div>
      </div>

      {/* 测试按钮 */}
      <div className="space-y-4">
        <button
          onClick={openNewWindow}
          className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          🚀 打开测试窗口
        </button>

        <button
          onClick={getAllWindows}
          className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
        >
          📊 获取所有窗口
        </button>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          当前窗口数量: <span className="font-bold">{windowCount}</span>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <div className="text-sm font-semibold text-yellow-900 dark:text-yellow-300 mb-2">📝 测试说明</div>
        <div className="text-xs text-yellow-800 dark:text-yellow-400 space-y-1">
          <p>1. 点击 "打开测试窗口" 创建新窗口</p>
          <p>2. 点击 "获取所有窗口" 查看当前窗口状态</p>
          <p>3. 每个新窗口都是独立的，可以同时操作</p>
          <p>4. 按F12打开开发者工具查看详细日志</p>
        </div>
      </div>
    </div>
  )
}