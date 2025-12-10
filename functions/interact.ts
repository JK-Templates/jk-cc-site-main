import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { entityName, entityId, action } = await req.json();

        // Simple like increment logic
        // In a real app with auth, we would track user_likes to prevent duplicates
        if (action === 'like') {
            const entity = await base44.asServiceRole.entities[entityName].get(entityId);
            const currentLikes = entity.likes || 0;
            
            await base44.asServiceRole.entities[entityName].update(entityId, {
                likes: currentLikes + 1
            });
            
            return Response.json({ success: true, newLikes: currentLikes + 1 });
        }

        return Response.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});