import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, ArrowRight, Menu, X, Check, Shield,
  Zap, Users, BarChart3, Globe, Lock, ChevronDown,
  Play, Star, Wallet, ArrowDownLeft, ArrowUpRight,
  Copy, LineChart, Layers, Cpu, Sparkles, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase, authAPI } from "@/api/supabaseClient";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Live Ticker Data
const TICKERS = [
  { sym: "BTC", name: "Bitcoin", price: 97240, chg: 2.4, pos: true },
  { sym: "ETH", name: "Ethereum", price: 3842, chg: 1.8, pos: true },
  { sym: "SOL", name: "Solana", price: 198, chg: 5.2, pos: true },
  { sym: "BNB", name: "BNB", price: 624, chg: -0.9, pos: false },
  { sym: "AVAX", name: "Avalanche", price: 41.2, chg: 3.1, pos: true },
  { sym: "ADA", name: "Cardano", price: 0.82, chg: 1.5, pos: true },
  { sym: "MATIC", name: "Polygon", price: 1.02, chg: -1.2, pos: false },
  { sym: "LINK", name: "Chainlink", price: 18.4, chg: 4.2, pos: true },
];

const FEATURES = [
  {
    icon: Users,
    title: "Copy Elite Traders",
    desc: "Mirror top-performing traders automatically. Real positions, verified results, passive growth.",
    stat: "3,200+",
    statLabel: "Verified Traders"
  },
  {
    icon: LineChart,
    title: "AI-Powered Analytics",
    desc: "Machine learning analyzes 1000+ signals to surface high-probability trading opportunities.",
    stat: "99.2%",
    statLabel: "Accuracy Rate"
  },
  {
    icon: Zap,
    title: "Lightning Execution",
    desc: "Sub-millisecond order execution across 50+ blockchains. Zero lag, minimal slippage.",
    stat: "<50ms",
    statLabel: "Avg Execution"
  },
  {
    icon: Shield,
    title: "Military-Grade Security",
    desc: "Cold storage, 2FA, biometric auth, and comprehensive insurance coverage for peace of mind.",
    stat: "$250M",
    statLabel: "Insured Assets"
  },
  {
    icon: Globe,
    title: "Multi-Chain Universe",
    desc: "One dashboard. Every chain. Ethereum, Solana, BSC, Polygon, Avalanche, and 45+ more.",
    stat: "50+",
    statLabel: "Blockchains"
  },
  {
    icon: Lock,
    title: "Regulatory Compliance",
    desc: "Fully licensed, KYC/AML compliant. Operate with confidence in 150+ jurisdictions.",
    stat: "150+",
    statLabel: "Countries"
  },
];

const STATS = [
  { label: "Active Traders", value: "127K+", sub: "Across 150+ countries" },
  { label: "Volume Traded", value: "$4.8B", sub: "Past 30 days" },
  { label: "Copy Traders", value: "3,200+", sub: "Verified performers" },
  { label: "Platform Uptime", value: "99.98%", sub: "Guaranteed SLA" },
];

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    desc: "Perfect for exploring crypto trading",
    features: ["Up to $10,000 portfolio", "5 copy traders", "Basic analytics", "Email support", "Standard execution"],
    cta: "Start Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    per: "/mo",
    desc: "For serious traders scaling up",
    features: ["Unlimited portfolio", "50 copy traders", "AI analytics suite", "Priority support", "Advanced charts", "API access"],
    cta: "Start Pro Trial",
    highlight: true,
  },
  {
    name: "Elite",
    price: "$99",
    per: "/mo",
    desc: "For institutions & professionals",
    features: ["Everything in Pro", "Unlimited copy traders", "Custom strategies", "Dedicated manager", "White-label options", "SLA guarantee"],
    cta: "Contact Sales",
    highlight: false,
  },
];

const STEPS = [
  {
    num: "01",
    title: "Create Your Account",
    desc: "Sign up in under 60 seconds. Quick verification, secure setup, and you're ready to trade.",
    icon: Users,
  },
  {
    num: "02",
    title: "Fund Your Wallet",
    desc: "Deposit crypto or fiat instantly. Support for 40+ payment methods with zero fees on first deposit.",
    icon: Wallet,
  },
  {
    num: "03",
    title: "Trade & Copy",
    desc: "Browse top traders, one-click copy, or trade manually. Your portfolio, your strategy.",
    icon: TrendingUp,
  },
];

