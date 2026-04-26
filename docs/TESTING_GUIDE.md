# 多语言集成测试指南

## Python AI服务测试

### 1. 直接测试服务

```bash
cd services/python

# 启动服务
uv run python ai_service.py

# 在另一个终端测试
echo '{"id": 1, "method": "analyze_image", "params": {"image_path": "/test/image.jpg"}}' | uv run python ai_service.py
```

### 2. 测试图像分析

```bash
echo '{"id": 1, "method": "analyze_image", "params": {"image_path": "test.jpg"}}' | uv run python ai_service.py
```

**预期输出:**
```json
{
  "id": 1,
  "success": true,
  "data": {
    "objects": ["sofa", "couch"],
    "colors": ["beige", "gray"],
    "style": "modern minimalist"
  }
}
```

### 3. 测试描述生成

```bash
echo '{"id": 2, "method": "generate_description", "params": {"product": {"name": "sofa", "material": "fabric"}}}' | uv run python ai_service.py
```

## Go爬虫服务测试

### 1. 编译Go程序

```bash
cd services/go

# 编译Windows版本
go build -o crawler.exe crawler.go

# 编译Linux/Mac版本
GOOS=linux go build -o crawler crawler.go
GOOS=darwin go build -o crawler crawler.go
```

### 2. 测试爬虫服务

```bash
# 启动服务
./crawler.exe

# 测试商品爬取
echo '{"id": 1, "method": "crawl_product", "params": {"url": "https://example.com/product"}}' | ./crawler.exe
```

## Electron集成测试

### 1. 测试IPC通信

在开发者工具控制台中测试：

```javascript
// 测试Python图像分析
window.electronAPI.multilang.analyzeImage('/path/to/image.jpg')
  .then(result => console.log('分析结果:', result))
  .catch(error => console.error('错误:', error))

// 测试Go爬虫
window.electronAPI.multilang.crawlProduct('https://example.com/product')
  .then(result => console.log('爬取结果:', result))
  .catch(error => console.error('错误:', error))
```

### 2. 测试React Hooks

```typescript
// 在组件中使用
const { python, crawler } = useMultilangServices()

// 图像分析
const handleAnalyze = async () => {
  const result = await python.analyzeImage('/path/to/image.jpg')
  console.log('识别的物体:', result.objects)
  console.log('识别的颜色:', result.colors)
}

// 爬取商品
const handleCrawl = async () => {
  const result = await crawler.crawlProduct('https://example.com/product')
  console.log('商品名称:', result.name)
  console.log('商品价格:', result.price)
}
```

## 性能测试

### Python服务性能

```python
import time
import json

def benchmark_python():
    """性能测试"""
    process = subprocess.Popen([...])
    
    start = time.time()
    for i in range(100):
        request = {"id": i, "method": "analyze_image", "params": {...}}
        process.stdin.write(json.dumps(request) + "\n")
        response = process.stdout.readline()
    
    duration = time.time() - start
    print(f"100个请求耗时: {duration:.2f}秒")
    print(f"平均响应时间: {duration/100*1000:.2f}毫秒")
```

### Go服务性能

```bash
# 使用ab工具进行压力测试
ab -n 1000 -c 10 -p request.json http://localhost:8080/api/crawl
```

## 调试技巧

### 1. 查看Python日志

Python服务的日志会输出到标准输出，包括：
- 服务初始化信息
- 每个请求的处理状态
- 错误信息

### 2. 查看Go日志

Go服务的日志同样输出到标准输出

### 3. Electron调试

在开发者工具中查看IPC消息：
```javascript
// 监控所有IPC调用
const originalInvoke = window.electronAPI.multilang.analyzeImage
window.electronAPI.multilang.analyzeImage = async function(...args) {
  console.log('调用 analyzeImage:', args)
  const result = await originalInvoke.apply(this, args)
  console.log('analyzeImage 返回:', result)
  return result
}
```

## 常见问题解决

### 问题1: Python服务无法启动

**解决方案:**
```bash
# 检查Python依赖
uv pip install torch torchvision opencv-python

# 或使用虚拟环境
uv venv
uv pip install -r requirements.txt
```

### 问题2: Go编译失败

**解决方案:**
```bash
# 初始化Go模块
go mod init crawler
go mod tidy

# 下载依赖
go mod download
```

### 问题3: IPC通信超时

**解决方案:**
```typescript
// 增加超时时间
await service.call('method', params, 60000) // 60秒超时
```

## 完整测试流程

1. **单元测试**: 测试各个服务的独立功能
2. **集成测试**: 测试Electron与服务的通信
3. **性能测试**: 测试响应时间和吞吐量
4. **稳定性测试**: 长时间运行测试
5. **错误处理测试**: 测试各种异常情况

## 测试检查清单

- [ ] Python服务正常启动
- [ ] Go服务正常启动
- [ ] 图像分析功能正常
- [ ] 描述生成功能正常
- [ ] 翻译功能正常
- [ ] 爬虫功能正常
- [ ] IPC通信正常
- [ ] 错误处理正常
- [ ] 性能可接受
- [ ] 内存使用正常
