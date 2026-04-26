# 项目目录结构设计文档

## 📁 目录结构概览

本文档描述了 AI CrossBorder Workspace 项目的完整目录结构设计，采用企业级 Electron + React + TypeScript 项目的最佳实践。

## 🎯 设计原则

### 1. 关注点分离
- **主进程 (Main Process)**：系统操作、文件访问、IPC通信
- **预加载 (Preload)**：安全桥接、API暴露、上下文隔离
- **渲染进程 (Renderer)**：UI逻辑、用户交互、页面展示

### 2. 模块化组织
- 按功能模块划分，便于维护和扩展
- 每个模块独立、职责清晰
- 避免循环依赖

### 3. 类型安全
- 使用 `shared/types/` 存放共享类型定义
- 避免类型重复定义
- 保持严格的 TypeScript 配置

### 4. 代码复用
- `shared/` 目录存放主进程和渲染进程共享的代码
- 避免代码重复
- 提高可维护性

## 📂 完整目录结构

```
electron-ai-workspace/
├── src/                           # 源代码目录
│   ├── main/                      # Electron 主进程
│   │   ├── index.ts               # 主进程入口文件
│   │   ├── window/                # 窗口管理
│   │   │   ├── mainWindow.ts     # 主窗口配置
│   │   │   └── windowManager.ts  # 窗口管理器
│   │   ├── ipc/                   # IPC 通信
│   │   │   ├── handlers/          # IPC 处理器
│   │   │   │   ├── fileHandler.ts    # 文件操作
│   │   │   │   ├── dbHandler.ts      # 数据库操作
│   │   │   │   ├── aiHandler.ts      # AI 服务
│   │   │   │   └── crawlerHandler.ts # 爬虫服务
│   │   │   ├── channels.ts        # IPC 通道定义
│   │   │   └── index.ts
│   │   ├── services/              # 业务服务层
│   │   │   ├── database/          # 数据库服务
│   │   │   │   ├── index.ts
│   │   │   │   ├── connection.ts  # 连接管理
│   │   │   │   ├── models/        # 数据模型
│   │   │   │   └── migrations/    # 数据迁移
│   │   │   ├── ai/                # AI 服务
│   │   │   │   ├── index.ts
│   │   │   │   ├── openai.ts      # OpenAI API
│   │   │   │   └── claude.ts      # Claude API
│   │   │   ├── storage/           # 存储服务
│   │   │   │   ├── index.ts
│   │   │   │   ├── local.ts       # 本地存储
│   │   │   │   └── cloud.ts       # 云存储
│   │   │   └── network/           # 网络服务
│   │   │       ├── index.ts
│   │   │       ├── request.ts     # HTTP 请求
│   │   │       └── websocket.ts   # WebSocket
│   │   ├── utils/                 # 工具函数
│   │   │   ├── logger.ts          # 日志工具
│   │   │   ├── format.ts          # 格式化工具
│   │   │   └── validate.ts        # 验证工具
│   │   ├── config/                # 配置文件
│   │   │   ├── app.config.ts      # 应用配置
│   │   │   └── db.config.ts       # 数据库配置
│   │   └── constants/             # 常量定义
│   │       ├── ipc.ts             # IPC 常量
│   │       └── app.ts             # 应用常量
│   │
│   ├── preload/                   # 预加载脚本
│   │   ├── index.ts               # 预加载入口
│   │   ├── api/                   # 暴露给渲染进程的 API
│   │   │   ├── database.ts        # 数据库 API
│   │   │   ├── ai.ts              # AI API
│   │   │   ├── crawler.ts         # 爬虫 API
│   │   │   └── storage.ts         # 存储 API
│   │   └── types/                 # 预加载类型定义
│   │
│   └── renderer/                  # 渲染进程
│       ├── index.html             # HTML 入口
│       ├── src/
│       │   ├── main.tsx           # React 入口
│       │   ├── App.tsx            # 根组件
│       │   │
│       │   ├── pages/             # 页面组件
│       │   │   ├── workspace/     # 工作台页面
│       │   │   │   ├── index.tsx  # 页面入口
│       │   │   │   └── components/# 页面专属组件
│       │   │   ├── products/      # 商品管理页面
│       │   │   │   ├── index.tsx
│       │   │   │   ├── List.tsx   # 商品列表
│       │   │   │   ├── Detail.tsx # 商品详情
│       │   │   │   └── Edit.tsx   # 编辑商品
│       │   │   ├── analysis/      # AI 分析页面
│       │   │   │   ├── index.tsx
│       │   │   │   └── components/
│       │   │   ├── dashboard/     # 仪表盘页面
│       │   │   │   └── index.tsx
│       │   │   ├── settings/      # 设置页面
│       │   │   │   ├── index.tsx
│       │   │   │   ├── General.tsx
│       │   │   │   ├── AI.tsx
│       │   │   │   └── Storage.tsx
│       │   │   └── _layouts/      # 布局组件
│       │   │       ├── MainLayout.tsx
│       │   │       └── EmptyLayout.tsx
│       │   │
│       │   ├── components/        # 通用组件
│       │   │   ├── ui/            # 基础 UI 组件
│       │   │   │   ├── Button/
│       │   │   │   │   ├── index.tsx
│       │   │   │   │   ├── Button.tsx
│       │   │   │   │   └── types.ts
│       │   │   │   ├── Input/
│       │   │   │   ├── Modal/
│       │   │   │   ├── Table/
│       │   │   │   ├── Dropdown/
│       │   │   │   └── index.ts   # 统一导出
│       │   │   └── business/      # 业务组件
│       │   │       ├── ProductCard/
│       │   │       │   ├── index.tsx
│       │   │       │   ├── ProductCard.tsx
│       │   │       │   └── types.ts
│       │   │       ├── AnalysisPanel/
│       │   │       ├── DataTable/
│       │   │       ├── Sidebar/
│       │   │       └── Header/
│       │   │
│       │   ├── hooks/             # 自定义 Hooks
│       │   │   ├── useIPC.ts      # IPC 通信
│       │   │   ├── useDatabase.ts # 数据库
│       │   │   ├── useAI.ts       # AI 服务
│       │   │   ├── useProducts.ts # 商品数据
│       │   │   ├── useCrawler.ts  # 爬虫
│       │   │   └── useStorage.ts  # 存储
│       │   │
│       │   ├── store/             # 状态管理
│       │   │   ├── slices/        # Redux slices
│       │   │   │   ├── productSlice.ts
│       │   │   │   ├── uiSlice.ts
│       │   │   │   └── settingsSlice.ts
│       │   │   └── index.ts       # Store 配置
│       │   │
│       │   ├── services/          # 渲染进程服务
│       │   │   ├── api/           # API 调用
│       │   │   │   ├── client.ts   # HTTP 客户端
│       │   │   │   ├── products.ts
│       │   │   │   └── ai.ts
│       │   │   └── storage/       # 存储服务
│       │   │       ├── index.ts
│       │   │       └── local.ts
│       │   │
│       │   ├── utils/             # 工具函数
│       │   │   ├── format.ts      # 格式化
│       │   │   ├── validate.ts    # 验证
│       │   │   ├── date.ts        # 日期处理
│       │   │   └── number.ts      # 数字处理
│       │   │
│       │   ├── types/             # 类型定义
│       │   │   ├── index.ts       # 统一导出
│       │   │   ├── product.ts     # 商品类型
│       │   │   ├── ai.ts          # AI 类型
│       │   │   ├── crawler.ts     # 爬虫类型
│       │   │   └── common.ts      # 通用类型
│       │   │
│       │   ├── constants/         # 常量定义
│       │   │   ├── index.ts
│       │   │   ├── routes.ts      # 路由常量
│       │   │   ├── api.ts         # API 常量
│       │   │   └── config.ts      # 配置常量
│       │   │
│       │   ├── styles/            # 全局样式
│       │   │   ├── global.css     # 全局 CSS
│       │   │   ├── variables.css  # CSS 变量
│       │   │   └── mixins.css     # CSS 混合
│       │   │
│       │   └── assets/            # 静态资源
│       │       ├── images/        # 图片
│       │       ├── icons/         # 图标
│       │       └── fonts/         # 字体
│       │
│       └── public/                # 公共资源
│           └── favicon.ico
│
├── shared/                        # 共享代码（主进程和渲染进程）
│   ├── types/                     # 共享类型定义
│   │   ├── index.ts
│   │   ├── product.ts            # 商品类型
│   │   ├── ipc.ts                # IPC 类型
│   │   └── database.ts           # 数据库类型
│   ├── constants/                 # 共享常量
│   │   ├── index.ts
│   │   ├── channels.ts           # IPC 通道
│   │   └── errors.ts             # 错误码
│   └── utils/                     # 共享工具函数
│       ├── index.ts
│       ├── format.ts
│       └── logger.ts
│
├── resources/                     # 资源文件
│   ├── icons/                     # 应用图标
│   │   ├── icon.ico              # Windows 图标
│   │   ├── icon.icns             # macOS 图标
│   │   └── icon.png              # Linux 图标
│   ├── images/                    # 图片资源
│   ├── databases/                 # 数据库文件
│   └── config/                    # 配置文件
│       └── default.json
│
├── scripts/                       # 构建和开发脚本
│   ├── afterPack.js              # 打包后处理
│   ├── afterSign.js              # 签名后处理
│   └── notarize.js               # macOS 公证脚本
│
├── build/                         # 构建资源
│   ├── icon.ico
│   ├── icon.icns
│   ├── installerHeader.bmp       # 安装程序头部
│   └── installerSidebar.bmp      # 安装程序侧边栏
│
├── docs/                          # 项目文档
│   ├── PROJECT_STRUCTURE.md      # 项目结构（本文档）
│   ├── API.md                    # API 文档
│   ├── ARCHITECTURE.md           # 架构文档
│   ├── DEVELOPMENT.md            # 开发指南
│   └── DEPLOYMENT.md             # 部署文档
│
├── tests/                         # 测试文件
│   ├── unit/                     # 单元测试
│   │   ├── main/
│   │   └── renderer/
│   ├── integration/              # 集成测试
│   └── e2e/                      # 端到端测试
│
├── .env.example                   # 环境变量示例
├── .env.local                     # 本地环境变量（不提交）
├── .gitignore
├── .prettierrc                   # Prettier 配置
├── .eslintrc                     # ESLint 配置
├── package.json
├── package-lock.json
├── tsconfig.json                 # TypeScript 配置
├── tsconfig.node.json            # 主进程 TS 配置
├── tsconfig.web.json             # 渲染进程 TS 配置
├── electron.vite.config.ts       # Electron Vite 配置
├── vite.plugins.ts               # Vite 插件配置
├── electron-builder.yml          # Electron Builder 配置
├── postcss.config.js             # PostCSS 配置
├── tailwind.config.js            # Tailwind CSS 配置
├── BUILD.md                      # 构建文档
├── PACKAGE_SUMMARY.md            # 打包总结
└── README.md                     # 项目说明
```

