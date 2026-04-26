package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

// Request 请求结构
type Request struct {
	ID     int                    `json:"id"`
	Method string                 `json:"method"`
	Params map[string]interface{} `json:"params"`
}

// Response 响应结构
type Response struct {
	ID        int         `json:"id"`
	Success   bool        `json:"success"`
	Data      interface{} `json:"data,omitempty"`
	Error     string      `json:"error,omitempty"`
	Timestamp string      `json:"timestamp"`
}

// CrawlerService 爬虫服务
type CrawlerService struct {
	httpClient *http.Client
}

// NewCrawlerService 创建爬虫服务实例
func NewCrawlerService() *CrawlerService {
	return &CrawlerService{
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// CrawlProduct 爬取单个商品
func (s *CrawlerService) CrawlProduct(url string) (map[string]interface{}, error) {
	// TODO: 实际的爬虫逻辑
	// 这里使用示例数据
	product := map[string]interface{}{
		"name":        "Modern Sofa Set",
		"price":       299.99,
		"currency":    "USD",
		"images":      []string{"image1.jpg", "image2.jpg"},
		"description": "High-quality modern sofa set",
		"specifications": map[string]interface{}{
			"material": "fabric",
			"dimensions": "220 x 150 x 85 cm",
			"weight":    "45 kg",
		},
		"supplier": map[string]interface{}{
			"name":    "Furniture Co",
			"country": "China",
		},
		"stock":      100,
		"moq":        10,
		"crawl_time": time.Now().Format(time.RFC3339),
	}

	return product, nil
}

// BatchCrawl 批量爬取
func (s *CrawlerService) BatchCrawl(urls []interface{}) ([]map[string]interface{}, error) {
	results := make([]map[string]interface{}, 0, len(urls))

	for i, urlInterface := range urls {
		url, ok := urlInterface.(string)
		if !ok {
			log.Printf("Invalid URL at index %d\n", i)
			continue
		}

		product, err := s.CrawlProduct(url)
		if err != nil {
			log.Printf("Error crawling %s: %v\n", url, err)
			continue
		}

		results = append(results, product)
	}

	return results, nil
}

// MonitorPrice 监控价格变化
func (s *CrawlerService) MonitorPrice(url string) (map[string]interface{}, error) {
	// TODO: 实际的价格监控逻辑
	// 可以定期爬取并比较价格变化

	monitorData := map[string]interface{}{
		"url":           url,
		"current_price": 299.99,
		"previous_price": 319.99,
		"change":        -20.00,
		"change_percent": -6.25,
		"last_check":    time.Now().Format(time.RFC3339),
	}

	return monitorData, nil
}

// CrawlCompetitors 爬取竞品信息
func (s *CrawlerService) CrawlCompetitors(productName string) ([]map[string]interface{}, error) {
	// TODO: 实际的竞品爬取逻辑
	// 可以从多个电商平台搜索和爬取

	competitors := []map[string]interface{}{
		{
			"platform":    "Amazon",
			"name":        "Similar Sofa",
			"price":       349.99,
			"rating":      4.5,
			"reviews":     1234,
			"availability": "In Stock",
		},
		{
			"platform":    "eBay",
			"name":        "Used Sofa Set",
			"price":       199.99,
			"rating":      4.2,
			"reviews":     567,
			"availability": "Limited",
		},
	}

	return competitors, nil
}

// handleRequest 处理请求
func (s *CrawlerService) handleRequest(request Request) Response {
	method := request.Method
	params := request.Params

	log.Printf("Handling request: %s (id: %d)\n", method, request.ID)

	var result interface{}
	var err error

	switch method {
	case "crawl_product":
		url, ok := params["url"].(string)
		if !ok {
			return Response{
				ID:      request.ID,
				Success: false,
				Error:   "Missing or invalid url parameter",
			}
		}
		result, err = s.CrawlProduct(url)

	case "batch_crawl":
		urlsInterface, ok := params["urls"].([]interface{})
		if !ok {
			return Response{
				ID:      request.ID,
				Success: false,
				Error:   "Missing or invalid urls parameter",
			}
		}
		result, err = s.BatchCrawl(urlsInterface)

	case "monitor_price":
		url, ok := params["url"].(string)
		if !ok {
			return Response{
				ID:      request.ID,
				Success: false,
				Error:   "Missing or invalid url parameter",
			}
		}
		result, err = s.MonitorPrice(url)

	case "crawl_competitors":
		productName, ok := params["product_name"].(string)
		if !ok {
			return Response{
				ID:      request.ID,
				Success: false,
				Error:   "Missing or invalid product_name parameter",
			}
		}
		result, err = s.CrawlCompetitors(productName)

	default:
		return Response{
			ID:      request.ID,
			Success: false,
			Error:   fmt.Sprintf("Unknown method: %s", method),
		}
	}

	if err != nil {
		return Response{
			ID:      request.ID,
			Success: false,
			Error:   err.Error(),
		}
	}

	return Response{
		ID:        request.ID,
		Success:   true,
		Data:      result,
		Timestamp: time.Now().Format(time.RFC3339),
	}
}

func main() {
	log.Println("Go Crawler Service starting...")

	service := NewCrawlerService()

	scanner := bufio.NewScanner(os.Stdin)
	writer := bufio.NewWriter(os.Stdout)

	// 处理输入
	for scanner.Scan() {
		line := scanner.Text()
		if strings.TrimSpace(line) == "" {
			continue
		}

		var request Request
		err := json.Unmarshal([]byte(line), &request)
		if err != nil {
			log.Printf("Failed to parse request: %v\n", err)
			errorResponse := Response{
				ID:      0,
				Success: false,
				Error:   fmt.Sprintf("Invalid JSON: %v", err),
			}
			sendResponse(writer, errorResponse)
			continue
		}

		// 处理请求
		response := service.handleRequest(request)
		sendResponse(writer, response)
	}

	if err := scanner.Err(); err != nil && err != io.EOF {
		log.Printf("Error reading input: %v\n", err)
	}

	log.Println("Go Crawler Service stopping...")
}

// sendResponse 发送响应
func sendResponse(writer *bufio.Writer, response Response) {
	data, err := json.Marshal(response)
	if err != nil {
		log.Printf("Failed to marshal response: %v\n", err)
		return
	}

	fmt.Fprintln(writer, string(data))
	writer.Flush()
}
