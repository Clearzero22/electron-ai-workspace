interface Step {
  id: number;
  label: string;
  status: 'completed' | 'active' | 'pending';
}

export default function StepProgress() {
  const steps: Step[] = [
    { id: 1, label: '创建项目', status: 'completed' },
    { id: 2, label: '配置采集', status: 'completed' },
    { id: 3, label: '采集商品', status: 'active' },
    { id: 4, label: '校验资料', status: 'pending' },
    { id: 5, label: '分析竞品', status: 'pending' },
    { id: 6, label: '生成内容', status: 'pending' },
    { id: 7, label: '合规检查', status: 'pending' },
    { id: 8, label: '导出资料包', status: 'pending' }
  ];

  const getStepClass = (status: Step['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'active':
        return 'step-active text-white';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  const getTextClass = (status: Step['status']) => {
    switch (status) {
      case 'completed':
        return 'text-gray-900';
      case 'active':
        return 'text-blue-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
      <div className="flex items-center gap-6">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full ${getStepClass(step.status)} flex items-center justify-center text-xs font-medium`}>
              {step.status === 'completed' ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.id
              )}
            </div>
            <span className={`text-sm font-medium ${getTextClass(step.status)}`}>{step.label}</span>
            {step.status === 'active' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>}
            {index < steps.length - 1 && (
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
