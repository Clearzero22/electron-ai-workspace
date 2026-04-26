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

/**
 * 窗口管理API接口
 */
interface WindowAPI {
  createWindow(config: {
    id: string
    route?: string
    title?: string
    width?: number
    height?: number
    minWidth?: number
    minHeight?: number
    modal?: boolean
    resizable?: boolean
    parent?: string
    alwaysOnTop?: boolean
    frame?: boolean
    transparent?: boolean
  }): Promise<{ success: boolean; windowId?: string; error?: string }>

  closeWindow(windowId: string): Promise<{ success: boolean; error?: string }>
  getWindowInfo(): Promise<any>
  getAllWindows(): Promise<{ success: boolean; windows: any[]; error?: string }>

  sendToWindow(windowId: string, channel: string, ...args: any[]): Promise<{ success: boolean; error?: string }>
  broadcast(channel: string, ...args: any[]): Promise<{ success: boolean; error?: string }>

  minimize(): Promise<{ success: boolean }>
  maximize(): Promise<{ success: boolean }>
  hide(): Promise<{ success: boolean }>
  show(): Promise<{ success: boolean }>
  focus(): Promise<{ success: boolean }>
  blur(): Promise<{ success: boolean }>

  setTitle(title: string): Promise<{ success: boolean }>
  setSize(width: number, height: number): Promise<{ success: boolean }>
  setPosition(x: number, y: number): Promise<{ success: boolean }>
  center(): Promise<{ success: boolean }>

  onWindowMessage(channel: string, callback: (...args: any[]) => void): void
  removeWindowMessageListener(channel: string, callback: (...args: any[]) => void): void
  onceWindowMessage(channel: string, callback: (...args: any[]) => void): void
}

declare global {
  interface Window {
    electron: ElectronAPI
    multilang: MultilangAPI
    window: WindowAPI
    api: unknown
  }
}
