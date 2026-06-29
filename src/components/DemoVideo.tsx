"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Maximize, CheckCircle2 } from "lucide-react";

interface CaptionItem {
  timeRatio: number; // percentage of duration when caption starts
  title: string;
  text: string;
  highlightFeature: string;
}

export default function DemoVideo() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(50); // fallback duration
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [showPoster, setShowPoster] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const captions: CaptionItem[] = [
    {
      timeRatio: 0,
      title: "Welcome to UPSC Tracker OS",
      text: "India's first dashboard designed exclusively to handle the complexity of civil services preparation.",
      highlightFeature: "Dashboard Overview"
    },
    {
      timeRatio: 0.2,
      title: "Active Session Logger",
      text: "Start the Pomodoro timer. Choose your subject, focus topic, and watch it autolog directly into your Daily Tracker.",
      highlightFeature: "Pomodoro + Session Tracker"
    },
    {
      timeRatio: 0.4,
      title: "Weekly Planning & Backlogs",
      text: "Map out your chapters. If you miss a slot, the planner highlights the backlog and recalculates daily targets.",
      highlightFeature: "Adaptive Weekly Planner"
    },
    {
      timeRatio: 0.6,
      title: "Subject Distribution Insights",
      text: "Check subject analytics. Balance GS papers and your optional subject so you never fall behind in any paper.",
      highlightFeature: "Subject Analytics Donut"
    },
    {
      timeRatio: 0.8,
      title: "GitHub-style Heatmap Calendar",
      text: "Consistency is key. The Heatmap rewards daily logs, keeping your momentum high over the 12-month marathon.",
      highlightFeature: "Consistency Heatmap"
    }
  ];

  // Sync play state
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      setShowPoster(false);
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error("Autoplay/play blocked:", err);
      });
    }
  };

  const handleReset = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    setCurrentTime(0);
    setShowPoster(false);
    videoRef.current.play().then(() => {
      setIsPlaying(true);
    });
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    const nextMute = !isMuted;
    videoRef.current.muted = nextMute;
    setIsMuted(nextMute);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 50);
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickedTime = (x / rect.width) * duration;
    videoRef.current.currentTime = clickedTime;
    setCurrentTime(clickedTime);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  // Find active caption index
  const getActiveCaptionIndex = () => {
    let activeIdx = 0;
    for (let i = 0; i < captions.length; i++) {
      if (currentTime >= captions[i].timeRatio * duration) {
        activeIdx = i;
      }
    }
    return activeIdx;
  };

  const activeCaptionIdx = getActiveCaptionIndex();
  const activeCaption = captions[activeCaptionIdx];
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
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
          
          {/* Main Video Wrapper */}
          <div className="relative aspect-video w-full bg-zinc-950 flex items-center justify-center overflow-hidden">
            {!hasError ? (
              <video
                ref={videoRef}
                src="/media/demo.mp4"
                poster="/media/video_thumbnail.png"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onError={() => setHasError(true)}
                className="w-full h-full object-contain"
                playsInline
              />
            ) : (
              /* Fallback Mock Video (if video file errors out) */
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                <span className="text-zinc-500 font-sans text-xs">Video preview unavailable</span>
              </div>
            )}

            {/* Premium Custom Poster Overlay */}
            <AnimatePresence>
              {showPoster && (
                <motion.div
                  key="poster-overlay"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handlePlayPause}
                  className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-cover bg-center cursor-pointer z-20"
                  style={{ backgroundImage: "linear-gradient(to top, rgba(9, 9, 11, 0.92), rgba(9, 9, 11, 0.7)), url('/media/video_thumbnail.png')" }}
                >
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-brand-purple to-brand-indigo shadow-lg shadow-brand-purple/30 hover:scale-105 transition-transform duration-300">
                    <Play className="h-9 w-9 text-white fill-white translate-x-0.5" />
                  </div>
                  <h3 className="font-sans text-2xl font-bold text-white">UPSC Tracker Walkthrough</h3>
                  <p className="mt-2 text-xs text-zinc-400">See the full UPSC Tracker OS dashboard in action</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Premium Video Control Bar */}
          <div className="flex items-center justify-between border-t border-white/5 bg-zinc-950 p-4 text-zinc-400 z-30 relative">
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePlayPause}
                className="rounded-lg p-1.5 hover:bg-zinc-900 hover:text-white transition-colors"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-zinc-400" />}
              </button>
              <button
                onClick={handleReset}
                className="rounded-lg p-1.5 hover:bg-zinc-900 hover:text-white transition-colors"
                title="Restart Video"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* Scrub Progress Bar */}
            <div 
              onClick={handleScrub}
              className="mx-4 flex-1 relative h-2 rounded-full bg-zinc-800 hover:bg-zinc-700/80 transition-colors cursor-pointer overflow-hidden group"
            >
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-brand-purple transition-all duration-100 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleMuteToggle}
                className="rounded-lg p-1.5 hover:bg-zinc-900 hover:text-white transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <button
                onClick={handleFullscreen}
                className="rounded-lg p-1.5 hover:bg-zinc-900 hover:text-white transition-colors"
                title="Fullscreen"
              >
                <Maximize className="h-4.5 w-4.5" />
              </button>
              <span className="font-mono text-xs text-zinc-500 min-w-[75px] text-right">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>

        </div>

        {/* Live Synced Caption Box */}
        <div className="mt-6 w-full max-w-4xl min-h-[90px] rounded-xl border border-white/5 bg-zinc-950/40 p-4 backdrop-blur-md flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCaptionIdx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="text-center"
            >
              <span className="inline-block rounded-full bg-brand-purple/10 border border-brand-purple/20 px-2.5 py-0.5 text-[9px] font-bold text-brand-purple uppercase tracking-wider mb-1">
                {activeCaption.highlightFeature}
              </span>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                {activeCaption.title}
              </h4>
              <p className="mt-1 text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                {activeCaption.text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
