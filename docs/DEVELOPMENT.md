# 开发指南

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **Git**: >= 2.0.0
- **操作系统**: Windows 10+, macOS 10.15+, Ubuntu 20.04+

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/Clearzero22/electron-ai-workspace.git
cd electron-ai-workspace

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 📝 开发规范

### 代码风格

#### TypeScript 规范

```typescript
// 使用函数组件 + Hooks
export default function ComponentName({ prop }: Props) {
  // Hook 调用
  const [state, setState] = useState(initialValue)

  // 事件处理函数
  const handleClick = useCallback(() => {
    // 处理逻辑
  }, [dependencies])

  // 渲染
  return <div>...</div>
}
```

#### 组件规范

```typescript
// 组件文件结构
import type { ComponentProps } from './types'
import { useCustomHook } from '@hooks/useCustomHook'

// 接口定义
interface Props {
  title: string
  items: Item[]
  onAction: (item: Item) => void
}

// 组件实现
export default function MyComponent({ title, items, onAction }: Props) {
  // Hook 调用
  const { data, loading } = useCustomHook(items)

  // 早期返回
  if (loading) return <Loading />

  // 渲染
  return (
    <div>
      <h1>{title}</h1>
      {data.map(item => (
        <Item key={item.id} item={item} onClick={onAction} />
      ))}
    </div>
  )
}
```

#### 类型定义规范

```typescript
// types/product.ts
export interface Product {
  id: string
  name: string
  price: number
  description?: string
  images: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ProductFilters {
  keyword?: string
  category?: string
  minPrice?: number
  maxPrice?: number
}

export type ProductStatus = 'draft' | 'published' | 'archived'

// types/index.ts
export * from './product'
export * from './user'
export * from './order'
```

### 文件命名

```
组件文件:      PascalCase.tsx         (例: ProductCard.tsx)
Hook 文件:     camelCase.ts           (例: useProducts.ts)
类型文件:      PascalCase.ts          (例: Product.ts)
工具文件:      camelCase.ts           (例: formatDate.ts)
常量文件:      UPPER_SNAKE_CASE.ts    (例: API_CONSTANTS.ts)
配置文件:      *.config.ts            (例: vite.config.ts)
```

### 导入顺序

```typescript
// 1. React 核心库
import { useState, useEffect } from 'react'
import { type RouterOutputs } from '@types/trpc'

// 2. 第三方库
import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'

// 3. 组件库
import { Modal } from '@components/ui/Modal'
import { ProductCard } from '@components/business/ProductCard'

// 4. Hooks
import { useProducts } from '@hooks/useProducts'

// 5. 工具函数
import { formatDate } from '@utils/format'

// 6. 类型
import type { Product } from '@types/product'

// 7. 常量
import { API_BASE_URL } from '@constants/config'

// 8. 样式
import styles from './Component.module.css'
```

## 🔧 开发工具

### VS Code 配置

推荐安装的扩展：
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-python.python",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### Git 提交规范

使用 Conventional Commits 规范：

```bash
# 格式: <type>: <description>

# 类型
feat:     新功能
fix:      修复 bug
docs:     文档更新
style:    代码格式（不影响功能）
refactor: 重构
perf:     性能优化
test:     测试相关
chore:    构建/工具链相关

# 示例
git commit -m "feat: 添加商品批量导入功能"
git commit -m "fix: 修复 AI 分析面板显示错误"
git commit -m "docs: 更新 API 文档"
```

### 分支策略

```bash
main          # 主分支，用于生产环境
develop       # 开发分支
feature/*     # 功能分支
bugfix/*      # 修复分支
hotfix/*      # 紧急修复分支
release/*     # 发布分支
```

## 🧪 测试

### 单元测试

```typescript
// tests/unit/components/Button.test.tsx
import { render, screen } from '@testing-library/react'
import Button from '@components/ui/Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    screen.getByText('Click me').click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### 集成测试

```typescript
// tests/integration/ipc/products.test.ts
import { ipcMain } from 'electron'
import { window } from './mocks/window'

describe('Product IPC', () => {
  beforeEach(() => {
    // 设置 IPC 监听器
    ipcMain.handle('db:products:get', async () => {
      return mockProducts
    })
  })

  it('fetches products via IPC', async () => {
    const products = await window.electronAPI.database.getProducts()
    expect(products).toEqual(mockProducts)
  })
})
```

### E2E 测试

```typescript
// tests/e2e/workspace.spec.ts
import { test, expect } from '@playwright/test'

