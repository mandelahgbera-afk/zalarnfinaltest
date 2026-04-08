import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Plus, Edit3, Trash2, Save, X, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/api/dbClient";
import PageHeader from "@/components/ui/PageHeader";
import { toast } from "sonner";

const EMPTY_TRADER = {
  trader_name: "", win_rate: "", total_profit_pct: "", total_trades: "",
  specialty: "", risk_level: "medium", avatar_color: "#6366f1", is_approved: true,
};

export default function ManageTraders() {
  const { user } = useOutletContext();
  const [traders, setTraders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_TRADER);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const data = await db.entities.CopyTrader.list("-created_at", 100);
    setTraders(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!form.trader_name?.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    await db.entities.CopyTrader.create({
      ...form,
      win_rate: parseFloat(form.win_rate) || 0,
      total_profit_pct: parseFloat(form.total_profit_pct) || 0,
      total_trades: parseInt(form.total_trades) || 0,
    });
    toast.success("Trader added");
    setForm(EMPTY_TRADER);
    setShowAdd(false);
    setSaving(false);
    load();
  };

  const handleUpdate = async () => {
    if (!form.trader_name?.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    await db.entities.CopyTrader.update(editingId, {
      ...form,
      win_rate: parseFloat(form.win_rate) || 0,
      total_profit_pct: parseFloat(form.total_profit_pct) || 0,
      total_trades: parseInt(form.total_trades) || 0,
    });
    toast.success("Trader updated");
    setEditingId(null);
    setForm(EMPTY_TRADER);
    setSaving(false);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this trader?")) return;
    await db.entities.CopyTrader.delete(id);
    toast.success("Trader deleted");
    load();
  };

  const handleToggleActive = async (trader) => {
    await db.entities.CopyTrader.update(trader.id, { is_approved: !trader.is_approved });
    toast.success(trader.is_approved ? "Trader deactivated" : "Trader activated");
    load();
  };

  const startEdit = (trader) => {
    setEditingId(trader.id);
    setShowAdd(false);
    setForm({
      trader_name: trader.trader_name || "",
      win_rate: trader.win_rate?.toString() || "",
      total_profit_pct: trader.total_profit_pct?.toString() || "",
      total_trades: trader.total_trades?.toString() || "",
      specialty: trader.specialty || "",
      risk_level: trader.risk_level || "medium",
      avatar_color: trader.avatar_color || "#6366f1",
      is_approved: trader.is_approved ?? true,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowAdd(false);
    setForm(EMPTY_TRADER);
  };

  const RISK_COLORS = { low: "text-up", medium: "text-yellow-400", high: "text-down" };

  return (
    <div className="space-y-6">
      <PageHeader user={user} title="Copy Traders" subtitle={`${traders.length} traders configured`} />

      <div className="flex gap-3">
        <Button onClick={() => { setShowAdd(true); setEditingId(null); setForm(EMPTY_TRADER); }}
          className="gradient-green text-white font-semibold glow-green-sm">
          <Plus className="w-4 h-4 mr-2" /> Add Trader
        </Button>
      </div>

      {(showAdd || editingId) && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold">{editingId ? "Edit Trader" : "Add New Trader"}</p>
            <button onClick={cancelEdit}><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Name *</label>
              <Input value={form.trader_name} onChange={e => setForm(p => ({ ...p, trader_name: e.target.value }))}
                className="bg-secondary border-border" placeholder="Trader name" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Win Rate (%)</label>
              <Input type="number" value={form.win_rate} onChange={e => setForm(p => ({ ...p, win_rate: e.target.value }))}
                className="bg-secondary border-border" placeholder="85.5" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Total Profit (%)</label>
              <Input type="number" value={form.total_profit_pct} onChange={e => setForm(p => ({ ...p, total_profit_pct: e.target.value }))}
                className="bg-secondary border-border" placeholder="182.4" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Total Trades</label>
              <Input type="number" value={form.total_trades} onChange={e => setForm(p => ({ ...p, total_trades: e.target.value }))}
                className="bg-secondary border-border" placeholder="1200" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Specialty</label>
              <Input value={form.specialty} onChange={e => setForm(p => ({ ...p, specialty: e.target.value }))}
                className="bg-secondary border-border" placeholder="DeFi, Swing Trading, etc." />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Risk Level</label>
              <select value={form.risk_level} onChange={e => setForm(p => ({ ...p, risk_level: e.target.value }))}
                className="w-full h-9 bg-secondary border border-border rounded-md px-3 text-sm">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="text-xs text-muted-foreground mb-1.5 block">Avatar Color</label>
              <Input value={form.avatar_color} onChange={e => setForm(p => ({ ...p, avatar_color: e.target.value }))}
                className="bg-secondary border-border" placeholder="#6366f1" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={editingId ? handleUpdate : handleAdd} disabled={saving}
              className="gradient-green text-white font-semibold">
              <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : (editingId ? "Update" : "Add")}
            </Button>
            <Button variant="outline" onClick={cancelEdit} className="border-border">Cancel</Button>
          </div>
        </motion.div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-6 lg:grid-cols-8 gap-4 px-5 py-3 border-b border-border text-xs text-muted-foreground font-medium uppercase tracking-wider">
          <span className="col-span-2">Trader</span>
          <span className="text-center">Win Rate</span>
          <span className="text-right">Profit</span>
          <span className="hidden lg:block text-center">Risk</span>
          <span className="hidden lg:block text-center">Trades</span>
          <span className="text-center">Status</span>
          <span className="text-right">Actions</span>
        </div>
        {loading ? (
          <div className="space-y-px">{[1,2,3].map(i => <div key={i} className="h-16 bg-secondary/30 animate-pulse" />)}</div>
        ) : traders.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">No traders configured yet</div>
        ) : (
          <div className="divide-y divide-border/50">
            {traders.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="grid grid-cols-6 lg:grid-cols-8 gap-4 px-5 py-4 hover:bg-secondary/30 transition-colors items-center">
                <div className="col-span-2 flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{t.trader_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{t.specialty || "No specialty"}</p>
                  </div>
                </div>
                <div className="text-center text-sm font-mono font-semibold text-up">{t.win_rate?.toFixed(1)}%</div>
                <div className="text-right text-sm font-mono font-bold">{t.total_profit_pct?.toFixed(1)}%</div>
                <div className="hidden lg:flex justify-center">
                  <span className={`text-xs font-semibold capitalize ${RISK_COLORS[t.risk_level] || ""}`}>{t.risk_level}</span>
                </div>
                <div className="hidden lg:block text-center text-sm font-mono text-muted-foreground">{t.total_trades}</div>
                <div className="flex justify-center">
                  <button onClick={() => handleToggleActive(t)} title={t.is_approved ? "Deactivate" : "Activate"}>
                    {t.is_approved
                      ? <ToggleRight className="w-6 h-6 text-up" />
                      : <ToggleLeft className="w-6 h-6 text-muted-foreground" />}
                  </button>
                </div>
                <div className="flex gap-1.5 justify-end">
                  <Button size="sm" variant="outline" onClick={() => startEdit(t)}
                    className="h-7 w-7 p-0 border-border text-muted-foreground hover:text-foreground">
                    <Edit3 className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(t.id)}
                    className="h-7 w-7 p-0 border-destructive/40 text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
