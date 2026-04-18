import { useState, useEffect, useCallback, useMemo } from 'react';
import { format, isSameMonth, parseISO, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { db } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

const STORAGE_KEY = 'pfm_data_v4';

const INITIAL_DATA = {
  transactions: [],
  budgets: {
    'Needs': { amount: 0, spent: 0 },
    'Wants': { amount: 0, spent: 0 },
    'Savings': { amount: 0, spent: 0 },
  },
  goals: [],
  assets: [],
  liabilities: [],
  categories: {
    income: ['Salary', 'Freelance', 'Investments', 'Business', 'Gift', 'Side Hustle', 'Rental Income', 'Bonus'],
    expense: ['Rent', 'Groceries', 'Utilities', 'Dining', 'Transport', 'Entertainment', 'Healthcare', 'Shopping', 'Education', 'Subscriptions', 'Insurance', 'Fuel', 'Personal Care', 'Gifts', 'Misc'],
  },
  userName: '',
  currency: '₹',
};

export const useFinanceData = (uid) => {
  const [data, setData] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(true);

  // ─── REAL-TIME SYNC ───────────────────────────────────────────────────
  useEffect(() => {
    if (!uid) return;

    // 1. Sync Base Data (Settings, Categories, Budgets)
    const settingsRef = doc(db, 'users', uid);
    const unsubSettings = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        const settings = docSnap.data();
        setData(prev => ({ ...prev, ...settings }));
      } else {
        // Initialize new user document
        setDoc(settingsRef, {
          currency: INITIAL_DATA.currency,
          categories: INITIAL_DATA.categories,
          budgets: INITIAL_DATA.budgets,
          userName: INITIAL_DATA.userName
        });
      }
    });

    // 2. Sync Transactions
    const txQuery = query(collection(db, 'users', uid, 'transactions'), orderBy('date', 'desc'));
    const unsubTx = onSnapshot(txQuery, (snap) => {
      const txs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setData(prev => ({ ...prev, transactions: txs }));
      setLoading(false);
    });

    // 3. Sync Goals
    const goalsQuery = query(collection(db, 'users', uid, 'goals'));
    const unsubGoals = onSnapshot(goalsQuery, (snap) => {
      const goals = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setData(prev => ({ ...prev, goals }));
    });

    // 4. Sync Assets/Liabilities
    const assetsQuery = query(collection(db, 'users', uid, 'assets'));
    const unsubAssets = onSnapshot(assetsQuery, (snap) => {
      const assets = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setData(prev => ({ ...prev, assets }));
    });

    const liabQuery = query(collection(db, 'users', uid, 'liabilities'));
    const unsubLiab = onSnapshot(liabQuery, (snap) => {
      const liab = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setData(prev => ({ ...prev, liabilities: liab }));
    });

    return () => {
      unsubSettings();
      unsubTx();
      unsubGoals();
      unsubAssets();
      unsubLiab();
    };
  }, [uid]);

  // ─── TRANSACTION CRUD ─────────────────────────────────────────────────
  const addTransaction = useCallback(async (tx) => {
    if (!uid) return;
    await addDoc(collection(db, 'users', uid, 'transactions'), {
      ...tx,
      amount: Number(tx.amount),
      note: tx.note || '',
      createdAt: serverTimestamp()
    });
  }, [uid]);

  const deleteTransaction = useCallback(async (id) => {
    if (!uid) return;
    await deleteDoc(doc(db, 'users', uid, 'transactions', id));
  }, [uid]);

  const editTransaction = useCallback(async (updated) => {
    if (!uid) return;
    const { id, ...txData } = updated;
    await updateDoc(doc(db, 'users', uid, 'transactions', id), {
      ...txData,
      amount: Number(updated.amount)
    });
  }, [uid]);

  // ─── GOALS CRUD ───────────────────────────────────────────────────────
  const addGoal = useCallback(async (goal) => {
    if (!uid) return;
    await addDoc(collection(db, 'users', uid, 'goals'), {
      ...goal,
      current: Number(goal.current) || 0,
      target: Number(goal.target)
    });
  }, [uid]);

  const deleteGoal = useCallback(async (id) => {
    if (!uid) return;
    await deleteDoc(doc(db, 'users', uid, 'goals', id));
  }, [uid]);

  const editGoal = useCallback(async (updated) => {
    if (!uid) return;
    const { id, ...goalData } = updated;
    await updateDoc(doc(db, 'users', uid, 'goals', id), {
      ...goalData,
      current: Number(updated.current),
      target: Number(updated.target)
    });
  }, [uid]);

  const depositToGoal = useCallback(async (id, amount) => {
    if (!uid) return;
    const goalRef = doc(db, 'users', uid, 'goals', id);
    const goal = data.goals.find(g => g.id === id);
    if (!goal) return;
    await updateDoc(goalRef, {
      current: Math.min(Number(goal.target), Number(goal.current) + Number(amount))
    });
  }, [uid, data.goals]);

  const withdrawFromGoal = useCallback(async (id, amount) => {
    if (!uid) return;
    const goalRef = doc(db, 'users', uid, 'goals', id);
    const goal = data.goals.find(g => g.id === id);
    if (!goal) return;
    await updateDoc(goalRef, {
      current: Math.max(0, Number(goal.current) - Number(amount))
    });
  }, [uid, data.goals]);

  // ─── ASSETS & LIABILITIES ─────────────────────────────────────────────
  const addAsset = useCallback(async (asset) => {
    if (!uid) return;
    await addDoc(collection(db, 'users', uid, 'assets'), { ...asset, value: Number(asset.value) });
  }, [uid]);

  const deleteAsset = useCallback(async (id) => {
    if (!uid) return;
    await deleteDoc(doc(db, 'users', uid, 'assets', id));
  }, [uid]);

  const addLiability = useCallback(async (item) => {
    if (!uid) return;
    await addDoc(collection(db, 'users', uid, 'liabilities'), { ...item, value: Number(item.value) });
  }, [uid]);

  const deleteLiability = useCallback(async (id) => {
    if (!uid) return;
    await deleteDoc(doc(db, 'users', uid, 'liabilities', id));
  }, [uid]);

  // ─── BUDGETS & SETTINGS ───────────────────────────────────────────────
  const setBudget = useCallback(async (category, amount) => {
    if (!uid) return;
    await updateDoc(doc(db, 'users', uid), {
      [`budgets.${category}.amount`]: Number(amount)
    });
  }, [uid]);

  const addCategory = useCallback(async (type, name) => {
    if (!uid) return;
    const newCategories = { ...data.categories, [type]: [...data.categories[type], name] };
    await updateDoc(doc(db, 'users', uid), { categories: newCategories });
  }, [uid, data.categories]);

  const updateSettings = useCallback(async (settings) => {
    if (!uid) return;
    await updateDoc(doc(db, 'users', uid), settings);
  }, [uid]);

  // ─── DATA MIGRATION (Local -> Cloud) ──────────────────────────────────
  const importFromLocal = useCallback(async () => {
    if (!uid) return;
    const local = localStorage.getItem(STORAGE_KEY);
    if (!local) return;
    const parsed = JSON.parse(local);
    // Batch migrate (could be many txs, so we do them sequentially for safety here)
    for (const tx of (parsed.transactions || [])) {
      const { id, ...txData } = tx;
      await addDoc(collection(db, 'users', uid, 'transactions'), txData);
    }
    // Update settings
    await updateDoc(doc(db, 'users', uid), {
      currency: parsed.currency || '₹',
      budgets: parsed.budgets || INITIAL_DATA.budgets,
      categories: parsed.categories || INITIAL_DATA.categories
    });
    localStorage.removeItem(STORAGE_KEY);
  }, [uid]);

  // ─── MEMOIZED CALCULATIONS ───────────────────────────────────────────
  // (All the existing calculation logic remains the same)
  const totals = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const monthlyTxs = data.transactions.filter(t => {
      try { return isWithinInterval(parseISO(t.date), { start: monthStart, end: monthEnd }); } catch { return false; }
    });
    const income = monthlyTxs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const expenses = monthlyTxs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
    const balance = data.transactions.reduce((s, t) => t.type === 'income' ? s + Number(t.amount) : s - Number(t.amount), 0);
    const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;
    return { income, expenses, balance, monthlyTxs, savingsRate };
  }, [data.transactions]);

  const netWorth = useMemo(() => {
    const totalAssets = (data.assets || []).reduce((s, a) => s + Number(a.value), 0);
    const totalLiabilities = (data.liabilities || []).reduce((s, l) => s + Number(l.value), 0);
    return { totalAssets, totalLiabilities, netWorth: totalAssets - totalLiabilities };
  }, [data.assets, data.liabilities]);

  const monthlyHistory = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const target = subMonths(new Date(), 11 - i);
      const start = startOfMonth(target);
      const end = endOfMonth(target);
      const txs = data.transactions.filter(t => { try { return isWithinInterval(parseISO(t.date), { start, end }); } catch { return false; } });
      const income = txs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
      const expenses = txs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
      return { label: format(target, 'MMM yy'), income, expenses, savings: income - expenses };
    });
  }, [data.transactions]);

  const categoryBreakdown = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const map = {};
    data.transactions.filter(t => {
      try { return t.type === 'expense' && isWithinInterval(parseISO(t.date), { start: monthStart, end: monthEnd }); } catch { return false; }
    }).forEach(t => { map[t.category] = (map[t.category] || 0) + Number(t.amount); });
    return Object.entries(map).map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount);
  }, [data.transactions]);

  const spendingForecast = useMemo(() => {
    const now = new Date();
    const dayOfMonth = now.getDate();
    const daysInMonth = endOfMonth(now).getDate();
    const { expenses, income } = totals;
    if (dayOfMonth === 0) return { projected: 0, safeToSpend: income, dailyRate: 0, daysLeft: daysInMonth };
    const dailyRate = expenses / dayOfMonth;
    const projected = Math.round(dailyRate * daysInMonth);
    const safeToSpend = Math.max(0, income - projected);
    return { projected, safeToSpend, dailyRate: Math.round(dailyRate), daysLeft: daysInMonth - dayOfMonth };
  }, [totals]);

  const budgets = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const needsCategories = ['Rent', 'Groceries', 'Utilities', 'Transport', 'Healthcare', 'Education', 'Insurance', 'Fuel'];
    const wantsCategories = ['Dining', 'Entertainment', 'Shopping', 'Subscriptions', 'Personal Care', 'Gifts', 'Misc'];
    let spentNeeds = 0;
    let spentWants = 0;
    data.transactions.forEach(t => {
      try {
        if (t.type === 'expense' && isWithinInterval(parseISO(t.date), { start: monthStart, end: monthEnd })) {
          if (needsCategories.includes(t.category)) spentNeeds += Number(t.amount);
          else if (wantsCategories.includes(t.category)) spentWants += Number(t.amount);
          else spentNeeds += Number(t.amount);
        }
      } catch { }
    });
    const { income, expenses } = totals;
    const savedAmount = Math.max(0, income - expenses);
    const sugNeeds = Math.round(income * 0.5);
    const sugWants = Math.round(income * 0.3);
    const sugSavings = Math.round(income * 0.2);
    return {
      'Needs': { amount: data.budgets?.['Needs']?.amount || sugNeeds, spent: spentNeeds },
      'Wants': { amount: data.budgets?.['Wants']?.amount || sugWants, spent: spentWants },
      'Savings': { amount: data.budgets?.['Savings']?.amount || sugSavings, spent: savedAmount }
    };
  }, [data.transactions, data.budgets, totals]);

  const recurringExpenses = useMemo(() => {
    return data.transactions.filter(t => t.type === 'expense' && t.recurring !== 'none');
  }, [data.transactions]);

  const anomalies = useMemo(() => {
    const now = new Date();
    const thisMonth = data.transactions.filter(t => {
      try { return isSameMonth(parseISO(t.date), now); } catch { return false; }
    });
    const lastMonth = data.transactions.filter(t => {
      try { return isSameMonth(parseISO(t.date), subMonths(now, 1)); } catch { return false; }
    });
    const list = [];
    const categories = [...new Set(thisMonth.filter(t => t.type === 'expense').map(t => t.category))];
    categories.forEach(cat => {
      const thisAmt = thisMonth.filter(t => t.category === cat && t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
      const lastAmt = lastMonth.filter(t => t.category === cat && t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
      if (lastAmt > 0 && thisAmt > lastAmt * 1.5) {
        list.push({ category: cat, increase: Math.round(((thisAmt - lastAmt) / lastAmt) * 100), thisAmt, lastAmt });
      }
    });
    return list;
  }, [data.transactions]);

  const healthScore = useMemo(() => {
    if (totals.income === 0) return 0;
    const ratio = (totals.income - totals.expenses) / totals.income;
    return Math.max(0, Math.min(100, Math.round(ratio * 100)));
  }, [totals]);

  const aiInsights = useMemo(() => {
    const { expenses, income, balance, savingsRate } = totals;
    const recurringTotal = recurringExpenses.reduce((s, t) => s + Number(t.amount), 0);
    const insights = [];
    if (balance < 0) insights.push(`🔴 Alert: Your total balance is negative (${data.currency}${Math.abs(balance).toLocaleString()} deficit). Prioritize income or cut all non-essential spending.`);
    if (expenses > income * 0.9) insights.push(`🚨 Critical: You've spent ${Math.round((expenses / income) * 100)}% of income! Immediate action needed.`);
    else if (expenses > income * 0.7) insights.push(`⚠️ Spending at ${Math.round((expenses / income) * 100)}% of income. Keep it below 70% for a healthy buffer.`);
    if (spendingForecast.projected > income) insights.push(`📉 At current pace, you'll spend ₹${spendingForecast.projected.toLocaleString()} this month — exceeding your ₹${income.toLocaleString()} income!`);
    if (anomalies.length > 0) insights.push(`🔍 Anomaly: "${anomalies[0].category}" spending spiked by ${anomalies[0].increase}% vs last month.`);
    if (savingsRate >= 20) insights.push(`✅ Excellent! Saving ${savingsRate}% of income — above the recommended 20% benchmark.`);
    if (recurringTotal > income * 0.3) insights.push(`🔄 Recurring expenses are ₹${recurringTotal.toLocaleString()}/mo (${Math.round((recurringTotal / income) * 100)}% of income). Review your subscriptions.`);
    return insights;
  }, [totals, categoryBreakdown, spendingForecast, anomalies, recurringExpenses, data.currency]);

  // ─── STABLE CALLBACK API ──────────────────────────────────────────────
  const getTotals = useCallback(() => totals, [totals]);
  const getNetWorth = useCallback(() => netWorth, [netWorth]);
  const getMonthlyHistory = useCallback((months = 6) => monthlyHistory.slice(-months), [monthlyHistory]);
  const getCategoryBreakdown = useCallback(() => categoryBreakdown, [categoryBreakdown]);
  const getSpendingForecast = useCallback(() => spendingForecast, [spendingForecast]);
  const getBudgets = useCallback(() => budgets, [budgets]);
  const getRecurringExpenses = useCallback(() => recurringExpenses, [recurringExpenses]);
  const getAnomalies = useCallback(() => anomalies, [anomalies]);
  const getHealthScore = useCallback(() => healthScore, [healthScore]);
  const getAIInsights = useCallback(() => aiInsights, [aiInsights]);

  const askAI = useCallback((question) => {
    // Placeholder AI chat logic - can be expanded to use real LLM later
    return "I'm your Ledzo Finance AI. I see your current savings rate is " + totals.savingsRate + "%. Keep tracking to get more insights!";
  }, [totals]);

  return {
    data, loading,
    addTransaction, deleteTransaction, editTransaction,
    addGoal, deleteGoal, editGoal, depositToGoal, withdrawFromGoal,
    addAsset, deleteAsset, addLiability, deleteLiability,
    setBudget, addCategory, updateSettings,
    getTotals, getNetWorth, getMonthlyHistory, getCategoryBreakdown,
    getSpendingForecast, getRecurringExpenses, getAnomalies, getBudgets,
    getHealthScore, getAIInsights, askAI,
    importFromLocal,
    importJSON: (json) => { /* Logic to import data from JSON could be added back */ },
    resetData: () => { /* Logic to reset all user documents in Firestore */ }
  };
};
