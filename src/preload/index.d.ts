import { ElectronAPI } from '@electron-toolkit/preload'

/**
 * 多语言服务API接口
 */
interface MultilangAPI {
  // Python AI服务
  analyzeImage(imagePath: string): Promise<any>
  generateDescription(product: Record<string, any>): Promise<any>
  translate(text: string, targetLang: string): Promise<any>
  extractKeywords(text: string, maxKeywords?: number): Promise<any>

  // Go爬虫服务
  crawlProduct(url: string): Promise<any>
  batchCrawl(urls: string[]): Promise<any>
  monitorPrice(url: string): Promise<any>
  crawlCompetitors(productName: string): Promise<any>

  // 服务管理
  getServiceStatus(): Promise<any>
  restartService(serviceType: string): Promise<boolean>
  healthCheck(serviceType?: string): Promise<boolean | Record<string, boolean>>
}

declare global {
  interface Window {
    electron: ElectronAPI
    multilang: MultilangAPI
    api: unknown
  }
}
