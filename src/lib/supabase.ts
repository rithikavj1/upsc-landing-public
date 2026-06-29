// Supabase and Local Storage client adapter for UPSC Tracker Founding Aspirants landing page
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Real Supabase client (only initialized if variables exist)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial Mock Data (for fallback when Supabase is not configured)
const INITIAL_ROADMAP_VOTES: Record<string, number> = {
  "AI Answer Evaluation": 428,
  "AI Mentor": 315,
  "AI Essay Reviewer": 289,
  "AI Current Affairs": 367,
  "AI Interview Coach": 182,
  "Adaptive Planner": 254,
  "Revision Engine": 298,
  "Flashcards": 147,
  "Curated YouTube Strategy Hub": 93,
  "Android & iOS App": 512,
};

const INITIAL_PAIN_SURVEY: Record<string, number> = {
  "Consistency": 1240,
  "Revision": 1102,
  "Current Affairs": 984,
  "PYQs": 832,
  "Optional Subject": 745,
  "Burnout": 621,
  "Time Management": 954,
  "Answer Writing": 889,
  "Test Analysis": 530,
  "Motivation": 412,
  "Source Management": 673,
};

const INITIAL_INTEREST_CHECK: Record<string, number> = {
  "Yes": 612,
  "No": 47,
  "Other": 118,
};

export interface AspirantComment {
  id: string;
  name: string;
  text: string;
  role: string;
  created_at: string;
}

const INITIAL_COMMENTS: AspirantComment[] = [
  {
    id: "1",
    name: "Aarav Sharma",
    role: "UPSC 2027 Aspirant (Delhi)",
    text: "The Daily Tracker and Subject Hours Log are exactly what I need. Currently, Excel sheets are too messy to manage. Count me in for the Founding program!",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
  },
  {
    id: "2",
    name: "Sneha Patel",
    role: "UPSC 2028 Aspirant (Mumbai)",
    text: "Having an AI Essay Reviewer on the roadmap is a game changer. UPSC evaluation is so subjective and expensive. Really excited about this OS concept.",
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
  },
  {
    id: "3",
    name: "Aditya Verma",
    role: "UPSC 2027 Aspirant (Bengaluru)",
    text: "Love the clean dark mode UI. Can we also have a Pomodoro timer integrated directly into the subject hour logger so it autologs? Great job founder!",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
  },
  {
    id: "4",
    name: "Priya Rao",
    role: "UPSC 2027 Aspirant (Hyderabad)",
    text: "Consistency is my biggest issue. The heatmap calendar idea is super motivating, like GitHub but for studies. I'd definitely subscribe to this.",
    created_at: new Date(Date.now() - 3600000 * 36).toISOString(), // 1.5 days ago
  }
];

// Seed list of initial waitlist entries for demonstration
const INITIAL_WAITLIST: WaitlistEntry[] = [
  {
    name: "Aarav Sharma",
    email: "aarav.sharma@gmail.com",
    target_year: "2027",
    optional_subject: "PSIR",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    name: "Sneha Patel",
    email: "sneha.patel@hotmail.com",
    target_year: "2028",
    optional_subject: "Geography",
    created_at: new Date(Date.now() - 3600000 * 13).toISOString()
  },
  {
    name: "Karan Singh",
    email: "karan.singh98@yahoo.com",
    target_year: "2027",
    optional_subject: "Sociology",
    created_at: new Date(Date.now() - 3600000 * 25).toISOString()
  }
];

// Seed list of initial feedbacks
const INITIAL_FEEDBACKS = [
  {
    choice: "Other",
    text: "We need an integrated syllabus tracker that shows micro-topics so we don't get lost in subheadings.",
    date: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    choice: "Other",
    text: "I am ready to spend ₹1699/year only if the AI mentor can review answer sheets with standard PDF templates.",
    date: new Date(Date.now() - 3600000 * 10).toISOString()
  }
];

// Helper to initialize local storage
const getLocalStorageData = <T>(key: string, initial: T): T => {
  if (typeof window === 'undefined') return initial;
  const val = localStorage.getItem(key);
  if (!val) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(val);
  } catch {
    return initial;
  }
};

const setLocalStorageData = <T>(key: string, data: T): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

// --- DATA ACCESS LAYER ---

// 1. Feature Votes API
export async function getFeatureVotes(): Promise<Record<string, number>> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('feature_votes').select('feature_name, vote_count');
    if (!error && data && data.length > 0) {
      return data.reduce((acc, curr) => {
        acc[curr.feature_name] = curr.vote_count;
        return acc;
      }, {} as Record<string, number>);
    }
  }
  return getLocalStorageData('upsc_feature_votes', INITIAL_ROADMAP_VOTES);
}

