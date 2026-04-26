# 系统架构文档

## 🏗️ 整体架构

AI CrossBorder Workspace 采用 **Electron + React + TypeScript** 架构，结合 **主进程 - 预加载 - 渲染进程** 的三层架构模式。

## 📐 架构分层

```
┌─────────────────────────────────────────────────────┐
│                   用户界面层                          │
│           (React Components + TypeScript)           │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│                  状态管理层                           │
│         (Zustand/Redux + Context API)               │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│                 业务逻辑层                           │
│       (Custom Hooks + Services Layer)               │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│                 API 接口层                           │
│         (Preload Scripts + IPC Channels)            │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│                服务层 (主进程)                        │
│    (Database + AI Service + Crawler + Storage)      │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│                数据层                               │
│      (SQLite + File System + Remote API)            │
└─────────────────────────────────────────────────────┘
```

## 🔧 核心模块

### 1. 主进程 (Main Process)

**职责**：
- 窗口生命周期管理
- 系统级 API 访问
- 业务服务实现
- IPC 请求处理

**核心服务**：
```typescript
// 数据库服务
class DatabaseService {
  connection: Connection
  models: ModelRegistry

  // 商品 CRUD
  async createProduct(data: ProductData): Promise<Product>
  async getProducts(filters: ProductFilters): Promise<Product[]>
  async updateProduct(id: string, data: Partial<ProductData>): Promise<void>
  async deleteProduct(id: string): Promise<void>
}

// AI 服务
class AIService {
  // 图像识别
  async analyzeImage(imagePath: string): Promise<ImageAnalysis>

  // 文本生成
  async generateDescription(product: Product): Promise<string>

  // 翻译
  async translate(text: string, targetLang: string): Promise<string>
}

// 爬虫服务
class CrawlerService {
  // 网页抓取
  async crawlProduct(url: string): Promise<ProductData>

  // 批量抓取
  async batchCrawl(urls: string[]): Promise<ProductData[]>

  // 监控价格
  async monitorPrice(url: string): Promise<PriceUpdate>
}
```

### 2. 预加载脚本 (Preload Scripts)

**职责**：
- 暴露安全的 API 给渲染进程
- 实现 IPC 通信桥接
- 类型安全的接口

**API 暴露**：
```typescript
// 暴露给渲染进程的 API
window.electronAPI = {
  // 数据库 API
  database: {
    getProducts: (filters) => ipcRenderer.invoke('db:products:get', filters),
    createProduct: (data) => ipcRenderer.invoke('db:products:create', data),
    updateProduct: (id, data) => ipcRenderer.invoke('db:products:update', id, data),
    deleteProduct: (id) => ipcRenderer.invoke('db:products:delete', id)
  },

  // AI API
  ai: {
    analyzeImage: (imagePath) => ipcRenderer.invoke('ai:image:analyze', imagePath),
    generateDescription: (product) => ipcRenderer.invoke('ai:text:generate', product),
    translate: (text, lang) => ipcRenderer.invoke('ai:translate', text, lang)
  },

  // 爬虫 API
  crawler: {
    crawlProduct: (url) => ipcRenderer.invoke('crawler:crawl', url),
    batchCrawl: (urls) => ipcRenderer.invoke('crawler:batch', urls)
  },

  // 存储 API
  storage: {
    save: (key, value) => ipcRenderer.invoke('storage:save', key, value),
    get: (key) => ipcRenderer.invoke('storage:get', key),
    remove: (key) => ipcRenderer.invoke('storage:remove', key)
  }
}
```

### 3. 渲染进程 (Renderer Process)

**架构模式**：
- **组件化**: React 函数组件
- **状态管理**: Zustand/Redux Toolkit
- **路由**: React Router
- **UI 框架**: Tailwind CSS + 自定义组件

**核心 Hook**：
```typescript
// 商品数据 Hook
function useProducts(filters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const data = await window.electronAPI.database.getProducts(filters)
    setProducts(data)
    setLoading(false)
  }, [filters])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { products, loading, refetch: fetchProducts }
}

// AI 分析 Hook
function useAIAnalysis() {
  const analyzeImage = useCallback(async (imagePath: string) => {
    return await window.electronAPI.ai.analyzeImage(imagePath)
  }, [])

  const generateDescription = useCallback(async (product: Product) => {
    return await window.electronAPI.ai.generateDescription(product)
  }, [])

  return { analyzeImage, generateDescription }
}
```

## 🔄 IPC 通信架构

### 通信模式

**1. 单次请求-响应 (invoke/handle)**
```typescript
// 渲染进程
const result = await window.electronAPI.someMethod(params)

// 主进程
ipcMain.handle('channel-name', async (event, params) => {
  return result
})
```

**2. 单向发送 (send/on)**
```typescript
// 渲染进程
window.electronAPI.sendEvent(data)

// 主进程
ipcMain.on('event-name', (event, data) => {
  // 处理事件
})
```

**3. 双向通信 (双向流)**
```typescript
// 渲染进程
const port = window.electronAPI.createPort()
port.onmessage = (event) => { /* 处理消息 */ }
port.postMessage(data)

// 主进程
ipcMain.on('port-channel', (event) => {
  const port = event.ports[0]
  port.onmessage = (event) => { /* 处理消息 */ }
  port.postMessage(response)
})
```

### 通道命名规范

```typescript
// 格式: {domain}:{action}:{subaction}
const IPC_CHANNELS = {
  // 数据库
  'db:products:get': '获取商品列表',
  'db:products:create': '创建商品',
  'db:products:update': '更新商品',
  'db:products:delete': '删除商品',

  // AI 服务
  'ai:image:analyze': '图像分析',
  'ai:text:generate': '文本生成',
  'ai:translate': '翻译',

  // 爬虫
  'crawler:crawl': '爬取商品',
  'crawler:batch': '批量爬取',
  'crawler:monitor': '监控价格',

  // 存储
  'storage:save': '保存数据',
  'storage:get': '获取数据',
  'storage:remove': '删除数据'
}
```