## 📂 目录详解

### 1. 主进程 (src/main/)

**职责**：管理系统级操作、文件访问、IPC 通信

**关键目录**：
- `window/` - 窗口创建和管理
- `ipc/` - 进程间通信处理
- `services/` - 业务逻辑服务层

### 2. 预加载 (src/preload/)

**职责**：安全桥接主进程和渲染进程

**关键文件**：
- `index.ts` - 预加载入口
- `api/` - 暴露给渲染进程的安全 API

### 3. 渲染进程 (src/renderer/)

**职责**：UI 渲染和用户交互

**关键目录**：
- `pages/` - 页面级组件
- `components/` - 可复用组件
- `hooks/` - 自定义 React Hooks
- `store/` - 状态管理

### 4. 共享代码 (shared/)

**职责**：主进程和渲染进程共享的代码

**优势**：
- 避免代码重复
- 保持类型一致性
- 简化维护

## 🎯 针对跨境电商项目的具体结构

```
src/main/services/
├── database/              # 商品数据库
│   ├── products/         # 商品表
│   ├── suppliers/        # 供应商表
│   └── orders/           # 订单表
├── ai/                   # AI 分析服务
│   ├── image/            # 图像识别
│   ├── text/             # 文本生成
│   └── translation/      # 翻译服务
├── crawler/              # 网页爬虫
│   ├── gigab2b/          # GIGAB2B 爬虫
│   ├── alibaba/          # 阿里巴巴爬虫
│   └── amazon/           # Amazon 爬虫
└── storage/              # 数据存储
    ├── local/            # 本地 SQLite
    └── cloud/            # 云存储

src/renderer/src/pages/
├── workspace/            # 工作台（已实现）
├── products/             # 商品管理
├── suppliers/            # 供应商管理
├── analysis/             # AI 分析
├── keywords/             # 关键词管理
└── settings/             # 系统设置

src/renderer/src/components/business/
├── ProductCard/          # 商品卡片
├── AnalysisPanel/        # 分析面板
├── CrawlerConfig/        # 爬虫配置
├── KeywordManager/       # 关键词管理
└── CompetitorChart/      # 竞品图表
```

