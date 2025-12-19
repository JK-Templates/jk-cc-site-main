-- ============================================================================
-- Knowledge Seed System - Database Schema
-- ============================================================================
-- Purpose: Store and manage structured knowledge seed files for RAG system
-- Created: December 2024
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector"; -- For RAG embeddings (pgvector)

-- ============================================================================
-- Main Tables
-- ============================================================================

-- Knowledge Seeds Table
-- Stores the structured seed files extracted from source materials
CREATE TABLE IF NOT EXISTS knowledge_seeds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'TinyML/Edge AI',
        'No-Code/Low-Code',
        'Agentic Systems',
        'RAG Architecture',
        'Web Development',
        'Case Study',
        'Constraint Engineering',
        'Vector Databases',
        'LLM Optimization',
        'Security & Privacy'
    )),
    core_summary TEXT NOT NULL,
    technical_depth INTEGER NOT NULL CHECK (technical_depth BETWEEN 1 AND 5),
    
    -- JSON fields for structured data
    key_entities JSONB DEFAULT '{
        "tools": [],
        "concepts": [],
        "hardware": []
    }'::jsonb,
    
    implementation_details JSONB DEFAULT '{
        "problem_solved": "",
        "architecture": "",
        "constraints": []
    }'::jsonb,
    
    expansion_vectors TEXT[] DEFAULT ARRAY[]::TEXT[],
    cross_references TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Original content
    raw_content TEXT,
    source_type TEXT CHECK (source_type IN ('text', 'pdf', 'docx', 'url')),
    source_url TEXT,
    
    -- Metadata
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Quality metrics
    usage_count INTEGER DEFAULT 0,
    quality_score NUMERIC(3,2) DEFAULT 0.0 CHECK (quality_score BETWEEN 0 AND 5),
    
    -- Search optimization
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('hebrew', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('hebrew', coalesce(core_summary, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(raw_content, '')), 'C')
    ) STORED
);

-- Knowledge Embeddings Table
-- Stores vector embeddings for RAG semantic search
CREATE TABLE IF NOT EXISTS knowledge_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seed_id UUID NOT NULL REFERENCES knowledge_seeds(id) ON DELETE CASCADE,
    
    -- Vector embedding (1536 dimensions for OpenAI ada-002)
    embedding vector(1536),
    
    -- Chunk information (for large documents)
    chunk_index INTEGER DEFAULT 0,
    chunk_text TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(seed_id, chunk_index)
);

-- Seed Relationships Table
-- Tracks cross-references and relationships between seeds
CREATE TABLE IF NOT EXISTS seed_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_seed_id UUID NOT NULL REFERENCES knowledge_seeds(id) ON DELETE CASCADE,
    target_seed_id UUID NOT NULL REFERENCES knowledge_seeds(id) ON DELETE CASCADE,
    
    relationship_type TEXT NOT NULL CHECK (relationship_type IN (
        'extends',
        'contradicts',
        'complements',
        'prerequisite',
        'similar',
        'case_study_of'
    )),
    
    strength NUMERIC(3,2) DEFAULT 0.5 CHECK (strength BETWEEN 0 AND 1),
    description TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(source_seed_id, target_seed_id, relationship_type)
);

-- RAG Query History Table
-- Tracks RAG queries for analytics and improvement
CREATE TABLE IF NOT EXISTS rag_query_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    
    query TEXT NOT NULL,
    retrieved_seeds UUID[] DEFAULT ARRAY[]::UUID[],
    response TEXT,
    
    -- Quality metrics
    user_rating INTEGER CHECK (user_rating BETWEEN 1 AND 5),
    was_helpful BOOLEAN,
    
    -- Performance metrics
    retrieval_time_ms INTEGER,
    generation_time_ms INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge Gaps Table
-- Identifies missing knowledge areas based on failed queries
CREATE TABLE IF NOT EXISTS knowledge_gaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic TEXT NOT NULL,
    description TEXT,
    
    -- How many times this gap was identified
    occurrence_count INTEGER DEFAULT 1,
    
    -- Priority for filling this gap
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    
    status TEXT DEFAULT 'identified' CHECK (status IN (
        'identified',
        'in_progress',
        'filled',
        'dismissed'
    )),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(topic)
);

-- ============================================================================
-- Indexes for Performance
-- ============================================================================

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_knowledge_seeds_search 
ON knowledge_seeds USING GIN(search_vector);

-- Category and depth filtering
CREATE INDEX IF NOT EXISTS idx_knowledge_seeds_category 
ON knowledge_seeds(category);

CREATE INDEX IF NOT EXISTS idx_knowledge_seeds_depth 
ON knowledge_seeds(technical_depth);

-- Embedding similarity search (HNSW index for fast approximate nearest neighbor)
CREATE INDEX IF NOT EXISTS idx_knowledge_embeddings_vector 
ON knowledge_embeddings USING hnsw (embedding vector_cosine_ops);

