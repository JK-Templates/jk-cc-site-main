import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

/**
 * Semantic Search for RAG System
 * 
 * Provides semantic search capabilities using vector embeddings
 * for the Knowledge Seed RAG system.
 * 
 * Features:
 * - Vector similarity search
 * - Hybrid search (vector + full-text)
 * - Context retrieval for RAG
 * - Query expansion
 * - Result ranking and filtering
 */

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        // Allow anonymous users for search (adjust based on your needs)
        // if (!user) {
        //     return Response.json({ error: 'Unauthorized' }, { status: 401 });
        // }

        const { action, data } = await req.json();

        switch (action) {
            case 'semantic_search':
                return await semanticSearch(base44, user?.id, data);
            
            case 'hybrid_search':
                return await hybridSearch(base44, user?.id, data);
            
            case 'rag_query':
                return await ragQuery(base44, user?.id, data);
            
            case 'expand_query':
                return await expandQuery(base44, data);
            
            case 'get_context':
                return await getContext(base44, data);
            
            default:
                return Response.json({ error: 'Invalid action' }, { status: 400 });
        }

    } catch (error: any) {
        console.error("Semantic Search Error:", error);
        return Response.json({ 
            error: error.message,
            stack: error.stack 
        }, { status: 500 });
    }
});

/**
 * Perform semantic search using vector embeddings
 */
async function semanticSearch(base44: any, userId: string | undefined, data: any) {
    const { 
        query, 
        limit = 5, 
        threshold = 0.7,
        category = null,
        technicalDepth = null
    } = data;

    if (!query) {
        return Response.json({ error: 'query is required' }, { status: 400 });
    }

    try {
        // Generate embedding for the query
        // Note: In production, you'd use a proper embedding API
        const queryEmbedding = await generateQueryEmbedding(base44, query);

        // Build the search query
        let searchQuery = base44
            .rpc('search_knowledge_seeds', {
                query_embedding: queryEmbedding,
                match_threshold: threshold,
                match_count: limit
            });

        const { data: results, error } = await searchQuery;

        if (error) {
            throw new Error(`Search failed: ${error.message}`);
        }

        // Filter by category if specified
        let filteredResults = results;
        if (category) {
            filteredResults = results.filter((r: any) => r.category === category);
        }

        // Filter by technical depth if specified
        if (technicalDepth) {
            filteredResults = filteredResults.filter((r: any) => 
                r.technical_depth === technicalDepth
            );
        }

        // Track usage
        if (userId) {
            await trackSearch(base44, userId, query, filteredResults.map((r: any) => r.seed_id));
        }

        return Response.json({
            success: true,
            results: filteredResults,
            count: filteredResults.length,
            query,
            message: `נמצאו ${filteredResults.length} תוצאות`
        });

    } catch (error: any) {
        console.error("Semantic search error:", error);
        return Response.json({ 
            error: 'Search failed',
            details: error.message 
        }, { status: 500 });
    }
}

/**
 * Hybrid search combining vector similarity and full-text search
 */
async function hybridSearch(base44: any, userId: string | undefined, data: any) {
    const { 
        query, 
        limit = 10,
        vectorWeight = 0.7,
        textWeight = 0.3,
        category = null
    } = data;

    if (!query) {
        return Response.json({ error: 'query is required' }, { status: 400 });
    }

    try {
        // Perform vector search
        const vectorResults = await semanticSearch(base44, userId, {
            query,
            limit: limit * 2, // Get more results for merging
            category
        });

        // Perform full-text search
        let textQuery = base44
            .from('knowledge_seeds')
            .select('*')
            .textSearch('search_vector', query, {
                type: 'websearch',
                config: 'hebrew'
            })
            .limit(limit * 2);

        if (category) {
            textQuery = textQuery.eq('category', category);
        }

        const { data: textResults, error: textError } = await textQuery;

        if (textError) {
            console.error("Text search error:", textError);
        }

        // Merge and rank results
        const mergedResults = mergeSearchResults(
            await vectorResults.json(),
            textResults || [],
            vectorWeight,
            textWeight,
            limit
        );

        return Response.json({
            success: true,
            results: mergedResults,
            count: mergedResults.length,
            query,
            searchType: 'hybrid',
            message: `נמצאו ${mergedResults.length} תוצאות (חיפוש היברידי)`
        });

    } catch (error: any) {
        console.error("Hybrid search error:", error);
        return Response.json({ 
            error: 'Hybrid search failed',
            details: error.message 
        }, { status: 500 });
    }
}

