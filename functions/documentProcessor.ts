import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

/**
 * Document Processor
 * 
 * Processes various document formats (PDF, DOCX, TXT) and extracts text content
 * for knowledge seed generation.
 * 
 * Features:
 * - PDF text extraction
 * - DOCX text extraction
 * - URL content fetching
 * - Text chunking for large documents
 * - Metadata extraction
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
            case 'process_file':
                return await processFile(base44, data);
            
            case 'process_url':
                return await processUrl(base44, data);
            
            case 'extract_metadata':
                return await extractMetadata(data);
            
            case 'chunk_text':
                return await chunkText(data);
            
            default:
                return Response.json({ error: 'Invalid action' }, { status: 400 });
        }

    } catch (error: any) {
        console.error("Document Processor Error:", error);
        return Response.json({ 
            error: error.message,
            stack: error.stack 
        }, { status: 500 });
    }
});

/**
 * Process uploaded file (PDF, DOCX, TXT)
 */
async function processFile(base44: any, data: any) {
    const { fileUrl, fileType, fileName } = data;

    if (!fileUrl) {
        return Response.json({ error: 'fileUrl is required' }, { status: 400 });
    }

    try {
        let extractedText = '';
        let metadata: any = {
            fileName,
            fileType,
            processedAt: new Date().toISOString()
        };

        // Fetch file content
        const response = await fetch(fileUrl);
        const fileBuffer = await response.arrayBuffer();

        switch (fileType?.toLowerCase()) {
            case 'pdf':
                extractedText = await extractFromPDF(fileBuffer);
                break;
            
            case 'docx':
            case 'doc':
                extractedText = await extractFromDOCX(fileBuffer);
                break;
            
            case 'txt':
            case 'text':
                extractedText = new TextDecoder().decode(fileBuffer);
                break;
            
            default:
                // Try to decode as text
                extractedText = new TextDecoder().decode(fileBuffer);
        }

        // Extract metadata
        metadata = {
            ...metadata,
            characterCount: extractedText.length,
            wordCount: extractedText.split(/\s+/).length,
            estimatedReadingTime: Math.ceil(extractedText.split(/\s+/).length / 200) // 200 words per minute
        };

        return Response.json({
            success: true,
            text: extractedText,
            metadata,
            message: 'קובץ עובד בהצלחה'
        });

    } catch (error: any) {
        console.error("File processing error:", error);
        return Response.json({ 
            error: 'Failed to process file',
            details: error.message 
        }, { status: 500 });
    }
}

/**
 * Extract text from PDF
 * Note: This is a simplified version. In production, you'd use a proper PDF library
 */
async function extractFromPDF(buffer: ArrayBuffer): Promise<string> {
    // For Deno, you might use: https://deno.land/x/pdf
    // This is a placeholder implementation
    
    try {
        // In a real implementation, you would use a PDF parsing library
        // For now, we'll return a message indicating PDF support needs to be added
        
        const text = new TextDecoder().decode(buffer);
        
        // Very basic PDF text extraction (not reliable for all PDFs)
        // This is just a placeholder - use a proper library in production
        const matches = text.match(/\(([^)]+)\)/g);
        if (matches) {
            return matches.map(m => m.slice(1, -1)).join(' ');
        }
        
        return text;
    } catch (error) {
        console.error("PDF extraction error:", error);
        throw new Error('PDF extraction failed. Please use a text file or implement proper PDF library.');
    }
}

/**
 * Extract text from DOCX
 * Note: This is a simplified version. In production, you'd use a proper DOCX library
 */
async function extractFromDOCX(buffer: ArrayBuffer): Promise<string> {
    // For Deno, you might use: https://deno.land/x/docx
    // This is a placeholder implementation
    
    try {
        // In a real implementation, you would use a DOCX parsing library
        // For now, we'll return a message indicating DOCX support needs to be added
        
        const text = new TextDecoder().decode(buffer);
        
        // Very basic DOCX text extraction (not reliable)
        // This is just a placeholder - use a proper library in production
        return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    } catch (error) {
        console.error("DOCX extraction error:", error);
        throw new Error('DOCX extraction failed. Please use a text file or implement proper DOCX library.');
    }
}

/**
 * Process content from URL
 */
