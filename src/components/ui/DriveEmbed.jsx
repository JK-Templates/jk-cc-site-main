import React from 'react';
import { FileText, Table, Presentation, File } from 'lucide-react';

export default function DriveEmbed({ url, title }) {
    if (!url) return null;

    // Helper to determine type and construct embed URL
    const getEmbedConfig = (link) => {
        let embedUrl = link;
        let type = 'file';

        // Clean link
        const cleanLink = link.trim();

        if (cleanLink.includes('docs.google.com/document')) {
            type = 'doc';
            // Convert edit link to pub link if needed, though usually user should paste pub link
            // If it's a direct drive link, try preview
            if (!cleanLink.includes('/pub')) {
                 embedUrl = cleanLink.replace(/\/edit.*$/, '/preview');
            }
        } else if (cleanLink.includes('docs.google.com/spreadsheets')) {
            type = 'sheet';
            if (!cleanLink.includes('/pubhtml')) {
                 embedUrl = cleanLink.replace(/\/edit.*$/, '/preview');
            }
        } else if (cleanLink.includes('docs.google.com/presentation')) {
            type = 'slide';
            if (!cleanLink.includes('/embed')) {
                 embedUrl = cleanLink.replace(/\/edit.*$/, '/preview');
            }
        } else if (cleanLink.includes('drive.google.com/file')) {
            type = 'pdf'; // Generic file/PDF
            embedUrl = cleanLink.replace(/\/view.*$/, '/preview');
        }

        return { embedUrl, type };
    };

    const { embedUrl, type } = getEmbedConfig(url);

    return (
        <div className="w-full h-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800 relative">
            <iframe 
                src={embedUrl} 
                className="w-full h-full min-h-[500px]"
                frameBorder="0"
                allowFullScreen
                title={title}
            ></iframe>
            <div className="absolute top-2 right-2 p-2 bg-slate-900/80 backdrop-blur rounded text-slate-400">
                {type === 'doc' && <FileText className="w-4 h-4" />}
                {type === 'sheet' && <Table className="w-4 h-4" />}
                {type === 'slide' && <Presentation className="w-4 h-4" />}
                {type === 'pdf' && <File className="w-4 h-4" />}
            </div>
        </div>
    );
}