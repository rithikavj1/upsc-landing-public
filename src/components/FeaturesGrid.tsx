"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Clock,
  Calendar,
  Layers,
  BarChart3,
  Settings,
  Flame,
  Timer,
  LineChart,
  AreaChart,
  Moon,
  Cpu,
  CheckCircle2
} from "lucide-react";

interface FeatureItem {
  name: string;
  description: string;
  icon: React.ComponentType<any>;
}

export default function FeaturesGrid() {
  const features: FeatureItem[] = [
    {
      name: "Dashboard",
      description: "Get a comprehensive bird's-eye view of your daily schedule, recent targets, and focus trends.",
      icon: LayoutDashboard,
    },
    {
      name: "Daily Tracker",
      description: "Log every study session against specific subjects (Polity, History, Optional) with subtopic details.",
      icon: Clock,
    },
    {
      name: "Weekly Planner",
      description: "Schedule your weekly targets. Drag-and-drop slots to organize your syllabus micro-steps.",
      icon: Calendar,
    },
    {
      name: "Monthly Overview",
      description: "Track monthly syllabus coverage percentages, backlogs, and study hours in a calendar frame.",
      icon: Layers,
    },
    {
      name: "Subject Hours Log",
      description: "See the exact breakdown of hours logged per subject. Ensure balanced coverage across GS papers.",
      icon: BarChart3,
    },
    {
      name: "Targets & Settings",
      description: "Customize daily study targets (e.g. 8h/day) and sync with target exam years (UPSC 2027/28).",
      icon: Settings,
    },
    {
      name: "Habit Tracker",
      description: "Track habits vital for preparation: Answer writing, Editorial reading, Answer review, and CSAT drill.",
      icon: Flame,
    },
    {
      name: "Pomodoro Timer",
      description: "Focus without distraction. Custom Pomodoro intervals auto-log completed hours to corresponding subjects.",
      icon: Timer,
    },
    {
      name: "Study Analytics",
      description: "Analyze daily average hours, consistency metrics, and focus efficiency charts to improve stamina.",
      icon: LineChart,
    },
    {
      name: "Progress Charts",
      description: "Syllabus tracking progress charts showing cumulative completion percentages of GS Mains subjects.",
      icon: AreaChart,
    },
    {
      name: "Dark Mode",
      description: "Premium OLED-dark color scheme designed to reduce eye strain during late-night study marathons.",
      icon: Moon,
    },
    {
      name: "AI-Ready Architecture",
      description: "Built-in endpoints structured to support context-aware AI essay reviews and answer evaluation modules.",
      icon: Cpu,
    },
  ];

  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center">
        {/* Section Title */}
        <div className="mb-4 inline-flex items-center space-x-2 rounded-full border border-brand-emerald/20 bg-brand-emerald/5 px-3 py-1 text-xs text-brand-emerald">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span className="font-sans font-semibold tracking-wide">Fully Functional MVP Ready</span>
        </div>
        <h2 className="text-center font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Available at Launch
        </h2>
        <p className="mt-4 max-w-2xl text-center font-sans text-sm text-zinc-400">
          We have already built the core operating system. When you join the Founding Aspirants program, you get immediate access to all these tools.
        </p>

        {/* Feature Grid */}
        <div className="mt-12 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/5 bg-zinc-900/40 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-900/70 hover:border-white/10 hover:shadow-xl hover:shadow-brand-purple/2"
              >
                {/* Background glow hover effect */}
                <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-brand-purple/0 to-brand-purple/0 opacity-0 group-hover:from-brand-purple/3 group-hover:to-brand-indigo/3 group-hover:opacity-100 transition-all duration-300" />

                <div>
                  {/* Icon Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 group-hover:text-brand-purple group-hover:border-brand-purple/20 transition-all duration-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-brand-emerald/10 border border-brand-emerald/15 px-2.5 py-0.5 text-[9px] font-semibold text-brand-emerald tracking-wide">
                      Launch Ready
                    </span>
                  </div>

                  {/* Details */}
                  <h3 className="mt-4 font-sans text-sm font-bold text-white tracking-wide">
                    {feature.name}
                  </h3>
                  <p className="mt-2 font-sans text-xs text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