export async function castFeatureVote(featureName: string): Promise<Record<string, number>> {
  if (isSupabaseConfigured && supabase) {
    const { data: current } = await supabase.from('feature_votes').select('vote_count').eq('feature_name', featureName).single();
    const currentVotes = current?.vote_count || 0;
    const { error } = await supabase.from('feature_votes').upsert({
      feature_name: featureName,
      vote_count: currentVotes + 1
    });
    if (!error) {
      return getFeatureVotes();
    }
  }
  const votes = getLocalStorageData('upsc_feature_votes', INITIAL_ROADMAP_VOTES);
  votes[featureName] = (votes[featureName] || 0) + 1;
  setLocalStorageData('upsc_feature_votes', votes);
  return votes;
}

// 2. Pain Survey API
export async function getPainSurvey(): Promise<Record<string, number>> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('pain_survey').select('challenge, vote_count');
    if (!error && data && data.length > 0) {
      return data.reduce((acc, curr) => {
        acc[curr.challenge] = curr.vote_count;
        return acc;
      }, {} as Record<string, number>);
    }
  }
  return getLocalStorageData('upsc_pain_survey', INITIAL_PAIN_SURVEY);
}

export async function submitPainVote(challenge: string): Promise<Record<string, number>> {
  if (isSupabaseConfigured && supabase) {
    const { data: current } = await supabase.from('pain_survey').select('vote_count').eq('challenge', challenge).single();
    const currentVotes = current?.vote_count || 0;
    const { error } = await supabase.from('pain_survey').upsert({
      challenge: challenge,
      vote_count: currentVotes + 1
    });
    if (!error) {
      return getPainSurvey();
    }
  }
  const survey = getLocalStorageData('upsc_pain_survey', INITIAL_PAIN_SURVEY);
  survey[challenge] = (survey[challenge] || 0) + 1;
  setLocalStorageData('upsc_pain_survey', survey);
  return survey;
}

// 3. Interest Check / Validation Poll API
export async function getInterestCheck(): Promise<Record<string, number>> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('interest_check').select('choice, vote_count');
    if (!error && data && data.length > 0) {
      return data.reduce((acc, curr) => {
        acc[curr.choice] = curr.vote_count;
        return acc;
      }, {} as Record<string, number>);
    }
  }
  return getLocalStorageData('upsc_interest_check', INITIAL_INTEREST_CHECK);
}

export async function submitInterestCheck(option: string, feedbackText?: string): Promise<Record<string, number>> {
  if (isSupabaseConfigured && supabase) {
    const { data: current } = await supabase.from('interest_check').select('vote_count').eq('choice', option).single();
    const currentVotes = current?.vote_count || 0;
    await supabase.from('interest_check').upsert({
      choice: option,
      vote_count: currentVotes + 1
    });
    
    if (feedbackText) {
      await supabase.from('interest_check_feedbacks').insert({
        choice: option,
        feedback_text: feedbackText
      });
    }
    return getInterestCheck();
  }
  
  const poll = getLocalStorageData('upsc_interest_check', INITIAL_INTEREST_CHECK);
  poll[option] = (poll[option] || 0) + 1;
  setLocalStorageData('upsc_interest_check', poll);

  if (feedbackText) {
    const feedbacks = getLocalStorageData<Array<{choice: string, text: string, date: string}>>('upsc_interest_feedbacks', INITIAL_FEEDBACKS);
    feedbacks.unshift({
      choice: option,
      text: feedbackText,
      date: new Date().toISOString()
    });
    setLocalStorageData('upsc_interest_feedbacks', feedbacks);
  }

  return poll;
}

export async function getInterestFeedbacks(): Promise<Array<{choice: string, text: string, date: string}>> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('interest_check_feedbacks').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      return data.map(d => ({
        choice: d.choice,
        text: d.feedback_text,
        date: d.created_at
      }));
    }
  }
  return getLocalStorageData('upsc_interest_feedbacks', INITIAL_FEEDBACKS);
}

// 4. Comments API
export async function getComments(): Promise<AspirantComment[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('comments').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      return data as AspirantComment[];
    }
  }
  return getLocalStorageData('upsc_comments', INITIAL_COMMENTS);
}

