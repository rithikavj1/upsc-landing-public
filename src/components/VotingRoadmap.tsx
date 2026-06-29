"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Vote, Flame, Check, Loader2 } from "lucide-react";
import { getFeatureVotes, castFeatureVote } from "@/lib/supabase";

interface RoadmapItem {
  name: string;
  phase: string;
  progress: number; // percentage complete towards design/architecture
  description: string;
}

export default function VotingRoadmap() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [votedFeatures, setVotedFeatures] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [votingFor, setVotingFor] = useState<string | null>(null);

  const roadmap: RoadmapItem[] = [
    {
      name: "AI Answer Evaluation",
      phase: "Architecture Phase",
      progress: 60,
      description: "Upload scans of your hand-written GS answers and receive instant, line-by-line evaluation mapped to UPSC marking standards.",
    },
    {
      name: "AI Mentor",
      phase: "Model Training",
      progress: 45,
      description: "A 24/7 AI tutor specialized in civil services syllabus. Ask complex historical connections, economics concepts, or doubt clarifications.",
    },
    {
      name: "AI Essay Reviewer",
      phase: "Prompt Tuning",
      progress: 70,
      description: "Submit philosophy or current affairs essays. Get instant reviews on essay structure, coherence, quotes usage, and critical depth.",
    },
    {
      name: "AI Current Affairs",
      phase: "Data Pipelines",
      progress: 50,
      description: "Daily automated curations from The Hindu, Indian Express, and PIB, summarized and tagged to specific syllabus chapters.",
    },
    {
      name: "AI Interview Coach",
      phase: "Research Phase",
      progress: 20,
      description: "Simulated DAF-based mock interviews. The AI generates personalized questions based on your background and analyzes your responses.",
    },
    {
      name: "Adaptive Planner",
      phase: "Algorithmic Design",
      progress: 80,
      description: "An engine that automatically reschedules your backlogs. If you miss days, it shifts syllabus targets without causing anxiety.",
    },
    {
      name: "Revision Engine",
      phase: "Prototyping",
      progress: 35,
      description: "Uses spaced-repetition algorithms to prompt you to revise specific topics (Polity, History) exactly before you forget them.",
    },
    {
      name: "Flashcards",
      phase: "Database Setup",
      progress: 90,
      description: "Pre-made syllabus deck for quick facts, article numbers, constitutional bodies, environmental acts, and history timelines.",
    },
    {
      name: "Curated YouTube Strategy Hub",
      phase: "Curation Engine",
      progress: 75,
      description: "Filter out garbage content. Get curated toppers strategy playlists, editorial discussions, and core lectures mapped to syllabus.",
    },
    {
      name: "Android & iOS App",
      phase: "UI Mockups",
      progress: 15,
      description: "Native applications for logging study hours on-the-go, tracking habits, and receiving flashcard notifications.",
    },
  ];

  // Load votes
  useEffect(() => {
    async function loadVotes() {
      try {
        const data = await getFeatureVotes();
        setVotes(data);
      } catch (err) {
        console.error("Failed to load votes:", err);
      } finally {
        setLoading(false);
      }
    }

    if (typeof window !== "undefined") {
      // Check admin status
      const params = new URLSearchParams(window.location.search);
      if (params.get("admin") === "true") {
        setIsAdmin(true);
      }

      // Load from local storage what the user voted for
      const storedVotes = localStorage.getItem("user_roadmap_voted") || "{}";
      try {
        setVotedFeatures(JSON.parse(storedVotes));
      } catch {
        // ignore
      }
    }

    loadVotes();
  }, []);

  // Calculate percentages
  const totalVotes = Object.values(votes).reduce((sum, v) => sum + v, 0) || 1;

  // Handle vote click
  const handleVote = async (featureName: string) => {
    if (votedFeatures[featureName]) return; // Already voted

    setVotingFor(featureName);
    try {
      const updatedVotes = await castFeatureVote(featureName);
      setVotes(updatedVotes);
      
      const newVoted = { ...votedFeatures, [featureName]: true };
      setVotedFeatures(newVoted);
      if (typeof window !== "undefined") {
        localStorage.setItem("user_roadmap_voted", JSON.stringify(newVoted));
      }
    } catch (err) {
      console.error("Error casting vote:", err);
    } finally {
      setVotingFor(null);
    }
  };

  // Determine trending features (Top 3 voted)
  const getTrendingThreshold = () => {
    const sorted = Object.entries(votes).sort((a, b) => b[1] - a[1]);
    if (sorted.length >= 3) {
      return sorted[2][1]; // The third highest vote count
    }
    return 300; // fallback
  };

  const trendingThreshold = getTrendingThreshold();

  return (
    <section id="roadmap" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center">
        {/* Header */}
        <h2 className="text-center font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl">
          What Should We Build Next?
        </h2>
        <p className="mt-4 max-w-2xl text-center font-sans text-sm text-zinc-400">
          Voters shape the development queue. Help us decide which module to release next in the UPSC Tracker OS.
        </p>

        {/* Roadmap Cards Grid */}
        <div className="mt-12 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {roadmap.map((item, index) => {
            const voteCount = votes[item.name] || 0;
            const percentage = Math.round((voteCount / totalVotes) * 100);
            const hasVoted = votedFeatures[item.name];
            const isTrending = voteCount >= trendingThreshold && voteCount > 0;
            const isPendingVote = votingFor === item.name;

            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className={`relative flex flex-col justify-between rounded-2xl border p-6 backdrop-blur-md transition-all duration-300 ${
                  hasVoted
                    ? "border-brand-purple/20 bg-brand-purple/2"
                    : "border-white/5 bg-zinc-900/40 hover:bg-zinc-900/60 hover:border-white/10"
                }`}
              >
                {/* Upper row: Title, status pill, trending */}
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-sans text-base font-bold text-white tracking-wide flex items-center gap-2">
                        {item.name}
                        {isTrending && (
                          <span className="inline-flex items-center gap-1 rounded bg-brand-amber/10 border border-brand-amber/20 px-1.5 py-0.5 text-[8px] font-bold text-brand-amber uppercase tracking-wider">
                            <Flame className="h-2.5 w-2.5 fill-brand-amber" /> Trending
                          </span>
                        )}
                      </h3>
                      <p className="mt-1 font-mono text-[9px] font-semibold text-zinc-500 uppercase tracking-widest">
                        {item.phase}
                      </p>
                    </div>

                    {/* Vote Info */}
                    <div className="text-right">
                      {loading ? (
                        <div className="h-4 w-12 bg-zinc-800 rounded animate-pulse" />
                      ) : isAdmin ? (
                        <span className="font-sans text-xs font-bold text-white">
                          {voteCount.toLocaleString()} <span className="text-[10px] text-zinc-500 font-normal">votes ({percentage}%)</span>
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Body description */}
                  <p className="mt-3 font-sans text-xs text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Progress, percentage and Vote Button */}
                <div className="mt-6">
                  {/* Status Bar */}
                  <div className="mb-4 flex items-center justify-between text-[9px] text-zinc-500">
                    <span>Integration Readiness</span>
                    <span className="font-bold text-zinc-300">{item.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-zinc-850 overflow-hidden mb-5">
                    <div
                      className="h-full bg-gradient-to-r from-brand-purple to-brand-indigo rounded-full transition-all duration-500"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>

                  {/* Vote Button Trigger */}
                  <button
                    onClick={() => handleVote(item.name)}
                    disabled={hasVoted || isPendingVote || loading}
                    className={`relative w-full inline-flex h-10 items-center justify-center gap-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                      hasVoted
                        ? "bg-brand-purple/10 border border-brand-purple/20 text-brand-purple cursor-default"
                        : "bg-white text-zinc-950 hover:bg-zinc-200 hover:scale-[1.01] active:scale-[0.99]"
                    } disabled:opacity-50`}
                  >
                    {isPendingVote ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Counting Vote...
                      </>
                    ) : hasVoted ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Voted
                      </>
                    ) : (
                      <>
                        <Vote className="h-3.5 w-3.5" /> Upvote Feature
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
