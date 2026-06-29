"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Shield, Mail, Calendar, Compass, Loader2, Check, Users } from "lucide-react";
import confetti from "canvas-confetti";
import { joinWaitlist, getWaitlistCount } from "@/lib/supabase";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newCount: number) => void;
}

export default function WaitlistModal({ isOpen, onClose, onSuccess }: WaitlistModalProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [targetYear, setTargetYear] = useState<string>("2027");
  const [optionalSubject, setOptionalSubject] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [waitlistCount, setWaitlistCount] = useState<number>(1240);

  // Load count
  useEffect(() => {
    async function loadCount() {
      try {
        const count = await getWaitlistCount();
        setWaitlistCount(count);
      } catch (err) {
        console.error(err);
      }
    }
    if (isOpen) {
      loadCount();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setLoading(true);
    try {
      const updatedCount = await joinWaitlist(
        name.trim(),
        email.trim(),
        targetYear,
        optionalSubject.trim()
      );
      setWaitlistCount(updatedCount);
      if (onSuccess) {
        onSuccess(updatedCount);
      }
      
      setSuccess(true);
      
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#8b5cf6", "#6366f1", "#06b6d4"]
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/85 p-4 backdrop-blur-md"
        >
          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/90 p-8 shadow-2xl backdrop-blur-xl"
          >
            {/* Background glow */}
            <div className="absolute -top-12 -right-12 -z-10 h-32 w-32 rounded-full bg-brand-purple/20 blur-[50px]" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full bg-zinc-950 border border-white/5 p-1.5 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {!success ? (
              // Waitlist Signup Form
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-purple/15 border border-brand-purple/20 text-brand-purple">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="font-sans text-xl font-bold text-white tracking-tight sm:text-2xl">
                    Join Priority Launch Waitlist
                  </h3>
                  <p className="font-sans text-xs text-zinc-400">
                    Secure locked-in subscription pricing post-launch. Compared with other market products, ours is the complete, full package.
                  </p>
                </div>

                {/* Info Bar: locked price and waiting slots */}
                <div className="rounded-2xl border border-white/5 bg-zinc-950 p-4 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-sans text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Locked Subscription Rate</span>
                    <strong className="text-white text-base">₹1699<span className="text-zinc-500 font-normal text-[10px]">/year</span></strong>
                    <span className="block text-[8px] text-zinc-500">Standard Post-Launch: ₹4,999/yr</span>
                  </div>
                  <div className="text-right flex flex-col justify-center">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-end gap-1">
                      <Users className="h-3 w-3 text-brand-purple" /> Waitlist Size
                    </span>
                    <strong className="text-brand-purple text-base mt-0.5">{waitlistCount.toLocaleString()} <span className="text-[10px] text-zinc-500 font-normal">Aspirants</span></strong>
                  </div>
                </div>

                {/* Input Fields */}
                <div className="space-y-3 text-left">
                  {/* Name */}
                  <div>
                    <label htmlFor="waitlist-name" className="block font-sans text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="waitlist-name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Kumar"
                      className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-655 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="waitlist-email" className="block font-sans text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="waitlist-email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-655 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple"
                    />
                  </div>

                  {/* Target and Optional */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="waitlist-year" className="block font-sans text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
                        Target UPSC Year
                      </label>
                      <select
                        id="waitlist-year"
                        value={targetYear}
                        onChange={(e) => setTargetYear(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-white focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple"
                      >
                        <option value="2027">2027 Aspirant</option>
                        <option value="2028">2028 Aspirant</option>
                        <option value="2026">2026 Veteran</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="waitlist-optional" className="block font-sans text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
                        Optional Subject
                      </label>
                      <input
                        type="text"
                        id="waitlist-optional"
                        value={optionalSubject}
                        onChange={(e) => setOptionalSubject(e.target.value)}
                        placeholder="e.g. PSIR / History"
                        className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-white placeholder-zinc-655 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple"
                      />
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo px-4 text-xs font-bold text-white transition-all hover:from-brand-purple/95 hover:to-brand-indigo/95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 shadow-lg shadow-brand-purple/10"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Registering...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4" /> Secure My Waitlist Spot
                    </>
                  )}
                </button>

                <p className="text-[10px] text-zinc-500 text-center font-sans leading-relaxed">
                  *Your subscription rate is locked in at ₹1699/year. New AI-powered features will be delivered every 2 months (advanced AI modules require separate add-on charges to unlock).
                </p>
              </form>
            ) : (
              // Waitlist Success state
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-6"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald">
                  <Check className="h-8 w-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-sans text-2xl font-bold text-white">Registered Successfully!</h3>
                  <p className="font-sans text-xs text-zinc-400 max-w-sm mx-auto">
                    Thank you! We have logged your waitlist spot. Early beta links and news updates will be sent to <strong>{email}</strong>.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-zinc-950 p-4 space-y-2.5 text-left text-[11px] max-w-sm mx-auto">
                  <div className="flex items-center space-x-2 text-zinc-300">
                    <Mail className="h-3.5 w-3.5 text-brand-purple" />
                    <span>Waitlist Status: <strong className="text-brand-emerald">Verified Position</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 text-zinc-300">
                    <Calendar className="h-3.5 w-3.5 text-brand-purple" />
                    <span>Locked-in Price: <strong className="text-white">₹1699/year subscription</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 text-zinc-300">
                    <Compass className="h-3.5 w-3.5 text-brand-purple" />
                    <span>Beta Group: <strong className="text-white">Cohort #2 Access</strong></span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="rounded-xl border border-white/10 bg-zinc-900 px-6 py-2.5 text-xs font-semibold text-white transition-all hover:bg-zinc-800"
                >
                  Return to Roadmap
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
