/**
 * 工作流编辑器页面
 * 跨境电商自动化工作流编辑器
 */

import React, { useState, useEffect } from 'react'

interface Node {
  id: string
  type: 'start' | 'browser' | 'ai' | 'data' | 'control' | 'end'
  title: string
  description: string
  icon: React.ReactNode
  status: 'pending' | 'success' | 'error'
  color: string
}

interface WorkflowNode {
  id: string
  node: Node
}

export default function WorkflowEditor() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [workflowEnabled, setWorkflowEnabled] = useState(true)

  // 工作流节点定义
  const [workflowNodes] = useState<WorkflowNode[]>([
    {
      id: 'start',
      node: {
        id: 'start',
        type: 'start',
        title: '开始节点',
        description: '工作流开始运行',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        status: 'success',
        color: 'gradient-green'
      }
    },
    {
      id: 'open-page',
      node: {
        id: 'open-page',
        type: 'browser',
        title: '打开亚马逊商品页面',
        description: '打开指定的亚马逊商品页面',
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#4285F4" />
            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" fill="white" />
            <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" fill="#EA4335" />
          </svg>
        ),
        status: 'success',
        color: 'border-blue-500'
      }
    },
    {
      id: 'extract-data',
      node: {
        id: 'extract-data',
        type: 'browser',
        title: '提取商品信息',
        description: '提取标题、价格、图片、描述等信息',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        status: 'success',
        color: 'bg-blue-50 text-blue-600'
      }
    },
    {
      id: 'ai-optimize',
      node: {
        id: 'ai-optimize',
        type: 'ai',
        title: 'AI 优化商品文案',
        description: '使用AI优化商品标题和描述',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
        status: 'success',
        color: 'gradient-purple'
      }
    },
    {
      id: 'open-shopify',
      node: {
        id: 'open-shopify',
        type: 'browser',
        title: '打开 Shopify 后台',
        description: '登录并打开 Shopify 后台商品创建页面',
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#95BF47" />
            <path d="M8 8l2 8h2l-2-8H8z" fill="white" />
          </svg>
        ),
        status: 'success',
        color: 'bg-green-50 text-green-600'
      }
    },
    {
      id: 'fill-info',
      node: {
        id: 'fill-info',
        type: 'browser',
        title: '填写商品信息',
        description: '填写优化后的商品信息',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        ),
        status: 'success',
        color: 'bg-blue-50 text-blue-600'
      }
    },
    {
      id: 'upload-images',
      node: {
        id: 'upload-images',
        type: 'browser',
        title: '上传商品图片',
        description: '上传提取的商品图片到 Shopify',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
        status: 'success',
        color: 'bg-cyan-50 text-cyan-600'
      }
    },
    {
      id: 'publish',
      node: {
        id: 'publish',
        type: 'browser',
        title: '发布商品',
        description: '发布商品到 Shopify 店铺',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        ),
        status: 'success',
        color: 'gradient-blue'
      }
    },
    {
      id: 'end',
      node: {
        id: 'end',
        type: 'end',
        title: '结束节点',
        description: '工作流执行完成',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
        ),
        status: 'pending',
        color: 'gradient-red'
      }
    }
  ])

  // 可用节点列表
  const availableNodes = [
    {
      category: '浏览器自动化',
      color: 'blue',
      nodes: [
        { name: '打开网页', icon: '🌐' },
        { name: '点击元素', icon: '👆' },
        { name: '输入文本', icon: '⌨️' },
        { name: '提取数据', icon: '📊' },
        { name: '滚动页面', icon: '📜' },
        { name: '等待元素', icon: '⏱️' },
        { name: '截图保存', icon: '📷' },
        { name: '执行JS代码', icon: '💻' }
      ]
    },
    {
      category: 'AI 处理',
      color: 'purple',
      nodes: [
        { name: 'AI 生成文案', icon: '✍️' },
        { name: 'AI 翻译', icon: '🌍' },
        { name: 'AI 优化标题', icon: '⚡' },
        { name: 'AI 生成图片', icon: '🎨' }
      ]
    },
    {
      category: '数据处理',
      color: 'orange',
      nodes: [
        { name: '数据筛选', icon: '🔍' },
        { name: '数据去重', icon: '🗑️' },
        { name: '数据合并', icon: '🔗' },
        { name: '数据导出', icon: '📤' }
      ]
    },
    {
      category: '流程控制',
      color: 'green',
      nodes: [
        { name: '条件判断', icon: '❓' },
        { name: '循环执行', icon: '🔄' },
        { name: '延时等待', icon: '⏰' }
      ]
    }
  ]

  // 主题切换
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDarkMode(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDarkMode(true)
    }
  }

  // 侧边栏切换
  const toggleSidebar = () => {
    const newCollapsed = !sidebarCollapsed
    setSidebarCollapsed(newCollapsed)
    localStorage.setItem('sidebarCollapsed', String(newCollapsed))
  }

  return (
    <div className={`flex h-full ${isDarkMode ? 'dark' : ''}`} id="workflowEditor">
      {/* 左侧导航栏 */}
      <aside
        id="sidebar"
        className={`bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-dark-border flex flex-col flex-shrink-0 relative transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-56'
        }`}
      >
        {/* 收缩/展开按钮 */}
        <button
          onClick={toggleSidebar}
          className={`absolute -right-3 top-5 w-6 h-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-full flex items-center justify-center shadow-sm z-50 hover:scale-110 transition-transform cursor-pointer`}
        >
          <svg
            className={`w-3 h-3 text-gray-500 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Logo */}
        <div className={`p-4 border-b border-gray-100 dark:border-dark-border flex items-center gap-2 relative ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-lg gradient-blue flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          {!sidebarCollapsed && (
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-sm text-gray-900 dark:text-dark-text">AI CrossBorder</span>
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded">Pro</span>
              </div>
              <div className="text-[11px] text-gray-500">AI 跨境电商自动化</div>
            </div>
          )}
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 overflow-y-auto py-2 scrollbar-hide">
          {[
            { name: '首页概览', icon: '🏠', active: false },
            { name: '工作流', icon: '📋', active: true },
            { name: '模板市场', icon: '🛒', active: false },
            { name: '浏览器自动化', icon: '🌐', active: false },
            { name: 'AI 助手', icon: '💡', active: false },
            { name: '任务执行记录', icon: '📝', active: false },
            { name: '数据看板', icon: '📊', active: false },
            { name: '集成中心', icon: '🔌', active: false },
            { name: '系统设置', icon: '⚙️', active: false }
          ].map((item) => (
            <div key={item.name} className="px-3 mb-1">
              <a
                href="#"
                className={`left-nav-item flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  item.active
                    ? 'active bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-gray-600 dark:text-dark-muted hover:bg-gray-50 dark:hover:bg-dark-hover'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
              >
                <span className="text-lg">{item.icon}</span>
                {!sidebarCollapsed && <span>{item.name}</span>}
              </a>
            </div>
          ))}
        </nav>

        {/* 底部计划信息 */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 dark:text-dark-muted">当前计划：</span>
              <span className="text-xs font-semibold text-gray-900 dark:text-dark-text">专业版</span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500 dark:text-dark-muted">执行次数</span>
              <span className="text-xs text-gray-700 dark:text-dark-subtle">12,550 / 50,000</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-1.5 mb-3">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '25%' }}></div>
            </div>
            <button className="w-full py-2 border border-gray-300 dark:border-dark-border rounded-lg text-xs font-medium text-gray-700 dark:text-dark-subtle hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors">
              升级计划
            </button>
          </div>
        )}
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* 顶部栏 */}
        <header className="h-14 bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center text-sm text-gray-600 dark:text-dark-muted">
              <span className="font-medium text-gray-900 dark:text-dark-text">工作流</span>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-700 dark:text-dark-subtle">创建新品并上架到Shopify</span>
            </div>
            <span className="px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs rounded-full border border-green-200 dark:border-green-800 font-medium">
              已保存
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* 主题切换按钮 */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover text-gray-500 dark:text-dark-muted transition-colors relative"
              title="切换黑白模式"
            >
              {isDarkMode ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-dark-muted">工作流已启用</span>
              <button
                onClick={() => setWorkflowEnabled(!workflowEnabled)}
                className={`relative inline-block w-10 h-5 align-middle select-none transition-colors duration-200 ${
                  workflowEnabled ? 'bg-blue-500' : 'bg-gray-300'
                } rounded-full`}
              >
                <span
                  className={`absolute block w-5 h-5 rounded-full bg-white border-2 appearance-none cursor-pointer transition-all duration-200 ${
                    workflowEnabled ? 'right-0 border-blue-500' : 'left-0 border-gray-300'
                  }`}
                />
              </button>
            </div>

            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-dark-border text-sm font-medium text-gray-700 dark:text-dark-subtle hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              运行
            </button>

            <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg gradient-blue text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-sm shadow-blue-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              发布
            </button>
          </div>
        </header>

        {/* 工作区 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 左侧节点面板 */}
          <div className="w-72 bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-dark-border flex flex-col flex-shrink-0">
            <div className="p-3 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
              <span className="font-semibold text-sm text-gray-900 dark:text-dark-text">添加节点</span>
              <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-dark-hover text-gray-400 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-3">
              <div className="relative">
                <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="搜索节点"
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide px-3 pb-4">
              {availableNodes.map((category) => (
                <div key={category.category} className="mb-4">
                  <div className="flex items-center gap-2 px-1 mb-2">
                    <div className={`w-1 h-4 bg-${category.color}-500 rounded-full`} />
                    <span className="text-xs font-semibold text-gray-500 dark:text-dark-muted uppercase tracking-wider">
                      {category.category}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {category.nodes.map((node) => (
                      <div
                        key={node.name}
                        className="node-item flex items-center gap-3 px-3 py-2 rounded-lg border border-transparent cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-dark-hover hover:border-gray-200 dark:hover:border-dark-border"
                      >
                        <span className="text-xl">{node.icon}</span>
                        <span className="text-sm text-gray-700 dark:text-dark-subtle">{node.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 中间画布区域 */}
          <div className="flex-1 bg-gray-50 dark:bg-dark-bg relative overflow-auto flex flex-col">
            {/* 画布内容 */}
            <div className="flex-1 flex items-start justify-center pt-12 pb-32 px-8 min-h-min">
              <div className="flex flex-col items-center gap-0 w-80">
                {workflowNodes.map((workflowNode, index) => (
                  <div key={workflowNode.id} className="relative w-full">
                    <div
                      onClick={() => setSelectedNode(workflowNode.id)}
                      className={`node-card w-full bg-white dark:bg-dark-card rounded-xl border p-4 flex items-center gap-3 cursor-pointer transition-all ${
                        selectedNode === workflowNode.id
                          ? 'border-2 border-blue-500 shadow-sm shadow-blue-100'
                          : 'border border-gray-200 dark:border-dark-border hover:border-blue-300 dark:hover:border-blue-600'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          workflowNode.node.color.startsWith('gradient')
                            ? workflowNode.node.color
                            : workflowNode.node.color
                        } ${workflowNode.node.type === 'start' || workflowNode.node.type === 'end' ? 'rounded-full' : ''}`}
                      >
                        {workflowNode.node.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900 dark:text-dark-text">{workflowNode.node.title}</div>
                        <div className="text-xs text-gray-500 dark:text-dark-muted mt-0.5">{workflowNode.node.description}</div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-dark-hover text-gray-400 transition-colors">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="6" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="12" cy="18" r="2" />
                          </svg>
                        </button>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${
                            workflowNode.node.status === 'success'
                              ? 'bg-green-500'
                              : workflowNode.node.status === 'error'
                              ? 'bg-red-500'
                              : 'bg-gray-300'
                          }`}
                        >
                          {workflowNode.node.status === 'success' && (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                    {index < workflowNodes.length - 1 && (
                      <>
                        <div className="workflow-line" />
                        <div className="workflow-arrow" />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 底部使用流程指南 */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-dark-card rounded-2xl shadow-lg border border-gray-200 dark:border-dark-border px-8 py-4 flex items-center gap-8">
              {[
                { num: 1, title: '选择模板', desc: '或从空白创建新的工作流' },
                { num: 2, title: '添加节点', desc: '从左侧选择节点拖拽到画布' },
                { num: 3, title: '配置节点', desc: '设置每个节点的具体参数' },
                { num: 4, title: '测试运行', desc: '逐个测试节点确保正常工作', color: 'orange' },
                { num: 5, title: '发布启用', desc: '发布工作流并开启自动化', color: 'gray' }
              ].map((step) => (
                <div key={step.num} className="guide-step flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-bold ${
                      step.color === 'orange' ? 'bg-orange-400' : step.color === 'gray' ? 'bg-gray-200 text-gray-500' : 'bg-blue-500'
                    }`}
                  >
                    {step.num}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-dark-text">{step.title}</div>
                    <div className="text-xs text-gray-500 dark:text-dark-muted">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧配置面板 */}
          <div className="w-80 bg-white dark:bg-dark-surface border-l border-gray-200 dark:border-dark-border flex flex-col flex-shrink-0">
            <div className="flex border-b border-gray-200 dark:border-dark-border">
              <button className="flex-1 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-500">节点配置</button>
              <button className="flex-1 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">运行日志</button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
              {selectedNode ? (
                <>
                  {/* 节点标题 */}
                  <div className="flex items-start gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-dark-card border-2 border-gray-100 dark:border-dark-border flex items-center justify-center flex-shrink-0 overflow-hidden mt-0.5">
                      {workflowNodes.find((n) => n.id === selectedNode)?.node.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-dark-text">
                          {workflowNodes.find((n) => n.id === selectedNode)?.node.title}
                        </h3>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-dark-muted mt-1">
                        {workflowNodes.find((n) => n.id === selectedNode)?.node.description}
                      </p>
                    </div>
                  </div>

                  {/* 配置选项 */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-4 bg-blue-500 rounded-full" />
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-dark-text">浏览器配置</h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-dark-muted mb-1.5">选择浏览器配置</label>
                        <div className="relative">
                          <select className="w-full pl-3 pr-8 py-2 bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border rounded-lg text-sm text-gray-700 dark:text-dark-subtle focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                            <option>默认浏览器配置</option>
                            <option>自定义配置 1</option>
                            <option>自定义配置 2</option>
                          </select>
                          <svg className="w-4 h-4 absolute right-3 top-2.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 测试此节点 */}
                  <div className="pt-4 border-t border-gray-200 dark:border-dark-border">
                    <div className="text-xs text-gray-500 dark:text-dark-muted mb-2">测试此节点</div>
                    <div className="text-xs text-gray-400 dark:text-dark-subtle mb-3">点击测试按钮，运行此节点看看效果</div>
                    <button className="w-full py-2.5 gradient-blue text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm shadow-blue-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      测试运行
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-dark-hover flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-dark-text mb-2">选择一个节点</h3>
                  <p className="text-sm text-gray-500 dark:text-dark-muted">点击画布上的节点查看和编辑配置</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
