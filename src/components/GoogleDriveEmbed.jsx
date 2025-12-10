import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { getDriveEmbedUrl } from '@/utils/drive';

const FRAME_SANDBOX = 'allow-same-origin allow-scripts allow-popups allow-forms';

export default function GoogleDriveEmbed({ url, title = 'Google Drive embed', className = '', fallback }) {
  const [isLoading, setIsLoading] = useState(Boolean(url));
  const [hasError, setHasError] = useState(false);
  const embedUrl = getDriveEmbedUrl(url);

  useEffect(() => {
    setIsLoading(Boolean(embedUrl));
    setHasError(false);
  }, [embedUrl]);

  if (!embedUrl) {
    return fallback || null;
  }

  return (
    <div className={`relative w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950 ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/80">
          <div className="flex items-center gap-3 text-slate-300">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading Drive content…</span>
          </div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/90 text-slate-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-400" />
            <span>Unable to load Drive content.</span>
          </div>
        </div>
      )}

      <iframe
        src={embedUrl}
        title={title}
        className="h-full w-full min-h-[360px]"
        loading="lazy"
        sandbox={FRAME_SANDBOX}
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        allow="clipboard-write"
      />
    </div>
  );
}
