#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试Python AI服务
"""

import sys
import json
import subprocess
import time

def test_python_service():
    """测试Python服务"""
    sys.stdout.reconfigure(encoding='utf-8')
    print("启动Python AI服务测试...")

    # 启动Python服务进程
    process = subprocess.Popen(
        ['uv', 'run', 'python', 'ai_service.py'],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=1,  # 行缓冲
        encoding='utf-8',
        errors='replace'
    )

    # 等待服务启动
    time.sleep(2)

    # 测试1: 图像分析
    print("\n=== 测试1: 图像分析 ===")
    request1 = {
        "id": 1,
        "method": "analyze_image",
        "params": {
            "image_path": "/path/to/test/image.jpg"
        }
    }

    process.stdin.write(json.dumps(request1) + "\n")
    process.stdin.flush()

    # 读取响应
    response_line = process.stdout.readline()
    if response_line:
        response = json.loads(response_line.strip())
        print(f"✅ 响应成功: {response['success']}")
        if response['success']:
            print(f"   识别物体: {response['data']['objects']}")
            print(f"   识别颜色: {response['data']['colors']}")
        else:
            print(f"   错误: {response['error']}")

    # 测试2: 生成描述
    print("\n=== 测试2: 生成描述 ===")
    request2 = {
        "id": 2,
        "method": "generate_description",
        "params": {
            "product": {
                "name": "现代沙发",
                "material": "优质布艺",
                "features": ["可拆洗", "防水防污"]
            }
        }
    }

    process.stdin.write(json.dumps(request2) + "\n")
    process.stdin.flush()

    response_line = process.stdout.readline()
    if response_line:
        response = json.loads(response_line.strip())
        print(f"✅ 响应成功: {response['success']}")
        if response['success']:
            print(f"   生成的描述: {response['data']['description'][:100]}...")
            print(f"   SEO关键词: {response['data']['keywords'][:3]}")
        else:
            print(f"   错误: {response['error']}")

    # 测试3: 翻译
    print("\n=== 测试3: 翻译 ===")
    request3 = {
        "id": 3,
        "method": "translate",
        "params": {
            "text": "Modern sofa",
            "target_lang": "zh"
        }
    }

    process.stdin.write(json.dumps(request3) + "\n")
    process.stdin.flush()

    response_line = process.stdout.readline()
    if response_line:
        response = json.loads(response_line.strip())
        print(f"✅ 响应成功: {response['success']}")
        if response['success']:
            print(f"   翻译结果: {response['data']['translated_text']}")
        else:
            print(f"   错误: {response['error']}")

    # 清理
    print("\n=== 测试完成，清理进程 ===")
    process.terminate()
    process.wait(timeout=5)

    print("✅ 所有测试完成！")

if __name__ == "__main__":
    try:
        test_python_service()
    except Exception as e:
        print(f"❌ 测试失败: {e}")
        sys.exit(1)
