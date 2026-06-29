"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  LayoutDashboard,
  Maximize2,
  PieChart,
  Sliders,
  TrendingUp,
  X
} from "lucide-react";
import MediaContainer from "@/components/MediaContainer";

type TabId =
  | "dashboard"
  | "tracker"
  | "planner"
  | "analytics"
  | "pomodoro"
  | "subject"
  | "heatmap";

interface TabItem {
  id: TabId;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}

export default function ProductPreview() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [enlarged, setEnlarged] = useState<boolean>(false);

  const tabs: TabItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "A centralized hub summarizing your daily syllabus coverage, recent habits, active timer status, and progress towards your yearly UPSC target.",
    },
    {
      id: "tracker",
      label: "Daily Tracker",
      icon: Clock,
      description: "Log study sessions by subject and topic with precise time tracking. Seamlessly link hours to specific GS papers or your optional subject.",
    },
    {
      id: "planner",
      label: "Weekly Planner",
      icon: Sliders,
      description: "Map out your weekly goals and syllabus subtopics. Set micro-targets and track daily completion to stay on track.",
    },
    {
      id: "analytics",
      label: "Monthly Analytics",
      icon: TrendingUp,
      description: "Understand your long-term consistency. Visualize trends, tracking daily study averages, streak counts, and backlog recovery.",
    },
    {
      id: "pomodoro",
      label: "Pomodoro Timer",
      icon: Clock,
      description: "Deep-focus timer designed specifically for long study sessions. Eliminates distraction with ambient sound integration and automatic logging.",
    },
    {
      id: "subject",
      label: "Subject Analytics",
      icon: PieChart,
      description: "Identify preparation imbalances. A beautiful chart breakdown shows you if you are spending too much time on polity and ignoring optional subjects.",
    },
    {
      id: "heatmap",
      label: "Heatmap Calendar",
      icon: Calendar,
      description: "A GitHub-style study contribution calendar. Keep your consistency streak alive by logging study hours every day.",
    },
  ];

  // Render original vector fallback mockups
  const renderFallbackIllustration = (tab: TabId) => {
    switch (tab) {
      case "dashboard":
        return (
          <div className="flex h-full w-full flex-col p-6 font-sans text-xs bg-zinc-950">
            <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h4 className="text-sm font-bold text-white">Aspirant Workspace</h4>
                <p className="text-[10px] text-zinc-500">Target UPSC 2027 • Day 112/365</p>
              </div>
              <span className="rounded-full bg-brand-purple/10 px-2 py-0.5 text-[9px] font-medium text-brand-purple border border-brand-purple/20">
                Streak: 14 Days 🔥
              </span>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/5 bg-zinc-900/60 p-4">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500">Today's Focus</span>
                <p className="mt-1 text-lg font-semibold text-white">5h 45m logged</p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-zinc-850">
                  <div className="h-full rounded-full bg-brand-purple" style={{ width: "72%" }} />
                </div>
                <p className="mt-2 text-[9px] text-zinc-400">Target: 8h (72% complete)</p>
              </div>

              <div className="rounded-xl border border-white/5 bg-zinc-900/60 p-4">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500">Syllabus Covered</span>
                <p className="mt-1 text-lg font-semibold text-white">41.8% complete</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-[9px] text-zinc-400">
                  <div className="flex items-center space-x-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-purple" />
                    <span>GS 1: 52%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan" />
                    <span>GS 2: 30%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-emerald" />
                    <span>GS 3: 40%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-amber" />
                    <span>Optional: 45%</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-zinc-900/60 p-4">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500">Next Major Milestone</span>
                <p className="mt-1 text-sm font-semibold text-white">Polity Revision (GS2)</p>
                <p className="mt-1 text-[10px] text-zinc-400">Starts tomorrow • 8 chapters pending</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-white/5 bg-zinc-900/45 p-4">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500">Weekly Progress</span>
              <div className="mt-3 flex items-end justify-between px-2 h-14">
                {[6.2, 7.5, 8.0, 5.0, 9.2, 4.5, 0].map((hours, i) => (
                  <div key={i} className="flex flex-col items-center space-y-1">
                    <div
                      className={`w-6 rounded-t-sm bg-gradient-to-t ${
                        hours >= 7.5
                          ? "from-brand-purple/70 to-brand-purple"
                          : hours > 0
                          ? "from-brand-indigo/60 to-brand-indigo"
                          : "bg-zinc-850"
                      }`}
                      style={{ height: `${hours * 5}px` }}
                    />
                    <span className="text-[8px] text-zinc-500">
                      {["M", "T", "W", "T", "F", "S", "S"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "tracker":
        return (
          <div className="flex h-full w-full flex-col p-6 font-sans text-xs bg-zinc-950">
            <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white">Log Study Session</h4>
                <p className="text-[10px] text-zinc-500">Session logging and history</p>
              </div>
            </div>

            <div className="mb-4 rounded-lg bg-brand-purple/10 border border-brand-purple/20 p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-brand-purple animate-pulse" />
                <span className="text-[10px] text-zinc-200">Currently Tracking: <span className="font-semibold">Geography Optional</span></span>
              </div>
              <span className="font-mono text-xs font-bold text-white">01:42:08</span>
            </div>

            <span className="text-[10px] uppercase tracking-wider text-zinc-500">Recent Sessions</span>
            <div className="mt-2 space-y-2 max-h-[160px] overflow-y-auto">
              {[
                { subject: "GS2 Polity", topic: "Fundamental Rights revision", duration: "2h 15m", time: "10:30 AM" },
                { subject: "Daily Newspaper", topic: "The Hindu & Indian Express Analysis", duration: "1h 10m", time: "8:00 AM" },
                { subject: "GS3 Economy", topic: "IBC notes", duration: "2h 20m", time: "Yesterday" },
              ].map((log, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg border border-white/5 bg-zinc-900/60 p-2">
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">{log.subject}</span>
                    <span className="text-[9px] text-zinc-500">{log.topic}</span>
                  </div>
                  <div className="text-right">
                    <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] text-zinc-300 font-semibold">{log.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "planner":
        return (
          <div className="flex h-full w-full flex-col p-6 font-sans text-xs bg-zinc-950">
            <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white">Weekly Planner</h4>
                <p className="text-[10px] text-zinc-500">Target allocation for July Week 1</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { day: "Monday", slots: ["Polity (FRs)", "Newspaper", "Optional Test"] },
                { day: "Tuesday", slots: ["Polity (DPSP)", "Newspaper", "Answer Writing"] },
                { day: "Wednesday", slots: ["Economy (Budget)", "Newspaper", "Geography"] },
              ].map((planner, idx) => (
                <div key={idx} className="rounded-lg border border-white/5 bg-zinc-900/40 p-3">
                  <span className="font-bold text-brand-purple">{planner.day}</span>
                  <div className="mt-2 space-y-1.5">
                    {planner.slots.map((s, i) => (
                      <div key={i} className="flex items-center space-x-1.5 rounded bg-zinc-900/80 px-2 py-1 text-[9px] text-zinc-350 border border-white/5">
                        <input type="checkbox" className="accent-brand-purple rounded" checked={i === 0 || planner.day === "Monday"} readOnly />
                        <span className="truncate">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="flex h-full w-full flex-col p-6 font-sans text-xs bg-zinc-950">
            <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white">Monthly Analytics</h4>
                <p className="text-[10px] text-zinc-500">June 2026 Summary Report</p>
              </div>
              <span className="text-[10px] font-bold text-brand-cyan">Avg: 7.2 Hours/Day</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/5 bg-zinc-900/60 p-4 flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500">Monthly Target</span>
                <div className="relative mt-2 flex items-center justify-center">
                  <svg className="h-20 w-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="32" stroke="#27272a" strokeWidth="5" fill="transparent" />
                    <circle cx="40" cy="40" r="32" stroke="#06b6d4" strokeWidth="5" fill="transparent" strokeDasharray="201" strokeDashoffset="35" />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-white">216h</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between space-y-2">
                <div className="rounded-xl border border-white/5 bg-zinc-900/60 p-3">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500">Productivity Streak</span>
                  <p className="text-base font-bold text-white">21 Days</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-zinc-900/60 p-3">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500">Weekly Backlog</span>
                  <p className="text-base font-bold text-brand-rose">-2.5 Hours</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "pomodoro":
        return (
          <div className="flex h-full w-full flex-col items-center justify-center p-6 font-sans text-xs bg-zinc-950">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Focus Session</span>
            <span className="rounded bg-brand-purple/10 px-2 py-0.5 text-[9px] font-semibold text-brand-purple border border-brand-purple/15">
              GS1 Geography
            </span>

            <div className="relative mt-4 flex h-28 w-28 items-center justify-center">
              <svg className="absolute inset-0 h-full w-full transform -rotate-90">
                <circle cx="56" cy="56" r="48" stroke="#27272a" strokeWidth="3" fill="transparent" />
                <circle cx="56" cy="56" r="48" stroke="#8b5cf6" strokeWidth="3" fill="transparent" strokeDasharray="301.6" strokeDashoffset="110" />
              </svg>
              <div className="flex flex-col items-center">
                <span className="font-mono text-xl font-bold text-white">16:45</span>
              </div>
            </div>
          </div>
        );
      case "subject":
        return (
          <div className="flex h-full w-full flex-col p-6 font-sans text-xs bg-zinc-950">
            <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white">Subject Analytics</h4>
                <p className="text-[10px] text-zinc-500">Preparation distribution</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="relative flex justify-center">
                <svg className="h-24 w-24" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="30" stroke="#8b5cf6" strokeWidth="12" fill="transparent" strokeDasharray="188.4" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="30" stroke="#6366f1" strokeWidth="12" fill="transparent" strokeDasharray="188.4" strokeDashoffset="60" />
                  <circle cx="50" cy="50" r="18" fill="#18181b" />
                </svg>
              </div>

              <div className="space-y-1.5">
                {[
                  { name: "Optional Subject", color: "bg-brand-purple", hours: "78h (35%)" },
                  { name: "Polity GS2", color: "bg-brand-indigo", hours: "67h (30%)" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-1.5 text-[9px]">
                    <span className={`h-2 w-2 rounded-sm ${item.color}`} />
                    <span className="text-zinc-300 truncate max-w-[80px]">{item.name}</span>
                    <span className="font-semibold text-white ml-auto">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "heatmap":
        return (
          <div className="flex h-full w-full flex-col p-6 font-sans text-xs bg-zinc-950">
            <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white">Heatmap Calendar</h4>
                <p className="text-[10px] text-zinc-500">Study Consistency</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="grid grid-cols-12 gap-1 max-w-[380px] mx-auto">
                {Array.from({ length: 48 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-3 w-3 rounded-sm border border-white/2 ${
                      idx % 3 === 0 ? "bg-brand-purple" : idx % 2 === 0 ? "bg-brand-purple/40" : "bg-zinc-900"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const activeItem = tabs.find((t) => t.id === activeTab)!;

  return (
    <section id="preview" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center">
        {/* Title */}
        <h2 className="text-center font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Designed for Premium Performance
        </h2>
        <p className="mt-4 max-w-2xl text-center font-sans text-sm text-zinc-400">
          UPSC Tracker delivers an immersive workspace directly inside your browser. Open options to view dashboard layout, planners, mock reports, and streaks.
        </p>

        {/* Tab Navigator */}
        <div className="mt-10 flex w-full flex-wrap justify-center gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-brand-purple text-white shadow-md shadow-brand-purple/20"
                    : "bg-zinc-900/60 text-zinc-400 border border-white/5 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Showcase Screen */}
        <div className="mt-8 grid w-full grid-cols-1 gap-8 lg:grid-cols-3 items-center">
          {/* Descriptive column */}
          <div className="lg:col-span-1 space-y-4">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-brand-purple">
              {React.createElement(activeItem.icon, { className: "h-5 w-5" })}
            </div>
            <h3 className="font-sans text-2xl font-bold text-white">
              {activeItem.label}
            </h3>
            <p className="font-sans text-sm text-zinc-400 leading-relaxed">
              {activeItem.description}
            </p>
            <div className="pt-2 text-xs font-semibold text-brand-purple flex items-center space-x-1.5">
              <span>Ready at launch</span>
              <span className="h-1 w-1 rounded-full bg-brand-purple" />
              <span className="text-zinc-500">Unlimited sessions</span>
            </div>
          </div>

          {/* Interactive Screen Display */}
          <div className="lg:col-span-2 relative group rounded-2xl border border-white/10 bg-zinc-950/80 p-1 shadow-2xl backdrop-blur-md">
            {/* Window header */}
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
              <div className="flex space-x-1.5">
                <span className="h-3 w-3 rounded-full bg-zinc-800" />
                <span className="h-3 w-3 rounded-full bg-zinc-800" />
                <span className="h-3 w-3 rounded-full bg-zinc-800" />
              </div>
              <div className="rounded bg-zinc-900 px-3 py-1 font-mono text-[9px] text-zinc-500 border border-white/2">
                upsctracker.com/app/{activeTab}
              </div>
              <button
                onClick={() => setEnlarged(true)}
                className="rounded-lg p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
                title="Enlarge screen"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Screen Content Wrapper (With MediaContainer support) */}
            <div className="relative aspect-video w-full overflow-hidden bg-brand-dark-bg/60">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className="h-full w-full"
                >
                  <MediaContainer src={`/media/${activeTab}.png`} type="image" alt={`${activeTab} screenshot`}>
                    {renderFallbackIllustration(activeTab)}
                  </MediaContainer>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Enlargement Modal (Lightbox) */}
      <AnimatePresence>
        {enlarged && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEnlarged(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl rounded-2xl border border-white/10 bg-brand-dark-bg p-1 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
                <div className="flex space-x-1.5">
                  <span className="h-3 w-3 rounded-full bg-zinc-800" />
                  <span className="h-3 w-3 rounded-full bg-zinc-800" />
                  <span className="h-3 w-3 rounded-full bg-zinc-800" />
                </div>
                <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">{activeItem.label} Preview</span>
                <button
                  onClick={() => setEnlarged(false)}
                  className="rounded-full bg-zinc-900 p-1.5 text-zinc-500 hover:text-white border border-white/5 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Enlarged Mockup Body */}
              <div className="aspect-video w-full bg-brand-dark-bg/60">
                <MediaContainer src={`/media/${activeTab}.png`} type="image" alt={`${activeTab} enlarged`}>
                  {renderFallbackIllustration(activeTab)}
                </MediaContainer>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
