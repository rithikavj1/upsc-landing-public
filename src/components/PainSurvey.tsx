"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";
import { getPainSurvey, submitPainVote } from "@/lib/supabase";

export default function PainSurvey() {
  const [surveyData, setSurveyData] = useState<Record<string, number>>({});
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const challenges = [
    { name: "Consistency", description: "Studying 8+ hours day after day without breaking streaks." },
    { name: "Revision", description: "Retaining vast history and policy facts before exam day." },
    { name: "Current Affairs", description: "Synthesizing newspapers, PIB releases, and monthly magazines." },
    { name: "PYQs", description: "Analyzing previous year questions and trends effectively." },
    { name: "Optional Subject", description: "Balancing optional syllabus depth with GS syllabus width." },
    { name: "Burnout", description: "Handling isolation, mental fatigue, and continuous pressure." },
    { name: "Time Management", description: "Tracking daily progress without wasting time on admin tasks." },
    { name: "Answer Writing", description: "Structuring answers under 7 minutes with core points." },
    { name: "Test Analysis", description: "Extracting errors from mocks and correcting subject gaps." },
    { name: "Motivation", description: "Staying driven during a multi-year, highly competitive cycle." },
    { name: "Source Management", description: "Filtering study material; avoiding the traps of resource overload." },
  ];

  // Load survey data
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getPainSurvey();
        setSurveyData(data);
      } catch (err) {
        console.error("Failed to load pain survey:", err);
      } finally {
        setLoading(false);
      }
    }

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user_pain_voted");
      if (stored) {
        setSelectedChallenge(stored);
      }
    }

    loadData();
  }, []);

  const handleSelect = async (challengeName: string) => {
    if (selectedChallenge) return; // Only allow one vote

    setSelectedChallenge(challengeName);
    if (typeof window !== "undefined") {
      localStorage.setItem("user_pain_voted", challengeName);
    }

    try {
      const updated = await submitPainVote(challengeName);
      setSurveyData(updated);
    } catch (err) {
      console.error("Error submitting pain vote:", err);
    }
  };

  const totalVotes = Object.values(surveyData).reduce((sum, v) => sum + v, 0) || 1;

  return (
    <section id="pain-survey" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center">
        {/* Title */}
        <h2 className="text-center font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl">
          What is Your Biggest UPSC Challenge?
        </h2>
        <p className="mt-4 max-w-2xl text-center font-sans text-sm text-zinc-400">
          UPSC prep is a marathon. Select your primary struggle to help us adapt our AI tools and dashboard templates for you.
        </p>

        {/* Survey Cards Grid */}
        <div className="mt-12 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map((challenge, idx) => {
            const voteCount = surveyData[challenge.name] || 0;
            const percentage = Math.round((voteCount / totalVotes) * 100);
            const isSelected = selectedChallenge === challenge.name;
            const hasAnyVoted = selectedChallenge !== null;

            return (
              <motion.div
                key={challenge.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                onClick={() => handleSelect(challenge.name)}
                className={`relative overflow-hidden rounded-2xl border p-5 cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "border-brand-purple bg-brand-purple/5 shadow-lg shadow-brand-purple/5"
                    : hasAnyVoted
                    ? "border-white/5 bg-zinc-900/20 cursor-default opacity-60"
                    : "border-white/5 bg-zinc-900/40 hover:bg-zinc-900/60 hover:border-white/10 hover:scale-[1.01]"
                }`}
              >
                {/* Background progress bar for results view */}
                {hasAnyVoted && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0 -z-10 bg-brand-purple/10"
                  />
                )}

                <div className="flex flex-col justify-between h-full">
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-sm font-bold text-white tracking-wide">
                        {challenge.name}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-brand-purple fill-brand-purple/10" />
                      )}
                    </div>

                    {/* Desc */}
                    <p className="mt-2 font-sans text-xs text-zinc-400 leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>

                  {/* Vote count and stats after selection */}
                  {hasAnyVoted && (
                    <div className="mt-4 flex items-center justify-between text-[10px] text-zinc-500 border-t border-white/5 pt-2.5">
                      <span>Total Votes: {voteCount.toLocaleString()}</span>
                      <span className="font-bold text-brand-purple">{percentage}%</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Survey feedback alert */}
        <AnimatePresence>
          {selectedChallenge && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex items-center space-x-2 rounded-xl border border-brand-purple/20 bg-brand-purple/5 px-4 py-2.5 text-xs text-brand-purple"
            >
              <AlertCircle className="h-4 w-4" />
              <span>Thank you! We're prioritizing guides and timers designed to counter <strong>{selectedChallenge}</strong>.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
