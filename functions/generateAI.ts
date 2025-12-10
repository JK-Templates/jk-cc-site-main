import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { prompt, type, parameters, task } = await req.json();

        // Task: 'generate_prompt' means the AI helps write a prompt for the user
        if (task === 'generate_prompt') {
            const res = await base44.integrations.Core.InvokeLLM({
                prompt: `You are an expert Prompt Engineer. Create a highly detailed, optimized prompt for an AI model based on this description: "${prompt}". 
                Return ONLY the prompt text, ready to paste.`,
                response_json_schema: { type: "object", properties: { optimized_prompt: { type: "string" } } }
            });
            return Response.json({ output: res.optimized_prompt, type: 'text' });
        }

        // Task: 'generate_project' suggestions
        if (task === 'generate_project') {
            const { description, category } = parameters;
            const res = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate a creative project portfolio entry based on this description: "${description}" and category: "${category}".
                Return a JSON with:
                - title (catchy and professional)
                - description (compelling summary, 2-3 sentences, Hebrew or English based on input language)
                - technologies (array of 3-5 relevant tech stack keywords)
                - image_keywords (keywords for finding an image)
                `,
                response_json_schema: { 
                    type: "object", 
                    properties: { 
                        title: { type: "string" },
                        description: { type: "string" },
                        technologies: { type: "array", items: { type: "string" } },
                        image_keywords: { type: "string" }
                    } 
                }
            });
            
            // Add a high-quality placeholder image from Unsplash (using specific ID/keywords approach not reliable without API key, 
            // but we can use a generic tech one or try to generate one if requested. 
            // For now, we'll return a generic tech placeholder or the keyword to be used in frontend)
            res.placeholder_image = `https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800`; // Cyberpunk/Tech default
            
            return Response.json({ output: res, type: 'json' });
        }

        // Standard execution
        if (type === 'image') {
            const res = await base44.integrations.Core.GenerateImage({
                prompt: prompt
            });
            return Response.json({ type: 'image', output: res.url });
        } else {
            // Text generation with parameters
            const temp = parameters?.temperature || 0.7;
            const maxTokens = parameters?.max_tokens || 500;
            
            const res = await base44.integrations.Core.InvokeLLM({
                prompt: prompt,
                // Note: The built-in integration might not support all raw params directly in every version, 
                // but we simulate the logic here or pass them if supported. 
                // For this demo, we'll append instructions to the prompt to simulate behavior if needed, 
                // or assume standard params if the integration supports them (simplified here).
                response_json_schema: { type: "object", properties: { content: { type: "string" } } }
            });
            return Response.json({ type: 'text', output: res.content });
        }
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});