-- Relationship queries
CREATE INDEX IF NOT EXISTS idx_seed_relationships_source 
ON seed_relationships(source_seed_id);

CREATE INDEX IF NOT EXISTS idx_seed_relationships_target 
ON seed_relationships(target_seed_id);

-- Usage tracking
CREATE INDEX IF NOT EXISTS idx_knowledge_seeds_usage 
ON knowledge_seeds(usage_count DESC);

-- Time-based queries
CREATE INDEX IF NOT EXISTS idx_knowledge_seeds_created 
ON knowledge_seeds(created_at DESC);

-- ============================================================================
-- Functions
-- ============================================================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for knowledge_seeds
CREATE TRIGGER update_knowledge_seeds_updated_at
    BEFORE UPDATE ON knowledge_seeds
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for knowledge_gaps
CREATE TRIGGER update_knowledge_gaps_updated_at
    BEFORE UPDATE ON knowledge_gaps
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Semantic search function
CREATE OR REPLACE FUNCTION search_knowledge_seeds(
    query_embedding vector(1536),
    match_threshold FLOAT DEFAULT 0.7,
    match_count INT DEFAULT 5
)
RETURNS TABLE (
    seed_id UUID,
    title TEXT,
    core_summary TEXT,
    category TEXT,
    similarity FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ks.id,
        ks.title,
        ks.core_summary,
        ks.category,
        1 - (ke.embedding <=> query_embedding) AS similarity
    FROM knowledge_embeddings ke
    JOIN knowledge_seeds ks ON ke.seed_id = ks.id
    WHERE 1 - (ke.embedding <=> query_embedding) > match_threshold
    ORDER BY ke.embedding <=> query_embedding
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- Increment usage count
CREATE OR REPLACE FUNCTION increment_seed_usage(seed_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE knowledge_seeds
    SET usage_count = usage_count + 1
    WHERE id = seed_uuid;
END;
$$ LANGUAGE plpgsql;

-- Auto-detect knowledge gaps
CREATE OR REPLACE FUNCTION detect_knowledge_gap(
    failed_query TEXT,
    suggested_topic TEXT
)
RETURNS UUID AS $$
DECLARE
    gap_id UUID;
BEGIN
    INSERT INTO knowledge_gaps (topic, description, priority)
    VALUES (
        suggested_topic,
        'Identified from query: ' || failed_query,
        'medium'
    )
    ON CONFLICT (topic) 
    DO UPDATE SET 
        occurrence_count = knowledge_gaps.occurrence_count + 1,
        updated_at = NOW()
    RETURNING id INTO gap_id;
    
    RETURN gap_id;
END;
$$ LANGUAGE plpgsql;

-- Get related seeds
CREATE OR REPLACE FUNCTION get_related_seeds(
    seed_uuid UUID,
    max_results INT DEFAULT 5
)
RETURNS TABLE (
    related_seed_id UUID,
    title TEXT,
    relationship_type TEXT,
    strength NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ks.id,
        ks.title,
        sr.relationship_type,
        sr.strength
    FROM seed_relationships sr
    JOIN knowledge_seeds ks ON sr.target_seed_id = ks.id
    WHERE sr.source_seed_id = seed_uuid
    ORDER BY sr.strength DESC
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE knowledge_seeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seed_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE rag_query_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_gaps ENABLE ROW LEVEL SECURITY;

-- Knowledge Seeds Policies
-- Anyone can read seeds
CREATE POLICY "Anyone can view knowledge seeds"
    ON knowledge_seeds FOR SELECT
    USING (true);

-- Only authenticated users can create seeds
CREATE POLICY "Authenticated users can create seeds"
    ON knowledge_seeds FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own seeds
CREATE POLICY "Users can update own seeds"
    ON knowledge_seeds FOR UPDATE
    USING (auth.uid() = created_by);

-- Users can delete their own seeds
CREATE POLICY "Users can delete own seeds"
    ON knowledge_seeds FOR DELETE
    USING (auth.uid() = created_by);

-- Knowledge Embeddings Policies
-- Anyone can read embeddings (for RAG search)
CREATE POLICY "Anyone can view embeddings"
    ON knowledge_embeddings FOR SELECT
    USING (true);

-- Only system can create/update embeddings
CREATE POLICY "System can manage embeddings"
    ON knowledge_embeddings FOR ALL
    USING (auth.uid() IS NOT NULL);

-- Seed Relationships Policies
-- Anyone can view relationships
CREATE POLICY "Anyone can view relationships"
    ON seed_relationships FOR SELECT
    USING (true);

-- Authenticated users can create relationships
CREATE POLICY "Authenticated users can create relationships"
    ON seed_relationships FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- RAG Query History Policies
-- Users can only see their own queries
CREATE POLICY "Users can view own queries"
    ON rag_query_history FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create their own queries
CREATE POLICY "Users can create queries"
    ON rag_query_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Knowledge Gaps Policies
-- Anyone can view gaps
CREATE POLICY "Anyone can view knowledge gaps"
    ON knowledge_gaps FOR SELECT
    USING (true);

-- Authenticated users can create gaps
CREATE POLICY "Authenticated users can create gaps"
    ON knowledge_gaps FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================================
-- Sample Data (Optional - for testing)
-- ============================================================================

-- Insert a sample seed
INSERT INTO knowledge_seeds (
    source_id,
    title,
    category,
    core_summary,
    technical_depth,
    key_entities,
    implementation_details,
    expansion_vectors,
    cross_references,
    raw_content,
    source_type
) VALUES (
    'SAMPLE_001_TINYML',
    'אופטימיזציה של K-Means למיקרו-בקרים',
    'TinyML/Edge AI',
    'מאמר זה מציג שיטה לאופטימיזציה של אלגוריתם K-Means לריצה על Arduino Nano 33 עם מגבלות זיכרון של 256KB. הפתרון משתמש בקוונטיזציה של 8-bit ובעיבוד אצווה להפחתת צריכת הזיכרון ב-75%. היישום מאפשר סיווג בזמן אמת של נתוני חיישנים עם דיוק של 92%.',
    5,
    '{
        "tools": ["Arduino Nano 33 BLE Sense", "TensorFlow Lite Micro", "Edge Impulse"],
        "concepts": ["K-Means Clustering", "Quantization", "Batch Processing", "Memory Optimization"],
        "hardware": ["Arduino Nano 33", "Cortex-M4", "256KB RAM"]
    }'::jsonb,
    '{
        "problem_solved": "הרצת אלגוריתמי ML מורכבים על חומרה מוגבלת בזיכרון",
        "architecture": "Pipeline של preprocessing → quantization → batch K-Means → post-processing",
        "constraints": ["זיכרון RAM: 256KB", "זמן ריצה מקסימלי: 100ms לדגימה", "דיוק מינימלי: 90%"]
    }'::jsonb,
    ARRAY[
        'כיצד ניתן להרחיב את הגישה לאלגוריתמים אחרים כמו SVM או Decision Trees?',
        'מהן האסטרטגיות לאופטימיזציה נוספת בעזרת SIMD instructions?',
        'איך ניתן לשלב את הפתרון עם מערכת No-Code כמו Bolt.new?'
    ],
    ARRAY[
        'מתחבר לנושא SLM Optimization - שיטות דומות לדחיסת מודלים',
        'רלוונטי ל-Google Apps Script Constraints - גישה דומה לעבודה עם מגבלות runtime'
    ],
    'Sample raw content for TinyML K-Means optimization...',
    'text'
) ON CONFLICT (source_id) DO NOTHING;

-- ============================================================================
-- Views for Analytics
-- ============================================================================

-- Popular seeds view
CREATE OR REPLACE VIEW popular_seeds AS
SELECT 
    id,
    title,
    category,
    usage_count,
    quality_score,
    created_at
FROM knowledge_seeds
ORDER BY usage_count DESC, quality_score DESC
LIMIT 20;

-- Knowledge coverage by category
CREATE OR REPLACE VIEW category_coverage AS
SELECT 
    category,
    COUNT(*) as seed_count,
    AVG(technical_depth) as avg_depth,
    AVG(quality_score) as avg_quality,
    SUM(usage_count) as total_usage
FROM knowledge_seeds
GROUP BY category
ORDER BY seed_count DESC;

-- Recent knowledge gaps
CREATE OR REPLACE VIEW recent_gaps AS
SELECT 
    topic,
    description,
    occurrence_count,
    priority,
    status,
    created_at
FROM knowledge_gaps
WHERE status IN ('identified', 'in_progress')
ORDER BY 
    CASE priority
        WHEN 'critical' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        WHEN 'low' THEN 4
    END,
    occurrence_count DESC;

-- ============================================================================
-- Grants (adjust based on your auth setup)
-- ============================================================================

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Grant access to tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- ============================================================================
-- Comments for Documentation
-- ============================================================================

COMMENT ON TABLE knowledge_seeds IS 'Stores structured knowledge seed files extracted from various sources';
COMMENT ON TABLE knowledge_embeddings IS 'Vector embeddings for semantic search in RAG system';
COMMENT ON TABLE seed_relationships IS 'Tracks relationships and cross-references between knowledge seeds';
COMMENT ON TABLE rag_query_history IS 'Logs all RAG queries for analytics and improvement';
COMMENT ON TABLE knowledge_gaps IS 'Identifies missing knowledge areas based on failed queries';

COMMENT ON FUNCTION search_knowledge_seeds IS 'Performs semantic search using vector similarity';
COMMENT ON FUNCTION increment_seed_usage IS 'Increments usage counter when a seed is accessed';
COMMENT ON FUNCTION detect_knowledge_gap IS 'Automatically detects and logs knowledge gaps';
COMMENT ON FUNCTION get_related_seeds IS 'Retrieves related seeds based on relationships';

-- ============================================================================
-- End of Schema
-- ============================================================================
