"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, CheckCircle2 } from "lucide-react";
import MediaContainer from "@/components/MediaContainer";

export default function DemoVideo() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentCaptionIdx, setCurrentCaptionIdx] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const captions = [
    {
      time: 0,
      title: "Welcome to UPSC Tracker OS",
      text: "India's first dashboard designed exclusively to handle the complexity of civil services preparation.",
      highlightFeature: "Dashboard Overview"
    },
    {
      time: 20,
      title: "Active Session Logger",
      text: "Start the Pomodoro timer. Choose your subject, focus topic, and watch it autolog directly into your Daily Tracker.",
      highlightFeature: "Pomodoro + Session Tracker"
    },
    {
      time: 40,
      title: "Weekly Planning & Backlogs",
      text: "Map out your chapters. If you miss a slot, the planner highlights the backlog and recalculates daily targets.",
      highlightFeature: "Adaptive Weekly Planner"
    },
    {
      time: 60,
      title: "Subject Distribution Insights",
      text: "Check subject analytics. Balance GS papers and your optional subject so you never fall behind in any paper.",
      highlightFeature: "Subject Analytics Donut"
    },
    {
      time: 85,
      title: "GitHub-style Heatmap Calendar",
      text: "Consistency is key. The Heatmap rewards daily logs, keeping your momentum high over the 12-month marathon.",
      highlightFeature: "Consistency Heatmap"
    }
  ];

  // Run mock video playback progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 300); // ~30 seconds total duration
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Update caption index based on progress percentage
  useEffect(() => {
    const currentPercent = progress;
    const targetIdx = captions.findIndex((c, i) => {
      const nextC = captions[i + 1];
      return currentPercent >= c.time && (!nextC || currentPercent < nextC.time);
    });
    if (targetIdx !== -1) {
      setCurrentCaptionIdx(targetIdx);
    }
  }, [progress]);

  const activeCaption = captions[currentCaptionIdx];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setProgress(0);
    setCurrentCaptionIdx(0);
    setIsPlaying(true);
  };

  return (
    <section id="demo-video" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center">
        {/* Header */}
        <h2 className="text-center font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Watch Product Walkthrough
        </h2>
        <p className="mt-4 max-w-2xl text-center font-sans text-sm text-zinc-400">
          Take a 60-second guided tour of our UPSC Tracker environment. See how we help you manage syllabus backlogs, track consistency, and log focus hours.
        </p>

        {/* Video Player Frame */}
        <div className="relative mt-12 w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
          <MediaContainer src="/media/demo.mp4" type="video">
            {/* Fallback Mock Video Container (Rendered if demo.mp4 is missing) */}
            <div className="relative aspect-video w-full bg-zinc-900 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                {!isPlaying && progress === 0 ? (
                  <motion.div
                    key="poster"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-t from-zinc-950 via-zinc-900/90 to-brand-purple/10"
                  >
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-brand-purple to-brand-indigo shadow-lg shadow-brand-purple/30 group-hover:scale-105 transition-transform duration-300">
                      <Play className="h-9 w-9 text-white fill-white translate-x-0.5" />
                    </div>
                    <h3 className="font-sans text-2xl font-bold text-white">UPSC Tracker Walkthrough</h3>
                    <p className="mt-2 text-xs text-zinc-400">See the full UPSC Tracker OS dashboard in action (0:50)</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={currentCaptionIdx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center bg-zinc-950"
                  >
                    <div className="w-full h-full p-8 flex flex-col justify-between bg-zinc-900/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 rounded-full bg-brand-purple/20 border border-brand-purple/30 px-3 py-1 text-[10px] text-brand-purple">
                          <Sparkles className="h-3 w-3 animate-spin" />
                          <span>Interactive Demo: {activeCaption.highlightFeature}</span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500">SIMULATED PREVIEW</span>
                      </div>

                      <div className="flex-grow flex items-center justify-center py-4">
                        {currentCaptionIdx === 0 && (
                          <div className="w-full max-w-md rounded-xl border border-white/5 bg-zinc-900/80 p-5 shadow-2xl flex flex-col space-y-3">
                            <div className="h-2 w-1/3 rounded bg-zinc-850" />
                            <div className="grid grid-cols-3 gap-2">
                              <div className="h-16 rounded bg-zinc-800/50 p-2 flex flex-col justify-between">
                                <span className="text-[8px] text-zinc-500">DAILY TARGET</span>
                                <span className="text-xs font-bold text-white">8h Goals</span>
                              </div>
                              <div className="h-16 rounded bg-zinc-800/50 p-2 flex flex-col justify-between">
                                <span className="text-[8px] text-zinc-500">COMPLETED</span>
                                <span className="text-xs font-bold text-brand-purple">5.5h Logged</span>
                              </div>
                              <div className="h-16 rounded bg-zinc-800/50 p-2 flex flex-col justify-between">
                                <span className="text-[8px] text-zinc-500">SYLLABUS</span>
                                <span className="text-xs font-bold text-brand-cyan">41.8% Done</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {currentCaptionIdx === 1 && (
                          <div className="w-full max-w-sm rounded-xl border border-white/5 bg-zinc-900/80 p-5 shadow-2xl flex flex-col items-center space-y-4">
                            <span className="text-[9px] uppercase tracking-wider text-zinc-500">ACTIVE LOGGING</span>
                            <div className="h-20 w-20 rounded-full border-4 border-brand-purple/20 border-t-brand-purple flex items-center justify-center animate-spin-slow">
                              <span className="font-mono text-xs font-bold text-white">16:45</span>
                            </div>
                          </div>
                        )}

                        {currentCaptionIdx === 2 && (
                          <div className="w-full max-w-md rounded-xl border border-white/5 bg-zinc-900/80 p-4 shadow-2xl">
                            <span className="text-[9px] uppercase tracking-wider text-zinc-500">ADAPTIVE WEEKLY LIST</span>
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center justify-between rounded bg-zinc-800/30 p-2 border border-white/5">
                                <div className="flex items-center space-x-2">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-brand-emerald" />
                                  <span className="text-[10px] text-zinc-300">Laxmikanth Chapters 12-14</span>
                                </div>
                                <span className="text-[8px] text-brand-emerald uppercase font-bold">Done</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {currentCaptionIdx === 3 && (
                          <div className="w-full max-w-sm rounded-xl border border-white/5 bg-zinc-900/80 p-4 shadow-2xl flex flex-col items-center">
                            <span className="text-[9px] uppercase tracking-wider text-zinc-500 mb-3">SUBJECT HOUR LOGS</span>
                            <svg className="h-20 w-20" viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="35" stroke="#27272a" strokeWidth="12" fill="transparent" />
                              <circle cx="50" cy="50" r="35" stroke="#8b5cf6" strokeWidth="12" fill="transparent" strokeDasharray="219.8" strokeDashoffset="65" />
                            </svg>
                          </div>
                        )}

                        {currentCaptionIdx === 4 && (
                          <div className="w-full max-w-sm rounded-xl border border-white/5 bg-zinc-900/80 p-4 shadow-2xl">
                            <span className="text-[9px] uppercase tracking-wider text-zinc-500 mb-2 block">CONSISTENCY PATTERN</span>
                            <div className="grid grid-cols-8 gap-1 justify-center py-2">
                              {Array.from({ length: 24 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={`h-3 w-3 rounded-sm ${
                                    i % 4 === 0 ? "bg-brand-purple" : "bg-zinc-800"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Clickable Overlay to Play */}
              {!isPlaying && progress === 0 && (
                <div
                  onClick={handlePlayPause}
                  className="absolute inset-0 z-10 cursor-pointer bg-transparent"
                />
              )}
            </div>

            {/* Video Control Bar */}
            <div className="flex items-center justify-between border-t border-white/5 bg-zinc-950 p-4 text-zinc-400">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePlayPause}
                  className="rounded-lg p-1.5 hover:bg-zinc-900 hover:text-white transition-colors"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-zinc-400" />}
                </button>
                <button
                  onClick={handleReset}
                  className="rounded-lg p-1.5 hover:bg-zinc-900 hover:text-white transition-colors"
                  title="Replay Video"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              <div className="mx-4 flex-1 relative h-1.5 rounded-full bg-zinc-800 overflow-hidden cursor-pointer">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-brand-purple transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="rounded-lg p-1.5 hover:bg-zinc-900 hover:text-white transition-colors"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
                <span className="font-mono text-xs text-zinc-500">0:{progress < 10 ? `0${Math.floor(progress/2)}` : Math.floor(progress/2)} / 0:50</span>
              </div>
            </div>
          </MediaContainer>
        </div>

        {/* Live Captions (Synced to Playback Progress, only rendered when simulated is playing) */}
        <div className="mt-6 w-full max-w-4xl min-h-[90px] rounded-xl border border-white/5 bg-zinc-950/40 p-4 backdrop-blur-md flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCaptionIdx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="text-center"
            >
              <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-purple">
                {activeCaption.title}
              </h4>
              <p className="mt-1 text-sm text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                {activeCaption.text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
