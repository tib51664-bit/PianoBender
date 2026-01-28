import { Sizer } from '@/components'
import {
  addFolder,
  isFileSystemAccessSupported,
  isScanningAtom,
  localDirsAtom,
  localSongsAtom,
  removeFolder,
  requiresPermissionAtom,
  scanFolders,
  uploadMidiFile,
} from '@/features/persist'
import { useAtomValue } from 'jotai'
import { AlertCircle, Folder, Music, Plus, RefreshCw, Trash2, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function ManageFoldersForm({ onClose }: { onClose: () => void }) {
  const isScanning = useAtomValue<boolean | Promise<void>>(isScanningAtom)
  const folders = useAtomValue(localDirsAtom)
  const localSongs = useAtomValue(localSongsAtom)
  const needsPermission = useAtomValue(requiresPermissionAtom)
  const isScanningActive = isScanning !== false
  const [showSpinner, setShowSpinner] = useState(false)
  const spinnerStartRef = useRef<number | null>(null)

  useEffect(() => {
    let isCancelled = false
    const syncSpinner = async () => {
      if (isScanningActive) {
        if (!showSpinner) {
          spinnerStartRef.current = performance.now()
          setShowSpinner(true)
        }
        return
      }
      if (showSpinner) {
        const start = spinnerStartRef.current ?? performance.now()
        const elapsed = performance.now() - start
        const remaining = Math.max(0, 1000 - elapsed)
        if (remaining > 0) {
          await new Promise((resolve) => setTimeout(resolve, remaining))
        }
        if (!isCancelled) {
          setShowSpinner(false)
          spinnerStartRef.current = null
        }
      }
    }
    void syncSpinner()
    return () => {
      isCancelled = true
    }
  }, [isScanningActive, showSpinner])

  const handleScanFolders = async () => {
    if (isScanningActive) {
      return
    }
    spinnerStartRef.current = performance.now()
    setShowSpinner(true)
    await new Promise(requestAnimationFrame)
    await scanFolders()
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await uploadMidiFile(file)
      onClose()
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  if (!isFileSystemAccessSupported()) {
    return (
      <div className="relative flex flex-col gap-5 px-6 pt-6 pb-6 text-base bg-[#1a1a1e] text-white">
        <h1 className="text-2xl font-black tracking-tight">Add Music Folder</h1>
        <Sizer height={0} />

        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          <AlertCircle size={20} />
          <div>
            <p className="font-bold">Browser Not Supported</p>
            <p className="text-sm opacity-80">
              Syncing folders is only supported in Chromium-based browsers like Chrome and Edge.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/2 p-4">
          <p className="mb-4 text-sm font-medium text-slate-400">
            You can still upload individual MIDI files for this session:
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".mid,.midi,audio/midi"
            className="hidden"
          />
          <button
            onClick={triggerFileUpload}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-black text-white transition hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            <Upload size={18} />
            Upload MIDI File
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full cursor-pointer rounded-xl bg-white/5 py-3 text-white font-bold transition hover:bg-white/10 active:scale-95"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto bg-[#1a1a1e] px-6 pt-6 pb-6 text-white rounded-2xl border border-white/10">
      <div className="mb-6 border-b border-white/5 pb-4">
        <h2 className="mb-1 text-2xl font-black tracking-tight">Folder Management</h2>
        <p className="text-sm text-slate-500 font-medium tracking-tight">Organize your music collection</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">
          Folders ({folders.length})
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".mid,.midi,audio/midi"
            className="hidden"
          />
          <button
            onClick={triggerFileUpload}
            title="Upload single MIDI file"
            className="flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-slate-400 transition hover:bg-white/5"
          >
            <Upload className="h-4 w-4" />
            Upload
          </button>
          <button
            onClick={handleScanFolders}
            disabled={isScanningActive}
            className="flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-slate-400 transition hover:bg-white/5 disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${showSpinner ? 'animate-spin' : ''}`} />
            Scan
          </button>
          <button
            onClick={addFolder}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-black text-white transition hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Add Folder
          </button>
        </div>
      </div>

      <Sizer height={24} />

      {/* Folders List */}
      <div className="space-y-2">
        {needsPermission && (
          <p className="text-xs text-red-400 font-bold mb-4">
            * Permission required. Please scan again.
          </p>
        )}

        {folders.length === 0 ? (
          <div className="py-12 text-center rounded-2xl bg-white/2 border border-dashed border-white/5">
            <Folder className="mx-auto mb-3 h-10 w-10 text-slate-700" />
            <p className="text-sm text-slate-500 font-bold">No folders added yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {folders.map((folder, i) => {
              const songCount = localSongs.get(folder.id)?.length || 0
              return (
                <div
                  key={i}
                  className="group flex items-center justify-between rounded-xl border border-white/5 p-4 transition hover:bg-white/5"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                      <Folder className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={'truncate text-sm font-bold text-white'}>
                        {folder.handle.name}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <Music className="h-3 w-3 text-slate-600" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          {songCount} {songCount === 1 ? 'song' : 'songs'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFolder(folder.id)
                    }}
                    className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    title="Remove folder"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {folders.length > 0 && (
        <div className="mt-8 border-t border-white/5 pt-4">
          <p className="text-center text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
            {folders.reduce((sum, folder) => sum + (localSongs.get(folder.id)?.length ?? 0), 0)}{' '}
            songs • {folders.length} folders
          </p>
        </div>
      )}
    </div>
  )
}
