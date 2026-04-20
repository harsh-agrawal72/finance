import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, TrendingUp, PieChart, Sparkles, ArrowRight, CheckCircle2, 
  ChevronDown, BarChart3, Wallet, Target, Lock, Globe, Layers, Cpu,
  Quote, Star, Activity, PlusCircle, RefreshCw, 
  ExternalLink, HelpCircle, Mail, MessageSquare, Monitor, Layout,
  Smartphone, Database, Code, ZapOff, Fingerprint, SearchSlash, AlertCircle
} from 'lucide-react';
import Logo from '../Common/Logo';
import { useIsMobile } from '../../hooks/useMediaQuery';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ marginBottom: '16px', borderRadius: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: '100%', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }}
      >
        <span style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={20} color="#64748b" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 24px 24px', color: '#475569', lineHeight: 1.6, fontSize: '15px', fontWeight: 500 }}>
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BentoCard = ({ icon: Icon, title, desc, colSpan = 1, rowSpan = 1, color = 'var(--accent-cyan)', isMobile }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    style={{ 
      gridColumn: isMobile ? 'span 1' : `span ${colSpan}`,
      gridRow: isMobile ? 'span 1' : `span ${rowSpan}`,
      padding: isMobile ? '24px' : '32px',
      borderRadius: '32px',
      background: 'rgba(15, 23, 42, 0.4)',
      border: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      position: 'relative',
      overflow: 'hidden',
      backdropFilter: 'blur(10px)'
    }}
  >
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: `radial-gradient(circle at 10% 10%, ${color}08, transparent 50%)`, pointerEvents: 'none' }} />
    <div style={{ width: '48px', height: '48px', background: `${color}15`, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
      <Icon size={24} />
    </div>
    <h3 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: 800, color: 'white' }}>{title}</h3>
    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>{desc}</p>
  </motion.div>
);

