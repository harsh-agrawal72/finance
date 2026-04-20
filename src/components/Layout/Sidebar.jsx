import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, ReceiptText, PieChart, Target, BarChart2, TrendingUp, Download, RefreshCw, Settings, LogOut } from 'lucide-react';
import Logo from '../Common/Logo';

const Sidebar = ({ activeTab, setActiveTab, exportJSON, resetData, handleLogout }) => {
  const menuItems = [
    { id: 'dashboard',    label: 'Dashboard',     icon: LayoutDashboard, color: '#00f2ff' },
    { id: 'transactions', label: 'Transactions',   icon: ReceiptText,     color: '#00ffaa' },
    { id: 'budget',       icon: PieChart,        label: 'Budget AI',      color: '#f59e0b' },
    { id: 'savings',      label: 'Savings Goals',  icon: Target,          color: '#8b5cf6' },
    { id: 'analytics',   label: 'Analytics & AI', icon: BarChart2,       color: '#d946ef' },
    { id: 'networth',    label: 'Net Worth',       icon: TrendingUp,      color: '#22c55e' },
    { id: 'settings',    label: 'Settings',        icon: Settings,        color: '#94a3b8' },
  ];

  return (
    <aside style={{
      width: '240px', flexShrink: 0,
      height: '100vh', position: 'sticky', top: 0,
      display: 'flex', flexDirection: 'column',
      padding: '24px 12px',
      background: 'rgba(5,7,10,0.97)',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      backdropFilter: 'blur(20px)',
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ padding: '6px 12px', marginBottom: '32px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Logo size={34} />
          <div>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: '18px', letterSpacing: '-0.5px', background: 'linear-gradient(135deg,#00f2ff,#0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2 }}>Ledzo</h2>
            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block' }}>Ultra Edition</span>
          </div>
        </div>
      </div>

      {/* Nav Label */}
      <p style={{ fontSize: '9px', fontWeight: 800, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '2px', paddingLeft: '12px', marginBottom: '8px', flexShrink: 0 }}>Main Menu</p>

      {/* Nav Items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
        {menuItems.map(({ id, label, icon: Icon, color }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '11px',
                padding: '10px 13px', borderRadius: '11px',
                border: 'none', cursor: 'pointer',
                textAlign: 'left', width: '100%',
                fontFamily: 'inherit',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.18s',
                background: isActive ? `${color}12` : 'transparent',
                color: isActive ? color : 'rgba(255,255,255,0.4)',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='rgba(255,255,255,0.7)'; }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(255,255,255,0.4)'; }}}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-pill"
                  style={{ position: 'absolute', left: 0, top: '25%', bottom: '25%', width: '3px', background: color, borderRadius: '0 3px 3px 0', boxShadow: `0 0 10px ${color}` }}
                  transition={{ type: 'spring', bounce: 0.25, duration: 0.45 }}
                />
              )}
              <Icon size={16} style={{ flexShrink: 0 }} />
              <span style={{ fontWeight: isActive ? 700 : 500, fontSize: '13.5px', letterSpacing: '-0.2px' }}>{label}</span>
              {isActive && (
                <div style={{ marginLeft: 'auto', width: '5px', height: '5px', borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer tools */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <p style={{ fontSize: '9px', fontWeight: 800, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '2px', paddingLeft: '12px', marginBottom: '6px' }}>System</p>
        <button onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 13px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', background: 'transparent', color: 'rgba(255,77,77,0.45)', textAlign: 'left', width: '100%', transition: 'all 0.18s', fontSize: '13px', fontWeight: 600 }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(255,77,77,0.08)'; e.currentTarget.style.color='var(--danger)'; }}
          onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='rgba(255,77,77,0.45)'; }}>
          <LogOut size={14} /> Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
