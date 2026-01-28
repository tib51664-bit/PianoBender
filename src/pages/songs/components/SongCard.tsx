import { ExtendedSongMetadata, SongMetadata } from '@/types'
import { formatTime } from '@/utils'
import { Clock, Flame, Music, Play, Star } from 'lucide-react'
import * as React from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: any[]) {
    return twMerge(clsx(inputs))
}

interface Props {
    song: SongMetadata
    extended?: ExtendedSongMetadata
    onPlay: (song: SongMetadata) => void
}

export default function SongCard({ song, extended, onPlay }: Props) {
    const score = extended?.score || 0
    const playCount = extended?.playCount || 0

    return (
        <div className="group relative overflow-hidden rounded-2xl bg-[#1a1a1e] border border-white/5 hover:border-white/20 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 active:scale-[0.98]">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="p-6 space-y-4 relative z-10">
                <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/10 transition-colors duration-500">
                        <Music className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-white truncate group-hover:text-indigo-300 transition-colors uppercase tracking-tight">
                        {song.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-slate-500 text-xs font-medium">
                            {formatTime(song.duration)}
                        </span>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center gap-2">
                    <button
                        onClick={() => onPlay(song)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 text-white text-sm font-bold hover:bg-indigo-600 transition-all duration-300"
                    >
                        <Play className="w-4 h-4 fill-current" />
                        Play
                    </button>
                </div>
            </div>
        </div>
    )
}
