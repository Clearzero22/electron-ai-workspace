/**
 * 多语言服务测试页面
 */

import { useState } from 'react'
import { useMultilangServices } from '@/hooks/useMultilangService'

export default function MultilangTestPage() {
  const { python, crawler } = useMultilangServices()
  const [testResult, setTestResult] = useState<any>(null)

  // 测试Python图像分析
  const testPythonAnalyze = async () => {
    try {
      setTestResult({ loading: true, message: '正在分析图片...' })

      const result = await python.analyzeImage('/test/sofa.jpg')

      setTestResult({
        loading: false,
        success: true,
        type: 'python_analyze',
        data: result
      })

      console.log('图像分析结果:', result)
      alert(`识别成功！\n物体: ${result.objects.join(', ')}\n颜色: ${result.colors.join(', ')}`)
    } catch (error) {
      setTestResult({
        loading: false,
        success: false,
        type: 'python_analyze',
        error: String(error)
      })
      alert(`分析失败: ${error}`)
    }
  }

  // 测试Python描述生成
  const testPythonGenerate = async () => {
    try {
      setTestResult({ loading: true, message: '正在生成描述...' })

      const product = {
        name: '现代简约三人座沙发',
        material: '优质布艺',
        features: ['可拆洗', '防污防水', '高弹海绵', '实木框架']
      }

      const result = await python.generateDescription(product)

      setTestResult({
        loading: false,
        success: true,
        type: 'python_generate',
        data: result
      })

      alert(`描述生成成功！\n${result.description}`)
    } catch (error) {
      setTestResult({
        loading: false,
        success: false,
        type: 'python_generate',
        error: String(error)
      })
      alert(`生成失败: ${error}`)
    }
  }

  // 测试Python翻译
  const testPythonTranslate = async () => {
    try {
      setTestResult({ loading: true, message: '正在翻译...' })

      const result = await python.translate('Modern fabric sofa', 'zh')

      setTestResult({
        loading: false,
        success: true,
        type: 'python_translate',
        data: result
      })

      alert(`翻译成功！\n英文: Modern fabric sofa\n中文: ${result.translated_text}`)
    } catch (error) {
      setTestResult({
        loading: false,
        success: false,
        type: 'python_translate',
        error: String(error)
      })
      alert(`翻译失败: ${error}`)
    }
  }

  // 测试Go爬虫
  const testGoCrawl = async () => {
    try {
      setTestResult({ loading: true, message: '正在爬取商品...' })

      const result = await crawler.crawlProduct('https://www.example.com/product/123')

      setTestResult({
        loading: false,
        success: true,
        type: 'go_crawl',
        data: result
      })

      console.log('爬取结果:', result)
      alert(`爬取成功！\n商品: ${result.name}\n价格: ${result.price}`)
    } catch (error) {
      setTestResult({
        loading: false,
        success: false,
        type: 'go_crawl',
        error: String(error)
      })
      alert(`爬取失败: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">多语言服务测试页面</h1>

        {/* 服务状态 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">服务状态</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Python AI服务:</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                python.loading
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {python.loading ? '运行中' : '就绪'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Go爬虫服务:</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                crawler.loading
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {crawler.loading ? '运行中' : '就绪'}
              </span>
            </div>
          </div>
        </div>

        {/* Python AI服务测试 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Python AI 服务测试</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={testPythonAnalyze}
              disabled={python.loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {python.loading ? '分析中...' : '测试图像分析'}
            </button>

            <button
              onClick={testPythonGenerate}
              disabled={python.loading}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {python.loading ? '生成中...' : '测试描述生成'}
            </button>

            <button
              onClick={testPythonTranslate}
              disabled={python.loading}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {python.loading ? '翻译中...' : '测试翻译'}
            </button>
          </div>
        </div>

        {/* Go爬虫服务测试 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Go 爬虫服务测试</h2>

          <button
            onClick={testGoCrawl}
            disabled={crawler.loading}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {crawler.loading ? '爬取中...' : '测试商品爬取'}
          </button>
        </div>

        {/* 测试结果显示 */}
        {testResult && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">测试结果</h2>

            {testResult.loading && (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span>{testResult.message}</span>
              </div>
            )}

            {!testResult.loading && testResult.success && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">测试成功！</span>
                </div>
                <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              </div>
            )}

            {!testResult.loading && !testResult.success && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-red-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="font-medium">测试失败</span>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-red-700">
                  {testResult.error}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 使用说明 */}
        <div className="bg-blue-50 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">使用说明</h2>
          <div className="space-y-2 text-sm">
            <p><strong>1. 图像分析：</strong>识别图片中的物体、颜色、风格等信息</p>
            <p><strong>2. 描述生成：</strong>根据商品信息生成SEO友好的描述</p>
            <p><strong>3. 翻译功能：</strong>支持多语言翻译（英语、西班牙语、法语等）</p>
            <p><strong>4. 商品爬取：</strong>从电商平台爬取商品信息</p>
          </div>

          <div className="mt-4 p-4 bg-white rounded-lg">
            <h3 className="font-medium mb-2">在代码中使用：</h3>
            <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
{`// Python AI服务
const { python } = useMultilangServices()

// 图像分析
const result = await python.analyzeImage('/path/to/image.jpg')

// Go爬虫服务
const { crawler } = useMultilangServices()

// 商品爬取
const product = await crawler.crawlProduct('https://example.com/product')`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
