/**
 * 工作台主页面
 * 包含页面切换和导航功能
 */

import React, { useState } from 'react'
import WorkflowEditor from '../components/WorkflowEditor'
import MultilangTestPage from '../components/MultilangTestPage'
import WorkspaceMain from '../components/workspace/Workspace'
import WindowDemo from '../components/WindowDemo'

type PageType = 'workflow' | 'collection' | 'multilang' | 'window-demo'

export default function Workspace() {
  const [currentPage, setCurrentPage] = useState<PageType>('collection')

  const pages = [
    { id: 'collection' as PageType, name: '商品采集', icon: '🛒', description: '采集电商平台商品数据' },
    { id: 'workflow' as PageType, name: '工作流编辑', icon: '⚙️', description: '设计和自动化工作流程' },
    { id: 'multilang' as PageType, name: '多语言服务', icon: '🌍', description: 'AI翻译和文本处理' },
    { id: 'window-demo' as PageType, name: '多窗口测试', icon: '🪟', description: '测试多窗口管理功能' }
  ]

  const renderPage = () => {
    switch (currentPage) {
      case 'workflow':
        return <WorkflowEditor />
      case 'multilang':
        return <MultilangTestPage />
      case 'window-demo':
        return <WindowDemo />
      case 'collection':
      default:
        return <WorkspaceMain />
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

      {/* 页面内容 */}
      <main className="flex-1 overflow-hidden">
        {renderPage()}
      </main>
    </div>
  )
}
