"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Users, Gift, Share2, Award, Zap, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";
import { createReferral, getReferralInfo, ReferralInfo, useReferralCode } from "@/lib/supabase";

export default function ReferralWidget() {
  const [email, setEmail] = useState<string>("");
  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [simulatedInvites, setSimulatedInvites] = useState<number>(0);

  const rewards = [
    { target: 3, title: "Priority Beta Access", description: "Get invites to our private beta pool starting next week.", icon: Zap },
    { target: 10, title: "1-Year Premium Free", description: "Full subscription credited upon official launch.", icon: Gift },
    { target: 25, title: "Founding Member Badge", description: "Permanent profile badge and private founder channels.", icon: Award },
    { target: 50, title: "Lifetime Premium OS", description: "Unlimited access to all current and future modules.", icon: Award },
  ];

  // Try to load referral from localStorage if already registered
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user_referral_info");
      if (stored) {
        try {
          const info = JSON.parse(stored);
          setReferralInfo(info);
          setSimulatedInvites(info.count);
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const info = await createReferral(email.trim());
      setReferralInfo(info);
      setSimulatedInvites(info.count);
      if (typeof window !== "undefined") {
        localStorage.setItem("user_referral_info", JSON.stringify(info));
      }
      
      // Fire confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!referralInfo) return;
    const link = `${window.location.origin}?ref=${referralInfo.code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulate an invite increment for validation purposes
  const handleSimulateInvite = async () => {
    if (!referralInfo) return;
    try {
      const updated = await useReferralCode(referralInfo.code);
      if (updated) {
        setReferralInfo(updated);
        setSimulatedInvites(updated.count);
        localStorage.setItem("user_referral_info", JSON.stringify(updated));
        
        // Confetti burst on reaching a target milestone
        if (rewards.some(r => r.target === updated.count)) {
          confetti({
            particleCount: 150,
            spread: 80,
            colors: ['#8b5cf6', '#6366f1', '#10b981']
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const currentMaxTarget = rewards[rewards.length - 1].target;
  const progressPercentage = Math.min((simulatedInvites / currentMaxTarget) * 100, 100);

  return (
    <section id="referral" className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-white/5 bg-zinc-900/10 p-8 sm:p-12 backdrop-blur-md shadow-2xl relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute -top-12 -left-12 -z-10 h-48 w-48 rounded-full bg-brand-purple/5 blur-[80px]" />
        <div className="absolute -bottom-12 -right-12 -z-10 h-48 w-48 rounded-full bg-brand-cyan/5 blur-[80px]" />

        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald">
            <Gift className="h-5 w-5" />
          </div>
          <h2 className="font-sans text-3xl font-bold text-white tracking-tight sm:text-4xl">
            Aspirant Referral Program
          </h2>
          <p className="font-sans text-sm text-zinc-400">
            Invite your fellow UPSC aspirants to join. Share your unique link and unlock premium program rewards as they sign up.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!referralInfo ? (
            // State A: Email Registration
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="mt-10 max-w-md mx-auto"
            >
              <form onSubmit={handleRegister} className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email to generate link"
                  className="flex-1 rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-xs text-white placeholder-zinc-500 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-white px-5 py-3 text-xs font-semibold text-zinc-950 transition-all hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5" /> Get Referral Link
                    </>
                  )}
                </button>
              </form>
              {error && (
                <p className="mt-2 text-center text-[10px] text-brand-rose font-medium">
                  {error}
                </p>
              )}
            </motion.div>
          ) : (
            // State B: Generated Link and Progress tracking
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="mt-10 space-y-8"
            >
              {/* Copy Widget */}
              <div className="max-w-xl mx-auto rounded-2xl border border-white/10 bg-zinc-950 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Your Referral Link</span>
                  <span className="font-mono text-xs text-zinc-300 select-all truncate max-w-[280px] sm:max-w-xs mt-1">
                    {typeof window !== "undefined" ? `${window.location.origin}?ref=${referralInfo.code}` : `.../ref=${referralInfo.code}`}
                  </span>
                </div>
                
                <button
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto rounded-xl bg-brand-purple px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-brand-purple/95 active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy Link
                    </>
                  )}
                </button>
              </div>

              {/* Progress Milestones Bar */}
              <div className="space-y-4 max-w-2xl mx-auto">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-sans text-zinc-400 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-brand-purple" />
                    Invited: <strong className="text-white">{simulatedInvites}</strong>
                  </span>
                  <span className="font-sans text-zinc-500">Max Tier: 50 Invites</span>
                </div>

                {/* Progress bar line */}
                <div className="relative h-2 w-full rounded-full bg-zinc-850">
                  <motion.div
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-cyan"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.8 }}
                  />

                  {/* Marker points */}
                  {rewards.map((rew) => {
                    const pct = (rew.target / currentMaxTarget) * 100;
                    const isUnlocked = simulatedInvites >= rew.target;
                    return (
                      <div
                        key={rew.target}
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
                        style={{ left: `${pct}%` }}
                      >
                        <div
                          className={`h-3.5 w-3.5 rounded-full border-2 transition-all duration-300 ${
                            isUnlocked
                              ? "bg-brand-cyan border-brand-cyan scale-110 shadow-md shadow-brand-cyan/20"
                              : "bg-zinc-950 border-zinc-700"
                          }`}
                        />
                        <span className="mt-2.5 font-mono text-[9px] text-zinc-500 font-bold">
                          {rew.target}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Simulation tools for mock validation */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={handleSimulateInvite}
                  className="rounded-lg border border-white/5 bg-zinc-900/60 px-3 py-1.5 text-[10px] font-semibold text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <Zap className="h-3 w-3 text-brand-purple fill-brand-purple" /> Simulate 1 Successful Referral Sign-Up
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rewards grid cards */}
        <div className="mt-16 border-t border-white/5 pt-10">
          <h3 className="font-sans text-sm font-bold text-white text-center mb-8 uppercase tracking-widest text-zinc-400">
            Referral Tiers & Rewards
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewards.map((rew) => {
              const Icon = rew.icon;
              const isUnlocked = simulatedInvites >= rew.target;
              return (
                <div
                  key={rew.target}
                  className={`rounded-2xl border p-5 flex items-start space-x-4 transition-all duration-300 ${
                    isUnlocked
                      ? "border-brand-emerald/20 bg-brand-emerald/2"
                      : "border-white/5 bg-zinc-900/30"
                  }`}
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                    isUnlocked
                      ? "bg-brand-emerald/10 border-brand-emerald/20 text-brand-emerald"
                      : "bg-zinc-900 border-white/5 text-zinc-500"
                  }`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-sans text-xs font-bold text-white tracking-wide">
                        {rew.title}
                      </h4>
                      <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                        isUnlocked
                          ? "bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald"
                          : "bg-zinc-800 text-zinc-500"
                      }`}>
                        {rew.target} Invites
                      </span>
                    </div>
                    <p className="mt-1.5 font-sans text-[11px] text-zinc-400 leading-relaxed">
                      {rew.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