## 💾 数据管理架构

### 数据流

```
用户操作
    ↓
React 组件
    ↓
Dispatch Action
    ↓
Store 更新
    ↓
组件重渲染
    ↓
显示更新
```

### 状态管理结构

```typescript
// Zustand Store 示例
interface ProductStore {
  // 状态
  products: Product[]
  selectedProduct: Product | null
  filters: ProductFilters
  loading: boolean

  // 操作
  fetchProducts: () => Promise<void>
  selectProduct: (id: string) => void
  updateFilters: (filters: Partial<ProductFilters>) => void
  createProduct: (data: ProductData) => Promise<void>
  updateProduct: (id: string, data: Partial<ProductData>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
}

const useProductStore = create<ProductStore>((set, get) => ({
  // 初始状态
  products: [],
  selectedProduct: null,
  filters: {},
  loading: false,

  // 操作实现
  fetchProducts: async () => {
    set({ loading: true })
    const products = await window.electronAPI.database.getProducts(get().filters)
    set({ products, loading: false })
  },

  selectProduct: (id) => {
    const product = get().products.find(p => p.id === id)
    set({ selectedProduct: product || null })
  },

  // ... 其他操作
}))
```

## 🔐 安全架构

### 1. 上下文隔离

**目的**: 防止渲染进程访问 Node.js API

**实现**:
```typescript
// electron.vite.config.ts
contextIsolation: true,
nodeIntegration: false,
sandbox: true
```

### 2. CSP 策略

**Content Security Policy**:
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' 'unsafe-eval' 'unsafe-inline';
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               font-src 'self' https:;
               connect-src 'self' https:;">
```

### 3. 权限验证

**IPC 验证**:
```typescript
ipcMain.handle('sensitive-operation', async (event, params) => {
  // 验证来源
  if (!validateSender(event.sender)) {
    throw new Error('Unauthorized')
  }

  // 验证参数
  if (!validateParams(params)) {
    throw new Error('Invalid parameters')
  }

  // 执行操作
  return await performOperation(params)
})
```

## 🚀 性能优化

### 1. 懒加载

```typescript
// 路由级懒加载
const Workspace = lazy(() => import('@pages/workspace'))
const Products = lazy(() => import('@pages/products'))

// 组件级懒加载
const HeavyComponent = lazy(() => import('./HeavyComponent'))
```

### 2. 数据缓存

```typescript
// 缓存策略
interface CacheConfig {
  ttl: number        // 生存时间
  maxSize: number    // 最大缓存数
  strategy: 'lru' | 'fifo' | 'lfu'
}

class DataCache<T> {
  private cache = new Map<string, { value: T, expiry: number }>()

  get(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  set(key: string, value: T, ttl: number): void {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl
    })
  }
}
```

### 3. 渲染优化

```typescript
// 使用 React.memo 避免不必要的重渲染
const ProductCard = memo(({ product }: { product: Product }) => {
  return <div>{product.name}</div>
})

// 使用 useMemo 缓存计算结果
const filteredProducts = useMemo(() => {
  return products.filter(filterFn)
}, [products, filterFn])

// 使用 useCallback 缓存函数
const handleClick = useCallback(() => {
  doSomething(id)
}, [id])
```

## 📊 错误处理

### 错误边界

```typescript
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误
    console.error('Error caught:', error, errorInfo)
    // 发送到错误跟踪服务
    sendErrorToService(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }
    return this.props.children
  }
}
```

### IPC 错误处理

```typescript
// 主进程
ipcMain.handle('operation', async (event, params) => {
  try {
    return await performOperation(params)
  } catch (error) {
    // 记录错误
    logger.error('IPC operation failed', error)
    // 返回错误信息
    throw new IPCError('Operation failed', error.code)
  }
})

// 渲染进程
try {
  const result = await window.electronAPI.someMethod(params)
} catch (error) {
  if (error instanceof IPCError) {
    // 处理 IPC 错误
    showErrorMessage(error.message)
  }
}
```

## 🔍 日志和监控

### 日志系统

```typescript
// 日志级别
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

// 日志记录器
class Logger {
  private level: LogLevel

  log(level: LogLevel, message: string, data?: any) {
    if (level >= this.level) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        level: LogLevel[level],
        message,
        data
      }
      // 输出到控制台
      console[level === LogLevel.DEBUG ? 'log' : LogLevel[level].toLowerCase()](logEntry)
      // 写入文件
      this.writeToFile(logEntry)
    }
  }
}
```

### 性能监控

```typescript
// 性能指标收集
class PerformanceMonitor {
  measureOperation(name: string, fn: () => Promise<any>) {
    const start = performance.now()
    return fn().finally(() => {
      const duration = performance.now() - start
      this.recordMetric(name, duration)
    })
  }

  recordMetric(name: string, value: number) {
    // 记录到监控系统
    metrics.record(name, value)
  }
}
```

## 📚 技术栈总结

| 层次 | 技术选型 |
|------|---------|
| **桌面框架** | Electron 39.x |
| **前端框架** | React 19.x |
| **类型系统** | TypeScript 5.x |
| **构建工具** | Vite 7.x + electron-vite |
| **样式方案** | Tailwind CSS 3.x |
| **状态管理** | Zustand / Redux Toolkit |
| **路由管理** | React Router 6.x |
| **数据库** | SQLite (better-sqlite3) |
| **IPC 通信** | Electron IPC |
| **代码混淆** | javascript-obfuscator |

---

**文档版本**: 1.0.0
**最后更新**: 2024-04-27