/**
 * Full RAG query with context retrieval and response generation
 */
async function ragQuery(base44: any, userId: string | undefined, data: any) {
    const { 
        query, 
        contextLimit = 3,
        includeRelated = true,
        generateResponse = true
    } = data;

    if (!query) {
        return Response.json({ error: 'query is required' }, { status: 400 });
    }

    try {
        // Step 1: Retrieve relevant context
        const searchResults = await semanticSearch(base44, userId, {
            query,
            limit: contextLimit,
            threshold: 0.6
        });

        const searchData = await searchResults.json();
        const contexts = searchData.results || [];

        if (contexts.length === 0) {
            // No relevant context found - detect knowledge gap
            await base44.rpc('detect_knowledge_gap', {
                failed_query: query,
                suggested_topic: query
            });

            return Response.json({
                success: true,
                hasContext: false,
                message: 'לא נמצא הקשר רלוונטי. פער הידע תועד.',
                suggestion: 'אנא נסה לנסח את השאלה אחרת או הוסף מקורות ידע חדשים.'
            });
        }

        // Step 2: Get related seeds if requested
        let relatedSeeds: any[] = [];
        if (includeRelated) {
            for (const context of contexts) {
                const { data: related } = await base44.rpc('get_related_seeds', {
                    seed_uuid: context.seed_id,
                    max_results: 2
                });
                if (related) {
                    relatedSeeds.push(...related);
                }
            }
        }

        // Step 3: Build context for LLM
        const contextText = contexts.map((c: any, i: number) => 
            `[מקור ${i + 1}: ${c.title}]\n${c.core_summary}\n`
        ).join('\n');

        // Step 4: Generate response if requested
        let response = null;
        if (generateResponse) {
            const ragPrompt = `אתה עוזר AI מומחה. השתמש בהקשר הבא כדי לענות על השאלה.

הקשר רלוונטי:
${contextText}

שאלת המשתמש: ${query}

הנחיות:
1. ענה בעברית
2. התבסס רק על המידע שניתן בהקשר
3. אם המידע לא מספיק, ציין זאת בבירור
4. צטט את המקורות (מקור 1, מקור 2, וכו')
5. היה ספציפי וטכני

תשובה:`;

            const llmResult = await base44.integrations.Core.InvokeLLM({
                prompt: ragPrompt
            });

            response = llmResult;
        }

        // Step 5: Track query
        if (userId) {
            await base44.from('rag_query_history').insert({
                user_id: userId,
                query,
                retrieved_seeds: contexts.map((c: any) => c.seed_id),
                response: response || null
            });
        }

        // Step 6: Increment usage counters
        for (const context of contexts) {
            await base44.rpc('increment_seed_usage', {
                seed_uuid: context.seed_id
            });
        }

        return Response.json({
            success: true,
            hasContext: true,
            query,
            contexts,
            relatedSeeds,
            response,
            citations: contexts.map((c: any) => ({
                title: c.title,
                category: c.category,
                id: c.seed_id
            })),
            message: 'תשובה נוצרה בהצלחה'
        });

    } catch (error: any) {
        console.error("RAG query error:", error);
        return Response.json({ 
            error: 'RAG query failed',
            details: error.message 
        }, { status: 500 });
    }
}

/**
 * Expand query using LLM to generate alternative phrasings
 */
