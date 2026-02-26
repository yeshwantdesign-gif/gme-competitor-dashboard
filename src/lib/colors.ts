const colorCache = new Map<string, string>();

const PALETTE = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899',
  '#06B6D4', '#F97316', '#14B8A6', '#6366F1', '#D946EF', '#84CC16',
  '#0EA5E9', '#E11D48', '#22C55E', '#FBBF24', '#A855F7', '#FB923C',
];

export function hashColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export async function extractDominantColor(imageUrl: string): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(img, 0, 0, 10, 10);
    const data = ctx.getImageData(0, 0, 10, 10).data;

    let bestColor = '';
    let bestSaturation = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
      if (a < 128) continue;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const l = (max + min) / 2;

      // Skip near-white, near-black
      if (l > 240 || l < 15) continue;

      const delta = max - min;
      const sat = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l / 255 - 1));
      if (sat > bestSaturation) {
        bestSaturation = sat;
        bestColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      }
    }

    return bestColor || null;
  } catch {
    return null;
  }
}

export { colorCache };
