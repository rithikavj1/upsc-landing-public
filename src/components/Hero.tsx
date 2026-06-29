"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Rocket, Sparkles, Star, Users, CheckCircle2 } from "lucide-react";
import { getWaitlistCount } from "@/lib/supabase";

interface HeroProps {
  onWatchDemoClick: () => void;
  onJoinClick: () => void;
}

export default function Hero({ onWatchDemoClick, onJoinClick }: HeroProps) {
  const [count, setCount] = useState<number>(250);

  useEffect(() => {
    async function loadCount() {
      try {
        const c = await getWaitlistCount();
        setCount(c);
      } catch (err) {
        // ignore
      }
    }
    loadCount();
  }, []);

  return (
    <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 text-center sm:px-6 sm:pt-24 lg:px-8">
      {/* Glow highlight */}
      <div className="absolute top-0 left-1/2 -z-10 h-72 w-full max-w-lg -translate-x-1/2 rounded-full bg-brand-purple/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        {/* Top Feature Pill */}
        <div className="mb-6 inline-flex items-center space-x-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-brand-purple animate-pulse" />
          <span className="font-sans text-[11px] font-semibold tracking-wider uppercase text-zinc-300">
            India's First AI-Powered UPSC Operating System
          </span>
        </div>

        {/* Headline */}
        <h1 className="max-w-4xl font-sans text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
          Built by an Aspirant.
          <br />
          <span className="bg-gradient-to-r from-brand-purple via-brand-indigo to-brand-cyan gradient-text">
            Designed for Every Aspirant.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 max-w-2xl font-sans text-base text-zinc-400 sm:text-lg lg:text-xl leading-relaxed">
          We've built India's first AI-powered UPSC Operating System. Before
          launching it publicly, we're inviting the UPSC community to help shape
          the final product.
        </p>

        {/* Value Proposition Badge */}
        <div className="mt-6 inline-flex items-center gap-1.5 rounded-xl border border-brand-purple/15 bg-brand-purple/5 px-3 py-1.5 text-xs text-brand-purple font-medium">
          <CheckCircle2 className="h-4 w-4" />
          <span>Compared with other market products, ours is the complete, full package.</span>
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <button
            onClick={onWatchDemoClick}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-shadow bg-zinc-900/60 px-6 font-sans text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:bg-zinc-800 hover:border-white/20 active:scale-[0.98]"
          >
            <Play className="h-4 w-4 fill-white text-white" /> Watch Product Demo
          </button>
          
          <button
            onClick={onJoinClick}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo px-6 font-sans text-sm font-semibold text-white transition-all duration-200 hover:from-brand-purple/95 hover:to-brand-indigo/95 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand-purple/20"
          >
            <Rocket className="h-4 w-4 text-white" /> Join Priority Launch Waitlist
          </button>
        </div>

        {/* Supporting Stats/Metadata Row */}
        <div className="mt-12 grid w-full max-w-4xl grid-cols-2 gap-4 rounded-2xl border border-white/5 bg-zinc-950/40 p-6 backdrop-blur-md sm:grid-cols-3 text-left">
          
          <div className="flex flex-col justify-between border-r border-white/5 p-2 pr-4 sm:border-r">
            <div>
              <span className="font-sans text-xs text-zinc-500 uppercase tracking-wider block">
                Waitlist Launch Special
              </span>
              <span className="mt-1 font-sans text-xl font-bold text-white block">
                ₹1699<span className="text-xs text-zinc-400 font-normal">/year sub</span>
              </span>
            </div>
            <p className="text-[9px] text-zinc-500 mt-2 leading-relaxed">
              Locks in 66% OFF base rate. Regular updates include new AI features every 2 months (add-on charges apply to unlock advanced AI modules).
            </p>
          </div>

          <div className="flex flex-col justify-between p-2 pl-4 border-r-0 sm:border-r sm:border-white/5">
            <div>
              <span className="font-sans text-xs text-zinc-500 uppercase tracking-wider block">
                Launching For
              </span>
              <span className="mt-1 font-sans text-xl font-bold text-brand-purple block">
                UPSC (All Years)
              </span>
            </div>
            <p className="text-[9px] text-zinc-500 mt-2 leading-relaxed">
              Fully aligned with UPSC preparation for civil services aspirants across all attempts and years.
            </p>
          </div>

          <div className="col-span-2 flex flex-col justify-between p-2 pl-4 sm:col-span-1">
            <div>
              <span className="font-sans text-xs text-zinc-500 uppercase tracking-wider block">
                Waitlist Size
              </span>
              <span className="mt-1 font-sans text-xl font-bold text-brand-cyan flex items-center gap-1.5">
                <Users className="h-4.5 w-4.5" /> {count.toLocaleString()}
              </span>
            </div>
            <p className="text-[9px] text-zinc-500 mt-2 leading-relaxed">
              Aspirants who have registered to lock-in early pricing and prioritize roadmap voting. Signup is 100% free.
            </p>
          </div>
        </div>

        {/* Tiny security / verification notice */}
        <div className="mt-6 flex items-center space-x-2 text-xs text-zinc-500">
          <Star className="h-3 w-3 fill-brand-amber text-brand-amber" />
          <span>Base sub rate locks ₹1699/yr subscription after launch. Advanced AI models are unlockable separately.</span>
        </div>
      </motion.div>
    </section>
  );
}