async function expandQuery(base44: any, data: any) {
    const { query } = data;

    if (!query) {
        return Response.json({ error: 'query is required' }, { status: 400 });
    }

    try {
        const expansionPrompt = `בהינתן השאלה הבאה, צור 3 ניסוחים חלופיים שישמרו את הכוונה המקורית אך ישתמשו במילים שונות.

שאלה מקורית: ${query}

החזר JSON עם מערך של ניסוחים חלופיים.`;

        const result = await base44.integrations.Core.InvokeLLM({
            prompt: expansionPrompt,
            response_json_schema: {
                type: "object",
                properties: {
                    alternatives: {
                        type: "array",
                        items: { type: "string" }
                    }
                },
                required: ["alternatives"]
            }
        });

        return Response.json({
            success: true,
            original: query,
            alternatives: result.alternatives,
            message: 'שאלה הורחבה בהצלחה'
        });

    } catch (error: any) {
        console.error("Query expansion error:", error);
        return Response.json({ 
            error: 'Query expansion failed',
            details: error.message 
        }, { status: 500 });
    }
}

/**
 * Get full context for a specific seed
 */
async function getContext(base44: any, data: any) {
    const { seedId, includeRelated = true } = data;

    if (!seedId) {
        return Response.json({ error: 'seedId is required' }, { status: 400 });
    }

    try {
        // Get the seed
        const { data: seed, error: seedError } = await base44
            .from('knowledge_seeds')
            .select('*')
            .eq('id', seedId)
            .single();

        if (seedError || !seed) {
            throw new Error('Seed not found');
        }

        // Get related seeds
        let related = [];
        if (includeRelated) {
            const { data: relatedData } = await base44.rpc('get_related_seeds', {
                seed_uuid: seedId,
                max_results: 5
            });
            related = relatedData || [];
        }

        return Response.json({
            success: true,
            seed,
            related,
            message: 'הקשר נטען בהצלחה'
        });

    } catch (error: any) {
        console.error("Get context error:", error);
        return Response.json({ 
            error: 'Failed to get context',
            details: error.message 
        }, { status: 500 });
    }
}

/**
 * Helper: Generate embedding for query
 * Note: This is a placeholder - implement with actual embedding API
 */
async function generateQueryEmbedding(base44: any, query: string): Promise<number[]> {
    // In production, you would call an embedding API (OpenAI, Cohere, etc.)
    // For now, return a dummy embedding
    // This should be replaced with actual embedding generation
    
    // Placeholder: return array of 1536 zeros (OpenAI ada-002 dimension)
    return new Array(1536).fill(0);
}

/**
 * Helper: Merge search results from vector and text search
 */
function mergeSearchResults(
    vectorResults: any,
    textResults: any[],
    vectorWeight: number,
    textWeight: number,
    limit: number
): any[] {
    const scoreMap = new Map();

    // Add vector results
    if (vectorResults.results) {
        vectorResults.results.forEach((result: any) => {
            scoreMap.set(result.seed_id, {
                ...result,
                score: result.similarity * vectorWeight
            });
        });
    }

    // Add text results
    textResults.forEach((result: any, index: number) => {
        const textScore = (1 - index / textResults.length) * textWeight;
        
        if (scoreMap.has(result.id)) {
            const existing = scoreMap.get(result.id);
            existing.score += textScore;
        } else {
            scoreMap.set(result.id, {
                seed_id: result.id,
                title: result.title,
                core_summary: result.core_summary,
                category: result.category,
                score: textScore
            });
        }
    });

    // Sort by combined score and return top results
    return Array.from(scoreMap.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}

/**
 * Helper: Track search for analytics
 */
async function trackSearch(
    base44: any, 
    userId: string, 
    query: string, 
    resultIds: string[]
): Promise<void> {
    try {
        await base44.from('rag_query_history').insert({
            user_id: userId,
            query,
            retrieved_seeds: resultIds
        });
    } catch (error) {
        console.error("Failed to track search:", error);
        // Don't throw - tracking failure shouldn't break search
    }
}
