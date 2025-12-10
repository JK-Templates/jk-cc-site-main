import { getDriveEmbedUrl, getDriveImageUrl } from '@/utils/drive';

const heroImageEmbed = getDriveImageUrl(
  import.meta.env.VITE_DRIVE_HERO_IMAGE_EMBED_URL ||
    'https://drive.google.com/uc?export=view&id=1jzIXd4XCFBDsqHwlMBDVMZgT1ZgZ-cz5'
);

export const driveContentConfig = {
  hero: {
    title: import.meta.env.VITE_DRIVE_HERO_TITLE || 'ארכיטקטורה של מחשבה',
    subtitle:
      import.meta.env.VITE_DRIVE_HERO_SUBTITLE ||
      'יונתן קאשי. מפתח, יוצר והוגה. בונה גשרים בין טכנולוגיה, פילוסופיה ואמנות.',
    ctaPrimaryLabel: import.meta.env.VITE_DRIVE_HERO_CTA_PRIMARY || 'לצפייה בעבודות',
    ctaSecondaryLabel: import.meta.env.VITE_DRIVE_HERO_CTA_SECONDARY || 'הקודקס הפילוסופי',
    docEmbedUrl:
      import.meta.env.VITE_DRIVE_HERO_DOC_EMBED_URL ||
      getDriveEmbedUrl(
        'https://docs.google.com/document/d/e/2PACX-1vRO1M4M6uWqY3XgLJb0mDh1RcF0QFyYw0-kIB6kCLehTu3aC7Zr7X-DdGJcTmcVT0/pub?embedded=true'
      ),
    imageUrl: heroImageEmbed,
  },
  categories: {
    feedUrl: import.meta.env.VITE_DRIVE_CATEGORIES_FEED_URL || '',
    fallback: [
      {
        key: 'tech',
        icon: 'Code2',
        title: 'קוד וטכנולוגיה',
        description: 'פיתוח מערכות, אתרים ופרויקטים בקוד פתוח. Base44, אוטומציה ו-AI.',
        image: getDriveImageUrl('https://drive.google.com/uc?export=view&id=1mQTlE28mT1co2q1qYjX4y23sdTkeXnw3'),
        link: 'Portfolio',
      },
      {
        key: 'research',
        icon: 'Database',
        title: 'קודקס ומחקר',
        description: 'מסמכים אסטרטגיים, פילוסופיה של הבינה המלאכותית ופרוטוקולים.',
        image: getDriveImageUrl('https://drive.google.com/uc?export=view&id=1nJYGS1eNq9iLrRAC-bS-5Fl3olqYF3Vf'),
        link: 'Codex',
      },
      {
        key: 'aiVideo',
        icon: 'Film',
        title: 'סרטוני AI',
        description: 'פרסומות, טריילירים ויצירות וידאו שנוצרו בבינה מלאכותית.',
        image: getDriveImageUrl('https://drive.google.com/uc?export=view&id=16Nz_tEQ_2ce_0zS9HuPOX9ehZ3-6oQmE'),
        link: 'AIVideos',
      },
      {
        key: 'base44',
        icon: 'ExternalLink',
        title: 'Base44',
        description: 'פלטפורמת הפיתוח המהפכנית. המקום שבו הכל מתחבר.',
        image: getDriveImageUrl('https://drive.google.com/uc?export=view&id=1t3BwBf7IA-1GxXq2wW6TFkzkX8x6MFmc'),
        link: 'Base44',
      },
    ],
  },
};

export const iconMap = {
  Code2: 'Code2',
  Database: 'Database',
  Film: 'Film',
  ExternalLink: 'ExternalLink',
};
