import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const base44 = createClientFromRequest(req);
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const entry = await base44.asServiceRole.entities.ContactMessage.create({
            name,
            email,
            message,
            submittedAt: new Date().toISOString(),
        });

        return Response.json({ success: true, id: entry.id });
    } catch (error) {
        console.error('Contact submission failed', error);
        return Response.json({ error: error.message ?? 'Internal server error' }, { status: 500 });
    }
});
