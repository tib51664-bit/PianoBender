import { recentSongsAtom } from '@/features/data/library'
import { extendedMetadataAtom } from '@/features/persist'
import { Music, Clock, Play, ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useAtomValue } from 'jotai'
import { useMemo, useState } from 'react'
import Filters, { SortOption } from '../songs/components/Filters'
import { SongMetadata } from '@/types'
import { SongPreviewModal } from '@/features/SongPreview'
import { formatTime, getKey } from '@/utils'

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}

export default function Home() {
  const recentSongs = useAtomValue(recentSongsAtom)
  const extendedMeta = useAtomValue(extendedMetadataAtom)
  const [previewSong, setPreviewSong] = useState<SongMetadata | null>(null)

  const sortedRecent = useMemo(() => {
    return [...recentSongs].sort((a, b) => {
      const extA = extendedMeta[getKey(a.id, a.source)] || {}
      const extB = extendedMeta[getKey(b.id, b.source)] || {}
      return (extB.lastPlayed || 0) - (extA.lastPlayed || 0)
    }).slice(0, 8)
  }, [recentSongs, extendedMeta])

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8 space-y-12 animate-in fade-in duration-700">
        {/* Recently Played Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Clock className="w-6 h-6 text-indigo-400" />
              Recently Played
            </h2>
            <Link to="/play-song" className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold flex items-center gap-1 group">
              View Full Library
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-2">
            {sortedRecent.map((song) => {
              const lastPlayed = extendedMeta[getKey(song.id, song.source)]?.lastPlayed
              const lastPlayedLabel = lastPlayed ? new Date(lastPlayed).toLocaleDateString() : 'Never'

              return (
                <div
                  key={song.id}
                  onClick={() => setPreviewSong(song)}
                  className="group flex items-center justify-between p-4 rounded-2xl bg-[#1a1a1e] border border-white/5 hover:border-white/10 hover:bg-white/2 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/10 transition-colors">
                      <Music className="w-6 h-6 text-slate-400 group-hover:text-indigo-400" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                        {song.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">Played on {lastPlayedLabel}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="hidden sm:block text-sm text-slate-600 font-bold">{formatTime(song.duration)}</span>
                    <button className="p-3 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>
              )
            })}

            {sortedRecent.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-slate-500 space-y-4">
                <Music className="w-16 h-16 opacity-20" />
                <p className="text-lg">No songs played yet.</p>
                <Link to="/play-song" className="px-6 py-2 rounded-xl bg-indigo-500 text-white font-bold hover:bg-indigo-600 transition-colors">
                  Start Playing
                </Link>
              </div>
            )}
          </div>
        </section>

        <SongPreviewModal
          show={!!previewSong}
          songMeta={previewSong || undefined}
          onClose={() => setPreviewSong(null)}
        />
      </div>
    </div>
  )
}

