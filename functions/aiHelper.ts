import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me(); // Verify auth generally
        
        // Allow public to use it? Probably better to restrict AI generation to admin or registered users to prevent abuse.
        // For now, let's assume registered users can use it for "interactive" features, 
        // but maybe only admin should update the DB. 
        // The user request implies these are features for the "creator" (user of the app builder) or the end-user interaction.
        // "Improve user interaction... enable AI to suggest..." implies end-users might use it too.
        
        if (!user) {
             return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { action, data } = await req.json();
        
        let prompt = "";
        let responseSchema = null;
        let systemRole = "You are a helpful AI assistant.";

        switch (action) {
            case 'summarize_codex':
                systemRole = "You are an expert synthesizer of information.";
                prompt = `Please provide a concise summary (max 3 sentences) of the following text:\n\n${data.text}`;
                break;
                
            case 'improve_prompt':
                systemRole = "You are an expert prompt engineer.";
                prompt = `Analyze the following prompt and suggest 3 improved variations or refinements to get better results. Format the output as a JSON object with a 'suggestions' array of strings.\n\nPrompt:\n${data.prompt}`;
                responseSchema = {
                    type: "object",
                    properties: {
                        suggestions: { type: "array", items: { type: "string" } }
                    },
                    required: ["suggestions"]
                };
                break;
                
            case 'project_description':
                systemRole = "You are a creative copywriter.";
                prompt = `Generate a concise and engaging description (max 200 characters) for a portfolio project with the following details:\n
                Title: ${data.title}\n
                Category: ${data.category}\n
                Tech Stack: ${data.technologies?.join(', ')}\n
                Context: ${data.description || 'No description provided.'}`;
                break;

            case 'refine_output':
                systemRole = "You are an expert editor and AI assistant.";
                prompt = `Original Prompt: "${data.original_prompt}"\n\nCurrent Output: "${data.current_output}"\n\nUser Feedback: "${data.feedback}"\n\nPlease refine the output based on the user's feedback. Return only the refined output.`;
                break;

            default:
                return Response.json({ error: 'Invalid action' }, { status: 400 });
        }

        const result = await base44.integrations.Core.InvokeLLM({
            prompt: prompt,
            response_json_schema: responseSchema,
            // We can add system instruction to the prompt if needed, or rely on the integration's default behavior.
            // The integration prompt is just a string.
        });

        // Parse result if it's JSON schema (InvokeLLM returns object if schema provided, string otherwise)
        // Actually Base44 integration returns the object directly if schema is used.
        
        return Response.json({ result });

    } catch (error) {
        console.error("AI Helper Error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});