export default function CollectionConfig() {
  return (
    <div className="w-64 flex-shrink-0 space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">采集来源</h3>
        <div className="flex gap-2 mb-3">
          <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-medium border border-blue-100">GIGAB2B</span>
          <span className="px-2 py-1 rounded-md text-gray-500 text-xs hover:bg-gray-50 cursor-pointer">关键词搜索</span>
          <span className="px-2 py-1 rounded-md text-gray-500 text-xs hover:bg-gray-50 cursor-pointer">批量导入</span>
        </div>
        <input
          type="text"
          value="https://www.gigab2b.com/product/12345"
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 focus:outline-none mb-2"
        />
        <button className="w-full py-2 gradient-blue text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          打开网页
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">搜索关键词</h3>
        <div className="flex flex-wrap gap-2 mb-2">
          {['Couch', 'Sofa', 'Sectional Sofa'].map((keyword, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-600 flex items-center gap-1">
              {keyword}
              <svg className="w-3 h-3 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          ))}
        </div>
        <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          添加
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">抓取选项</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            '商品基础参数',
            '价格 & MOQ',
            '所有图片',
            '详情描述'
          ].map((option, index) => (
            <label key={index} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={index < 4}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-600">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
