"use client";

import React from "react";
import { Check, X, ShieldAlert, Minimize2 } from "lucide-react";

interface CompareFeature {
  name: string;
  description: string;
  ours: boolean | string;
  others: boolean | string;
}

export default function CompareTable() {
  const comparisonData: CompareFeature[] = [
    {
      name: "Syllabus-Linked Daily Tracker",
      description: "Auto-links study hours directly to GS Papers, Mains topics, and your optional subject.",
      ours: true,
      others: false,
    },
    {
      name: "Adaptive Backlog Planner",
      description: "Automatically shifts target schedules if you miss study days, avoiding schedule panic.",
      ours: true,
      others: false,
    },
    {
      name: "Dedicated Pomodoro Timer",
      description: "Tracks session length and auto-logs completed hours against active study subjects.",
      ours: true,
      others: "Requires manual entry",
    },
    {
      name: "AI Answer & Essay Evaluation",
      description: "Evaluates handwritten GS answers and essay scans, providing instant UPSC-mapped feedback.",
      ours: "Included (Bi-monthly drop)",
      others: "Costs ₹500+ per test",
    },
    {
      name: "Spaced-Repetition Revision",
      description: "Intelligently flags chapters for revision exactly before you forget them.",
      ours: true,
      others: false,
    },
    {
      name: "Subject Analytics & Streak Maps",
      description: "Visualizes study time distribution and tracks daily consistency heatmaps.",
      ours: true,
      others: "Requires complex setups",
    },
    {
      name: "Pricing",
      description: "Total cost to organize your complete preparation workflow.",
      ours: "₹1699/year base sub",
      others: "₹8,000+ / year",
    },
  ];

  return (
    <section id="comparison" className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center">
        {/* Title */}
        <h2 className="text-center font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl">
          The Complete UPSC Package
        </h2>
        <p className="mt-4 max-w-2xl text-center font-sans text-sm text-zinc-400">
          UPSC preparation requires special tools. See how the UPSC Tracker Operating System compares to standard productivity templates and generic trackers.
        </p>

        {/* Comparison Table Grid */}
        <div className="mt-12 w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/40 backdrop-blur-md shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-zinc-900/80 border-b border-white/10 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4 sm:p-5 w-2/5">Preparation Feature</th>
                  <th className="p-4 sm:p-5 text-center text-brand-purple bg-brand-purple/5 w-3/10 font-extrabold">UPSC Tracker OS</th>
                  <th className="p-4 sm:p-5 text-center w-3/10">Generic Market Tools</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, idx) => {
                  return (
                    <tr
                      key={item.name}
                      className="border-b border-white/5 hover:bg-zinc-900/20 transition-colors"
                    >
                      {/* Feature Name & Description */}
                      <td className="p-4 sm:p-5">
                        <span className="font-bold text-white block tracking-wide">{item.name}</span>
                        <span className="text-[10px] sm:text-xs text-zinc-500 block mt-1 leading-normal">{item.description}</span>
                      </td>

                      {/* Ours (UPSC Tracker OS) */}
                      <td className="p-4 sm:p-5 text-center bg-brand-purple/2 border-x border-brand-purple/10">
                        {typeof item.ours === "boolean" ? (
                          item.ours ? (
                            <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple">
                              <Check className="h-3.5 w-3.5" />
                            </div>
                          ) : (
                            <X className="mx-auto h-4 w-4 text-zinc-600" />
                          )
                        ) : (
                          <span className="font-semibold text-brand-purple text-xs sm:text-sm bg-brand-purple/10 border border-brand-purple/20 px-2 py-0.5 rounded-md">
                            {item.ours}
                          </span>
                        )}
                      </td>

                      {/* Generic Market Tools */}
                      <td className="p-4 sm:p-5 text-center text-zinc-400 font-medium">
                        {typeof item.others === "boolean" ? (
                          item.others ? (
                            <Check className="mx-auto h-4 w-4 text-zinc-500" />
                          ) : (
                            <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900/50 border border-white/5 text-zinc-500">
                              <X className="h-3.5 w-3.5" />
                            </div>
                          )
                        ) : (
                          <span className="text-zinc-500 text-xs font-semibold bg-zinc-900 border border-white/5 px-2 py-0.5 rounded-md inline-block">
                            {item.others}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footnote statement */}
        <p className="mt-4 text-[10px] text-zinc-500 font-sans text-center max-w-lg">
          *Notion templates, Excel sheets, and generic planners require hours of manual setup. UPSC Tracker OS works out of the box with zero configuration.
        </p>
      </div>
    </section>
  );
}
