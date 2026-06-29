"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  MessageSquare,
  BarChart3,
  Trash2,
  Lock,
  ChevronDown,
  ChevronUp,
  Cpu,
  Mail,
  Calendar,
  Compass
} from "lucide-react";
import {
  getWaitlistEntries,
  getInterestFeedbacks,
  getFeatureVotes,
  getPainSurvey,
  clearMockData,
  WaitlistEntry
} from "@/lib/supabase";

export default function AdminDashboard() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"waitlist" | "feedbacks" | "analytics">("waitlist");
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [feedbacks, setFeedbacks] = useState<Array<{choice: string, text: string, date: string}>>([]);
  const [featureVotes, setFeatureVotes] = useState<Record<string, number>>({});
  const [painSurvey, setPainSurvey] = useState<Record<string, number>>({});

  const loadData = async () => {
    try {
      const waitlistData = await getWaitlistEntries();
      const feedbacksData = await getInterestFeedbacks();
      const votesData = await getFeatureVotes();
      const surveyData = await getPainSurvey();

      setWaitlist(waitlistData);
      setFeedbacks(feedbacksData);
      setFeatureVotes(votesData);
      setPainSurvey(surveyData);
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all local storage waitlist entries, votes, and feedbacks back to seed data?")) {
      clearMockData();
    }
  };

  const totalWaitlisted = waitlist.length;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 border-t border-white/5 mt-10">
      {/* Trigger Header */}
      <div className="flex justify-between items-center bg-zinc-950/80 border border-white/10 rounded-2xl p-5 shadow-lg backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-brand-purple">
            <Lock className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="font-sans text-[10px] font-bold text-brand-purple uppercase tracking-widest block">Founder Console</span>
            <h3 className="font-sans text-sm font-bold text-white tracking-wide">
              Live Waitlist & Analytics Insights
            </h3>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <span>{isOpen ? "Hide Insights" : "Expand Insights Dashboard"}</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-4"
          >
            <div className="rounded-2xl border border-white/5 bg-zinc-950/65 p-6 backdrop-blur-md shadow-inner space-y-6">
              
              {/* Top Controls & Navigation */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                {/* Tabs */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab("waitlist")}
                    className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold tracking-wide transition-all ${
                      activeTab === "waitlist"
                        ? "bg-brand-purple text-white"
                        : "bg-zinc-900/60 text-zinc-400 border border-white/5 hover:text-white"
                    }`}
                  >
                    <Users className="h-3.5 w-3.5" />
                    <span>Waitlist signups ({totalWaitlisted})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("feedbacks")}
                    className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold tracking-wide transition-all ${
                      activeTab === "feedbacks"
                        ? "bg-brand-purple text-white"
                        : "bg-zinc-900/60 text-zinc-400 border border-white/5 hover:text-white"
                    }`}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Open Feedbacks ({feedbacks.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("analytics")}
                    className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold tracking-wide transition-all ${
                      activeTab === "analytics"
                        ? "bg-brand-purple text-white"
                        : "bg-zinc-900/60 text-zinc-400 border border-white/5 hover:text-white"
                    }`}
                  >
                    <BarChart3 className="h-3.5 w-3.5" />
                    <span>Metric Polls</span>
                  </button>
                </div>

                {/* Reset Database Button */}
                <button
                  onClick={handleReset}
                  className="rounded-xl border border-brand-rose/20 bg-brand-rose/5 px-4 py-2 text-xs font-bold text-brand-rose hover:bg-brand-rose/10 transition-colors flex items-center gap-1.5 self-end"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Reset Local Database
                </button>
              </div>

              {/* Tab Content Panels */}
              <div className="min-h-[250px]">
                
                {/* 1. Waitlist signs */}
                {activeTab === "waitlist" && (
                  <div className="space-y-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block mb-2">Waitlist Signups (Actual database records)</span>
                    
                    <div className="overflow-x-auto rounded-xl border border-white/5">
                      <table className="w-full text-left border-collapse text-xs font-sans text-zinc-300">
                        <thead>
                          <tr className="bg-zinc-900 border-b border-white/5 text-zinc-500 font-bold uppercase tracking-wider text-[9px]">
                            <th className="p-3">Aspirant Name</th>
                            <th className="p-3">Email Address</th>
                            <th className="p-3">Target Year</th>
                            <th className="p-3">Optional Subject</th>
                            <th className="p-3 text-right">Register Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {waitlist.map((entry, idx) => (
                            <tr key={idx} className="border-b border-white/2 hover:bg-zinc-900/40">
                              <td className="p-3 font-semibold text-white">{entry.name}</td>
                              <td className="p-3 font-mono text-[11px] text-zinc-400">{entry.email}</td>
                              <td className="p-3">
                                <span className="rounded bg-brand-purple/10 border border-brand-purple/20 px-2 py-0.5 text-[10px] text-brand-purple font-medium">
                                  UPSC {entry.target_year}
                                </span>
                              </td>
                              <td className="p-3 font-medium text-zinc-300">{entry.optional_subject || "N/A"}</td>
                              <td className="p-3 text-right text-[10px] text-zinc-500">
                                {entry.created_at ? new Date(entry.created_at).toLocaleString() : "Pre-seed"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {waitlist.length === 0 && (
                      <div className="text-center py-10 text-zinc-500 text-xs font-sans">
                        No real waitlist entries logged yet. Sign up above to populate records.
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Custom Feedbacks */}
                {activeTab === "feedbacks" && (
                  <div className="space-y-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block mb-2">Open feedback responses (from 'Other' voters)</span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {feedbacks.map((f, idx) => (
                        <div key={idx} className="rounded-xl border border-white/5 bg-zinc-900/40 p-4 space-y-2">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="rounded bg-brand-cyan/10 border border-brand-cyan/20 px-2.5 py-0.5 text-[9px] text-brand-cyan font-bold uppercase tracking-wider">
                              Option: {f.choice}
                            </span>
                            <span className="text-zinc-500 font-mono">
                              {new Date(f.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="font-sans text-xs text-zinc-350 italic leading-relaxed">
                            "{f.text}"
                          </p>
                        </div>
                      ))}
                    </div>

                    {feedbacks.length === 0 && (
                      <div className="text-center py-10 text-zinc-500 text-xs font-sans">
                        No custom feedback entries logged yet. Vote 'Other' and submit thoughts above to see inputs.
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Aggregations & upvotes */}
                {activeTab === "analytics" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Feature Roadmap upvotes */}
                    <div className="rounded-xl border border-white/5 bg-zinc-900/20 p-5">
                      <h4 className="text-xs font-bold text-white mb-4 uppercase tracking-wider text-zinc-400">Roadmap Upvote Counts</h4>
                      <div className="space-y-2">
                        {Object.entries(featureVotes).sort((a,b)=>b[1]-a[1]).map(([feature, votes]) => (
                          <div key={feature} className="flex justify-between items-center text-xs">
                            <span className="text-zinc-300">{feature}</span>
                            <strong className="text-white font-mono">{votes}</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pain survey check */}
                    <div className="rounded-xl border border-white/5 bg-zinc-900/20 p-5">
                      <h4 className="text-xs font-bold text-white mb-4 uppercase tracking-wider text-zinc-400">UPSC Challenge Distribution</h4>
                      <div className="space-y-2">
                        {Object.entries(painSurvey).sort((a,b)=>b[1]-a[1]).map(([challenge, votes]) => (
                          <div key={challenge} className="flex justify-between items-center text-xs">
                            <span className="text-zinc-350">{challenge}</span>
                            <strong className="text-brand-purple font-mono">{votes}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
