import { Modal, Sizer } from '@/components'
import { useSongManifest } from '@/features/data/library'
import { extendedMetadataAtom, isInitializedAtom, localDirsAtom } from '@/features/persist/persistence'
import { SongPreviewModal } from '@/features/SongPreview'
import { useEventListener } from '@/hooks'
import { FolderOpen, LayoutGrid, List, PlusCircle } from '@/icons'
import { ExtendedSongMetadata, SongMetadata } from '@/types'
import { getKey } from '@/utils'
import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { Search } from 'lucide-react'
import * as React from 'react'
import { useMemo, useState } from 'react'
import ManageFoldersForm from './components/AddFolderForm'
import Filters, { SortOption } from './components/Filters'
import SongCard from './components/SongCard'
import { Table } from './components'
import { TableSkeleton } from './components/Table/Table'

export default function PlaySongPage() {
  const songs: SongMetadata[] = useSongManifest()
  const extendedMeta = useAtomValue(extendedMetadataAtom)
  const folders = useAtomValue(localDirsAtom)
  const isInitialized = useAtomValue(isInitializedAtom)

  const [isFolderFormOpen, setFolderForm] = useState(false)
  const [previewSong, setPreviewSong] = useState<SongMetadata | null>(null)

  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('title')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [selectedFolderId, setSelectedFolderId] = useState<string | 'all'>('all')

  // Filtering Logic
  const filteredAndSortedSongs = useMemo(() => {
    let result = [...songs]

    // Folder filter
    if (selectedFolderId !== 'all') {
      result = result.filter(s => s.id.startsWith(selectedFolderId + '/'))
    }

    // Search filter
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(s => s.title.toLowerCase().includes(q))
    }

    // Sorting
    result.sort((a, b) => {
      const extA = extendedMeta[getKey(a.id, a.source)] || {}
      const extB = extendedMeta[getKey(b.id, b.source)] || {}

      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'lastPlayed':
          return (extB.lastPlayed || 0) - (extA.lastPlayed || 0)
        case 'playCount':
          return (extB.playCount || 0) - (extA.playCount || 0)
        default:
          return 0
      }
    })

    return result
  }, [songs, extendedMeta, search, sortBy, selectedFolderId])



  const handlePlay = (song: SongMetadata) => {
    setPreviewSong(song)
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#0f1115]">
      <title>Piano Bender - Play Song</title>

      <SongPreviewModal
        show={!!previewSong}
        songMeta={previewSong || undefined}
        onClose={() => setPreviewSong(null)}
      />



      <Modal show={isFolderFormOpen} onClose={() => setFolderForm(false)} className="w-[min(100vw,500px)] bg-[#1a1a1e] border border-white/10">
        <ManageFoldersForm onClose={() => setFolderForm(false)} />
      </Modal>


      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar / Folders */}
        <div className="w-64 flex flex-col border-r border-white/5 bg-[#16181d] p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Library</h2>
            <button
              onClick={() => setFolderForm(true)}
              className="text-indigo-400 hover:text-indigo-300 transition"
              title="Add Library Folder"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => setSelectedFolderId('all')}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all mb-4",
                selectedFolderId === 'all'
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  : "text-slate-400 hover:bg-white/5"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              All Songs
            </button>

            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mt-6 mb-2 px-4">Books</h3>
            {folders.map(folder => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolderId(folder.id)}
                className={clsx(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all",
                  selectedFolderId === folder.id
                    ? "bg-slate-800 text-indigo-400 border border-white/10"
                    : "text-slate-500 hover:bg-white/5"
                )}
              >
                <FolderOpen className="w-4 h-4" />
                <span className="truncate text-left">{folder.handle.name}</span>
              </button>
            ))}

            {folders.length === 0 && (
              <div className="p-4 rounded-2xl bg-white/5 border border-dashed border-white/10 text-center">
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">No books added</p>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0f1115]">
          <div className="p-8 pb-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h1 className="text-4xl font-black text-white tracking-tight">
                  {selectedFolderId === 'all' ? 'Your Library' : folders.find(f => f.id === selectedFolderId)?.handle.name}
                </h1>
                <p className="text-slate-500 font-medium mt-1">
                  Ready to practice? Choose a piece and start.
                </p>
              </div>

              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={clsx(
                    "p-2 rounded-lg transition-all",
                    viewMode === 'grid' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={clsx(
                    "p-2 rounded-lg transition-all",
                    viewMode === 'table' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            <Filters
              search={search}
              onSearch={setSearch}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>

          <div className="flex-1 overflow-y-auto p-8 pt-4 custom-scrollbar">
            {!isInitialized ? (
              <div className="opacity-50 grayscale transition-all">
                <TableSkeleton />
              </div>
            ) : filteredAndSortedSongs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-white">No songs found</h3>
                <p className="text-slate-500 mt-1 max-w-xs mx-auto">
                  Try adjusting your search or filters.
                </p>
              </div>
            ) : viewMode === 'table' ? (
              <Table rows={filteredAndSortedSongs} search={""} onSelectRow={(id) => handlePlay(songs.find(s => s.id === id)!)} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {filteredAndSortedSongs.map(song => (
                  <SongCard
                    key={song.id}
                    song={song}
                    extended={extendedMeta[getKey(song.id, song.source)]}
                    onPlay={handlePlay}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>


      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        /* Table Styles for Dark Theme */
        .react-aria-Table {
           background: transparent !important;
           border: none !important;
        }
        .react-aria-TableHeader {
           background: rgba(255,255,255,0.02) !important;
           border-bottom: 1px solid rgba(255,255,255,0.05) !important;
        }
        .react-aria-Column {
           color: #64748b !important;
           text-transform: uppercase !important;
           font-size: 10px !important;
           font-weight: 900 !important;
           letter-spacing: 0.1em !important;
        }
        .react-aria-Row {
           background: transparent !important;
           border-bottom: 1px solid rgba(255,255,255,0.03) !important;
           color: #cbd5e1 !important;
           transition: all 0.2s !important;
        }
        .react-aria-Row:hover {
           background: rgba(255,255,255,0.03) !important;
           color: #fff !important;
        }
        .react-aria-Cell {
           padding: 1rem !important;
           border: none !important;
        }
      `}</style>
    </div>
  )
}