## 📝 命名约定

### 文件命名
- **组件文件**: `PascalCase.tsx` (例: `ProductCard.tsx`)
- **工具文件**: `camelCase.ts` (例: `formatDate.ts`)
- **类型文件**: `PascalCase.ts` (例: `Product.ts`)
- **常量文件**: `UPPER_SNAKE_CASE.ts` (例: `API_CONSTANTS.ts`)
- **Hooks**: `camelCase.ts` 带 `use` 前缀 (例: `useProducts.ts`)

### 目录命名
- **组件目录**: `PascalCase/` (例: `ProductCard/`)
- **功能目录**: `camelCase/` (例: `hooks/`, `utils/`)

### 导出命名
```typescript
// 组件导出
export { default } from './ProductCard'

// 类型导出
export * from './types'

// 统一导出
export { Button } from './Button'
export { Input } from './Input'
```

## 🔗 路径别名配置

在 `electron.vite.config.ts` 中配置：

```typescript
resolve: {
  alias: {
    '@': resolve(__dirname, 'src/renderer/src'),
    '@components': resolve(__dirname, 'src/renderer/src/components'),
    '@pages': resolve(__dirname, 'src/renderer/src/pages'),
    '@hooks': resolve(__dirname, 'src/renderer/src/hooks'),
    '@utils': resolve(__dirname, 'src/renderer/src/utils'),
    '@types': resolve(__dirname, 'src/renderer/src/types'),
    '@constants': resolve(__dirname, 'src/renderer/src/constants'),
    '@store': resolve(__dirname, 'src/renderer/src/store'),
    '@shared': resolve(__dirname, 'shared')
  }
}
```

