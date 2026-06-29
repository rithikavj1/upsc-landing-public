"use client";

import React, { useState } from "react";
import AnimatedBackground from "@/components/AnimatedBackground";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductPreview from "@/components/ProductPreview";
import DemoVideo from "@/components/DemoVideo";
import FeaturesGrid from "@/components/FeaturesGrid";
import VotingRoadmap from "@/components/VotingRoadmap";
import PainSurvey from "@/components/PainSurvey";
import InterestCheck from "@/components/InterestCheck";
import FounderStory from "@/components/FounderStory";
import WallOfAspirants from "@/components/WallOfAspirants";
import ReferralWidget from "@/components/ReferralWidget";
import AdminDashboard from "@/components/AdminDashboard";
import Footer from "@/components/Footer";
import WaitlistModal from "@/components/WaitlistModal";

export default function Home() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState<boolean>(false);

  const handleOpenWaitlist = () => {
    setIsWaitlistOpen(true);
  };

  const handleScrollToDemo = () => {
    const el = document.getElementById("demo-video");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden font-sans text-zinc-200">
      {/* Premium Glass & Blob Background Layer */}
      <AnimatedBackground />

      {/* Navigation Header */}
      <Header onJoinClick={handleOpenWaitlist} />

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero
          onWatchDemoClick={handleScrollToDemo}
          onJoinClick={handleOpenWaitlist}
        />

        {/* Live Product Preview */}
        <ProductPreview />

        {/* Demo Video Section */}
        <DemoVideo />

        {/* Features Grid - Available at Launch */}
        <FeaturesGrid />

        {/* Community Roadmap & Voting */}
        <VotingRoadmap />

        {/* UPSC Pain Survey */}
        <PainSurvey />

        {/* Interest Check Validation Poll */}
        <InterestCheck onJoinClick={handleOpenWaitlist} />

        {/* Founder Story */}
        <FounderStory />

        {/* Wall of Aspirants */}
        <WallOfAspirants />

        {/* Referral Program */}
        <ReferralWidget />

        {/* Founder Admin Analytics Console */}
        <AdminDashboard />
      </main>

      {/* Footer */}
      <Footer />

      {/* Waitlist Modal Onboarding */}
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </div>
  );
}
