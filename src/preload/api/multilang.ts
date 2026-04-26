/**
 * 预加载脚本 - 多语言服务API
 * 暴露给渲染进程的安全API
 */

import { contextBridge, ipcRenderer } from 'electron'

/**
 * 多语言服务API
 */
export const multilangAPI = {
  // ========== Python AI服务 ==========

  /**
   * 图像分析
   */
  async analyzeImage(imagePath: string): Promise<any> {
    return ipcRenderer.invoke('python:analyzeImage', imagePath)
  },

  /**
   * 生成商品描述
   */
  async generateDescription(product: Record<string, any>): Promise<any> {
    return ipcRenderer.invoke('python:generateDescription', product)
  },

  /**
   * 翻译文本
   */
  async translate(text: string, targetLang: string): Promise<any> {
    return ipcRenderer.invoke('python:translate', text, targetLang)
  },

  /**
   * 提取关键词
   */
  async extractKeywords(text: string, maxKeywords?: number): Promise<any> {
    return ipcRenderer.invoke('python:extractKeywords', text, maxKeywords)
  },

  // ========== Go爬虫服务 ==========

  /**
   * 爬取商品
   */
  async crawlProduct(url: string): Promise<any> {
    return ipcRenderer.invoke('go:crawlProduct', url)
  },

  /**
   * 批量爬取
   */
  async batchCrawl(urls: string[]): Promise<any> {
    return ipcRenderer.invoke('go:batchCrawl', urls)
  },

  /**
   * 监控价格
   */
  async monitorPrice(url: string): Promise<any> {
    return ipcRenderer.invoke('go:monitorPrice', url)
  },

  /**
   * 爬取竞品
   */
  async crawlCompetitors(productName: string): Promise<any> {
    return ipcRenderer.invoke('go:crawlCompetitors', productName)
  },

  // ========== 服务管理 ==========

  /**
   * 获取所有服务状态
   */
  async getServiceStatus(): Promise<any> {
    return ipcRenderer.invoke('services:getStatus')
  },

  /**
   * 重启服务
   */
  async restartService(serviceType: string): Promise<boolean> {
    return ipcRenderer.invoke('services:restart', serviceType)
  },

  /**
   * 健康检查
   */
  async healthCheck(serviceType?: string): Promise<boolean | Record<string, boolean>> {
    return ipcRenderer.invoke('services:healthCheck', serviceType)
  }
}

/**
 * 在contextBridge中暴露多语言API
 */
export function exposeMultilangAPI() {
  contextBridge.exposeInMainWorld('multilang', multilangAPI)
}