使用示例：
```typescript
import { Button } from '@components/ui/Button'
import { useProducts } from '@hooks/useProducts'
import type { Product } from '@types/product'
```

## 📐 文件组织规则

### 1. 组件组织
每个组件一个独立目录，包含：
```
ComponentName/
├── index.tsx          # 组件入口
├── ComponentName.tsx  # 组件实现
├── types.ts          # 类型定义
├── styles.module.css  # 样式（可选）
└── __tests__/        # 测试文件
```

### 2. 模块导出
使用 `index.ts` 统一导出：
```typescript
// components/ui/index.ts
export { Button } from './Button'
export { Input } from './Input'
export { Modal } from './Modal'
```

### 3. 目录深度
避免超过 3 层嵌套：
```
✅ 好: components/ui/Button/
❌ 差: components/ui/form/inputs/text/primary/regular/
```

## 🔄 模块间依赖

### 推荐依赖方向
```
渲染进程组件
    ↓
渲染进程 Hooks/Store
    ↓
渲染进程 Services
    ↓
预加载 API
    ↓
主进程 Handlers
    ↓
主进程 Services
```

### 避免的依赖
- ❌ 主进程依赖渲染进程
- ❌ 渲染进程直接访问主进程服务（必须通过预加载）
- ❌ 组件之间深度耦合

## 📊 状态管理架构

### 推荐方案：Zustand 或 Redux Toolkit

```
store/
├── index.ts              # Store 配置
├── slices/               # 状态切片
│   ├── productSlice.ts  # 商品状态
│   ├── uiSlice.ts       # UI 状态
│   └── settingsSlice.ts # 设置状态
└── middleware/           # 中间件
    ├── logger.ts        # 日志中间件
    └── persistence.ts   # 持久化中间件
```

## 🔐 安全考虑

### 1. 上下文隔离
- 所有主进程功能通过预加载暴露
- 渲染进程不能直接访问 Node.js API

### 2. IPC 通信
```typescript
// 主进程 - 安全的 IPC 处理
ipcMain.handle('product:get', async (event, id) => {
  // 验证权限
  if (!validatePermission(event.sender)) {
    throw new Error('Unauthorized')
  }
  return await productService.get(id)
})
```

### 3. 敏感信息
- API 密钥存储在主进程
- 使用 `.env.local` 文件（不提交）
- 环境变量通过主进程传递

## 🚀 扩展建议

### 添加新功能时
1. 在 `shared/types/` 定义类型
2. 在 `src/main/services/` 实现服务
3. 在 `src/main/ipc/handlers/` 添加 IPC 处理
4. 在 `src/preload/api/` 暴露 API
5. 在 `src/renderer/src/hooks/` 创建 Hook
6. 在 `src/renderer/src/pages/` 创建页面

### 代码复用
- 通用组件放在 `components/ui/`
- 业务组件放在 `components/business/`
- 共享逻辑放在 `shared/`

## 📚 参考资源

- [Electron 最佳实践](https://www.electronjs.org/docs/latest/tutorial/quick-start)
- [React 项目结构](https://reactjs.org/docs/faq-structure.html)
- [TypeScript 项目结构](https://github.com/goldbergyoni/nodebestpractices#-3-project-structure-practices)
- [Vite 路径别名](https://vitejs.dev/config/shared-options.html#resolve-alias)

## 📝 维护建议

1. **定期审查**：每季度审查一次目录结构
2. **文档更新**：结构变更时更新本文档
3. **团队共识**：重大结构变更需团队讨论
4. **渐进重构**：避免大规模重构，逐步优化

---

**文档版本**: 1.0.0
**最后更新**: 2024-04-27
**维护者**: 开发团队
