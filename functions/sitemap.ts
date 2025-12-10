import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    const base44 = createClientFromRequest(req);
    const baseUrl = 'https://jonykashi.cc'; // Or retrieve dynamically

    try {
        // Fetch all dynamic content
        const [posts, projects, codex] = await Promise.all([
            base44.entities.BlogPost.list({ status: 'published' }),
            base44.entities.Project.list(),
            base44.entities.Codex.list()
        ]);

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>${baseUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
    <url><loc>${baseUrl}/Portfolio</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
    <url><loc>${baseUrl}/Codex</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
    <url><loc>${baseUrl}/AIPrompts</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
    <url><loc>${baseUrl}/Blog</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
`;

        // Add dynamic routes
        posts.forEach(post => {
            xml += `    <url><loc>${baseUrl}/BlogPost?id=${post.id}</loc><lastmod>${post.updated_date || post.created_date}</lastmod></url>\n`;
        });
        
        // Add others if they have dedicated pages
        
        xml += `</urlset>`;

        return new Response(xml, {
            headers: { 'Content-Type': 'application/xml' }
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});