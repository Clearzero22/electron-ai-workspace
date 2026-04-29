# AI CrossBorder Workspace - 打包和代码混淆指南

## 📦 打包命令

### 开发环境
```bash
npm run dev
```

### 实际构建验证产物

以下为 macOS 环境下 `npm run build:all` 的实际构建结果：

| 平台 | 文件 | 大小 |
|------|------|------|
| macOS (Intel) | `AI CrossBorder Workspace-1.0.0-x64.dmg` | 114 MB |
| macOS (Apple Silicon) | `AI CrossBorder Workspace-1.0.0-arm64.dmg` | 106 MB |
| Windows (x64) | `AI CrossBorder Workspace-1.0.0-x64.exe` | 93 MB |
| Linux (x64) | `AI CrossBorder Workspace-1.0.0-x86_64.AppImage` | 112 MB |

## 构建流程详解

### 命令执行链

```
npm run build:all
  └→ npm run build              # 步骤1: 类型检查 + Vite 编译
       ├→ npm run typecheck      #   tsc --noEmit (node + web 两套tsconfig)
       └→ electron-vite build    #   分别构建 main / preload / renderer
  └→ electron-builder -mwl      # 步骤2: 打包 mac + win + linux
```

### 步骤1: 类型检查 + Vite 编译

`npm run build` 会先执行类型检查，**任何 TS 错误都会阻止构建**。常见错误及修复方式：

| 错误类型 | 说明 | 修复方式 |
|---------|------|---------|
| TS6133 | 未使用的导入/变量 | 删除未使用的 `import` 语句 |
| TS2531 | 可能为 null 的对象 | 使用可选链 `?.` 如 `this.process?.stdin?.write()` |

**注意**: React 19 + Vite 7 配置下，JSX 转换不需要显式导入 React，`import React from 'react'` 应移除，只保留需要的具名导入如 `{ useState, useEffect }`。

类型检查通过后，`electron-vite build` 分别编译三个目标：
- **main** — Node.js 环境，代码混淆（javascript-obfuscator）
- **preload** — Node.js 环境，代码混淆
- **renderer** — 浏览器环境，React + 代码混淆 + 路径别名

### 步骤2: electron-builder 多平台打包

各平台打包流程：

**macOS (x64 + arm64)**
1. 下载对应架构的 Electron 二进制 (~118MB)
2. @electron/rebuild 编译 native 模块
3. Apple 开发者证书签名
4. 生成 DMG 安装镜像

**Windows (x64)**
1. 下载 Electron 二进制 (~137MB)
2. electron-builder 自动下载内置的 wine-4.0.1 + NSIS 工具链（**不需要系统安装 wine**）
3. 使用 winCodeSign 签名
4. 生成 NSIS 安装包 (.exe)

**Linux (x64)**
1. 下载 Electron 二进制 (~113MB)
2. 生成 AppImage

### 关于 Wine 的说明

在 macOS 上交叉编译 Windows 安装包时：
- **不需要** 手动安装 `brew install --cask wine-stable`（GitHub 上的构建源已失效，会 404）
- `electron-builder` 内置了精简版 wine (`wine-4.0.1-mac`)，构建时自动下载使用

### macOS 签名说明

当前构建使用 Apple Development 证书签名，但跳过了公证（notarization）。如需分发，需要：
1. 配置 Apple ID 和 App-specific password 到环境变量
2. 在 `electron-builder.yml` 中配置 `afterSign` 脚本

### 生产环境打包

#### Windows
```bash
npm run build:win
```
输出：`release/ai-crossborder-workspace-1.0.0-x64.exe` (安装包)
      `release/ai-crossborder-workspace-1.0.0-x64.exe` (便携版)

#### macOS
```bash
npm run build:mac
```
输出：`release/AI CrossBorder Workspace-1.0.0-x64.dmg` (Intel)
      `release/AI CrossBorder Workspace-1.0.0-arm64.dmg` (Apple Silicon)
      `release/AI CrossBorder Workspace-1.0.0-universal.dmg` (通用版)

#### Linux
```bash
npm run build:linux
```
输出：`release/ai-crossborder-workspace-1.0.0-x64.AppImage`
      `release/ai-crossborder-workspace-1.0.0-x64.deb`

#### 所有平台
```bash
npm run build:all
```

## 🔒 代码混淆配置

项目已配置以下安全措施：