export async function addComment(name: string, role: string, text: string): Promise<AspirantComment[]> {
  const newComment: AspirantComment = {
    id: Math.random().toString(36).substring(2, 9),
    name,
    role,
    text,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('comments').insert({
      id: newComment.id,
      name: newComment.name,
      role: newComment.role,
      text: newComment.text,
      created_at: newComment.created_at
    });
    if (!error) {
      return getComments();
    }
  }

  const comments = getLocalStorageData('upsc_comments', INITIAL_COMMENTS);
  comments.unshift(newComment);
  setLocalStorageData('upsc_comments', comments);
  return comments;
}

// 5. Referrals API
export interface ReferralInfo {
  code: string;
  email: string;
  count: number;
}

export async function getReferralInfo(code: string): Promise<ReferralInfo | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('referrals').select('*').eq('code', code).single();
    if (!error && data) {
      return { code: data.code, email: data.referrer_email, count: data.signup_count };
    }
  }
  const referrals = getLocalStorageData<ReferralInfo[]>('upsc_referrals', []);
  return referrals.find(r => r.code === code) || null;
}

export async function createReferral(email: string): Promise<ReferralInfo> {
  const code = Math.random().toString(36).substring(2, 7).toUpperCase();
  const info: ReferralInfo = { code, email, count: 0 };
  
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('referrals').insert({
      code: info.code,
      referrer_email: info.email,
      signup_count: 0
    });
    if (!error) {
      return info;
    }
  }

  const referrals = getLocalStorageData<ReferralInfo[]>('upsc_referrals', []);
  const existing = referrals.find(r => r.email.toLowerCase() === email.toLowerCase());
  if (existing) return existing;

  referrals.push(info);
  setLocalStorageData('upsc_referrals', referrals);
  return info;
}

export async function useReferralCode(code: string): Promise<ReferralInfo | null> {
  if (isSupabaseConfigured && supabase) {
    const current = await getReferralInfo(code);
    if (current) {
      const { error } = await supabase.from('referrals').update({
        signup_count: current.count + 1
      }).eq('code', code);
      if (!error) {
        return { ...current, count: current.count + 1 };
      }
    }
  }
  const referrals = getLocalStorageData<ReferralInfo[]>('upsc_referrals', []);
  const idx = referrals.findIndex(r => r.code === code);
  if (idx !== -1) {
    referrals[idx].count += 1;
    setLocalStorageData('upsc_referrals', referrals);
    return referrals[idx];
  }
  return null;
}

// 6. Waitlist Onboarding API
export interface WaitlistEntry {
  name: string;
  email: string;
  target_year: string;
  optional_subject: string;
  created_at?: string;
}

export async function getWaitlistCount(): Promise<number> {
  if (isSupabaseConfigured && supabase) {
    const { count, error } = await supabase.from('waitlist').select('*', { count: 'exact', head: true });
    if (!error && count !== null) {
      return 1240 + count;
    }
  }
  const list = getLocalStorageData<WaitlistEntry[]>('upsc_waitlist', INITIAL_WAITLIST);
  return 1240 + list.length;
}

export async function getWaitlistEntries(): Promise<WaitlistEntry[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('waitlist').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      return data.map(d => ({
        name: d.name,
        email: d.email,
        target_year: d.target_year,
        optional_subject: d.optional_subject,
        created_at: d.created_at
      }));
    }
  }
  return getLocalStorageData<WaitlistEntry[]>('upsc_waitlist', INITIAL_WAITLIST);
}

export async function joinWaitlist(name: string, email: string, targetYear: string, optionalSubject: string): Promise<number> {
  const newEntry: WaitlistEntry = {
    name,
    email,
    target_year: targetYear,
    optional_subject: optionalSubject,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    await supabase.from('waitlist').insert({
      name: newEntry.name,
      email: newEntry.email,
      target_year: newEntry.target_year,
      optional_subject: newEntry.optional_subject,
      created_at: newEntry.created_at
    });
    return getWaitlistCount();
  }

  const list = getLocalStorageData<WaitlistEntry[]>('upsc_waitlist', INITIAL_WAITLIST);
  const existing = list.find(w => w.email.toLowerCase() === email.toLowerCase());
  if (!existing) {
    list.unshift(newEntry);
    setLocalStorageData('upsc_waitlist', list);
  }
  return 1240 + list.length;
}

// Helper to clear mock details for local testing resets
export function clearMockData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('upsc_waitlist');
    localStorage.removeItem('upsc_interest_feedbacks');
    localStorage.removeItem('upsc_interest_check');
    localStorage.removeItem('upsc_feature_votes');
    localStorage.removeItem('upsc_pain_survey');
    localStorage.removeItem('user_interest_choice');
    localStorage.removeItem('user_pain_voted');
    localStorage.removeItem('user_roadmap_voted');
    window.location.reload();
  }
}
