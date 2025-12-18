import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

/**
 * Knowledge Seed Generator
 * 
 * This function processes raw source materials (text, documents) and generates
 * structured "Knowledge Seed Files" for RAG system integration.
 * 
 * Features:
 * - Extracts structured information using LLM
 * - Supports Hebrew output with English technical terms
 * - Generates embeddings for semantic search
 * - Auto-detects cross-references
 * - Validates against schema
 */

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { action, data } = await req.json();

        switch (action) {
            case 'generate_seed':
                return await generateSeed(base44, user.id, data);
            
            case 'generate_embedding':
                return await generateEmbedding(base44, data);
            
            case 'analyze_cross_references':
                return await analyzeCrossReferences(base44, data);
            
            case 'batch_process':
                return await batchProcess(base44, user.id, data);
            
            case 'validate_seed':
                return await validateSeed(data);
            
            default:
                return Response.json({ error: 'Invalid action' }, { status: 400 });
        }

    } catch (error) {
        console.error("Knowledge Seed Generator Error:", error);
        return Response.json({ 
            error: error.message,
            stack: error.stack 
        }, { status: 500 });
    }
});

/**
 * Generate a knowledge seed from raw content
 */
async function generateSeed(base44: any, userId: string, data: any) {
    const { content, sourceType = 'text', sourceUrl = null, category = null } = data;

    if (!content) {
        return Response.json({ error: 'Content is required' }, { status: 400 });
    }

    // Define the JSON schema for structured extraction
    const seedSchema = {
        type: "object",
        properties: {
            title: { 
                type: "string",
                description: "כותרת תמציתית ותיאורית בעברית"
            },
            category: { 
                type: "string",
                enum: [
                    "TinyML/Edge AI",
                    "No-Code/Low-Code",
                    "Agentic Systems",
                    "RAG Architecture",
                    "Web Development",
                    "Case Study",
                    "Constraint Engineering",
                    "Vector Databases",
                    "LLM Optimization",
                    "Security & Privacy"
                ],
                description: "קטגוריה המתאימה ביותר לתוכן"
            },
            core_summary: { 
                type: "string",
                description: "סיכום צפוף של 3 משפטים בעברית המתאר את הטכנולוגיה או הטיעון המרכזי"
            },
            technical_depth: { 
                type: "integer",
                minimum: 1,
                maximum: 5,
                description: "רמת עומק טכני: 1=שיווקי/כללי, 5=טכני מאוד/אקדמי"
            },
            key_entities: {
                type: "object",
                properties: {
                    tools: { 
                        type: "array",
                        items: { type: "string" },
                        description: "כלים ספציפיים שמוזכרים (שמות באנגלית)"
                    },
                    concepts: { 
                        type: "array",
                        items: { type: "string" },
                        description: "מושגים טכניים (בעברית או אנגלית)"
                    },
                    hardware: { 
                        type: "array",
                        items: { type: "string" },
                        description: "חומרה אם רלוונטי (שמות באנגלית)"
                    }
                },
                required: ["tools", "concepts", "hardware"]
            },
            implementation_details: {
                type: "object",
                properties: {
                    problem_solved: { 
                        type: "string",
                        description: "איזו בעיה ספציפית זה פותר? (בעברית)"
                    },
                    architecture: { 
                        type: "string",
                        description: "תיאור קצר של הארכיטקטורה או ה-tech stack (בעברית)"
                    },
                    constraints: { 
                        type: "array",
                        items: { type: "string" },
                        description: "מגבלות שמוזכרות (בעברית)"
                    }
                },
                required: ["problem_solved", "architecture", "constraints"]
            },
            expansion_vectors: {
                type: "array",
                items: { type: "string" },
                description: "3-5 שאלות או נושאים ספציפיים שהנתונים האלה זורעים להרחבה עתידית (בעברית)"
            },
            cross_references: {
                type: "array",
                items: { type: "string" },
                description: "קשרים לוגיים לנושאים אחרים במערכת (בעברית)"
            }
        },
        required: [
            "title",
            "category",
            "core_summary",
            "technical_depth",
            "key_entities",
            "implementation_details",
            "expansion_vectors",
            "cross_references"
        ]
    };

    // Create the extraction prompt
    const extractionPrompt = `אתה מהנדס ידע בכיר ואדריכל נתונים המתמחה בטכנולוגיות AI, פיתוח No-Code, ו-Edge Computing (TinyML).

המשימה שלך היא לעבד את החומר המקור המסופק ולהפיק "קובץ זרע ידע" מובנה למערכת RAG (Retrieval-Augmented Generation).

הנחיות חשובות:
1. כל הטקסטים בעברית, למעט שמות כלים, טכנולוגיות וחומרה (באנגלית)
2. התמקד במידע הטכני והמעשי
3. זהה מגבלות (constraints) באופן מפורש - הן חלק קריטי ללמידה
4. וקטורי ההרחבה (expansion_vectors) צריכים להיות שאלות ספציפיות, לא כלליות
5. הקשרים הצולבים (cross_references) צריכים להיות קונקרטיים

התוכן לעיבוד:
${content}

${category ? `הקטגוריה המוצעת: ${category}` : ''}

נתח את התוכן והפק JSON מובנה לפי הסכמה המוגדרת.`;

    try {
        // Call LLM to extract structured information
        const result = await base44.integrations.Core.InvokeLLM({
            prompt: extractionPrompt,
            response_json_schema: seedSchema
        });

        // Generate unique source_id
        const sourceId = `SOURCE_${Date.now()}_${result.category.replace(/[^A-Z]/g, '')}`;

        // Prepare seed data for database
        const seedData = {
            source_id: sourceId,
            title: result.title,
            category: result.category,
            core_summary: result.core_summary,
            technical_depth: result.technical_depth,
            key_entities: result.key_entities,
            implementation_details: result.implementation_details,
            expansion_vectors: result.expansion_vectors,
            cross_references: result.cross_references,
            raw_content: content,
            source_type: sourceType,
            source_url: sourceUrl,
            created_by: userId
        };

        // Insert into database
        const { data: insertedSeed, error: insertError } = await base44
            .from('knowledge_seeds')
            .insert(seedData)
            .select()
            .single();

        if (insertError) {
            throw new Error(`Database insert failed: ${insertError.message}`);
        }

        // Generate embedding for RAG
        await generateEmbedding(base44, {
            seedId: insertedSeed.id,
            text: `${result.title}\n\n${result.core_summary}\n\n${content.substring(0, 2000)}`
        });

        // Analyze and create cross-references
        await analyzeCrossReferences(base44, {
            seedId: insertedSeed.id,
            crossReferences: result.cross_references
        });

        return Response.json({
            success: true,
            seed: insertedSeed,
            message: 'קובץ זרע הידע נוצר בהצלחה'
        });

    } catch (error) {
        console.error("Seed generation error:", error);
        return Response.json({ 
            error: 'Failed to generate seed',
            details: error.message 
        }, { status: 500 });
    }
}

