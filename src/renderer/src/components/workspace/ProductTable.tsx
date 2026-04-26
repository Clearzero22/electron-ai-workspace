interface Product {
  id: number;
  image: string;
  name: string;
  sku: string;
  material: string;
  size: string;
  price: string;
  moq: string;
  status: 'confirmed' | 'pending' | 'processing';
}

export default function ProductTable() {
  const products: Product[] = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop',
      name: 'Modern Fabric Sofa',
      sku: 'GB2B-SF-2024',
      material: 'Linen',
      size: '180×90×75',
      price: '$56.00',
      moq: '50',
      status: 'confirmed'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=100&h=100&fit=crop',
      name: 'Sectional Couch Set',
      sku: 'GB2B-SC-2024',
      material: 'Velvet',
      size: '220×150×85',
      price: '$89.50',
      moq: '20',
      status: 'pending'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=100&h=100&fit=crop',
      name: 'Convertible Sofa Bed',
      sku: 'GB2B-SB-1023',
      material: 'PU Leather',
      size: '200×100×80',
      price: '$72.30',
      moq: '30',
      status: 'processing'
    }
  ];

  const getStatusBadge = (status: Product['status']) => {
    const badges = {
      confirmed: <span className="status-pass px-2 py-0.5 rounded text-xs">已确认</span>,
      pending: <span className="status-pending px-2 py-0.5 rounded text-xs">待确认</span>,
      processing: <span className="status-ai px-2 py-0.5 rounded text-xs">AI识别中</span>
    };
    return badges[status];
  };

  return (
    <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">商品资料表（人工校验）</h3>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors">
            批量操作
          </button>
          <button className="px-3 py-1.5 gradient-blue text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            导出Excel
          </button>
        </div>
      </div>
      <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-50">
        <div className="relative flex-1 max-w-xs">
          <svg className="w-4 h-4 absolute left-3 top-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="搜索商品名称/型号..."
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <select className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 focus:outline-none">
          <option>全部状态</option>
        </select>
        <select className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 focus:outline-none">
          <option>类目：沙发</option>
        </select>
        <select className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 focus:outline-none">
          <option>来源：GIGAB2B</option>
        </select>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gray-50 text-gray-500">
            <th className="px-4 py-2 w-8">
              <input type="checkbox" className="rounded border-gray-300" />
            </th>
            <th className="px-4 py-2 text-left font-medium">商品图片</th>
            <th className="px-4 py-2 text-left font-medium">商品名称</th>
            <th className="px-4 py-2 text-left font-medium">材质</th>
            <th className="px-4 py-2 text-left font-medium">尺寸</th>
            <th className="px-4 py-2 text-left font-medium">价格</th>
            <th className="px-4 py-2 text-left font-medium">MOQ</th>
            <th className="px-4 py-2 text-left font-medium">AI状态</th>
            <th className="px-4 py-2 text-left font-medium">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <input type="checkbox" className="rounded border-gray-300" />
              </td>
              <td className="px-4 py-3">
                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                  <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{product.name}</div>
                <div className="text-gray-400">{product.sku}</div>
              </td>
              <td className="px-4 py-3 text-gray-600">{product.material}</td>
              <td className="px-4 py-3 text-gray-600">{product.size}</td>
              <td className="px-4 py-3 text-gray-900 font-medium">{product.price}</td>
              <td className="px-4 py-3 text-gray-600">{product.moq}</td>
              <td className="px-4 py-3">{getStatusBadge(product.status)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button className="text-gray-400 hover:text-blue-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-blue-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-blue-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
