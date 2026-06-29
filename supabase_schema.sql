-- SQL database schema for UPSC Tracker Founding Aspirants landing page
-- Run this in your Supabase SQL Editor to set up the backend.

-- 1. Feature Votes table
CREATE TABLE IF NOT EXISTS feature_votes (
    feature_name TEXT PRIMARY KEY,
    vote_count INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO feature_votes (feature_name, vote_count) VALUES
('AI Answer Evaluation', 428),
('AI Mentor', 315),
('AI Essay Reviewer', 289),
('AI Current Affairs', 367),
('AI Interview Coach', 182),
('Adaptive Planner', 254),
('Revision Engine', 298),
('Flashcards', 147),
('Curated YouTube Strategy Hub', 93),
('Android & iOS App', 512)
ON CONFLICT (feature_name) DO NOTHING;

-- 2. Comments table
CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO comments (id, name, role, text, created_at) VALUES
('1', 'Aarav Sharma', 'UPSC 2027 Aspirant (Delhi)', 'The Daily Tracker and Subject Hours Log are exactly what I need. Currently, Excel sheets are too messy to manage. Count me in for the Founding program!', NOW() - INTERVAL '4 hours'),
('2', 'Sneha Patel', 'UPSC 2028 Aspirant (Mumbai)', 'Having an AI Essay Reviewer on the roadmap is a game changer. UPSC evaluation is so subjective and expensive. Really excited about this OS concept.', NOW() - INTERVAL '12 hours'),
('3', 'Aditya Verma', 'UPSC 2027 Aspirant (Bengaluru)', 'Love the clean dark mode UI. Can we also have a Pomodoro timer integrated directly into the subject hour logger so it autologs? Great job founder!', NOW() - INTERVAL '24 hours'),
('4', 'Priya Rao', 'UPSC 2027 Aspirant (Hyderabad)', 'Consistency is my biggest issue. The heatmap calendar idea is super motivating, like GitHub but for studies. I'd definitely subscribe to this.', NOW() - INTERVAL '36 hours')
ON CONFLICT (id) DO NOTHING;

-- 3. Pain Survey table
CREATE TABLE IF NOT EXISTS pain_survey (
    challenge TEXT PRIMARY KEY,
    vote_count INTEGER NOT NULL DEFAULT 0
);

INSERT INTO pain_survey (challenge, vote_count) VALUES
('Consistency', 1240),
('Revision', 1102),
('Current Affairs', 984),
('PYQs', 832),
('Optional Subject', 745),
('Burnout', 621),
('Time Management', 954),
('Answer Writing', 889),
('Test Analysis', 530),
('Motivation', 412),
('Source Management', 673)
ON CONFLICT (challenge) DO NOTHING;

-- 4. Interest Check Aggregates table
CREATE TABLE IF NOT EXISTS interest_check (
    choice TEXT PRIMARY KEY,
    vote_count INTEGER NOT NULL DEFAULT 0
);

INSERT INTO interest_check (choice, vote_count) VALUES
('Yes', 612),
('No', 47),
('Other', 118)
ON CONFLICT (choice) DO NOTHING;

-- 5. Open-ended feedbacks table
CREATE TABLE IF NOT EXISTS interest_check_feedbacks (
    id BIGSERIAL PRIMARY KEY,
    choice TEXT NOT NULL,
    feedback_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Waitlist signup table
CREATE TABLE IF NOT EXISTS waitlist (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    target_year TEXT NOT NULL,
    optional_subject TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Referrals table
CREATE TABLE IF NOT EXISTS referrals (
    code TEXT PRIMARY KEY,
    referrer_email TEXT UNIQUE NOT NULL,
    signup_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security policies
ALTER TABLE feature_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pain_survey ENABLE ROW LEVEL SECURITY;
ALTER TABLE interest_check ENABLE ROW LEVEL SECURITY;
ALTER TABLE interest_check_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on feature_votes" ON feature_votes FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on feature_votes" ON feature_votes FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read on comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Allow public insert on comments" ON comments FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on pain_survey" ON pain_survey FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on pain_survey" ON pain_survey FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read on interest_check" ON interest_check FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on interest_check" ON interest_check FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public insert on interest_check_feedbacks" ON interest_check_feedbacks FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert on waitlist" ON waitlist FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read waitlist count" ON waitlist FOR SELECT USING (true);

CREATE POLICY "Allow public read on referrals" ON referrals FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on referrals" ON referrals FOR ALL USING (true) WITH CHECK (true);
