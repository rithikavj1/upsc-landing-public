"use client";

import React from "react";
import { Quote, Send } from "lucide-react";

export default function FounderStory() {
  return (
    <section id="founder" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-white/5 bg-zinc-900/20 p-8 sm:p-12 backdrop-blur-md relative overflow-hidden">
        {/* Glow */}
        <div className="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-brand-indigo/5 blur-[100px]" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          {/* Text column */}
          <div className="lg:col-span-3 space-y-6">
            <div className="inline-flex items-center space-x-2 rounded-full border border-brand-purple/20 bg-brand-purple/5 px-3 py-1 text-xs text-brand-purple">
              <span>Our Origins</span>
            </div>
            <h2 className="font-sans text-3xl font-bold text-white tracking-tight sm:text-4xl">
              Why I Built UPSC Tracker
            </h2>
            
            <div className="space-y-4 font-sans text-sm text-zinc-400 leading-relaxed">
              <p>
                Two years ago, I was surrounded by stacks of Laxmikanth, spectrum summaries, printouts of newspaper editorials, and chaotic Excel files trying to calculate my study hours. The biggest enemy in my UPSC preparation wasn't the syllabus depth—it was the administrative overload of managing it.
              </p>
              <p>
                I spent hours planning, rescheduling backlogs, and drawing trackers instead of actual focused study. I looked for tools, but generic productivity software like Notion or Excel required hours of setup, and standard task managers lacked context.
              </p>
              <p>
                So, I decided to build **UPSC Tracker**—an operating system designed specifically around the UPSC workflow. It tracks syllabus progression, maps study sessions directly to GS papers, logs optional hours, and keeps backlogs visible so you never lose control.
              </p>
              <p className="text-white font-medium">
                This isn't just software; it's the digital partner I wish I had during my attempts. We're launching the Founding program to let real aspirants vote, review, and sculpt the tools they need. Let's make civil services preparation structured and stress-free together.
              </p>
            </div>

            {/* Handwritten Signature style */}
            <div className="pt-4 flex flex-col">
              <span className="font-sans font-bold text-white text-base">Rithika V.</span>
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">Founder & UPSC Aspirant</span>
            </div>
          </div>

          {/* Card quote column */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl relative">
              <Quote className="absolute top-4 right-4 h-12 w-12 text-white/5" />
              
              <h3 className="font-sans text-sm font-bold text-white mb-4">Founders Mission Statement</h3>
              <p className="font-sans text-xs text-zinc-300 italic leading-relaxed">
                "UPSC preparation demands high focus, consistency, and discipline. The technology we study with should support that focus, not distract from it. Our operating system handles the analytics so you can focus entirely on the books."
              </p>

              <div className="mt-6 border-t border-white/5 pt-4 space-y-3 text-[10px]">
                <div className="flex justify-between items-center text-zinc-500">
                  <span>Current Version</span>
                  <span className="font-semibold text-zinc-300">v1.2.0 (Active MVP)</span>
                </div>
                <div className="flex justify-between items-center text-zinc-500">
                  <span>Founding Slots Limit</span>
                  <span className="font-semibold text-brand-purple">500 Aspirants Only</span>
                </div>
                <div className="flex justify-between items-center text-zinc-500">
                  <span>Next Stable Release</span>
                  <span className="font-semibold text-brand-cyan">September 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
