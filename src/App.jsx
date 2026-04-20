import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Layout/Sidebar';
import MobileNav from './components/Layout/MobileNav';

// Lazy load feature components for better performance
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const TransactionManager = lazy(() => import('./components/Transactions/TransactionManager'));
const BudgetAI = lazy(() => import('./components/Budget/BudgetAI'));
const SavingsGamified = lazy(() => import('./components/Savings/SavingsGamified'));
const Analytics = lazy(() => import('./components/Analytics/Analytics'));
const NetWorth = lazy(() => import('./components/NetWorth/NetWorth'));
const Settings = lazy(() => import('./components/Settings/Settings'));
const Auth = lazy(() => import('./components/Auth/Auth'));
const Landing = lazy(() => import('./components/Landing/Landing'));

import { useFinanceData } from './hooks/useFinanceData';
import { useIsMobile } from './hooks/useMediaQuery';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

/**
 * Premium Loading Component for Lazy Loading
 */
const PageLoader = () => (
  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
    <motion.div 
      animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.8, 0.4] }} 
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}
    >
      <div style={{ position: 'relative', width: '60px', height: '60px' }}>
        <div style={{ position: 'absolute', width: '100%', height: '100%', border: '2px solid rgba(0,242,255,0.1)', borderRadius: '50%' }} />
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', width: '100%', height: '100%', border: '2px solid transparent', borderTopColor: 'var(--accent-cyan)', borderRadius: '50%' }} 
        />
      </div>
      <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)' }}>Syncing Core...</span>
    </motion.div>
  </div>
);


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [activeTab, setActiveTab] = useState(() => {
    return window.location.pathname !== '/' ? window.location.pathname.substring(1) : 'dashboard';
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      // If a user just logged in, always start them on the dashboard
      if (currentUser) {
        handleTabChange('dashboard');
        setShowAuth(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.substring(1);
      if (path && path !== activeTab) {
        setActiveTab(path);
      } else if (window.location.pathname === '/') {
        setActiveTab('dashboard');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.history.pushState(null, '', `/${tab}`);
  };

  const handleStartAuth = (mode) => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const finance = useFinanceData(user?.uid);
  const { data, exportJSON, resetData } = finance;

  const isMobile = useIsMobile();

  const mainRef = React.useRef(null);
  useEffect(() => { if (mainRef.current) mainRef.current.scrollTop = 0; }, [activeTab]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ width: '40px', height: '40px', border: '3px solid rgba(0,242,255,0.1)', borderTopColor: 'var(--accent-cyan)', borderRadius: '50%' }} />
      </div>
    );
  }

  if (!user) {
    return showAuth ? (
      <Auth initialMode={authMode} onBack={() => setShowAuth(false)} />
    ) : (
      <Landing onStart={handleStartAuth} onLogin={() => handleStartAuth('login')} />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard
          userName={data.userName}
          totals={finance.getTotals()}
          currency={data.currency}
          healthScore={finance.getHealthScore()}
          insights={finance.getAIInsights()}
          recentTransactions={data.transactions.slice(0, 5)}
          addTransaction={finance.addTransaction}
          categories={data.categories}
          monthlyHistory={finance.getMonthlyHistory(6)}
          categoryBreakdown={finance.getCategoryBreakdown()}
        />;
      case 'transactions':
        return <TransactionManager
          transactions={data.transactions}
          currency={data.currency}
          addTransaction={finance.addTransaction}
          deleteTransaction={finance.deleteTransaction}
          editTransaction={finance.editTransaction}
          categories={data.categories}
        />;
      case 'budget':
        return <BudgetAI
          totals={finance.getTotals()}
          currency={data.currency}
          budgets={finance.getBudgets()}
          setBudget={finance.setBudget}
        />;
      case 'savings':
        return <SavingsGamified
          goals={data.goals}
          currency={data.currency}
          addGoal={finance.addGoal}
          deleteGoal={finance.deleteGoal}
          editGoal={finance.editGoal}
          depositToGoal={finance.depositToGoal}
          withdrawFromGoal={finance.withdrawFromGoal}
        />;
      case 'analytics':
        return <Analytics
          userName={data.userName}
          monthlyHistory={finance.getMonthlyHistory(6)}
          categoryBreakdown={finance.getCategoryBreakdown()}
          totals={finance.getTotals()}
          currency={data.currency}
          getAnomalies={finance.getAnomalies}
          getSpendingForecast={finance.getSpendingForecast}
          getRecurringExpenses={finance.getRecurringExpenses}
          getNetWorth={finance.getNetWorth}
          askAI={finance.askAI}
          transactions={data.transactions}
          goals={data.goals}
          assets={data.assets}
        />;
      case 'networth':
        return <NetWorth
          assets={data.assets}
          liabilities={data.liabilities}
          currency={data.currency}
          addAsset={finance.addAsset}
          deleteAsset={finance.deleteAsset}
          addLiability={finance.addLiability}
          deleteLiability={finance.deleteLiability}
          getNetWorth={finance.getNetWorth}
        />;
      case 'settings':
        return <Settings
          user={user}
          data={data}
          currency={data.currency}
          updateSettings={finance.updateSettings}
          categories={data.categories}
          addCategory={finance.addCategory}
          exportJSON={exportJSON}
          importJSON={finance.importJSON}
          resetData={resetData}
          importFromLocal={finance.importFromLocal}
        />;
      default: return null;
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      signOut(auth);
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: 'var(--bg-primary)', fontFamily: 'var(--font-main)', flexDirection: isMobile ? 'column' : 'row' }}>
      {!isMobile && <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} exportJSON={exportJSON} resetData={resetData} handleLogout={handleLogout} />}
      <main
        ref={mainRef}
        style={{
          flex: 1, padding: isMobile ? '24px 20px' : '40px', overflowY: 'auto', minWidth: 0,
          marginBottom: isMobile ? '70px' : 0, display: 'flex', flexDirection: 'column', scrollBehavior: 'auto'
        }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15, ease: "easeOut" }} style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Suspense fallback={<PageLoader />}>
              {renderContent()}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      {isMobile && <MobileNav activeTab={activeTab} setActiveTab={handleTabChange} handleLogout={handleLogout} />}
    </div>
  );
}

export default App;
