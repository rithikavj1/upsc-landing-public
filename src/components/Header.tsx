"use client";

import React from "react";
import { CheckCircle2, Cpu } from "lucide-react";

interface HeaderProps {
  onJoinClick: () => void;
}

export default function Header({ onJoinClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-brand-dark-bg/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-purple to-brand-indigo shadow-md shadow-brand-purple/20">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-base font-bold tracking-tight text-white">
              UPSC Tracker
            </span>
            <span className="font-mono text-[9px] font-semibold tracking-wider uppercase text-brand-purple">
              Operating System
            </span>
          </div>
        </div>

        {/* Founding Status badge */}
        <div className="hidden items-center space-x-2 rounded-full border border-brand-purple/20 bg-brand-purple/5 px-3 py-1 text-xs text-brand-purple sm:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-purple opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-purple"></span>
          </span>
          <span className="font-sans font-medium tracking-wide">
            Founding Aspirants Program Live
          </span>
        </div>

        {/* CTA Button */}
        <button
          onClick={onJoinClick}
          className="relative inline-flex h-9 items-center justify-center rounded-lg bg-white px-4 text-xs font-semibold text-zinc-950 transition-all duration-200 hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm shadow-white/10"
        >
          Become a Founding Aspirant
        </button>
      </div>
    </header>
  );
}
