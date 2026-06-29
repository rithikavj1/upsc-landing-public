"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Check, Send, Sparkles, MessageSquare } from "lucide-react";
import { getInterestCheck, submitInterestCheck } from "@/lib/supabase";

interface InterestCheckProps {
  onJoinClick: () => void;
}

export default function InterestCheck({ onJoinClick }: InterestCheckProps) {
  const [pollData, setPollData] = useState<Record<string, number>>({});
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showOtherForm, setShowOtherForm] = useState<boolean>(false);

  const choices = [
    { key: "Yes", label: "Yes, absolutely! Really required." },
    { key: "No", label: "No, not my cup of tea." },
    { key: "Other", label: "Other / I want to give custom feedback..." }
  ];

  // Load poll data
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getInterestCheck();
        setPollData(data);
      } catch (err) {
        console.error("Failed to load interest check:", err);
      } finally {
        setLoading(false);
      }
    }

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user_interest_choice");
      if (stored) {
        setSelectedChoice(stored);
        setSubmitted(true);
      }
    }

    loadData();
  }, []);

  const handleSelectOption = (key: string) => {
    if (submitted) return;
    
    setSelectedChoice(key);
    if (key === "Other") {
      setShowOtherForm(true);
    } else {
      setShowOtherForm(false);
    }
  };

  const handleSubmitVote = async () => {
    if (!selectedChoice) return;
    if (selectedChoice === "Other" && !feedback.trim()) return;

    setLoading(true);
    try {
      const updated = await submitInterestCheck(
        selectedChoice,
        selectedChoice === "Other" ? feedback.trim() : undefined
      );
      setPollData(updated);
      setSubmitted(true);
      setShowOtherForm(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("user_interest_choice", selectedChoice);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalVotes = Object.values(pollData).reduce((sum, v) => sum + v, 0) || 1;

  return (
    <section id="interest-check" className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 -z-10 h-44 w-44 rounded-full bg-brand-purple/10 blur-[80px]" />

        <div className="flex flex-col md:flex-row gap-8 items-stretch">
          
          {/* Col 1: Text */}
          <div className="md:w-1/2 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-purple/15 border border-brand-purple/20 text-brand-purple">
                <HelpCircle className="h-5 w-5" />
              </div>
              <h2 className="font-sans text-2xl font-bold text-white tracking-tight sm:text-3xl">
                Is This Product Required?
              </h2>
              <p className="font-sans text-xs text-zinc-400 leading-relaxed">
                We are civil services aspirants building a workspace for aspirants. Before building everything, we want to know if the community really needs this operating system.
              </p>
              
              <div className="rounded-2xl border border-brand-purple/20 bg-brand-purple/5 p-4 space-y-3">
                <span className="font-sans text-[10px] font-bold text-brand-purple uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Core Evaluation
                </span>
                <p className="font-sans text-xs text-white font-medium leading-relaxed">
                  Are you, as an aspirant, excited for this product launch and ready to spend <strong className="text-brand-purple">₹1699/year</strong> on a subscription basis to organize yourself for all types of preparation?
                </p>
                <p className="font-sans text-[11px] text-zinc-400 leading-relaxed pt-1.5 border-t border-brand-purple/10">
                  ⚡ New AI-powered features will be delivered every two months (advanced AI modules require separate add-on charges to unlock). Compared with other products on the market, ours is the complete, full package.
                </p>
              </div>
            </div>

            {submitted && selectedChoice === "Yes" && (
              <div className="pt-2">
                <button
                  onClick={onJoinClick}
                  className="rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-zinc-950 transition-all hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Join Priority Launch Waitlist
                </button>
              </div>
            )}
          </div>

          {/* Col 2: Poll options & feedback form */}
          <div className="md:w-1/2 w-full flex flex-col justify-center space-y-4">
            <span className="font-sans text-xs font-bold text-zinc-400">
              Cast your vote to shape the roadmap:
            </span>

            <div className="space-y-2.5">
              {choices.map((opt) => {
                const voteCount = pollData[opt.key] || 0;
                const percentage = Math.round((voteCount / totalVotes) * 100);
                const isSelected = selectedChoice === opt.key;
                const hasVoted = submitted;

                return (
                  <button
                    key={opt.key}
                    disabled={hasVoted}
                    onClick={() => handleSelectOption(opt.key)}
                    className={`relative w-full text-left rounded-xl border p-3.5 text-xs transition-all duration-300 ${
                      isSelected
                        ? "border-brand-purple bg-brand-purple/5"
                        : hasVoted
                        ? "border-white/2 bg-zinc-900/10 cursor-default"
                        : "border-white/5 bg-zinc-900/40 hover:bg-zinc-800/40 hover:border-white/10"
                    }`}
                  >
                    {/* Progress indicator bar */}
                    {hasVoted && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-y-0 left-0 bg-brand-purple/5 rounded-l-xl pointer-events-none"
                      />
                    )}

                    <div className="relative flex items-center justify-between z-10">
                      <span className={`font-semibold ${isSelected ? "text-white" : "text-zinc-300"}`}>
                        {opt.label}
                      </span>
                      {hasVoted && (
                        <span className="font-mono font-bold text-zinc-400 ml-4">
                          {percentage}%
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Other Feedback Input Form */}
            <AnimatePresence>
              {showOtherForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 pt-2"
                >
                  <label htmlFor="other-feedback" className="font-sans text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" /> Custom Suggestions / Problems
                  </label>
                  <textarea
                    id="other-feedback"
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us what is your problem, or what you want us to add in the future. We build what aspirants need..."
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-650 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple resize-none"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action buttons / Feedback notice */}
            {!submitted ? (
              <button
                onClick={handleSubmitVote}
                disabled={!selectedChoice || loading}
                className="w-full inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-brand-purple px-4 text-xs font-bold text-white transition-all hover:bg-brand-purple/95 active:scale-[0.98] disabled:opacity-50"
              >
                <Send className="h-3 w-3" /> Submit Interest Check
              </button>
            ) : (
              <p className="text-[10px] text-brand-emerald text-center font-sans font-medium">
                ✓ Response logged. Thank you for validating the UPSC Operating System.
              </p>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
