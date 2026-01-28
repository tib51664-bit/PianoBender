import React from 'react'
import { Github, ExternalLink, Heart, Code, Music, Info } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}

export default function CreditsPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-12 max-w-5xl mx-auto">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
          <Info className="w-4 h-4" />
          <span>Project Credits</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Credits & Attribution
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl">
          PianoBender is built upon the incredible work of the open-source community. Here are the projects and creators that made this application possible.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Project Card */}
        <div className="group relative p-8 rounded-3xl bg-[#111114] border border-white/5 hover:border-indigo-500/30 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Code className="w-24 h-24 text-indigo-500" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <Github className="w-6 h-6 text-indigo-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Original Project</h2>
              <p className="text-slate-400 leading-relaxed">
                Originally forked from <span className="text-indigo-400 font-semibold">Sightread</span>. We are immensely grateful for their high-quality foundation and vision.
              </p>
            </div>

            <a
              href="https://github.com/sightread/sightread"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl transition-all border border-white/10"
            >
              View Original Repo
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* PianoBender Card */}
        <div className="group relative p-8 rounded-3xl bg-[#111114] border border-white/5 hover:border-purple-500/30 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Music className="w-24 h-24 text-purple-500" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Github className="w-6 h-6 text-purple-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">PianoBender</h2>
              <p className="text-slate-400 leading-relaxed">
                Our own piano player version.
              </p>
            </div>

            <a
              href="https://github.com/tib51664-bit/PianoBender"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl transition-all border border-white/10 shadow-lg shadow-purple-500/5"
            >
              Our Repository
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <footer className="pt-8 border-t border-white/5 text-center">
        <p className="text-slate-500 text-sm flex items-center justify-center gap-2">
          Crafted with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for the piano community.
        </p>
      </footer>
    </div>
  )
}
