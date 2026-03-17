"use server";

import { prisma } from "@/lib/prisma"; 

export async function incrementStartupView(id: string) {
  try {
    await prisma.startup.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    console.error("Failed to increment view count:", error);
  }
}