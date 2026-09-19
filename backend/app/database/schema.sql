-- ==============================================================================
-- DIGITALTRACE AI — SUPABASE POSTGRESQL SCHEMA
-- AI-Powered Public Profile & Digital Footprint Intelligence
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Targets Table (Consented Ingestions)
CREATE TABLE IF NOT EXISTS public.targets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    target_name TEXT,
    username TEXT,
    organization TEXT,
    location TEXT,
    image_url TEXT,
    keywords TEXT[],
    consent_acknowledged BOOLEAN DEFAULT TRUE NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'PROCESSED'
);

-- 2. Identity Candidates Table
CREATE TABLE IF NOT EXISTS public.identity_candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_id UUID REFERENCES public.targets(id) ON DELETE CASCADE,
    canonical_name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    handle_variations TEXT[],
    potential_aliases TEXT[],
    likelihood_score NUMERIC(4,3) NOT NULL,
    primary_organization TEXT,
    avatar_url TEXT,
    rationale TEXT,
    matched_signals TEXT[]
);

-- 3. Discovered Public Profiles Table
CREATE TABLE IF NOT EXISTS public.public_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_id UUID REFERENCES public.targets(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    handle TEXT NOT NULL,
    display_name TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    location TEXT,
    current_company TEXT,
    followers_count INTEGER,
    public_repos_count INTEGER,
    confidence_score NUMERIC(4,3) NOT NULL,
    match_reasons TEXT[],
    raw_data JSONB
);

-- 4. Extracted Entities Table (Person, Org, Role, Project, Event, Publication, Patent, etc.)
CREATE TABLE IF NOT EXISTS public.extracted_entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_id UUID REFERENCES public.targets(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT,
    organization TEXT,
    period_start TEXT,
    period_end TEXT,
    description TEXT,
    url TEXT,
    source_platform TEXT NOT NULL,
    confidence NUMERIC(4,3) NOT NULL,
    verification_status TEXT NOT NULL,
    supporting_evidence TEXT
);

-- 5. Evidence Matrix Table
CREATE TABLE IF NOT EXISTS public.evidence_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_id UUID REFERENCES public.targets(id) ON DELETE CASCADE,
    claim TEXT NOT NULL,
    source_platform TEXT NOT NULL,
    source_url TEXT NOT NULL,
    supporting_evidence TEXT NOT NULL,
    confidence NUMERIC(4,3) NOT NULL,
    verification_status TEXT NOT NULL,
    entities_involved TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Timeline Events Table
CREATE TABLE IF NOT EXISTS public.timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_id UUID REFERENCES public.targets(id) ON DELETE CASCADE,
    event_year INTEGER NOT NULL,
    date_display TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    category TEXT NOT NULL,
    organization TEXT,
    description TEXT,
    source_platform TEXT NOT NULL,
    source_url TEXT,
    confidence NUMERIC(4,3) NOT NULL,
    verification_status TEXT NOT NULL
);

-- 7. Relationship Graph Nodes and Edges
CREATE TABLE IF NOT EXISTS public.graph_nodes (
    id TEXT PRIMARY KEY,
    target_id UUID REFERENCES public.targets(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    node_type TEXT NOT NULL,
    sublabel TEXT,
    avatar TEXT,
    confidence NUMERIC(4,3) NOT NULL,
    verification_status TEXT NOT NULL,
    platform TEXT,
    properties JSONB
);

CREATE TABLE IF NOT EXISTS public.graph_edges (
    id TEXT PRIMARY KEY,
    target_id UUID REFERENCES public.targets(id) ON DELETE CASCADE,
    source_id TEXT NOT NULL,
    target_node_id TEXT NOT NULL,
    label TEXT NOT NULL,
    confidence NUMERIC(4,3) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    evidence TEXT
);

-- 8. Intelligence Reports Table
CREATE TABLE IF NOT EXISTS public.intelligence_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_id UUID REFERENCES public.targets(id) ON DELETE CASCADE UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    executive_summary TEXT NOT NULL,
    correlation_metrics JSONB NOT NULL,
    discrepancies JSONB NOT NULL,
    risk_analysis JSONB NOT NULL,
    full_dossier JSONB NOT NULL
);

-- Row Level Security (RLS) setup
ALTER TABLE public.targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.identity_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extracted_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.graph_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.graph_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intelligence_reports ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for demo authorization
CREATE POLICY "Allow public read on targets" ON public.targets FOR SELECT USING (true);
CREATE POLICY "Allow public insert on targets" ON public.targets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on reports" ON public.intelligence_reports FOR SELECT USING (true);
CREATE POLICY "Allow public insert on reports" ON public.intelligence_reports FOR INSERT WITH CHECK (true);