test('workspace page loads correctly', async ({ page }) => {
  await page.goto('/workspace')

  // 检查标题
  await expect(page.locator('h1')).toContainText('工作台')

  // 检查侧边栏
  await expect(page.locator('.sidebar')).toBeVisible()

  // 检查商品表格
  await expect(page.locator('.product-table')).toBeVisible()
})
```

## 🐛 调试

### 主进程调试

1. 在 VS Code 中设置断点
2. 按 F5 或使用调试面板
3. 选择 "Electron: Main" 配置

### 渲染进程调试

1. 运行应用
2. 按 F12 或 Ctrl+Shift+I
3. 使用 Chrome DevTools

### IPC 通信调试

```typescript
// 开发环境启用 IPC 日志
if (process.env.NODE_ENV === 'development') {
  ipcMain.on('ipc-message', (event, message) => {
    console.log('IPC Message:', message)
  })
}
```

## 📦 构建和打包

### 开发构建

```bash
# 快速构建（不进行代码检查）
npm run build

# 完整构建（包括类型检查）
npm run build

# 预览构建结果
npm run start
```

### 生产打包

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux

# 所有平台
npm run build:all
```

## 🔐 安全最佳实践

### 1. 敏感信息处理

```typescript
// ❌ 错误：硬编码密钥
const API_KEY = 'sk-1234567890'

// ✅ 正确：使用环境变量
const API_KEY = process.env.OPENAI_API_KEY
```

### 2. 用户输入验证

```typescript
// 验证用户输入
function validateProductInput(data: ProductData): ValidationResult {
  const errors: string[] = []

  if (!data.name || data.name.length > 100) {
    errors.push('商品名称必须在1-100字符之间')
  }

  if (data.price < 0) {
    errors.push('价格不能为负数')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
```

### 3. SQL 注入防护

```typescript
// ❌ 错误：字符串拼接
const query = `SELECT * FROM products WHERE name = '${productName}'`

// ✅ 正确：使用参数化查询
const query = 'SELECT * FROM products WHERE name = ?'
db.query(query, [productName])
```

## 📊 性能优化

### 1. 组件优化

```typescript
// 使用 React.memo 避免不必要的重渲染
export default memo(ComponentName)

// 使用 useMemo 缓存计算结果
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b])

// 使用 useCallback 缓存函数
const handleClick = useCallback(() => {
  doSomething(id)
}, [id])
```

### 2. 数据优化

```typescript
// 虚拟滚动长列表
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={products.length}
  itemSize={50}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <ProductCard product={products[index]} />
    </div>
  )}
</FixedSizeList>
```

### 3. 资源优化

```typescript
// 懒加载图片
<img
  src={imagePath}
  loading="lazy"
  decoding="async"
  alt={product.name}
/>

// 预加载关键资源
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossOrigin="" />
```

## 🔍 常见问题

### Q: 热更新不工作？

**A**: 检查是否正确配置了 Vite HMR：
```typescript
// electron.vite.config.ts
server: {
  hmr: true,
  watch: {
    ignored: ['**/node_modules/**', '**/out/**']
  }
}
```

### Q: TypeScript 类型错误？

**A**: 确保 `tsconfig.json` 正确配置：
```json
{
  "compilerOptions": {
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true
  }
}
```

### Q: 打包后应用无法启动？

**A**: 检查以下几点：
1. 路径是否正确（使用 `__dirname` 而不是相对路径）
2. 依赖是否正确打包
3. ASAR 包是否正确配置

## 📚 学习资源

### 官方文档
- [Electron 文档](https://www.electronjs.org/docs)
- [React 文档](https://react.dev)
- [TypeScript 文档](https://www.typescriptlang.org/docs)
- [Vite 文档](https://vitejs.dev)

### 社区资源
- [Electron GitHub](https://github.com/electron/electron)
- [Awesome Electron](https://github.com/sindresorhus/awesome-electron)
- [Electron Builder](https://www.electron.build/)

---

**文档版本**: 1.0.0
**最后更新**: 2024-04-27