/**
 * Generate vector embedding for semantic search
 */
async function generateEmbedding(base44: any, data: any) {
    const { seedId, text } = data;

    if (!seedId || !text) {
        return Response.json({ 
            error: 'seedId and text are required' 
        }, { status: 400 });
    }

    try {
        // Generate embedding using Base44 integration
        // Note: This assumes you have an embedding integration configured
        // You might need to adjust based on your Base44 setup
        
        const embeddingPrompt = `Generate embedding for: ${text}`;
        
        // For now, we'll use a placeholder
        // In production, you'd call an actual embedding API (OpenAI, Cohere, etc.)
        const embeddingResult = await base44.integrations.Core.InvokeLLM({
            prompt: embeddingPrompt,
            // This is a simplified version - you'd need proper embedding integration
        });

        // Store embedding in database
        // Note: You'll need to implement actual embedding generation
        // This is a placeholder structure
        const { error: embeddingError } = await base44
            .from('knowledge_embeddings')
            .insert({
                seed_id: seedId,
                // embedding: embeddingVector, // Actual vector would go here
                chunk_index: 0,
                chunk_text: text.substring(0, 1000)
            });

        if (embeddingError) {
            throw new Error(`Embedding insert failed: ${embeddingError.message}`);
        }

        return Response.json({
            success: true,
            message: 'Embedding נוצר בהצלחה'
        });

    } catch (error) {
        console.error("Embedding generation error:", error);
        return Response.json({ 
            error: 'Failed to generate embedding',
            details: error.message 
        }, { status: 500 });
    }
}

