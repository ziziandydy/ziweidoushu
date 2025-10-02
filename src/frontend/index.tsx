// React 前端入口點
export { default as InteractiveZiweiChart } from './InteractiveZiweiChart';

// 如果需要直接在此檔案中導出 React 元件
if (typeof window !== 'undefined') {
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import InteractiveZiweiChart from './InteractiveZiweiChart';

    // 如果在瀏覽器環境中，自動渲染元件
    const container = document.getElementById('ziwei-root');
    if (container) {
        const root = ReactDOM.createRoot(container);
        root.render(<InteractiveZiweiChart />);
    }
}

// 類型定義導出
export * from './InteractiveZiweiChart';
export type * from './InteractiveZiweiChart';

