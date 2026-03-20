
import { permanentRedirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

interface Props {
  params: { slug: string };
}

function categoryToSlug(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export default async function OldSlugRedirect({ params }: Props) {
  const { slug } = params;

 
  const startup = await prisma.startup.findFirst({
    where: {
      approved: true,
      OR: [{ slug }, { id: slug }],
    },
    select: { slug: true, id: true, category: true },
  });

  if (!startup) notFound();

  const cat      = categoryToSlug(startup.category);
  const pathSlug = startup.slug ?? startup.id;

  permanentRedirect(`/startup/${cat}/${pathSlug}`);
}