async function processUrl(base44: any, data: any) {
    const { url } = data;

    if (!url) {
        return Response.json({ error: 'url is required' }, { status: 400 });
    }

    try {
        // Fetch URL content
        const response = await fetch(url);
        const html = await response.text();

        // Extract text from HTML (basic implementation)
        const text = extractTextFromHTML(html);

        // Extract metadata
        const metadata = {
            url,
            title: extractTitle(html),
            processedAt: new Date().toISOString(),
            characterCount: text.length,
            wordCount: text.split(/\s+/).length
        };

        return Response.json({
            success: true,
            text,
            metadata,
            message: 'תוכן מ-URL חולץ בהצלחה'
        });

    } catch (error: any) {
        console.error("URL processing error:", error);
        return Response.json({ 
            error: 'Failed to process URL',
            details: error.message 
        }, { status: 500 });
    }
}

/**
 * Extract text from HTML
 */
function extractTextFromHTML(html: string): string {
    // Remove script and style tags
    let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    
    // Remove HTML tags
    text = text.replace(/<[^>]+>/g, ' ');
    
    // Decode HTML entities
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/</g, '<');
    text = text.replace(/>/g, '>');
    text = text.replace(/"/g, '"');
    
    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
}

/**
 * Extract title from HTML
 */
function extractTitle(html: string): string {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : 'Untitled';
}

/**
 * Extract metadata from content
 */
async function extractMetadata(data: any) {
    const { text, sourceType = 'text' } = data;

    if (!text) {
        return Response.json({ error: 'text is required' }, { status: 400 });
    }

    try {
        const metadata = {
            sourceType,
            characterCount: text.length,
            wordCount: text.split(/\s+/).length,
            lineCount: text.split('\n').length,
            estimatedReadingTime: Math.ceil(text.split(/\s+/).length / 200),
            
            // Language detection (basic)
            hasHebrew: /[\u0590-\u05FF]/.test(text),
            hasEnglish: /[a-zA-Z]/.test(text),
            
            // Content analysis
            hasCode: /```|function|class|const|let|var/.test(text),
            hasLinks: /https?:\/\//.test(text),
            hasTechnicalTerms: /API|SDK|database|server|client/.test(text),
            
            processedAt: new Date().toISOString()
        };

        return Response.json({
            success: true,
            metadata,
            message: 'Metadata חולץ בהצלחה'
        });

    } catch (error: any) {
        console.error("Metadata extraction error:", error);
        return Response.json({ 
            error: 'Failed to extract metadata',
            details: error.message 
        }, { status: 500 });
    }
}

/**
 * Chunk large text into smaller pieces
 */
async function chunkText(data: any) {
    const { 
        text, 
        chunkSize = 1000, 
        overlap = 200,
        preserveParagraphs = true 
    } = data;

    if (!text) {
        return Response.json({ error: 'text is required' }, { status: 400 });
    }

    try {
        const chunks: Array<{
            index: number;
            text: string;
            startChar: number;
            endChar: number;
        }> = [];

        if (preserveParagraphs) {
            // Split by paragraphs first
            const paragraphs = text.split(/\n\n+/);
            let currentChunk = '';
            let chunkIndex = 0;
            let startChar = 0;

            for (const paragraph of paragraphs) {
                if (currentChunk.length + paragraph.length > chunkSize && currentChunk.length > 0) {
                    // Save current chunk
                    chunks.push({
                        index: chunkIndex++,
                        text: currentChunk.trim(),
                        startChar,
                        endChar: startChar + currentChunk.length
                    });
                    
                    // Start new chunk with overlap
                    const overlapText = currentChunk.slice(-overlap);
                    startChar += currentChunk.length - overlap;
                    currentChunk = overlapText + '\n\n' + paragraph;
                } else {
                    currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
                }
            }

            // Add last chunk
            if (currentChunk) {
                chunks.push({
                    index: chunkIndex,
                    text: currentChunk.trim(),
                    startChar,
                    endChar: startChar + currentChunk.length
                });
            }
        } else {
            // Simple character-based chunking
            let position = 0;
            let chunkIndex = 0;

            while (position < text.length) {
                const end = Math.min(position + chunkSize, text.length);
                const chunkText = text.slice(position, end);

                chunks.push({
                    index: chunkIndex++,
                    text: chunkText,
                    startChar: position,
                    endChar: end
                });

                position += chunkSize - overlap;
            }
        }

        return Response.json({
            success: true,
            chunks,
            totalChunks: chunks.length,
            message: `טקסט חולק ל-${chunks.length} חלקים`
        });

    } catch (error: any) {
        console.error("Text chunking error:", error);
        return Response.json({ 
            error: 'Failed to chunk text',
            details: error.message 
        }, { status: 500 });
    }
}
