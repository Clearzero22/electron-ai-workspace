/**
 * 多语言服务集成示例组件
 * 展示如何在React组件中使用Python和Go服务
 */

import { useState, useEffect } from 'react'
import { useMultilangServices } from '@/hooks/useMultilangService'

export default function MultilangExample() {
  const { python, crawler, services } = useMultilangServices()
  const [imagePath, setImagePath] = useState('')
  const [productUrl, setProductUrl] = useState('')
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [crawlResult, setCrawlResult] = useState<any>(null)

  // 检查服务状态
  useEffect(() => {
    services.checkServices()
  }, [services])

  // Python AI服务示例
  const handleAnalyzeImage = async () => {
    if (!imagePath) {
      alert('请输入图片路径')
      return
    }

    try {
      const result = await python.analyzeImage(imagePath)
      setAnalysisResult(result)
      console.log('图像分析结果:', result)
    } catch (error) {
      alert(`图像分析失败: ${error}`)
    }
  }

  const handleGenerateDescription = async () => {
    const product = {
      name: '现代简约沙发',
      material: '优质布艺',
      features: ['可拆洗', '防污防水', '高弹海绵']
    }

    try {
      const result = await python.generateDescription(product)
      console.log('生成的描述:', result)
      alert(`生成的描述:\n${result.data.description}`)
    } catch (error) {
      alert(`生成描述失败: ${error}`)
    }
  }

  // Go爬虫服务示例
  const handleCrawlProduct = async () => {
    if (!productUrl) {
      alert('请输入商品URL')
      return
    }

    try {
      const result = await crawler.crawlProduct(productUrl)
      setCrawlResult(result)
      console.log('爬取结果:', result)
    } catch (error) {
      alert(`爬取失败: ${error}`)
    }
  }

  const handleBatchCrawl = async () => {
    const urls = [
      'https://example.com/product1',
      'https://example.com/product2',
      'https://example.com/product3'
    ]

    try {
      const result = await crawler.batchCrawl(urls, (current, total) => {
        console.log(`爬取进度: ${current}/${total}`)
      })
      console.log('批量爬取结果:', result)
      alert(`批量爬取完成，共爬取 ${result.length} 个商品`)
    } catch (error) {
      alert(`批量爬取失败: ${error}`)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">多语言服务集成示例</h1>

      {/* 服务状态 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">服务状态</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Python AI:</span>
            <span className={`px-2 py-1 rounded text-xs ${services.services.python ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {services.services.python ? '运行中' : '未启动'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Go Crawler:</span>
            <span className={`px-2 py-1 rounded text-xs ${services.services.go ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {services.services.go ? '运行中' : '未启动'}
            </span>
          </div>
        </div>
      </div>

      {/* Python AI服务 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Python AI 服务</h2>

        {/* 图像分析 */}
        <div className="mb-4">
          <h3 className="text-md font-medium mb-2">图像分析</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={imagePath}
              onChange={(e) => setImagePath(e.target.value)}
              placeholder="输入图片路径"
              className="flex-1 px-3 py-2 border rounded"
            />
            <button
              onClick={handleAnalyzeImage}
              disabled={python.loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {python.loading ? '分析中...' : '分析'}
            </button>
          </div>
          {analysisResult && (
            <div className="mt-2 p-3 bg-gray-50 rounded">
              <h4 className="font-medium mb-1">分析结果:</h4>
              <pre className="text-xs">{JSON.stringify(analysisResult, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* 生成描述 */}
        <div>
          <h3 className="text-md font-medium mb-2">生成商品描述</h3>
          <button
            onClick={handleGenerateDescription}
            disabled={python.loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {python.loading ? '生成中...' : '生成描述'}
          </button>
        </div>
      </div>

      {/* Go爬虫服务 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Go 爬虫服务</h2>

        {/* 爬取商品 */}
        <div className="mb-4">
          <h3 className="text-md font-medium mb-2">爬取商品</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              placeholder="输入商品URL"
              className="flex-1 px-3 py-2 border rounded"
            />
            <button
              onClick={handleCrawlProduct}
              disabled={crawler.loading}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {crawler.loading ? '爬取中...' : '爬取'}
            </button>
          </div>
          {crawlResult && (
            <div className="mt-2 p-3 bg-gray-50 rounded">
              <h4 className="font-medium mb-1">爬取结果:</h4>
              <pre className="text-xs">{JSON.stringify(crawlResult, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* 批量爬取 */}
        <div>
          <h3 className="text-md font-medium mb-2">批量爬取</h3>
          <button
            onClick={handleBatchCrawl}
            disabled={crawler.loading}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
          >
            {crawler.loading ? `爬取中... ${Math.round(crawler.progress)}%` : '批量爬取'}
          </button>
        </div>
      </div>

      {/* 服务管理 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">服务管理</h2>
        <div className="flex gap-2">
          <button
            onClick={() => services.checkServices()}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            检查服务
          </button>
          <button
            onClick={() => services.restartService('python')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            重启Python服务
          </button>
          <button
            onClick={() => services.restartService('go')}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            重启Go服务
          </button>
        </div>
      </div>
    </div>
  )
}
