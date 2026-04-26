interface ProductField {
  label: string;
  value: string;
}

export default function AIAnalysisPanel() {
  const fields: ProductField[] = [
    { label: '商品名称', value: 'Modern Fabric Sofa Couch' },
    { label: '材质', value: 'Linen + Solid Wood' },
    { label: '尺寸', value: '180 × 90 × 75 cm' },
    { label: '重量', value: '38 kg' },
    { label: '价格', value: '$56.00' },
    { label: 'MOQ', value: '50 pcs' },
    { label: '型号', value: 'SF-2024-001' },
    { label: '品牌', value: 'GIGAB2B' }
  ];

  const colorVariants = [
    { color: '#8B7355', name: 'Beige' },
    { color: '#2F4F4F', name: 'Gray' },
    { color: '#FFFFFF', name: 'White' },
    { color: '#000000', name: 'Black' }
  ];

  return (
    <div className="w-80 flex-shrink-0 space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">AI 自动抓取结果</h3>
          <span className="ai-badge px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            识别完成
          </span>
          <span className="text-xs text-blue-600 font-medium">85%</span>
        </div>
        <div className="space-y-2.5">
          {fields.map((field, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-14 flex-shrink-0">{field.label}</span>
              <input
                type="text"
                defaultValue={field.value}
                className="flex-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">AI 视觉解析</h3>
          <span className="ai-badge px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            已解析
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-xs text-gray-500 mb-2">检测到的颜色</div>
            <div className="flex flex-wrap gap-2">
              {colorVariants.map((variant, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-lg border-2 border-white shadow-sm" style={{ backgroundColor: variant.color }} />
                  <span className="text-[10px] text-gray-600">{variant.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-2">材质识别</div>
            <div className="flex gap-1.5 flex-wrap">
              <span className="px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs border border-green-200">织物</span>
              <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs border border-blue-200">木质框架</span>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-2">风格标签</div>
            <div className="flex gap-1.5 flex-wrap">
              <span className="px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-xs border border-purple-200">现代简约</span>
              <span className="px-2 py-1 rounded-md bg-orange-50 text-orange-700 text-xs border border-orange-200">北欧风</span>
              <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs">L型沙发</span>
              <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs">三人座</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
