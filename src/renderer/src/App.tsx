import Workspace from './components/workspace/Workspace';
import MultilangTestPage from './components/MultilangTestPage';
import { useState } from 'react';

function App(): React.JSX.Element {
  const [showTestPage, setShowTestPage] = useState(false);

  return (
    <>
      {showTestPage ? (
        <MultilangTestPage />
      ) : (
        <Workspace />
      )}

      {/* 测试按钮 - 悬浮在右上角 */}
      <button
        onClick={() => setShowTestPage(!showTestPage)}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 9999,
          padding: '8px 16px',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
        }}
      >
        {showTestPage ? '返回工作台' : '多语言测试'}
      </button>
    </>
  );
}

export default App;
