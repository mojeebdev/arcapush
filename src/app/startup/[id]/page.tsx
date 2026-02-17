
import { prisma } from '@/lib/prisma';

import { notFound } from 'next/navigation';



interface PageProps {

  params: Promise<{ id: string }>;

}



export default async function StartupDetailsPage({ params }: PageProps) {

  const { id } = await params;

  const startup = await prisma.startup.findUnique({

    where: { id },

    include: {

      _count: {

        select: { accessRequests: true }

      }

    }

  });



  if (!startup) notFound();



  return (

    <div className="min-h-screen bg-black text-white p-6 md:p-16">

      <div className="max-w-5xl mx-auto">

        

        {/* Header Section */}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">

          <div>

            <div className="flex items-center gap-3 mb-4">

              <span className="bg-purple-600/20 text-purple-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-purple-500/20">

                {startup.category || "Vibe Code"}

              </span>

              {startup.pinnedAt && (

                <span className="bg-green-600/20 text-green-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-green-500/20">

                  Featured

                </span>

              )}

            </div>

            <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">

              {startup.name}

            </h1>

            <p className="text-zinc-500 mt-4 text-lg font-medium max-w-xl italic">

              "{startup.tagline}"

            </p>

          </div>

          

          <div className="p-6 border border-white/5 bg-zinc-900/20 rounded-3xl text-center min-w-[160px]">

            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Interest</p>

            <p className="text-3xl font-black text-white">{startup._count.accessRequests}</p>

          </div>

        </div>



        {/* Content Grid */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-8">

            <div className="p-8 border border-white/10 rounded-[2rem] bg-white/5 backdrop-blur-md">

              <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-6">The Vision</h3>

              <p className="text-xl text-zinc-300 leading-relaxed font-light">

                {startup.problemStatement}

              </p>

            </div>

          </div>



          <div className="space-y-6">

            <div className="p-8 border border-white/10 rounded-[2rem] bg-zinc-900/40">

              <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-6">Founder Signal</h3>

              <div className="space-y-4">

                <a href={startup.website || "#"} target="_blank" className="block p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-all text-sm font-mono uppercase tracking-tighter">

                  🌐 Launch Website

                </a>

                <a href={startup.founderLinkedIn || "#"} target="_blank" className="block p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-all text-sm font-mono uppercase tracking-tighter">

                  💼 Founder LinkedIn

                </a>

              </div>

            </div>

            

            <p className="text-[10px] text-zinc-600 font-mono text-center uppercase tracking-widest">

              Registration: {id}

            </p>

          </div>

        </div>



      </div>

    </div>

  );

}