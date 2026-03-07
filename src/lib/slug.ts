import { prisma } from '@/lib/prisma';

/**
 * Converts a startup name into a URL-safe SEO slug.
 *
 * Examples:
 *   "Lovable AI"     → "lovable-ai"
 *   "Rocket.new"     → "rocket-new"
 *   "GPT-4 Wrapper!" → "gpt-4-wrapper"
 *   "  My  App  "    → "my-app"
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '-')  
    .replace(/[\s_]+/g, '-')    
    .replace(/-+/g, '-')        
    .replace(/^-+|-+$/g, '');   
}

/**
 * Generates a guaranteed-unique slug for a startup.
 * Appends a counter on collision: "bolt" → "bolt-2" → "bolt-3"
 *
 * @param name        
 * @param excludeId   
 */
export async function generateUniqueSlug(
  name: string,
  excludeId?: string,
): Promise<string> {
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const existing = await prisma.startup.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing || existing.id === excludeId) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}