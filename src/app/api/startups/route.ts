import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';



export async function GET() {

  try {

    const startups = await prisma.startup.findMany({

      

      orderBy: [

        { pinnedAt: 'desc' }, 

        { createdAt: 'desc' }

      ],

      

      include: {

        _count: {

          select: { accessRequests: true }

        }

      }

    });



    return NextResponse.json(startups);

  } catch (error) {

    console.error('VibeStream Feed Error:', error);

    return NextResponse.json(

      { error: 'Failed to synchronize the Startup stream.' }, 

      { status: 500 }

    );

  }

}