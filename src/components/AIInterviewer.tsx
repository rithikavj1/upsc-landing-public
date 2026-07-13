"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Upload,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  BookOpen,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Send,
  Loader2,
} from "lucide-react";

interface DAFProfile {
  name: string;
  state: string;
  optional: string;
  hobbies: string;
}

interface Question {
  text: string;
  focusArea: string;
}

export default function AIInterviewer() {
  const [step, setStep] = useState<"setup" | "interview" | "result">("setup");
  const [profile, setProfile] = useState<DAFProfile>({
    name: "Rohan Sharma",
    state: "Bihar",
    optional: "Political Science (PSIR)",
    hobbies: "Trekking, Madhubani Painting",
  });
  const [customDraft, setCustomDraft] = useState<string>("");
  const [draftName, setDraftName] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  // Video and Audio streams
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [micActive, setMicActive] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  // Custom speech state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [typewriterText, setTypewriterText] = useState<string>("");
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [isAnswering, setIsAnswering] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [answersSubmitted, setAnswersSubmitted] = useState<string[]>([]);
  const [evaluating, setEvaluating] = useState<boolean>(false);

  // References
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // DAF Questions Database
  const questionsDB: Record<string, Question[]> = {
    Rohan: [
      {
        text: "Welcome Rohan. You chose Political Science and international relations as your optional. Can you comment on the relevance of JP Narayan's 'Total Revolution' in today's local decentralized governance, especially in Bihar?",
        focusArea: "Optional (PSIR) + State Background",
      },
      {
        text: "You mention Madhubani painting as a hobby. Folk arts are struggling economically. How would you leverage government schemes to boost rural tourism and artisans' livelihoods in Madhubani clusters?",
        focusArea: "Hobbies & Public Policy",
      },
      {
        text: "Let's move to general ethics. Imagine you are a District Magistrate and a violent protest erupts over a major highways project. How would you balance firm law enforcement with public communication and grievance redressal?",
        focusArea: "Administrative Decision Making (GS-4)",
      },
    ],
    Sneha: [
      {
        text: "Welcome Sneha. You have selected Geography as your optional. How does the current El Niño Southern Oscillation (ENSO) anomaly impact the drylands agriculture of the Deccan Plateau?",
        focusArea: "Optional (Geography) + Agriculture",
      },
      {
        text: "You enjoy Carnatic Music. How does classical music act as a bridge for cultural diplomacy in southern India, and how would you preserve it among rural youth?",
        focusArea: "Hobbies & Cultural Heritage",
      },
      {
        text: "Imagine you discover that a local public official is leaking tender details to private contractors in your department. What initial administrative inquiries would you set up to check this systemic corruption?",
        focusArea: "Administrative Ethics & Transparency",
      },
    ],
    Custom: [
      {
        text: "Welcome. Based on your uploaded draft, why do you believe your specific academic background and profile are uniquely suited for administrative service in India?",
        focusArea: "DAF Profile Analysis",
      },
      {
        text: "How do you balance the extreme depth required for your Optional Subject with the wide current affairs coverage needed for General Studies papers?",
        focusArea: "Preparation Strategy & Time Allocation",
      },
      {
        text: "Describe an ethical challenge you faced during your preparation or career, and how you resolved it using core public service values.",
        focusArea: "Ethical Integrity & Values",
      },
    ],
  };

  const activeQuestions = draftName ? questionsDB.Custom : (profile.name === "Rohan Sharma" ? questionsDB.Rohan : questionsDB.Sneha);
  const activeQuestion = activeQuestions[currentQuestionIdx];

  // Typewriter effect for AI board member
  useEffect(() => {
    if (step !== "interview" || !activeQuestion) return;
    
    setTypewriterText("");
    let i = 0;
    const interval = setInterval(() => {
      setTypewriterText((prev) => prev + activeQuestion.text.charAt(i));
      i++;
      if (i >= activeQuestion.text.length) {
        clearInterval(interval);
      }
    }, 25); // Speed of text speaking

    return () => clearInterval(interval);
  }, [currentQuestionIdx, step]);

  // Clean up streams on unmount
  useEffect(() => {
    return () => {
      stopMedia();
    };
  }, []);

  // Web camera controls
  const startMedia = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 400, height: 300, facingMode: "user" },
        audio: true,
      });
      setStream(userStream);
      setCameraActive(true);
      setMicActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = userStream;
      }
      setupAudioVisualizer(userStream);
    } catch (err) {
      console.warn("Camera or microphone permission blocked:", err);
      setCameraActive(false);
      setMicActive(false);
    }
  };

  const stopMedia = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setCameraActive(false);
    setMicActive(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCameraActive(videoTrack.enabled);
      }
    } else {
      startMedia();
    }
  };

  // Audio Canvas visualizer
  const setupAudioVisualizer = (mediaStream: MediaStream) => {
    if (!canvasRef.current) return;
    
    // Create audio nodes
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioContextClass();
    const source = audioCtx.createMediaStreamSource(mediaStream);
    const analyser = audioCtx.createAnalyser();
    
    analyser.fftSize = 64;
    source.connect(analyser);
    
    audioCtxRef.current = audioCtx;
    analyserRef.current = analyser;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const draw = () => {
      if (!analyserRef.current || !canvasRef.current) return;
      
      const width = canvas.width;
      const height = canvas.height;
      
      animationFrameRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      ctx.fillStyle = "rgba(9, 9, 11, 0.4)";
      ctx.fillRect(0, 0, width, height);
      
      const barWidth = (width / bufferLength) * 1.5;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const value = dataArray[i];
        const percent = value / 255;
        const barHeight = percent * height * 0.8;
        
        // Premium gradient colors (Purple to Indigo)
        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        gradient.addColorStop(0, "#8b5cf6");
        gradient.addColorStop(1, "#6366f1");
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);
        x += barWidth;
      }
    };
    
    draw();
  };

  // Handle mock file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setDraftName(file.name);
    
    // Simulate reading details
    setTimeout(() => {
      setUploading(false);
      setCustomDraft(`Draft uploaded: ${file.name} (${Math.round(file.size / 1024)} KB)`);
    }, 1500);
  };

  const handleSelectSample = (name: string) => {
    setDraftName("");
    setCustomDraft("");
    if (name === "Rohan") {
      setProfile({
        name: "Rohan Sharma",
        state: "Bihar",
        optional: "Political Science (PSIR)",
        hobbies: "Trekking, Madhubani Painting",
      });
    } else {
      setProfile({
        name: "Sneha Reddy",
        state: "Telangana",
        optional: "Geography",
        hobbies: "Carnatic Music, Cycling",
      });
    }
  };

  // Mock speech recording timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAnswering) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isAnswering]);

  const handleStartSpeaking = () => {
    if (!isAnswering) {
      setIsAnswering(true);
      setUserAnswer("");
      // Simulate audio waveform animation start
      if (!stream) {
        startMedia();
      }
    } else {
      setIsAnswering(false);
      // Simulate Speech-to-Text output
      setUserAnswer(
        "Based on my analysis, decentralized local governance has a key role in bridging regional imbalances. By incorporating schemes like local folk art and trekking paths under MSME tourism clusters, we can double employment..."
      );
    }
  };

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return;

    const nextAnswers = [...answersSubmitted, userAnswer.trim()];
    setAnswersSubmitted(nextAnswers);
    setUserAnswer("");

    if (currentQuestionIdx < activeQuestions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      // Last question finished, transition to evaluation
      setEvaluating(true);
      setTimeout(() => {
        setEvaluating(false);
        setStep("result");
        stopMedia();
      }, 3000);
    }
  };

  const formatRecordingTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <section id="ai-interviewer" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center space-x-2 rounded-full border border-brand-purple/20 bg-brand-purple/5 px-4 py-1.5 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-brand-purple animate-pulse" />
          <span className="font-sans text-[11px] font-semibold tracking-wider uppercase text-brand-purple">
            AI DAF-Based Mock Panel
          </span>
        </div>
        <h2 className="font-sans text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          AI Personalized Interviewer
        </h2>
        <p className="font-sans text-sm text-zinc-400 leading-relaxed">
          Upload your Detailed Application Form (DAF) or study notes. Activate your camera and experience a simulated high-fidelity UPSC civil services interview.
        </p>
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-zinc-950/40 p-6 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col justify-between">
        {/* Glow */}
        <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-brand-purple/5 blur-[120px]" />

        <AnimatePresence mode="wait">
          {/* STEP 1: SETUP INTERVIEW */}
          {step === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-6"
            >
              {/* Setup Left: Options */}
              <div className="space-y-6 text-left">
                <div className="space-y-2">
                  <h3 className="font-sans text-xl font-bold text-white">Configure Panel Profile</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Choose one of our candidate profiles to test the simulator immediately, or upload your own custom DAF/notes to personalize questions.
                  </p>
                </div>

                {/* Profiles cards */}
                <div className="space-y-3">
                  <span className="font-sans text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Choose Candidate Profile</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => handleSelectSample("Rohan")}
                      className={`rounded-xl border p-4 text-left transition-all ${
                        profile.name === "Rohan Sharma" && !draftName
                          ? "border-brand-purple bg-brand-purple/5"
                          : "border-white/5 bg-zinc-900/40 hover:bg-zinc-800/40"
                      }`}
                    >
                      <strong className="text-xs text-white block">Rohan Sharma</strong>
                      <span className="text-[10px] text-zinc-400 block mt-1">State: Bihar</span>
                      <span className="text-[10px] text-zinc-400 block">Optional: PSIR</span>
                      <span className="text-[10px] text-brand-purple font-medium block mt-1.5">Focus: Governance & Art</span>
                    </button>

                    <button
                      onClick={() => handleSelectSample("Sneha")}
                      className={`rounded-xl border p-4 text-left transition-all ${
                        profile.name === "Sneha Reddy" && !draftName
                          ? "border-brand-purple bg-brand-purple/5"
                          : "border-white/5 bg-zinc-900/40 hover:bg-zinc-800/40"
                      }`}
                    >
                      <strong className="text-xs text-white block">Sneha Reddy</strong>
                      <span className="text-[10px] text-zinc-400 block mt-1">State: Telangana</span>
                      <span className="text-[10px] text-zinc-400 block">Optional: Geography</span>
                      <span className="text-[10px] text-brand-purple font-medium block mt-1.5">Focus: El Niño & Classical Music</span>
                    </button>
                  </div>
                </div>

                {/* Draft Uploader */}
                <div className="space-y-2">
                  <span className="font-sans text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Or Upload Your DAF / Draft</span>
                  
                  <div className="relative rounded-xl border border-dashed border-white/10 bg-zinc-900/20 p-6 flex flex-col items-center justify-center text-center hover:bg-zinc-900/40 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.txt"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {uploading ? (
                      <div className="flex flex-col items-center space-y-2 py-2">
                        <Loader2 className="h-6 w-6 text-brand-purple animate-spin" />
                        <span className="text-xs text-zinc-400">Parsing DAF keywords...</span>
                      </div>
                    ) : draftName ? (
                      <div className="flex flex-col items-center space-y-1 py-1">
                        <CheckCircle2 className="h-6 w-6 text-brand-emerald" />
                        <span className="text-xs text-white font-semibold">{draftName}</span>
                        <span className="text-[9px] text-zinc-500">Click to upload another</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 text-zinc-500 mb-2" />
                        <span className="text-xs text-white font-medium">Drag & Drop DAF (PDF/Image)</span>
                        <span className="text-[10px] text-zinc-500 mt-1">Accepts notes, drafts, or structured PDF templates</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Setup Right: Audio/Video check */}
              <div className="rounded-2xl border border-white/5 bg-zinc-900/20 p-6 flex flex-col items-center justify-center text-center space-y-6">
                <div className="h-16 w-16 rounded-full bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple">
                  <Video className="h-7 w-7" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Camera & Microphone Access</h4>
                  <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                    To make the mock experience feel authentic, we request authorization to capture your camera. The stream stays local in your browser.
                  </p>
                </div>

                <button
                  onClick={() => {
                    startMedia();
                    setStep("interview");
                  }}
                  className="w-full inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo px-5 text-xs font-bold text-white transition-all hover:from-brand-purple/95 hover:to-brand-indigo/95 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-brand-purple/20"
                >
                  <Play className="h-4 w-4 fill-white" /> Start AI Mock Panel
                </button>

                <button
                  onClick={() => {
                    setStep("interview");
                  }}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-medium"
                >
                  Launch without camera (avatar mode)
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: THE INTERVIEW PROCESS */}
          {step === "interview" && (
            <motion.div
              key="interview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 py-2"
            >
              {/* Split Screen Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                
                {/* Left Panel: Aspirant / Camera feed */}
                <div className="rounded-2xl border border-white/10 bg-zinc-950 overflow-hidden relative aspect-video flex flex-col justify-end">
                  {cameraActive ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover absolute inset-0"
                    />
                  ) : (
                    /* Elegant face scanner placeholder */
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-zinc-950 text-center">
                      <div className="relative h-28 w-28 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-900/40">
                        <div className="absolute inset-0 border border-brand-purple/30 rounded-full animate-ping" />
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">No Camera</span>
                      </div>
                      
                      {/* Scanning visual effect */}
                      <div className="absolute inset-x-0 top-1/4 h-0.5 bg-gradient-to-r from-transparent via-brand-purple to-transparent animate-pulse" />
                    </div>
                  )}

                  {/* Camera overlay UI */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent flex justify-between items-center z-10">
                    <div className="flex items-center space-x-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${cameraActive ? 'bg-brand-emerald animate-pulse' : 'bg-zinc-650'}`} />
                      <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-300 font-bold">
                        {draftName ? "Aspirant: Custom Draft" : `Aspirant: ${profile.name}`}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={toggleCamera}
                        className="rounded-lg p-1.5 bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white transition-colors"
                        title={cameraActive ? "Mute Video" : "Start Video"}
                      >
                        {cameraActive ? <Video className="h-3.5 w-3.5" /> : <VideoOff className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Panel: UPSC Board Member */}
                <div className="rounded-2xl border border-white/10 bg-zinc-900/50 overflow-hidden relative aspect-video flex flex-col justify-between p-6">
                  {/* Backdrop artwork details */}
                  <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/5 to-transparent pointer-events-none -z-10" />

                  {/* Panel Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-lg bg-zinc-950 border border-white/5 flex items-center justify-center text-xs font-bold text-zinc-300">
                        P1
                      </div>
                      <div>
                        <strong className="text-xs text-white block">Dr. B. K. Mathur</strong>
                        <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-mono font-bold block">UPSC Chairperson Panel</span>
                      </div>
                    </div>

                    <span className="rounded bg-brand-purple/10 border border-brand-purple/20 px-2 py-0.5 text-[9px] text-brand-purple font-bold uppercase tracking-wider">
                      Question {currentQuestionIdx + 1} of 3
                    </span>
                  </div>

                  {/* Speech box */}
                  <div className="flex-grow flex items-center justify-center py-4">
                    <p className="font-sans text-xs text-white text-center leading-relaxed max-w-sm italic">
                      "{typewriterText || "Preparing question..."}"
                    </p>
                  </div>

                  {/* Dynamic Speech Wave indicator */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-3 text-[10px]">
                    <div className="flex items-center space-x-2">
                      <span className="text-zinc-500 uppercase tracking-widest text-[8px] font-bold">Focus Area:</span>
                      <span className="text-brand-purple font-medium">{activeQuestion?.focusArea || "General Evaluation"}</span>
                    </div>

                    {/* Animated Speech Wave Bars */}
                    {typewriterText.length < (activeQuestion?.text.length || 0) && (
                      <div className="flex space-x-0.5 items-end h-3">
                        <div className="w-0.5 bg-brand-purple animate-sound-bar-1" style={{ height: "6px" }} />
                        <div className="w-0.5 bg-brand-purple animate-sound-bar-2" style={{ height: "10px" }} />
                        <div className="w-0.5 bg-brand-purple animate-sound-bar-3" style={{ height: "8px" }} />
                        <div className="w-0.5 bg-brand-purple animate-sound-bar-2" style={{ height: "12px" }} />
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Lower Section: User Voice/Type Answer Panel */}
              <div className="rounded-2xl border border-white/5 bg-zinc-950 p-5 space-y-4">
                
                {/* Audio Wave Visualizer canvas */}
                <div className="flex items-center gap-4">
                  <div className="h-10 w-28 bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
                    <canvas ref={canvasRef} width="112" height="40" className="w-full h-full" />
                  </div>
                  
                  <div className="flex-grow text-left">
                    <span className="font-sans text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Response Status</span>
                    <strong className="text-xs text-white">
                      {isAnswering ? `Recording Active... [${formatRecordingTime(recordingSeconds)}]` : "Select a response method below to answer the panel"}
                    </strong>
                  </div>
                </div>

                {/* Input Controls */}
                <div className="space-y-3">
                  <textarea
                    rows={2}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={isAnswering}
                    placeholder="Type your UPSC answer here, or click 'Speak Answer' to simulate microphone dictation..."
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-650 focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple resize-none disabled:opacity-50"
                  />

                  <div className="flex justify-between items-center">
                    <button
                      onClick={handleStartSpeaking}
                      className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-4 text-xs font-bold transition-all ${
                        isAnswering
                          ? "bg-brand-rose text-white animate-pulse"
                          : "bg-zinc-900 text-zinc-300 border border-white/5 hover:text-white"
                      }`}
                    >
                      {isAnswering ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                      <span>{isAnswering ? "Stop Recording" : "Speak Answer"}</span>
                    </button>

                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!userAnswer.trim() || evaluating}
                      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-brand-purple px-4 text-xs font-bold text-white transition-all hover:bg-brand-purple/90 active:scale-[0.98] disabled:opacity-40"
                    >
                      {evaluating ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Evaluating...
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" /> Submit Response
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SCORECARD / PERFORMANCE DETAILS */}
          {step === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6 py-4"
            >
              {/* Scorecard Header */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="font-sans text-xl font-bold text-white">Evaluation Complete</h3>
                <p className="text-xs text-zinc-400 max-w-sm">
                  The UPSC AI Mock Panel has generated your performance feedback card based on the 3 submitted responses.
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="rounded-xl border border-white/5 bg-zinc-900/30 p-4 space-y-1.5 text-center">
                  <span className="font-sans text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Structure & Flow</span>
                  <strong className="text-2xl text-white font-mono">8.4<span className="text-[10px] text-zinc-500 font-normal">/10</span></strong>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    Good introduction formatting. Linking core topics to GS syllabus markers was smooth.
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-zinc-900/30 p-4 space-y-1.5 text-center">
                  <span className="font-sans text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Syllabus Depth</span>
                  <strong className="text-2xl text-brand-purple font-mono">7.8<span className="text-[10px] text-zinc-500 font-normal">/10</span></strong>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    Satisfactory optional concepts. You can add more constitutional articles to enhance answer validity.
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-zinc-900/30 p-4 space-y-1.5 text-center">
                  <span className="font-sans text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Speech Pacing & Tone</span>
                  <strong className="text-2xl text-brand-cyan font-mono">9.1<span className="text-[10px] text-zinc-500 font-normal">/10</span></strong>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    Calm tone, professional vocabulary, and clear voice delivery. Avoid overly-abrupt endings.
                  </p>
                </div>

              </div>

              {/* Feedbacks box */}
              <div className="rounded-2xl border border-brand-purple/20 bg-brand-purple/5 p-5 text-left space-y-2">
                <span className="font-sans text-[10px] font-bold text-brand-purple uppercase tracking-widest flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" /> Detailed Panel Remarks
                </span>
                <p className="font-sans text-xs text-zinc-300 leading-relaxed">
                  "Your explanation of local developmental challenges and balancing security with grievance redressal was commendable Rohan. However, in your optional subject query, you missed noting local panchayat financial statistics from the 15th Finance Commission. Pacing and delivery were stable. Excellent potential."
                </p>
              </div>

              {/* Onboarding CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => {
                    setStep("setup");
                    setCurrentQuestionIdx(0);
                    setAnswersSubmitted([]);
                  }}
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900/60 px-6 font-sans text-xs font-bold text-white transition-all hover:bg-zinc-800"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Re-take Interview
                </button>

                <button
                  onClick={() => {
                    // Open waitlist modal trigger via local storage/callback binding
                    const btn = document.querySelector('[data-waitlist-trigger]') as HTMLButtonElement;
                    if (btn) btn.click();
                  }}
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo px-6 font-sans text-xs font-bold text-white transition-all hover:scale-[1.01]"
                >
                  <UserCheck className="h-3.5 w-3.5" /> Join Waitlist to Unlock Unlimited Mock Panels
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
