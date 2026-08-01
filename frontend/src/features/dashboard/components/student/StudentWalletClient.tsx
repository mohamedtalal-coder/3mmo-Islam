"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/src/lib/api";
import { toast } from "sonner";
import { Wallet, Plus, ArrowUpRight, ArrowDownRight, Clock, Loader2 } from "lucide-react";
import { Button } from "@/src/shared/components/ui/Button";

type Transaction = {
  id: string;
  amount: number;
  type: "CHARGE" | "PURCHASE" | "REFUND";
  description: string;
  createdAt: string;
};

export function StudentWalletClient() {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [chargeAmount, setChargeAmount] = useState("");
  const [isCharging, setIsCharging] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  async function fetchWalletData() {
    try {
      const data = await fetchApi("/student/wallet/history");
      setBalance(data.balance);
      setTransactions(data.transactions);
    } catch (e: any) {
      toast.error("فشل في تحميل المحفظة");
    } finally {
      setLoading(false);
    }
  }

  async function handleCharge(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number(chargeAmount);
    if (!amount || amount <= 0) return toast.error("أدخل مبلغ صحيح");

    setIsCharging(true);
    const toastId = toast.loading("جاري شحن المحفظة (محاكاة)...");

    try {
      const data = await fetchApi("/student/wallet/charge", {
        method: "POST",
        body: JSON.stringify({ amount })
      });
      setBalance(data.balance);
      setChargeAmount("");
      toast.success("تم شحن المحفظة بنجاح!", { id: toastId });
      fetchWalletData();
    } catch (e: any) {
      toast.error(e.message || "فشل الشحن", { id: toastId });
    } finally {
      setIsCharging(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-br from-primary to-accent text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
              <Wallet size={32} className="text-white" />
            </div>
            <div>
              <p className="text-white/80 font-ui text-sm mb-1">الرصيد المتاح</p>
              <h2 className="font-display text-4xl">{balance} <span className="text-2xl opacity-80">ج.م</span></h2>
            </div>
          </div>
          
          <form onSubmit={handleCharge} className="flex flex-col sm:flex-row items-center gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-sm w-full md:w-auto">
            <input 
              type="number"
              min="1"
              value={chargeAmount}
              onChange={(e) => setChargeAmount(e.target.value)}
              placeholder="المبلغ (ج.م)"
              className="bg-white/20 border-none text-white placeholder:text-white/50 rounded-xl px-4 py-2 w-full sm:w-32 focus:ring-2 focus:ring-white/50"
              required
            />
            <Button 
              type="submit"
              variant="outline"
              isLoading={isCharging}
              className="w-full sm:w-auto bg-white text-primary border-none hover:bg-white/90"
              leftIcon={<Plus size={18} />}
            >
              شحن الرصيد
            </Button>
          </form>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-surface border border-primary/5 rounded-[24px] shadow-sm p-6 md:p-8">
        <h3 className="font-display text-2xl text-primary mb-6 flex items-center gap-2">
          <Clock size={24} className="text-accent" />
          سجل المعاملات
        </h3>

        {transactions.length === 0 ? (
          <div className="text-center py-12 text-muted font-ui bg-background/50 rounded-2xl border border-dashed border-primary/20">
            لا توجد معاملات سابقة
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-background rounded-xl border border-primary/5 hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    tx.type === 'CHARGE' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                  }`}>
                    {tx.type === 'CHARGE' ? <ArrowDownRight size={24} /> : <ArrowUpRight size={24} />}
                  </div>
                  <div>
                    <p className="font-body text-primary font-medium">{tx.description}</p>
                    <p className="font-ui text-xs text-muted mt-1">
                      {new Date(tx.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className={`font-display text-lg ${tx.type === 'CHARGE' ? 'text-success' : 'text-danger'}`}>
                  {tx.type === 'CHARGE' ? '+' : '-'}{tx.amount} ج.م
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