### 1. JavaScript代码混淆
- **控制流扁平化**：打乱代码逻辑流程
- **死代码注入**：插入无用代码
- **字符串数组加密**：Base64编码
- **标识符重命名**：十六进制命名
- **自我保护**：防止格式化和调试
- **禁用console**：移除所有调试输出

### 2. 代码压缩和优化
- Terser压缩
- 删除console.log
- 删除debugger
- 移除注释

### 3. ASAR打包
- 所有代码打包到asar文件
- 二进制格式，难以查看和修改
- 减少文件数量和体积

### 4. 构建优化
- Tree-shaking：移除未使用代码
- Code-splitting：代码分割
- 资源压缩：图片、字体等

## 🛡️ 安全建议

### 基础安全措施
1. **环境变量保护**：敏感信息使用.env文件（已排除在打包外）
2. **Source Map禁用**：生产环境不生成源映射
3. **CSP策略**：Content Security Policy限制资源加载

### 高级安全措施
4. **代码签名**（Windows/macOS）：
   ```bash
   # Windows: 购买代码签名证书
   # macOS: 使用Apple Developer账号
   ```

5. **许可证验证**：实现软件授权系统

6. **反调试**：
   ```javascript
   // vite.plugins.ts 中设置
   debugProtection: true  // 强烈建议在最终版本启用
   ```

7. **完整性检查**：
   ```javascript
   // 在主进程中检查应用是否被篡改
   const { app } = require('electron');
   app.on('ready', () => {
     // 检查asar包的哈希值
   });
   ```

## 📏 打包体积优化

### 1. 分析打包体积
```bash
npm install -D electron-builder-clean
```

### 2. 优化建议
- **删除不必要的依赖**：检查package.json
- **使用生产依赖**：devDependencies不会被打包
- **压缩资源**：图片使用WebP格式
- **懒加载**：按需加载模块

### 3. 体积对比
| 配置 | 体积 |
|------|------|
| 未优化 | ~150MB |
| ASAR打包 | ~100MB |
| 代码压缩 | ~80MB |
| 资源优化 | ~60MB |

## 🚀 发布流程

### 1. 版本号管理
```bash
# 更新版本号
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.1 -> 1.1.0
npm version major  # 1.1.0 -> 2.0.0
```

### 2. 构建发布包
```bash
npm run build:win
```

### 3. 发布到GitHub Releases
```bash
# 使用electron-builder自动发布
npm run build:win -- --publish always
```

### 4. 自动更新
项目已配置 `electron-updater`，用户会收到更新通知。

## 📋 打包清单

- [ ] 更新版本号
- [ ] 更新CHANGELOG.md
- [ ] 运行测试：`npm test`
- [ ] 代码检查：`npm run lint`
- [ ] 类型检查：`npm run typecheck`
- [ ] 构建项目：`npm run build`
- [ ] 测试安装包
- [ ] 代码签名（生产环境）
- [ ] 发布到GitHub Releases

## 🔧 常见问题

### Q1: 打包失败？
```bash
# 清理缓存
rm -rf node_modules
rm -rf out
rm -rf release
npm install
npm run build
```

### Q2: 应用体积太大？
- 检查是否包含了不必要的文件
- 使用 `--dir` 模式检查输出目录
- 考虑使用 `electron-builder-clean` 优化

### Q3: 代码混淆后运行报错？
- 检查 `vite.plugins.ts` 中的排除项
- 确保关键函数没有被重命名
- 测试混淆后的代码功能

### Q4: Windows Defender报警？
- 这是正常现象，未签名的应用会被标记
- 解决方法：购买代码签名证书

## 📞 技术支持

- Electron文档：https://www.electronjs.org/docs
- electron-builder：https://www.electron.build/
- 代码混淆：https://github.com/javascript-obfuscator/javascript-obfuscator

## ⚠️ 重要提示

1. **首次打包建议使用 `--dir` 参数**：
   ```bash
   npm run build:unpack
   ```
   这会生成未打包的目录，便于调试。

2. **生产环境打包前务必测试**：
   - 在干净的环境中测试安装包
   - 确保所有功能正常
   - 检查自动更新功能

3. **代码混淆的影响**：
   - 打包时间增加2-3倍
   - 首次启动可能稍慢
   - 调试变得困难
   - 建议在开发环境禁用混淆

4. **最终版本检查清单**：
   - [ ] 禁用所有调试输出
   - [ ] 启用代码签名
   - [ ] 配置自动更新
   - [ ] 优化应用图标
   - [ ] 准备用户文档
   - [ ] 配置错误上报
