/**
 * 工作台主页面
 * 包含页面切换和导航功能
 */

import React, { useState } from 'react'
import WorkflowEditor from '../components/WorkflowEditor'
import MultilangTestPage from '../components/MultilangTestPage'

type PageType = 'workflow' | 'collection' | 'multilang'

export default function Workspace() {
  const [currentPage, setCurrentPage] = useState<PageType>('collection')

  const pages = [
    { id: 'collection' as PageType, name: '商品采集', icon: '🛒', description: '采集电商平台商品数据' },
    { id: 'workflow' as PageType, name: '工作流编辑', icon: '⚙️', description: '设计和自动化工作流程' },
    { id: 'multilang' as PageType, name: '多语言服务', icon: '🌍', description: 'AI翻译和文本处理' }
  ]

  const renderPage = () => {
    switch (currentPage) {
      case 'workflow':
        return <WorkflowEditor />
      case 'multilang':
        return <MultilangTestPage />
      case 'collection':
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">商品采集工作台</h2>
              <p className="text-gray-600 dark:text-gray-400">电商数据采集和分析功能</p>
            </div>
          </div>
        )
    }
  }

  // 工作流编辑器页面有自己独立的导航，不需要外层导航
  if (currentPage === 'workflow') {
    return (
      <div className="relative">
        {/* 浮动页面切换按钮 */}
        <div className="fixed top-4 left-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2">
            <div className="flex gap-2">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setCurrentPage(page.id)}
                  title={page.name}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                    currentPage === page.id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {page.icon}
                </button>
              ))}
            </div>
          </div>
        </div>
        <WorkflowEditor />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 relative">
      {/* 浮动页面切换按钮 - 所有页面都显示 */}
      <div className="fixed top-4 left-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2">
          <div className="flex gap-2">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => setCurrentPage(page.id)}
                title={page.name}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                  currentPage === page.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {page.icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 顶部导航栏 */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg gradient-blue flex items-center justify-center text-white font-bold">
                AI
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">跨境电商工作台</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">AI-Powered Cross-Border E-Commerce Platform</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              文档
            </button>
            <button className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              设置
            </button>
          </div>
        </div>
      </header>

      {/* 页面切换标签 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6">
        <div className="flex gap-8">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => setCurrentPage(page.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                currentPage === page.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <span className="text-xl">{page.icon}</span>
              <div className="text-left">
                <div className="font-medium text-sm">{page.name}</div>
                <div className="text-xs opacity-75">{page.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 页面内容 */}
      <main className="flex-1 overflow-hidden">
        {renderPage()}
      </main>
    </div>
  )
}
