export const getDriveEmbedUrl = (link = '') => {
  if (!link) return '';

  const trimmed = link.trim();

  // If already published embed or preview link, use as-is
  if (trimmed.includes('embed') || trimmed.includes('preview') || trimmed.includes('pub')) {
    return trimmed;
  }

  // Convert common share links to embeddable preview links
  const matchId = trimmed.match(/[-\w]{25,}/);
  const id = matchId ? matchId[0] : '';

  if (!id) return trimmed;

  if (trimmed.includes('usp=drive_link') || trimmed.includes('drive.google.com/file')) {
    return `https://drive.google.com/file/d/${id}/preview`;
  }

  if (trimmed.includes('docs.google.com/document')) {
    return `https://docs.google.com/document/d/${id}/preview`;
  }

  if (trimmed.includes('docs.google.com/presentation')) {
    return `https://docs.google.com/presentation/d/${id}/embed`;
  }

  if (trimmed.includes('docs.google.com/spreadsheets')) {
    return `https://docs.google.com/spreadsheets/d/${id}/pubhtml`;
  }

  // Default to file preview
  return `https://drive.google.com/file/d/${id}/preview`;
};

export const getDriveImageUrl = (link = '') => {
  if (!link) return '';
  const matchId = link.match(/[-\w]{25,}/);
  const id = matchId ? matchId[0] : '';
  return id ? `https://drive.google.com/uc?export=view&id=${id}` : link;
};
