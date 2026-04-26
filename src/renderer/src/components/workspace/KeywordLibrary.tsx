interface Keyword {
  term: string;
  searchVolume: string;
  competition: 'low' | 'medium' | 'high';
  trend: 'up' | 'down' | 'stable';
}

export default function KeywordLibrary() {
  const keywords: Keyword[] = [
    { term: 'modern sofa', searchVolume: '12,500', competition: 'high', trend: 'up' },
    { term: 'sectional couch', searchVolume: '8,200', competition: 'medium', trend: 'up' },
    { term: 'fabric sofa set', searchVolume: '5,600', competition: 'low', trend: 'stable' },
    { term: 'L-shaped sofa', searchVolume: '4,300', competition: 'medium', trend: 'down' },
    { term: 'living room sofa', searchVolume: '3,800', competition: 'low', trend: 'stable' }
  ];

  const getCompetitionBadge = (level: Keyword['competition']) => {
    const badges = {
      low: <span className="px-1.5 py-0.5 bg-green-50 text-green-600 rounded text-[10px]">低</span>,
      medium: <span className="px-1.5 py-0.5 bg-yellow-50 text-yellow-600 rounded text-[10px]">中</span>,
      high: <span className="px-1.5 py-0.5 bg-red-50 text-red-600 rounded text-[10px]">高</span>
    };
    return badges[level];
  };

  const getTrendIcon = (trend: Keyword['trend']) => {
    const icons = {
      up: (
        <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      down: (
        <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      ),
      stable: (
        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
        </svg>
      )
    };
    return icons[trend];
  };

  return (
    <div className="w-80 flex-shrink-0 bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">关键词词库</h3>
        <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          添加关键词
        </button>
      </div>
      <div className="space-y-2">
        {keywords.map((keyword, index) => (
          <div key={index} className="flex items-center gap-2 p-2 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-900 truncate">{keyword.term}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-gray-500">{keyword.searchVolume}/月</span>
                {getCompetitionBadge(keyword.competition)}
              </div>
            </div>
            {getTrendIcon(keyword.trend)}
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>已添加关键词</span>
          <span className="font-medium text-gray-900">5 个</span>
        </div>
        <button className="w-full py-2 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors">
          导出关键词列表
        </button>
      </div>
    </div>
  );
}
