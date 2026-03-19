import React from 'react';

const PageTitle = ({ title, sub, action }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid var(--border)', background: 'var(--surface-1)', flexShrink: 0 }}>
    <div>
      <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-1)', margin: 0 }}>{title}</h1>
      {sub && <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)', marginTop: 2 }}>{sub}</p>}
    </div>
    {action}
  </div>
);

export default PageTitle;