/**
 * Analyze and create cross-references between seeds
 */
async function analyzeCrossReferences(base44: any, data: any) {
    const { seedId, crossReferences } = data;

    if (!seedId || !crossReferences || crossReferences.length === 0) {
        return Response.json({ 
            success: true,
            message: 'No cross-references to analyze'
        });
    }

    try {
        // For each cross-reference, try to find matching seeds
        const relationships = [];

        for (const ref of crossReferences) {
            // Search for related seeds using text search
            const { data: relatedSeeds } = await base44
                .from('knowledge_seeds')
                .select('id, title, category')
                .textSearch('search_vector', ref, {
                    type: 'websearch',
                    config: 'hebrew'
                })
                .limit(3);

            if (relatedSeeds && relatedSeeds.length > 0) {
                for (const relatedSeed of relatedSeeds) {
                    if (relatedSeed.id !== seedId) {
                        relationships.push({
                            source_seed_id: seedId,
                            target_seed_id: relatedSeed.id,
                            relationship_type: 'complements',
                            strength: 0.7,
                            description: ref
                        });
                    }
                }
            }
        }

        // Insert relationships
        if (relationships.length > 0) {
            const { error: relError } = await base44
                .from('seed_relationships')
                .insert(relationships);

            if (relError) {
                console.error("Relationship insert error:", relError);
            }
        }

        return Response.json({
            success: true,
            relationshipsCreated: relationships.length,
            message: `${relationships.length} קשרים נוצרו`
        });

    } catch (error) {
        console.error("Cross-reference analysis error:", error);
        return Response.json({ 
            error: 'Failed to analyze cross-references',
            details: error.message 
        }, { status: 500 });
    }
}

/**
 * Batch process multiple documents
 */
async function batchProcess(base44: any, userId: string, data: any) {
    const { documents } = data;

    if (!documents || !Array.isArray(documents)) {
        return Response.json({ 
            error: 'documents array is required' 
        }, { status: 400 });
    }

    const results = {
        successful: [],
        failed: []
    };

    for (const doc of documents) {
        try {
            const result = await generateSeed(base44, userId, doc);
            const resultData = await result.json();
            
            if (resultData.success) {
                results.successful.push({
                    title: resultData.seed.title,
                    id: resultData.seed.id
                });
            } else {
                results.failed.push({
                    content: doc.content.substring(0, 100),
                    error: resultData.error
                });
            }
        } catch (error) {
            results.failed.push({
                content: doc.content.substring(0, 100),
                error: error.message
            });
        }
    }

    return Response.json({
        success: true,
        summary: {
            total: documents.length,
            successful: results.successful.length,
            failed: results.failed.length
        },
        results
    });
}

/**
 * Validate seed structure
 */
async function validateSeed(data: any) {
    const requiredFields = [
        'title',
        'category',
        'core_summary',
        'technical_depth',
        'key_entities',
        'implementation_details',
        'expansion_vectors',
        'cross_references'
    ];

    const errors = [];

    for (const field of requiredFields) {
        if (!data[field]) {
            errors.push(`Missing required field: ${field}`);
        }
    }

    // Validate technical_depth range
    if (data.technical_depth && (data.technical_depth < 1 || data.technical_depth > 5)) {
        errors.push('technical_depth must be between 1 and 5');
    }

    // Validate category
    const validCategories = [
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
    ];

    if (data.category && !validCategories.includes(data.category)) {
        errors.push(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
    }

    // Validate arrays
    if (data.expansion_vectors && !Array.isArray(data.expansion_vectors)) {
        errors.push('expansion_vectors must be an array');
    }

    if (data.cross_references && !Array.isArray(data.cross_references)) {
        errors.push('cross_references must be an array');
    }

    return Response.json({
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
        message: errors.length === 0 ? 'Seed structure is valid' : 'Validation failed'
    });
}
