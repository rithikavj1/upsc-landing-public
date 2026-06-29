"use client";

import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";

interface MediaContainerProps {
  src: string;
  type: "image" | "video";
  alt?: string;
  children: React.ReactNode; // The beautiful SVG/CSS mockup fallback
}

export default function MediaContainer({ src, type, alt = "media preview", children }: MediaContainerProps) {
  const [hasError, setHasError] = useState<boolean>(false);
  const [checkingPath, setCheckingPath] = useState<boolean>(true);

  // Check if media exists at path on mount / when src changes
  useEffect(() => {
    setCheckingPath(true);
    setHasError(false);

    if (!src) {
      setHasError(true);
      setCheckingPath(false);
      return;
    }

    const checkMedia = async () => {
      try {
        const response = await fetch(src, { method: "HEAD" });
        if (!response.ok) {
          setHasError(true);
        }
      } catch (err) {
        setHasError(true);
      } finally {
        setCheckingPath(false);
      }
    };

    checkMedia();
  }, [src]);

  const filename = src.split("/").pop();

  if (checkingPath) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-zinc-900/50 p-6 text-zinc-500 font-sans text-xs">
        <span>Checking media assets...</span>
      </div>
    );
  }

  // If the user's asset is missing, render the beautiful mockup fallback + configuration instructions
  if (hasError) {
    return (
      <div className="relative h-full w-full group">
        <div className="h-full w-full">{children}</div>

        {/* Floating Upload Guide Overlay */}
        <div className="absolute inset-0 bg-zinc-950/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center p-6 text-center transition-opacity duration-300 pointer-events-none">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-brand-purple mb-3">
            <Upload className="h-5 w-5" />
          </div>
          <span className="font-sans text-xs font-bold text-white tracking-wide">
            Interactive Placeholder active
          </span>
          <p className="mt-1 max-w-xs font-sans text-[10px] text-zinc-400 leading-normal">
            Upload your screenshot named <strong className="text-brand-purple font-mono font-bold">"{filename}"</strong> into the <span className="font-mono text-zinc-300">public/</span> folder to replace this illustration.
          </p>
        </div>
      </div>
    );
  }

  // If the asset exists, render it directly and fit it well (object-contain with deep dark background)
  return (
    <div className="h-full w-full overflow-hidden flex items-center justify-center bg-zinc-950/80 p-2">
      {type === "image" ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-contain rounded-lg border border-white/5 shadow-lg bg-zinc-950"
          onError={() => setHasError(true)}
        />
      ) : (
        <video
          src={src}
          controls
          poster="/media/video_thumbnail.png"
          className="h-full w-full object-contain rounded-lg border border-white/5 shadow-lg bg-zinc-950"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}
