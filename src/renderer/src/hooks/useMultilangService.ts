/**
 * 多语言服务 Hook
 * 在React组件中使用多语言服务
 */

import { useState, useCallback } from 'react'

/**
 * 使用Python AI服务
 */
export function usePythonAI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * 分析图片
   */
  const analyzeImage = useCallback(async (imagePath: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await window.multilang.analyzeImage(imagePath)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * 生成描述
   */
  const generateDescription = useCallback(async (product: Record<string, any>) => {
    setLoading(true)
    setError(null)

    try {
      const result = await window.multilang.generateDescription(product)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * 翻译文本
   */
  const translate = useCallback(async (text: string, targetLang: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await window.multilang.translate(text, targetLang)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * 提取关键词
   */
  const extractKeywords = useCallback(async (text: string, maxKeywords = 10) => {
    setLoading(true)
    setError(null)

    try {
      const result = await window.multilang.extractKeywords(text, maxKeywords)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    analyzeImage,
    generateDescription,
    translate,
    extractKeywords
  }
}

/**
 * 使用Go爬虫服务
 */
export function useGoCrawler() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  /**
   * 爬取单个商品
   */
  const crawlProduct = useCallback(async (url: string) => {
    setLoading(true)
    setError(null)
    setProgress(0)

    try {
      const result = await window.multilang.crawlProduct(url)
      setProgress(100)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * 批量爬取
   */
  const batchCrawl = useCallback(async (urls: string[], onProgress?: (current: number, total: number) => void) => {
    setLoading(true)
    setError(null)
    setProgress(0)

    try {
      const result = await window.multilang.batchCrawl(urls)

      // 模拟进度更新
      for (let i = 0; i < urls.length; i++) {
        setProgress((i + 1) / urls.length * 100)
        onProgress?.(i + 1, urls.length)
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
      setProgress(100)
    }
  }, [])

  /**
   * 监控价格
   */
  const monitorPrice = useCallback(async (url: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await window.multilang.monitorPrice(url)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * 爬取竞品
   */
  const crawlCompetitors = useCallback(async (productName: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await window.multilang.crawlCompetitors(productName)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    progress,
    crawlProduct,
    batchCrawl,
    monitorPrice,
    crawlCompetitors
  }
}

/**
 * 使用服务管理
 */
export function useServiceManager() {
  const [services, setServices] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)

  /**
   * 获取服务状态
   */
  const checkServices = useCallback(async () => {
    setLoading(true)

    try {
      const status = await window.multilang.getServiceStatus()
      setServices(
        status.reduce((acc: Record<string, boolean>, s: any) => {
          acc[s.type] = s.healthy
          return acc
        }, {})
      )
      return status
    } catch (err) {
      console.error('Failed to check services:', err)
      return {}
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * 重启服务
   */
  const restartService = useCallback(async (serviceType: string) => {
    setLoading(true)

    try {
      const result = await window.multilang.restartService(serviceType)
      await checkServices()
      return result
    } catch (err) {
      console.error('Failed to restart service:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [checkServices])

  return {
    services,
    loading,
    checkServices,
    restartService
  }
}

/**
 * 组合Hook - 使用所有多语言服务
 */
export function useMultilangServices() {
  const pythonAI = usePythonAI()
  const goCrawler = useGoCrawler()
  const serviceManager = useServiceManager()

  return {
    python: pythonAI,
    crawler: goCrawler,
    services: serviceManager
  }
}
