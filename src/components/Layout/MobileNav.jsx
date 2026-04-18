import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, ReceiptText, PieChart, TrendingUp, Target, BarChart2, Settings, MoreHorizontal, X, LogOut } from 'lucide-react';

const MobileNav = ({ activeTab, setActiveTab, handleLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const primaryTabs = [
    { id: 'dashboard',    icon: LayoutDashboard, label: 'Home' },
    { id: 'transactions', icon: ReceiptText,     label: 'Txs' },
    { id: 'budget',       icon: PieChart,        label: 'Budget' },
    { id: 'analytics',    icon: BarChart2,       label: 'AI' },
  ];

  const secondaryTabs = [
    { id: 'savings', icon: Target,     label: 'Savings Goals', color: '#8b5cf6' },
    { id: 'networth', icon: TrendingUp, label: 'Net Worth',     color: '#22c55e' },
    { id: 'settings', icon: Settings,   label: 'Settings',      color: '#94a3b8' },
  ];

  const handleTabClick = (id) => {
    setActiveTab(id);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* More Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(10px)', zIndex: 999
              }}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed', bottom: '80px', left: '16px', right: '16px',
                background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '24px', padding: '24px', zIndex: 1000,
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>More Options</span>
                <button onClick={() => setIsMenuOpen(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}><X size={18} /></button>
              </div>
              <div style={{ display: 'grid', gap: '12px' }}>
                {secondaryTabs.map(({ id, icon: Icon, label, color }) => (
                  <button
                    key={id}
                    onClick={() => handleTabClick(id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '16px',
                      padding: '16px', background: activeTab === id ? `${color}15` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${activeTab === id ? `${color}30` : 'rgba(255,255,255,0.05)'}`,
                      borderRadius: '16px', color: activeTab === id ? color : 'rgba(255,255,255,0.6)',
                      textAlign: 'left', cursor: 'pointer', width: '100%'
                    }}
                  >
                    <Icon size={20} />
                    <span style={{ fontWeight: 700, fontSize: '15px' }}>{label}</span>
                  </button>
                ))}

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '8px 0' }} />

                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '16px', background: 'rgba(255,77,77,0.08)',
                    border: '1px solid rgba(255,77,77,0.2)',
                    borderRadius: '16px', color: 'var(--danger)',
                    textAlign: 'left', cursor: 'pointer', width: '100%'
                  }}
                >
                  <LogOut size={20} />
                  <span style={{ fontWeight: 700, fontSize: '15px' }}>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Bottom Bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: '75px', background: 'rgba(5,7,10,0.98)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        zIndex: 1001, padding: '0 8px',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.6)'
      }}>
        {primaryTabs.map(({ id, icon: Icon, label }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '4px', background: 'none', border: 'none', padding: '10px 0',
                position: 'relative', flex: 1
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-glow"
                  style={{
                    position: 'absolute', top: '-10px', width: '40px', height: '40px',
                    background: 'radial-gradient(circle, rgba(0,242,255,0.15) 0%, transparent 70%)',
                    zIndex: -1
                  }}
                />
              )}
              <Icon 
                size={22} 
                color={isActive ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.3)'} 
                style={{ transition: 'all 0.3s' }}
              />
              <span style={{ 
                fontSize: '10px', fontWeight: 800, 
                color: isActive ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.3)',
                textTransform: 'uppercase', letterSpacing: '0.5px'
              }}>
                {label}
              </span>
            </button>
          );
        })}
        
        {/* More Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '4px', background: 'none', border: 'none', padding: '10px 0',
            position: 'relative', flex: 1
          }}
        >
          <MoreHorizontal 
            size={22} 
            color={isMenuOpen ? 'var(--accent-violet)' : 'rgba(255,255,255,0.3)'} 
            style={{ transition: 'all 0.3s' }}
          />
          <span style={{ 
            fontSize: '10px', fontWeight: 800, 
            color: isMenuOpen ? 'var(--accent-violet)' : 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase', letterSpacing: '0.5px'
          }}>
            More
          </span>
        </button>
      </div>
    </>
  );
};

export default MobileNav;

