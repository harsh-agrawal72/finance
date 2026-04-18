import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import TransactionManager from './components/Transactions/TransactionManager';
import BudgetAI from './components/Budget/BudgetAI';
import SavingsGamified from './components/Savings/SavingsGamified';
import Analytics from './components/Analytics/Analytics';
import NetWorth from './components/NetWorth/NetWorth';
import Settings from './components/Settings/Settings';
import MobileNav from './components/Layout/MobileNav';
import Auth from './components/Auth/Auth';
import { useFinanceData } from './hooks/useFinanceData';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(() => {
    return window.location.hash ? window.location.hash.substring(1) : 'dashboard';
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      // If a user just logged in, always start them on the dashboard
      if (currentUser) {
        handleTabChange('dashboard');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.substring(1);
      if (hash && hash !== activeTab) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  const finance = useFinanceData(user?.uid);
  const { data, exportJSON, resetData } = finance;

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mainRef = React.useRef(null);
  useEffect(() => { if (mainRef.current) mainRef.current.scrollTop = 0; }, [activeTab]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ width: '40px', height: '40px', border: '3px solid rgba(0,242,255,0.1)', borderTopColor: 'var(--accent-cyan)', borderRadius: '50%' }} />
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard
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
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2, ease: "easeOut" }} style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
      {isMobile && <MobileNav activeTab={activeTab} setActiveTab={handleTabChange} handleLogout={handleLogout} />}
    </div>
  );
}

export default App;
