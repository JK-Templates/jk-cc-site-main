import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function SeoHead({ title, description, image, type = 'website', schema }) {
  const location = useLocation();
  const path = location.pathname.replace('/', '') || 'Home';

  // Fetch overrides from DB if available for this path
  const { data: metaOverride } = useQuery({
    queryKey: ['seo', path],
    queryFn: async () => {
        const res = await base44.entities.SEOMetadata.list({ page_path: `/${path}` });
        return res[0];
    },
    enabled: !!path
  });

  const finalTitle = metaOverride?.title || title || 'Jony Kashi | Architect of Thought';
  const finalDesc = metaOverride?.description || description || 'Portfolio of Jonathan Kashi. Developer, Creator, Thinker.';
  const finalImage = metaOverride?.og_image || image || 'https://jonykashi.cc/og-default.jpg';

  useEffect(() => {
    document.title = finalTitle;
    
    // Helper to update meta tags
    const updateMeta = (name, content, attribute = 'name') => {
        if (!content) return;
        let tag = document.querySelector(`meta[${attribute}="${name}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute(attribute, name);
            document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
    };

    updateMeta('description', finalDesc);
    updateMeta('keywords', metaOverride?.keywords);
    
    // OG Tags
    updateMeta('og:title', finalTitle, 'property');
    updateMeta('og:description', finalDesc, 'property');
    updateMeta('og:image', finalImage, 'property');
    updateMeta('og:type', type, 'property');

    // Schema.org
    if (schema) {
        let script = document.querySelector('#schema-jsonld');
        if (!script) {
            script = document.createElement('script');
            script.id = 'schema-jsonld';
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }
        script.text = JSON.stringify(schema);
    }

  }, [finalTitle, finalDesc, finalImage, type, schema]);

  return null;
}