const Landing = ({ onStart, onLogin }) => {
  const isMobile = useIsMobile();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100%', 
      background: '#05070a', 
      color: 'white',
      overflowX: 'hidden',
      position: 'relative',
      fontFamily: 'var(--font-main)'
    }}>
      {/* Background Blobs */}
      <div style={{ position: 'fixed', top: '-10%', right: '-5%', width: '1000px', height: '1000px', background: 'radial-gradient(circle, rgba(0, 242, 255, 0.03) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-10%', left: '-5%', width: '1000px', height: '1000px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.03) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Navigation */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: isMobile ? '16px 20px' : '24px 60px',
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(5, 7, 10, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Logo size={isMobile ? 32 : 40} />
          <h2 style={{ fontWeight: 800, fontSize: isMobile ? '18px' : '22px', letterSpacing: '-0.5px', margin: 0 }}>Ledzo Ultra</h2>
        </div>
        
        <div style={{ display: 'flex', gap: isMobile ? '16px' : '32px', alignItems: 'center' }}>
          {!isMobile && <button onClick={onLogin} style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '15px', transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Login</button>}
          <button 
            onClick={() => onStart(isMobile ? 'login' : 'signup')}
            style={{ 
              padding: isMobile ? '10px 20px' : '12px 28px', 
              background: 'white', 
              borderRadius: '12px', 
              color: 'black', 
              fontWeight: 700,
              fontSize: isMobile ? '13px' : '15px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isMobile ? 'Enter' : 'Get Access'}
          </button>
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <section style={{ padding: isMobile ? '80px 20px 100px' : '140px 20px 180px', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '40px' }}>
              <Sparkles size={14} color="var(--accent-cyan)" />
              <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)' }}>Trusted by 10k+ financial leaders</span>
            </motion.div>

            <motion.h1 variants={itemVariants} style={{ fontSize: isMobile ? '48px' : 'clamp(54px, 10vw, 96px)', fontWeight: 900, lineHeight: isMobile ? 1.1 : 0.9, marginBottom: isMobile ? '24px' : '40px', letterSpacing: isMobile ? '-2px' : '-5px' }}>
              Built for <br />
              <span style={{ background: 'linear-gradient(to right, var(--accent-cyan), var(--accent-violet))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Total Control.
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} style={{ fontSize: isMobile ? '16px' : 'clamp(20px, 2.5vw, 26px)', color: 'var(--text-secondary)', maxWidth: '800px', margin: isMobile ? '0 auto 40px' : '0 auto 64px', lineHeight: 1.6, fontWeight: 500 }}>
              The most advanced personal finance interface ever engineered. Precision auditing, AI-powered forecasting, and institutional-grade security.
            </motion.p>

            <motion.div variants={itemVariants} style={{ display: 'flex', gap: isMobile ? '12px' : '20px', justifyContent: 'center', flexDirection: isMobile ? 'column' : 'row' }}>
              <button onClick={() => onStart('signup')} style={{ padding: isMobile ? '18px 32px' : '24px 56px', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))', borderRadius: '20px', color: 'white', fontWeight: 800, fontSize: isMobile ? '18px' : '20px', boxShadow: '0 20px 40px -10px rgba(0, 242, 255, 0.4)' }}>Get Started</button>
              <button style={{ padding: isMobile ? '18px 32px' : '24px 48px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', color: 'white', fontWeight: 700, fontSize: isMobile ? '18px' : '20px' }}>View Demo</button>
            </motion.div>
          </motion.div>
        </section>

        {/* Dashboard Preview Section */}
        <section style={{ padding: isMobile ? '0 20px 80px' : '0 60px 140px', maxWidth: '1400px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ 
              width: '100%', 
              minHeight: isMobile ? '400px' : '700px',
              background: '#0a0c10', 
              borderRadius: isMobile ? '24px' : '40px', 
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '0',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* Window Top Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
                {!isMobile && (
                  <>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
                  </>
                )}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '6px 20px', borderRadius: '100px', fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.5px' }}>{isMobile ? 'ledzo.app' : 'ledzo.app/secure/overview'}</div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
              </div>
            </div>
 
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '240px 1fr 320px', gap: '0' }}>
              {/* Sidebar Section - Hidden on mobile for simplicity */}
              {!isMobile && (
                <div style={{ padding: '32px 24px', borderRight: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '40px' }}>
                    {['Overview', 'Wealth Engine', 'Audit Log', 'Treasury', 'Vaults'].map((item, i) => (
                      <div key={item} style={{ padding: '10px 16px', borderRadius: '12px', background: i === 0 ? 'rgba(0,242,255,0.05)' : 'transparent', color: i === 0 ? 'var(--accent-cyan)' : 'var(--text-secondary)', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px', opacity: i === 0 ? 1 : 0.5 }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: i === 0 ? 'var(--accent-cyan)' : 'white' }} />
                        {item}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 'auto', padding: '24px', background: 'linear-gradient(to bottom, rgba(0,242,255,0.05), transparent)', borderRadius: '24px', border: '1px solid rgba(0,242,255,0.1)' }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '8px' }}>IDENTITY VERIFIED</div>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: '100%', height: '100%', background: 'var(--accent-cyan)' }} />
                    </div>
                  </div>
                </div>
              )}
 
              {/* Main Content Area */}
              <div style={{ padding: isMobile ? '24px' : '40px', display: 'flex', flexDirection: 'column', gap: isMobile ? '20px' : '32px' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>Portfolio Value</h3>
                    <div style={{ fontSize: isMobile ? '22px' : '32px', fontWeight: 900 }}>$1,242,520.40</div>
                  </div>
                  {!isMobile && (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }} />
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }} />
                    </div>
                  )}
                </header>
 
                {/* Stat Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? '12px' : '20px' }}>
                  {[
                    { label: 'Growth', value: '+12.5%', color: 'var(--accent-emerald)' },
                    { label: 'Audit Score', value: '99.4', color: 'var(--accent-cyan)' },
                    { label: 'Asset Ratio', value: '4.2', color: 'var(--accent-violet)' }
                  ].slice(0, isMobile ? 2 : 3).map((stat, i) => (
                    <div key={i} style={{ padding: isMobile ? '14px' : '20px', background: 'rgba(255,255,255,0.02)', borderRadius: isMobile ? '16px' : '24px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: isMobile ? '0' : '8px' }}>{stat.label}</div>
                        <div style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: 900, color: stat.color }}>{stat.value}</div>
                      </div>
                      {isMobile && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: stat.color }} />}
                    </div>
                  ))}
                </div>
 
                {/* Major Visualization */}
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.01)', borderRadius: isMobile ? '20px' : '32px', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', position: 'relative', overflow: 'hidden', minHeight: isMobile ? '140px' : 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, opacity: 0.3 }}>{isMobile ? 'PERFORMANCE' : 'PERFORMANCE ANALYTICS'}</span>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-cyan)' }}>REAL-TIME</span>
                    </div>
                    <svg width="100%" height="70%" viewBox="0 0 400 150" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0 }}>
                       <path d="M0,120 Q50,110 100,50 T200,80 T300,30 T400,10" stroke="var(--accent-cyan)" strokeWidth="3" fill="none" />
                       <path d="M0,120 Q50,110 100,50 T200,80 T300,30 T400,10 L400,150 L0,150 Z" fill="url(#grad)" opacity="0.1" />
                       <defs>
                         <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                           <stop offset="0%" style={{ stopColor: 'var(--accent-cyan)', stopOpacity: 0.5 }} />
                           <stop offset="100%" style={{ stopColor: 'var(--accent-cyan)', stopOpacity: 0 }} />
                         </linearGradient>
                       </defs>
                    </svg>
                </div>
              </div>
 
              {/* Side Panel Area - Hidden on mobile */}
              {!isMobile && (
                <div style={{ padding: '32px', borderLeft: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.1)' }}>
                  <h4 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '24px', opacity: 0.3, letterSpacing: '1px' }}>RECENT OPERATIONS</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                     {[
                       { tx: 'Vault Deposit', val: '+$12,000', col: 'var(--accent-emerald)' },
                       { tx: 'AI Optimization', val: 'Complete', col: 'var(--accent-cyan)' },
                       { tx: 'Inbound Wire', val: '+$40,000', col: 'var(--accent-emerald)' },
                       { tx: 'Liquidity Move', val: '-$5,200', col: '#ff5f56' }
                     ].map((item, i) => (
                       <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                           <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }} />
                           <div style={{ fontSize: '13px', fontWeight: 600 }}>{item.tx}</div>
                         </div>
                         <div style={{ fontSize: '13px', fontWeight: 800, color: item.col }}>{item.val}</div>
                       </div>
                     ))}
                  </div>
                  <div style={{ marginTop: '40px', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 800, marginBottom: '12px' }}>
                      <span style={{ opacity: 0.3 }}>TOTAL SAFETY</span>
                      <span>99.4%</span>
                    </div>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: '99%', height: '100%', background: 'linear-gradient(to right, var(--accent-cyan), var(--accent-violet))' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Ambient Background Glow */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(circle at 50% 0%, rgba(0,242,255,0.03), transparent)' }} />
          </motion.div>
        </section>
 
        {/* Stats Section */}
        <section style={{ padding: isMobile ? '60px 20px' : '100px 60px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '40px 20px' : '60px' }}>
            {[
              { label: 'Total Volume', value: '$2.4B+', icon: TrendingUp },
              { label: 'Global Users', value: '180k+', icon: Globe },
              { label: 'Uptime Score', value: '99.9%', icon: Activity },
              { label: 'Secured Logs', value: '1M+', icon: Shield }
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--accent-cyan)', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}><stat.icon size={isMobile ? 20 : 24} /></div>
                <div style={{ fontSize: isMobile ? '28px' : '48px', fontWeight: 900, marginBottom: '4px', letterSpacing: '-1px' }}>{stat.value}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>
 
        {/* Bento Feature Grid */}
        <section style={{ padding: isMobile ? '80px 20px' : '180px 60px', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '60px' : '100px' }}>
            <h2 style={{ fontSize: isMobile ? '36px' : '56px', fontWeight: 900, marginBottom: '20px', letterSpacing: '-1px' }}>Power at Every Turn.</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: isMobile ? '16px' : '22px', maxWidth: '600px', margin: '0 auto' }}>Designed for those who demand precision and speed in their financial workflow.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: '24px', gridAutoRows: 'minmax(280px, auto)' }}>
            <BentoCard 
              icon={Cpu} 
              title="Budget AI Intelligence" 
              desc="Our adaptive algorithms analyze your spending patterns in real-time, forecasting anomalies before they happen." 
              colSpan={2}
              color="var(--accent-cyan)"
              isMobile={isMobile}
            />
            <BentoCard 
              icon={Globe} 
              title="Global Currency Core" 
              desc="Manage assets across 150+ currencies with institutional-grade exchange logic." 
              color="var(--accent-violet)"
              isMobile={isMobile}
            />
            <BentoCard 
              icon={Target} 
              title="Wealth Milestones" 
              desc="Gamified goal setting that turns every saved dollar into progress." 
              color="var(--accent-emerald)"
              isMobile={isMobile}
            />
            <BentoCard 
              icon={Shield} 
              title="Quantum Privacy" 
              desc="Zero-knowledge encryption for your sensitive financial data." 
              color="var(--accent-pink)"
              isMobile={isMobile}
            />
            <BentoCard 
              icon={BarChart3} 
              title="Predictive Analytics" 
              desc="Visual deep-dives into your financial future with 98% accuracy." 
              colSpan={2}
              color="var(--accent-cyan)"
              isMobile={isMobile}
            />
            <BentoCard 
              icon={Layers} 
              title="Multi-Vault Logic" 
              desc="Separate your business, personal, and travel funds with a click." 
              color="var(--accent-violet)"
              isMobile={isMobile}
            />
          </div>
        </section>

        {/* Security Deep Dive */}
        <section style={{ padding: isMobile ? '80px 20px' : '140px 60px', background: 'radial-gradient(circle at center, rgba(14, 165, 233, 0.05) 0%, transparent 70%)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: isMobile ? '40px' : '80px', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row' }}>
            <div style={{ flex: 1, minWidth: isMobile ? '100%' : '400px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '32px' }}>
                <Lock size={14} color="var(--accent-cyan)" />
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Fortress Security</span>
              </div>
              <h2 style={{ fontSize: isMobile ? '36px' : '56px', fontWeight: 900, marginBottom: '24px', letterSpacing: '-1px', lineHeight: 1.1 }}>Your Data stays <br /><span style={{ color: 'var(--accent-cyan)' }}>Your Data.</span></h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: isMobile ? '16px' : '20px', lineHeight: 1.7, marginBottom: isMobile ? '32px' : '48px' }}>
                We believe privacy is a fundamental human right. Ledzo is built on Zero-Knowledge architecture, meaning we couldn't see your data even if we wanted to.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? '24px' : '40px' }}>
                {[
                  { icon: Fingerprint, title: 'Biometric Integrity', desc: 'Secure login via hardware-based keys.' },
                  { icon: SearchSlash, title: 'Absolute Privacy', desc: 'Zero data tracking or advertising.' },
                  { icon: Database, title: 'Cloud-Hardened', desc: 'Decentralized encrypted storage.' },
                  { icon: ZapOff, title: 'Offline Mode', desc: 'Keep auditing without the grid.' }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ color: 'var(--accent-cyan)' }}><item.icon size={18} /></div>
                    <h4 style={{ fontSize: '17px', fontWeight: 800 }}>{item.title}</h4>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ flex: 1, minWidth: isMobile ? '100%' : '400px', position: 'relative' }}>
              <div style={{ width: '100%', aspectRatio: '1/1', background: 'rgba(15, 23, 42, 0.4)', borderRadius: isMobile ? '40px' : '60px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '40px' : '60px' }}>
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }} style={{ width: '100%', height: '100%', background: 'radial-gradient(circle, var(--accent-cyan)40, transparent 70%)', filter: 'blur(30px)', opacity: 0.1, position: 'absolute' }} />
                <Shield size={isMobile ? 120 : 200} color="var(--accent-cyan)" strokeWidth={1} />
              </div>
            </div>
          </div>
        </section>

        {/* QnA Section (WHITE SECTION FOR VISIBILITY) */}
        <section style={{ padding: isMobile ? '100px 20px' : '180px 60px', background: '#ffffff', position: 'relative' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '80px' }}>
               <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', background: '#f1f5f9', borderRadius: '100px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <HelpCircle size={16} color="var(--accent-cyan)" />
                <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: '#64748b' }}>Commonly Asked</span>
              </div>
              <h2 style={{ fontSize: isMobile ? '32px' : '56px', fontWeight: 900, marginBottom: '20px', color: '#0f172a', letterSpacing: '-1.5px' }}>Questions & Answers.</h2>
              <p style={{ color: '#64748b', fontSize: isMobile ? '16px' : '20px', fontWeight: 500 }}>High-contrast support for your queries.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(450px, 1fr))', gap: '16px' }}>
              <FAQItem 
                question="Is Ledzo Ultra really free for now?" 
                answer="Yes. We are currently in the Founder phase. All early adopters get lifetime access to current core features without a subscription." 
              />
              <FAQItem 
                question="Do I need to connect my bank accounts?" 
                answer="No. Ledzo is built on privacy-first principles. You retain full control by logging your transactions manually or via bulk imports." 
              />
              <FAQItem 
                question="How secure is my financial data?" 
                answer="We use AES-256 bit encryption at rest and TLS 1.3 for all data in motion. Your data is stored in localized, hardened clouds." 
              />
              <FAQItem 
                question="Does it support multiple users?" 
                answer="Each account is for a single identity. Multi-user shared vaults are coming in Q3 2026." 
              />
            </div>
          </div>
        </section>

        {/* Fixed Final CTA Section */}
        <section style={{ padding: '100px 20px', textAlign: 'center' }}>
          <div style={{ 
            maxWidth: '1000px', 
            margin: '0 auto', 
            padding: '60px 40px', 
            borderRadius: '40px', 
            background: 'rgba(15, 23, 42, 0.6)', 
            border: '1.5px solid rgba(0, 242, 255, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            {/* Subtle Inner Glow */}
            <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(0, 242, 255, 0.05) 0%, transparent 50%)', pointerEvents: 'none' }} />
            
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, marginBottom: '24px', color: 'white', lineHeight: 1.1, letterSpacing: '-1.5px' }}>The Future of Wealth is here.</h2>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.5, fontWeight: 500 }}>Join the elite group of individuals who take their financial architecture seriously.</p>
            
            <button 
              onClick={() => onStart('signup')}
              style={{ 
                padding: '16px 48px', 
                background: 'white', 
                color: 'black', 
                borderRadius: '16px', 
                fontWeight: 800, 
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: '0 auto',
                transition: '0.3s',
                boxShadow: '0 10px 20px rgba(0, 242, 255, 0.2)'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Initialize Dashboard <ArrowRight size={22} />
            </button>
          </div>
        </section>
      </main>

      {/* FOOTER (CLEAN & MINIMAL) */}
      <footer style={{ 
        padding: isMobile ? '60px 20px 40px' : '100px 60px 60px', 
        background: '#05070a', 
        borderTop: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: isMobile ? '40px' : '80px', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '40px' : '40px' }}>
            {/* Brand Section */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Logo size={isMobile ? 32 : 40} />
                <h2 style={{ fontWeight: 800, fontSize: isMobile ? '18px' : '22px', margin: 0 }}>Ledzo Ultra</h2>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>Precision financial platform for the high-end user.</p>
            </div>
 
            {/* Social Group */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {[Globe, Activity, Cpu, Monitor].map((Icon, i) => (
                <div key={i} style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                  <Icon size={16} />
                </div>
              ))}
            </div>
          </div>
 
          <div style={{ paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '24px' : '20px', textAlign: isMobile ? 'center' : 'left' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 500 }}>&copy; 2026 Ledzo Financial Technologies. Zero-Knowledge Auditing.</p>
            <div style={{ display: 'flex', gap: isMobile ? '20px' : '30px', alignItems: 'center' }}>
              {!isMobile && (
                <span style={{ color: 'var(--success)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '6px', height: '6px', background: 'var(--success)', borderRadius: '50%', boxShadow: '0 0 10px var(--success)' }} />
                  Secure
                </span>
              )}
              <span style={{ color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer' }}>Terms</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer' }}>Privacy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
