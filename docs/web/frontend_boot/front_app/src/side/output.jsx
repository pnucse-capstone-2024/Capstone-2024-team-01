import React from 'react';
import '../css/output.css'; // CSS 파일을 import

const Output = () => {
  return (
    <div style={{ padding: '20px' }}>
      <div className="legend">
        <div className="color-box yellow-box"></div>
        <span>(ED)</span>
      </div>
      <div className="legend">
        <div className="color-box blue-box"></div>
        <span>(ET)</span>
      </div>
      <div className="legend">
        <div className="color-box white-box"></div>
        <span>(NCR/NET)</span>
      </div>
    </div>
  );
};

export default Output;