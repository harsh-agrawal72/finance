import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Shield, TrendingUp, PieChart, Sparkles, ArrowRight, CheckCircle2, 
  ChevronDown, BarChart3, Wallet, Target, Lock, Globe, Layers, Cpu,
  Quote, Star, Activity, PlusCircle, RefreshCw, 
  ExternalLink, HelpCircle, Mail, MessageSquare, Monitor, Layout,
  Smartphone, Database, Code, ZapOff, Fingerprint, SearchSlash, AlertCircle
} from 'lucide-react';

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

const BentoCard = ({ icon: Icon, title, desc, colSpan = 1, rowSpan = 1, color = 'var(--accent-cyan)' }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    style={{ 
      gridColumn: `span ${colSpan}`,
      gridRow: `span ${rowSpan}`,
      padding: '32px',
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
    <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'white' }}>{title}</h3>
    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>{desc}</p>
  </motion.div>
);

const Landing = ({ onStart, onLogin }) => {
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
        padding: '24px 60px',
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(5, 7, 10, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(0, 242, 255, 0.2)' }}>
            <Zap size={22} color="white" fill="white" />
          </div>
          <h2 style={{ fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px' }}>Ledzo Ultra</h2>
        </div>
        
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <button onClick={onLogin} style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '15px', transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Login</button>
          <button 
            onClick={() => onStart('signup')}
            style={{ 
              padding: '12px 28px', 
              background: 'white', 
              borderRadius: '12px', 
              color: 'black', 
              fontWeight: 700,
              fontSize: '15px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Start Free
          </button>
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <section style={{ padding: '140px 20px 180px', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '40px' }}>
              <Sparkles size={14} color="var(--accent-cyan)" />
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)' }}>Trusted by 10k+ financial elites</span>
            </motion.div>

            <motion.h1 variants={itemVariants} style={{ fontSize: 'clamp(54px, 10vw, 96px)', fontWeight: 900, lineHeight: 0.9, marginBottom: '40px', letterSpacing: '-5px' }}>
              Engineered for <br />
              <span style={{ background: 'linear-gradient(to right, var(--accent-cyan), var(--accent-violet))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Extreme Clarity.
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} style={{ fontSize: 'clamp(20px, 2.5vw, 26px)', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 64px', lineHeight: 1.6, fontWeight: 500 }}>
              The most advanced personal finance platform ever built. AI-powered insights, multi-currency support, and precision auditing for the high-end user.
            </motion.p>

            <motion.div variants={itemVariants} style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => onStart('signup')} style={{ padding: '24px 56px', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))', borderRadius: '20px', color: 'white', fontWeight: 800, fontSize: '20px', boxShadow: '0 20px 40px -10px rgba(0, 242, 255, 0.4)' }}>Join the Elite</button>
              <button style={{ padding: '24px 48px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', color: 'white', fontWeight: 700, fontSize: '20px' }}>Explore Platform</button>
            </motion.div>
          </motion.div>
        </section>

        {/* Dashboard Preview Section */}
        <section style={{ padding: '0 60px 140px', maxWidth: '1400px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ 
              width: '100%', 
              minHeight: '600px',
              background: 'linear-gradient(135deg, #0d1117, #05070a)', 
              borderRadius: '40px', 
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 100px 200px -50px rgba(0, 242, 255, 0.1)',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* Platform Header Area (Premium replacement for dots) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Layout size={16} color="var(--accent-cyan)" />
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)' }}>Dashboard Overview</div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '80px', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
                <div style={{ width: '40px', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
              </div>
            </div>
            
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '220px 1fr', gap: '40px' }}>
              {/* Sidebar Mockup */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ width: '100%', height: '40px', background: 'rgba(0, 242, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(0, 242, 255, 0.2)', display: 'flex', alignItems: 'center', padding: '0 12px' }}>
                   <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'var(--accent-cyan)', marginRight: '12px' }} />
                   <div style={{ width: '60px', height: '6px', background: 'rgba(255,255,255,0.3)', borderRadius: '2px' }} />
                </div>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{ width: '100%', height: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '0 12px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', marginRight: '12px' }} />
                    <div style={{ width: '40px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
                  </div>
                ))}
                
                <div style={{ marginTop: 'auto', padding: '20px', background: 'rgba(0, 242, 255, 0.05)', borderRadius: '20px', border: '1px solid rgba(0, 242, 255, 0.1)' }}>
                   <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', marginBottom: '12px' }} />
                   <div style={{ width: '70%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }} />
                </div>
              </div>
              
              {/* Main Mockup Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  {[
                    { color: 'var(--accent-cyan)', label: 'Net Worth', value: '$254.2k' },
                    { color: 'var(--accent-violet)', label: 'Monthly Flow', value: '+12.4%' },
                    { color: 'var(--accent-emerald)', label: 'Total Assets', value: '42' }
                  ].map((stat, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ y: -5, borderColor: 'rgba(255,255,255,0.1)' }}
                      style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', transition: '0.3s' }}
                    >
                       <div style={{ color: 'var(--text-secondary)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '8px' }}>{stat.label}</div>
                       <div style={{ fontSize: '24px', fontWeight: 800, color: 'white' }}>{stat.value}</div>
                       <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '2px', marginTop: '12px', overflow: 'hidden' }}>
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: '60%' }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                            style={{ height: '100%', background: stat.color }} 
                          />
                       </div>
                    </motion.div>
                  ))}
                </div>
                
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px' }}>
                  {/* Mock Chart Area */}
                  <div style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div style={{ width: '120px', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }} />
                       <div style={{ display: 'flex', gap: '8px' }}>
                          <div style={{ width: '32px', height: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
                          <div style={{ width: '32px', height: '16px', background: 'var(--accent-cyan)20', borderRadius: '4px', border: '1px solid var(--accent-cyan)40' }} />
                       </div>
                    </div>
                    <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
                       {[40, 60, 45, 80, 55, 90, 70, 85, 100].map((h, i) => (
                         <motion.div 
                           key={i} 
                           initial={{ height: 0 }}
                           whileInView={{ height: `${h}%` }}
                           viewport={{ once: true }}
                           transition={{ delay: 0.8 + i * 0.05, duration: 0.5 }}
                           style={{ flex: 1, background: `linear-gradient(to top, ${i === 8 ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.08)'}, transparent)`, borderRadius: '4px' }} 
                         />
                       ))}
                    </div>
                  </div>
                  
                  {/* Mock List Area */}
                  <div style={{ background: 'rgba(255,255,255,0.01)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', padding: '24px' }}>
                    <div style={{ width: '80px', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', marginBottom: '24px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {[1, 2, 3, 4, 5].map(i => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: 10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 1 + i * 0.1 }}
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                               <div style={{ width: '40px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }} />
                               <div style={{ width: '25px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }} />
                            </div>
                          </div>
                          <div style={{ width: '30px', height: '6px', background: i % 2 === 0 ? 'var(--accent-emerald)40' : 'rgba(255,255,255,0.1)', borderRadius: '3px' }} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Overlay Gradient (Bottom fade) */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '30%', background: 'linear-gradient(to top, #05070a 20%, transparent)', zIndex: 2 }} />
          </motion.div>
        </section>

        {/* Stats Section */}
        <section style={{ padding: '100px 60px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '60px' }}>
            {[
              { label: 'Total Volume', value: '$2.4B+', icon: TrendingUp },
              { label: 'Global Users', value: '180k+', icon: Globe },
              { label: 'Uptime Score', value: '99.9%', icon: Activity },
              { label: 'Secured Logs', value: '1M+', icon: Shield }
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--accent-cyan)', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}><stat.icon size={24} /></div>
                <div style={{ fontSize: '48px', fontWeight: 900, marginBottom: '8px', letterSpacing: '-2px' }}>{stat.value}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Bento Feature Grid */}
        <section style={{ padding: '180px 60px', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '100px' }}>
            <h2 style={{ fontSize: '56px', fontWeight: 900, marginBottom: '24px', letterSpacing: '-2px' }}>Power at Every Turn.</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '22px', maxWidth: '600px', margin: '0 auto' }}>Designed for those who demand precision and speed in their financial workflow.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', gridAutoRows: 'minmax(300px, auto)' }}>
            <BentoCard 
              icon={Cpu} 
              title="Budget AI Intelligence" 
              desc="Our adaptive algorithms analyze your spending patterns in real-time, forecasting anomalies before they happen." 
              colSpan={2}
              color="var(--accent-cyan)"
            />
            <BentoCard 
              icon={Globe} 
              title="Global Currency Core" 
              desc="Manage assets across 150+ currencies with institutional-grade exchange logic." 
              color="var(--accent-violet)"
            />
            <BentoCard 
              icon={Target} 
              title="Wealth Milestones" 
              desc="Gamified goal setting that turns every saved dollar into progress." 
              color="var(--accent-emerald)"
            />
            <BentoCard 
              icon={Shield} 
              title="Quantum Privacy" 
              desc="Zero-knowledge encryption for your sensitive financial data." 
              color="var(--accent-pink)"
            />
            <BentoCard 
              icon={BarChart3} 
              title="Predictive Analytics" 
              desc="Visual deep-dives into your financial future with 98% accuracy." 
              colSpan={2}
              color="var(--accent-cyan)"
            />
            <BentoCard 
              icon={Layers} 
              title="Multi-Vault Logic" 
              desc="Separate your business, personal, and travel funds with a click." 
              color="var(--accent-violet)"
            />
          </div>
        </section>

        {/* Security Deep Dive */}
        <section style={{ padding: '140px 60px', background: 'radial-gradient(circle at center, rgba(14, 165, 233, 0.05) 0%, transparent 70%)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '80px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '400px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '32px' }}>
                <Lock size={14} color="var(--accent-cyan)" />
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Fortress Security</span>
              </div>
              <h2 style={{ fontSize: '56px', fontWeight: 900, marginBottom: '32px', letterSpacing: '-2px', lineHeight: 1.1 }}>Your Data stays <br /><span style={{ color: 'var(--accent-cyan)' }}>Your Data.</span></h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '20px', lineHeight: 1.7, marginBottom: '48px' }}>
                We believe privacy is a fundamental human right. Ledzo is built on Zero-Knowledge architecture, meaning we couldn't see your data even if we wanted to.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px' }}>
                {[
                  { icon: Fingerprint, title: 'Biometric Integrity', desc: 'Secure login via hardware-based keys.' },
                  { icon: SearchSlash, title: 'Absolute Privacy', desc: 'Zero data tracking or advertising.' },
                  { icon: Database, title: 'Cloud-Hardened', desc: 'Decentralized encrypted storage.' },
                  { icon: ZapOff, title: 'Offline Mode', desc: 'Keep auditing without the grid.' }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ color: 'var(--accent-cyan)' }}><item.icon size={20} /></div>
                    <h4 style={{ fontSize: '18px', fontWeight: 800 }}>{item.title}</h4>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ flex: 1, minWidth: '400px', position: 'relative' }}>
              <div style={{ width: '100%', aspectRatio: '1/1', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '60px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }} style={{ width: '100%', height: '100%', background: 'radial-gradient(circle, var(--accent-cyan)40, transparent 70%)', filter: 'blur(30px)', opacity: 0.1, position: 'absolute' }} />
                <Shield size={200} color="var(--accent-cyan)" strokeWidth={1} />
              </div>
            </div>
          </div>
        </section>

        {/* QnA Section (WHITE SECTION FOR VISIBILITY) */}
        <section style={{ padding: '180px 60px', background: '#ffffff', position: 'relative' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
               <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', background: '#f1f5f9', borderRadius: '100px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <HelpCircle size={16} color="var(--accent-cyan)" />
                <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: '#64748b' }}>Commonly Asked</span>
              </div>
              <h2 style={{ fontSize: '56px', fontWeight: 900, marginBottom: '24px', color: '#0f172a', letterSpacing: '-2px' }}>Questions & Answers.</h2>
              <p style={{ color: '#64748b', fontSize: '20px', fontWeight: 500 }}>High-contrast support for your queries.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px' }}>
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
        padding: '100px 60px 60px', 
        background: '#05070a', 
        borderTop: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '80px', flexWrap: 'wrap', gap: '40px' }}>
            {/* Brand Section */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={22} color="white" fill="white" />
                </div>
                <h2 style={{ fontWeight: 800, fontSize: '22px' }}>Ledzo Ultra</h2>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 500 }}>Precision financial platform for the high-end user.</p>
            </div>

            {/* Social Group */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {[Globe, Activity, Cpu, Monitor].map((Icon, i) => (
                <div key={i} style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                  <Icon size={18} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 500 }}>&copy; 2026 Ledzo Financial Technologies. Zero-Knowledge Auditing.</p>
            <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
              <span style={{ color: 'var(--success)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', background: 'var(--success)', borderRadius: '50%', boxShadow: '0 0 10px var(--success)' }} />
                Secure Connection
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Terms</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Privacy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