// Ticker Bar Component
function TickerBar() {
  return (
    <div className="border-y border-primary/10 bg-primary/[0.02] overflow-hidden py-3">
      <div className="flex gap-12 animate-[ticker_40s_linear_infinite]" style={{ width: "max-content" }}>
        {[...TICKERS, ...TICKERS, ...TICKERS].map((t, i) => (
          <div key={i} className="flex items-center gap-3 whitespace-nowrap">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-[9px] font-black text-primary">{t.sym.slice(0, 2)}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-foreground">{t.sym}</span>
              <span className="text-xs text-muted-foreground ml-1.5">${t.price.toLocaleString()}</span>
            </div>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${t.pos ? "text-primary bg-primary/10" : "text-destructive bg-destructive/10"}`}>
              {t.pos ? "+" : ""}{t.chg}%
            </span>
            <span className="text-primary/20 text-lg">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Hero Dashboard Mockup
function HeroDashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto max-w-5xl mt-16 lg:mt-20"
    >
      {/* Glow effects */}
      <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 via-emerald-500/15 to-primary/20 rounded-[3rem] blur-3xl opacity-60" />
      <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl" />
      
      {/* Main dashboard card */}
      <div className="relative rounded-2xl lg:rounded-3xl border border-primary/20 bg-card/90 backdrop-blur-xl overflow-hidden shadow-2xl shadow-primary/10">
        {/* Browser bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-background/50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-primary/70" />
          </div>
          <div className="flex-1 mx-4 h-7 rounded-lg bg-secondary/50 flex items-center px-3">
            <Lock className="w-3 h-3 text-primary/50 mr-2" />
            <span className="text-[11px] text-muted-foreground font-medium">app.salarn.io/dashboard</span>
          </div>
        </div>
        
        {/* Dashboard content */}
        <div className="p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main balance card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-primary/10 via-emerald-500/5 to-transparent border border-primary/10 rounded-2xl p-5 lg:p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1 font-medium">Total Portfolio Value</div>
                <div className="text-3xl lg:text-4xl font-black tabular-nums text-foreground">
                  $284,592<span className="text-xl lg:text-2xl text-muted-foreground">.38</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <TrendingUp className="w-3.5 h-3.5 text-primary" />
                <span className="text-sm font-bold text-primary">+12.7%</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs mb-5">
              <span className="text-primary font-semibold">+$32,140 this month</span>
              <span className="text-muted-foreground">Updated just now</span>
            </div>
            {/* Mini chart bars */}
            <div className="h-20 lg:h-24 flex items-end gap-1">
              {[40, 55, 45, 70, 65, 85, 75, 95, 88, 100, 92, 110, 105, 115].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/60 via-primary/40 to-primary/20 transition-all hover:from-primary/80 hover:via-primary/60 hover:to-primary/40"
                  style={{ height: `${h * 0.8}%` }}
                />
              ))}
            </div>
          </div>
          
          {/* Holdings sidebar */}
          <div className="space-y-3">
            {[
              { sym: "BTC", name: "Bitcoin", val: "$142,340", chg: "+8.2%", pos: true },
              { sym: "ETH", name: "Ethereum", val: "$83,120", chg: "+4.1%", pos: true },
              { sym: "SOL", name: "Solana", val: "$31,890", chg: "-1.4%", pos: false },
            ].map(c => (
              <div key={c.sym} className="bg-secondary/50 border border-border rounded-xl p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-[10px] font-black text-primary">{c.sym.slice(0, 2)}</span>
                    </div>
                    <span className="text-sm font-bold">{c.sym}</span>
                  </div>
                  <span className={`text-xs font-bold ${c.pos ? "text-primary" : "text-destructive"}`}>{c.chg}</span>
                </div>
                <div className="text-sm font-mono font-semibold text-foreground">{c.val}</div>
              </div>
            ))}
          </div>
          
          {/* Stats row */}
          {[
            { label: "Active Copies", val: "12", icon: Users },
            { label: "Win Rate", val: "78%", icon: BarChart3 },
            { label: "Open P&L", val: "+$4.2K", icon: TrendingUp },
          ].map(s => (
            <div key={s.label} className="bg-secondary/30 border border-border rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className="text-sm font-bold text-foreground">{s.val}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Auth Modal Component
function AuthModal({ isOpen, onClose, mode, setMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (mode === "login") {
        const { error } = await authAPI.login(email, password);
        if (error) throw new Error(error);
        toast.success("Welcome back!");
        onClose();
      } else {
        const { error } = await authAPI.register(email, password, { full_name: fullName });
        if (error) throw new Error(error);
        
        // Create user profile in database
        await supabase.from('users').insert([{
          email,
          full_name: fullName,
          role: 'user',
          status: 'active'
        }]);
        
        // Create initial balance
        await supabase.from('user_balances').insert([{
          user_email: email,
          balance_usd: 0,
          total_invested: 0,
          total_profit_loss: 0
        }]);
        
        toast.success("Account created! Please check your email to verify.");
        onClose();
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-black mb-1">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {mode === "login" ? "Log in to your Salarn account" : "Start your trading journey today"}
            </p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Full Name</label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="bg-secondary border-border"
                />
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-secondary border-border"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="bg-secondary border-border"
              />
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/30"
            >
              {loading ? "Please wait..." : mode === "login" ? "Log In" : "Create Account"}
            </Button>
          </form>
          
          {/* Toggle mode */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-primary font-semibold hover:underline"
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Feature Card Component
function FeatureCard({ feature, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 overflow-hidden"
    >
      {/* Hover glow effect */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary opacity-0 group-hover:opacity-5 blur-3xl transition-opacity duration-500" />
      
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-500/10 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/10">
          <feature.icon className="w-6 h-6 text-primary" />
        </div>
        <div className="text-right">
          <div className="text-lg font-black text-primary">{feature.stat}</div>
          <div className="text-[10px] text-muted-foreground font-medium">{feature.statLabel}</div>
        </div>
      </div>
      <h3 className="text-lg font-bold mb-2 text-foreground">{feature.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
    </motion.div>
  );
}

// Main Landing Component
export default function Landing() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const openAuth = (mode) => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <style>{`
        @keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-33.333%) } }
        @keyframes float { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.5 } 50% { opacity: 1 } }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between bg-card/80 backdrop-blur-2xl border border-border rounded-2xl px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-primary/30">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-black text-xl bg-gradient-to-r from-primary via-emerald-400 to-teal-400 bg-clip-text text-transparent tracking-tight">
                SALARN
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-1">
              {[["Features", "#features"], ["How it Works", "#how-it-works"], ["Pricing", "#pricing"]].map(([item, href]) => (
                <a
                  key={item}
                  href={href}
                  className="text-sm px-4 py-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-secondary transition-all"
                >
                  {item}
                </a>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuth("login")}
                className="hidden md:block text-sm text-muted-foreground hover:text-foreground px-4 py-2 transition-colors"
              >
                Log in
              </button>
              <button
                onClick={() => openAuth("register")}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-emerald-500 text-primary-foreground text-sm font-bold hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all"
              >
                Get Started
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl bg-secondary"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 bg-card/95 backdrop-blur-2xl border border-border rounded-2xl p-4 space-y-1"
              >
                {[["Features", "#features"], ["How it Works", "#how-it-works"], ["Pricing", "#pricing"]].map(([item, href]) => (
                  <a
                    key={item}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm px-4 py-3 text-muted-foreground hover:text-foreground rounded-xl hover:bg-secondary transition-all"
                  >
                    {item}
                  </a>
                ))}
                <div className="border-t border-border pt-3 mt-3 flex flex-col gap-2">
                  <button
                    onClick={() => { openAuth("login"); setMobileOpen(false); }}
                    className="block text-center text-sm px-4 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => { openAuth("register"); setMobileOpen(false); }}
                    className="block text-center text-sm px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-emerald-500 text-primary-foreground font-bold"
                  >
                    Get Started Free
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col pt-28">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[150px] animate-[pulse-glow_4s_ease-in-out_infinite]" />
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-emerald-500/6 rounded-full blur-[120px] animate-[pulse-glow_6s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/4 left-1/2 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[100px] animate-[pulse-glow_5s_ease-in-out_infinite]" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative flex-1 flex flex-col justify-center px-6 text-center">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 text-sm">
                <span className="relative w-2 h-2">
                  <span className="absolute inset-0 rounded-full bg-primary animate-ping" />
                  <span className="absolute inset-0 rounded-full bg-primary" />
                </span>
                <span className="text-primary font-semibold">Now live in 150+ countries</span>
                <ArrowRight className="w-3.5 h-3.5 text-primary" />
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.9] tracking-tight">
                Trade Crypto
                <br />
                <span className="bg-gradient-to-r from-primary via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Like a Pro
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Copy elite traders, access 50+ blockchains, and grow your portfolio with
                AI-powered signals — all from one sleek, secure dashboard.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => openAuth("register")}
                  className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-emerald-500 text-primary-foreground font-bold text-sm hover:shadow-2xl hover:shadow-primary/40 hover:scale-105 transition-all"
                >
                  Start Trading Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="flex items-center gap-2 px-8 py-4 rounded-xl bg-secondary border border-border hover:bg-secondary/80 text-foreground font-semibold text-sm transition-all">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-emerald-500 flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 fill-primary-foreground text-primary-foreground ml-0.5" />
                  </div>
                  Watch Demo
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-6 mt-10 flex-wrap">
                {["SOC 2 Type II", "256-bit SSL", "$250M Insured"].map(item => (
                  <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Dashboard mockup */}
          <div className="px-4">
            <HeroDashboardMockup />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center pb-8 mt-8">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-muted-foreground/40"
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </div>
      </section>

      {/* Ticker Bar */}
      <TickerBar />

      {/* Stats Section */}
      <section className="py-20 lg:py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all"
            >
              <div className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-foreground mb-1">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-[0.2em] mb-4">
              <span className="w-6 h-px bg-primary/50" />
              Why Salarn
              <span className="w-6 h-px bg-primary/50" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight">
              Built for the{" "}
              <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                Serious Trader
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Every tool you need to trade with confidence. Nothing you don&apos;t.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature, i) => (
              <FeatureCard key={feature.title} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 lg:py-24 px-6 bg-gradient-to-b from-card/50 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-[0.2em] mb-4">
              <span className="w-6 h-px bg-emerald-400/50" />
              Simple Process
              <span className="w-6 h-px bg-emerald-400/50" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
              Up and running in{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-primary bg-clip-text text-transparent">
                3 steps
              </span>
            </h2>
          </div>
          <div className="space-y-4">
            {STEPS.map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex items-start gap-6 p-6 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg shadow-primary/20">
                  <item.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-primary/60 font-mono">{item.num}</span>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-[0.2em] mb-4">
              <span className="w-6 h-px bg-teal-400/50" />
              Transparent Pricing
              <span className="w-6 h-px bg-teal-400/50" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
              Plans that{" "}
              <span className="bg-gradient-to-r from-teal-400 to-primary bg-clip-text text-transparent">
                scale with you
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-6 rounded-2xl border transition-all ${
                  plan.highlight
                    ? "bg-gradient-to-b from-primary/10 to-emerald-500/5 border-primary/30 shadow-lg shadow-primary/10"
                    : "bg-card border-border hover:border-primary/20"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-emerald-500 text-xs font-bold text-primary-foreground whitespace-nowrap shadow-lg">
                    Most Popular
                  </div>
                )}
                <div className="mb-5">
                  <div className="text-sm font-bold text-muted-foreground mb-1">{plan.name}</div>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-4xl font-black">{plan.price}</span>
                    {plan.per && <span className="text-muted-foreground mb-1">{plan.per}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.desc}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openAuth("register")}
                  className={`block w-full text-center py-3 rounded-xl text-sm font-bold transition-all ${
                    plan.highlight
                      ? "bg-gradient-to-r from-primary to-emerald-500 text-primary-foreground hover:shadow-lg hover:shadow-primary/30 hover:scale-105"
                      : "bg-secondary border border-border text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-24 px-6 bg-gradient-to-b from-card/50 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-3">
              Traders love <span className="text-primary">Salarn</span>
            </h2>
            <p className="text-muted-foreground">Join 127,000+ traders already growing their portfolio</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "Alex K.",
                role: "Day Trader, NYC",
                rating: 5,
                text: "I was skeptical at first, but the copy trading feature is genuinely amazing. Up 82% in 3 months just following two traders.",
              },
              {
                name: "Sarah M.",
                role: "Portfolio Manager, London",
                rating: 5,
                text: "The analytics tools are on par with institutional platforms. Finally a platform that takes retail traders seriously.",
              },
              {
                name: "Raj P.",
                role: "Crypto Investor, Singapore",
                rating: 5,
                text: "Multi-chain support is seamless. I manage positions across 8 blockchains from one dashboard. Incredible experience.",
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array(t.rating)
                    .fill(0)
                    .map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">&quot;{t.text}&quot;</p>
                <div>
                  <div className="text-sm font-bold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-10 md:p-14 rounded-3xl overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-emerald-500/5 to-teal-500/10 border border-primary/20 rounded-3xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-emerald-500/10 blur-3xl" />
            
            <div className="relative">
              <div className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-5">
                Start Today
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-5 leading-tight">
                Ready to{" "}
                <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                  dominate
                </span>
                ?
              </h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto">
                Join 127,000+ traders who chose Salarn. Free forever — no credit card required.
              </p>
              <button
                onClick={() => openAuth("register")}
                className="group inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-primary to-emerald-500 text-primary-foreground font-bold hover:shadow-2xl hover:shadow-primary/40 hover:scale-105 transition-all"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-black text-lg bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                  SALARN
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                Professional crypto trading platform trusted by 127,000+ traders worldwide.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
              {[
                { title: "Product", links: ["Features", "Pricing", "Copy Trading", "Analytics"] },
                { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
                { title: "Legal", links: ["Privacy", "Terms", "Security", "Compliance"] },
              ].map(col => (
                <div key={col.title}>
                  <div className="font-bold text-foreground mb-3 text-xs uppercase tracking-wider">
                    {col.title}
                  </div>
                  <ul className="space-y-2">
                    {col.links.map(l => (
                      <li key={l}>
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                          {l}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Salarn Technologies Inc. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Trading involves risk. Not financial advice.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        mode={authMode}
        setMode={setAuthMode}
      />
    </div>
  );
}
