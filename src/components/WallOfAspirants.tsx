"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, MessageCircle, Send, Users, User, ShieldCheck } from "lucide-react";
import { getComments, addComment, AspirantComment } from "@/lib/supabase";

export default function WallOfAspirants() {
  const [comments, setComments] = useState<AspirantComment[]>([]);
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<string>("UPSC 2027 Aspirant");
  const [text, setText] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const roleOptions = [
    "UPSC 2027 Aspirant",
    "UPSC 2028 Aspirant",
    "UPSC 2026 Veteran",
    "Geography Optional",
    "History Optional",
    "Sociology Optional",
    "PSIR Optional",
    "Working Professional Aspirant"
  ];

  // Load comments
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getComments();
        setComments(data);
      } catch (err) {
        console.error("Failed to load comments:", err);
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      setError("Please fill out your name and feedback.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const updated = await addComment(name.trim(), role, text.trim());
      setComments(updated);
      setName("");
      setText("");
    } catch (err) {
      console.error("Error posting comment:", err);
      setError("Failed to publish comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to format date
  const formatTimeAgo = (dateStr: string) => {
    const time = new Date(dateStr).getTime();
    const diffMs = Date.now() - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <section id="wall-of-aspirants" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center">
        {/* Header */}
        <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-purple/10 border border-brand-purple/20 text-brand-purple">
          <Users className="h-5 w-5" />
        </div>
        <h2 className="text-center font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Wall of Aspirants
        </h2>
        <p className="mt-4 max-w-2xl text-center font-sans text-sm text-zinc-400">
          Hear from peer civil services candidates shaping their roadmap. Join the conversation and drop your feature suggestions below.
        </p>

        <div className="mt-12 grid w-full grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Feed Grid: Column span 2 */}
          <div className="lg:col-span-2 space-y-4 max-h-[500px] overflow-y-auto pr-2">
            <AnimatePresence initial={false}>
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl border border-white/5 bg-zinc-900/40 p-5 backdrop-blur-sm relative"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="h-8 w-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-400">
                        {comment.name === "Founder" ? (
                          <ShieldCheck className="h-4 w-4 text-brand-purple" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-sans text-xs font-bold text-white tracking-wide">
                          {comment.name}
                        </span>
                        <span className="font-sans text-[10px] text-zinc-500">
                          {comment.role}
                        </span>
                      </div>
                    </div>

                    <span className="font-mono text-[9px] text-zinc-500">
                      {formatTimeAgo(comment.created_at)}
                    </span>
                  </div>

                  {/* Body Text */}
                  <p className="font-sans text-xs text-zinc-300 leading-relaxed">
                    {comment.text}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>

            {comments.length === 0 && (
              <div className="text-center py-10 text-xs text-zinc-500 font-sans">
                No comments posted yet. Be the first to start!
              </div>
            )}
          </div>

          {/* Form Widget: Column span 1 */}
          <div className="lg:col-span-1 rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-xl backdrop-blur-md sticky top-20">
            <h3 className="font-sans text-base font-bold text-white mb-4 flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-brand-purple" /> Write Suggestion
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name field */}
              <div>
                <label htmlFor="aspirant-name" className="block font-sans text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  id="aspirant-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Kumar"
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple"
                />
              </div>

              {/* Role drop-down */}
              <div>
                <label htmlFor="aspirant-role" className="block font-sans text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Target Exam / Optional
                </label>
                <select
                  id="aspirant-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple"
                >
                  {roleOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-zinc-950">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Feedback text area */}
              <div>
                <label htmlFor="aspirant-text" className="block font-sans text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Your Comment / Feature Request
                </label>
                <textarea
                  id="aspirant-text"
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="What module should we add? Or what feature from launch are you excited about?"
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple resize-none"
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="text-[10px] text-brand-rose font-medium">
                  {error}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-brand-purple px-4 text-xs font-semibold text-white transition-all duration-200 hover:bg-brand-purple/95 active:scale-[0.98] disabled:opacity-50"
              >
                <Send className="h-3 w-3" />
                <span>{submitting ? "Posting..." : "Publish to Wall"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
