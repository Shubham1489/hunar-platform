-- Enable pgvector extension for ML embeddings
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Confirm extensions loaded
SELECT extname FROM pg_extension;
