import type { ExtendedSongMetadata, PlaybackHistoryEntry, Song, SongConfig, SongMetadata } from '@/types'
import * as idb from 'idb-keyval'
import * as jotai from 'jotai'
import { parseMidi } from '../parsers'
import * as storageKeys from './constants'
import Storage from './storage'

interface LocalDir {
  id: string
  addedAt: number
  handle: FileSystemDirectoryHandle
}

// Clean up deprecated localStorage keys
if (globalThis.localStorage?.length > 0) {
  for (const key of storageKeys.DEPRECATED_LOCAL_STORAGE_KEYS) {
    localStorage.removeItem(key)
  }
}

type LocalDirKey = string

export const localDirsAtom = jotai.atom<LocalDir[]>([])
export const requiresPermissionAtom = jotai.atom<boolean>(false)
export const localSongsAtom = jotai.atom<Map<string, SongMetadata[]>>(new Map())
export const isInitializedAtom = jotai.atom<boolean>(false)

export const extendedMetadataAtom = jotai.atom<Record<string, ExtendedSongMetadata>>({})
export const playbackHistoryAtom = jotai.atom<PlaybackHistoryEntry[]>([])
export const uploadedSongsAtom = jotai.atom<SongMetadata[]>([])

const uploadedFilesMap = new Map<string, File>()

const store = jotai.getDefaultStore()

export async function initialize() {
  if (store.get(isInitializedAtom)) {
    return Promise.resolve()
  }
  try {
    const dirs: LocalDir[] = (await idb.get(storageKeys.OBSERVED_DIRECTORIES)) ?? []
    store.set(localDirsAtom, dirs)
    const hasPermission = await Promise.all(dirs.map((dir) => checkPermission(dir.handle)))
    if (!hasPermission.every((p) => p)) {
      store.set(requiresPermissionAtom, true)
      return
    }
    await scanFolders()

    const extendedMeta: Record<string, ExtendedSongMetadata> = (await idb.get(storageKeys.SONG_EXTENDED_METADATA)) ?? {}
    store.set(extendedMetadataAtom, extendedMeta)

    const history: PlaybackHistoryEntry[] = (await idb.get(storageKeys.PLAYBACK_HISTORY)) ?? []
    store.set(playbackHistoryAtom, history)


  } catch (e) {
    console.error('persistence init failed', e)
  } finally {
    store.set(isInitializedAtom, true)
  }
}

async function checkPermission(handle: FileSystemDirectoryHandle) {
  const permission = await handle.queryPermission({ mode: 'read' })
  return permission === 'granted'
}

// Check if File System Access API is supported
export function isFileSystemAccessSupported(): boolean {
  return 'showDirectoryPicker' in window
}

export async function addFolder(): Promise<void> {
  if (!isFileSystemAccessSupported()) {
    throw new Error('File System Access API is not supported in this browser')
  }
  await initialize()

  try {
    const newHandle = await window.showDirectoryPicker({
      mode: 'read',
      startIn: 'music',
    })

    // Add directory if it isn't already in the set
    const dirs = store.get(localDirsAtom)
    const alreadyExists = (
      await Promise.all(dirs.map((d) => d.handle.isSameEntry(newHandle)))
    ).find((d) => d)
    if (!alreadyExists) {
      dirs.push({ id: crypto.randomUUID(), handle: newHandle, addedAt: Date.now() })
      store.set(localDirsAtom, dirs)
      await idb.set(storageKeys.OBSERVED_DIRECTORIES, dirs)
      await scanFolders()
    }

    return
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      return
    }
    throw error
  }
}

export const isScanningAtom = jotai.atom<false | Promise<void>>(false)

export async function scanFolders() {
  const inProgressScan = store.get(isScanningAtom)
  if (inProgressScan !== false) {
    await inProgressScan
    return
  }
  const { resolve, reject, promise } = Promise.withResolvers()
  store.set(isScanningAtom, promise as Promise<void>)
  try {
    let songs = new Map()
    const dirs = store.get(localDirsAtom)
    if (store.get(requiresPermissionAtom)) {
      for (const dir of dirs) {
        const didGrant = (await dir.handle.requestPermission({ mode: 'read' })) === 'granted'
        if (!didGrant) {
          console.warn('Permission not granted for', dir.handle.name)
          return
        }
      }
      store.set(requiresPermissionAtom, false)
    }
    for (const dir of dirs) {
      const dirSongs = await scanFolder(dir)
      songs.set(dir.id, dirSongs)
    }
    store.set(localSongsAtom, songs)
    resolve(undefined)
  } catch (error) {
    reject(new Error('Error scanning folders:', { cause: error }))
  } finally {
    store.set(isScanningAtom, false)
  }
}

function isMidiFile(file: File): boolean {
  return (
    file.type === 'audio/midi' ||
    file.type === 'audio/mid' ||
    file.name.endsWith('.mid') ||
    file.name.endsWith('.midi')
  )
}

export async function getSongHandle(id: string): Promise<FileSystemFileHandle | undefined> {
  await initialize()
  const [dirId, basename] = id.split('/')

  const dir = store.get(localDirsAtom).find((d) => d.id === dirId)
  if (!dir) {
    console.error('Missing expected directory handle')
    return
  }

  const localSongs = store.get(localSongsAtom)
  const dirSongs = localSongs.get(dir?.id)
  return dirSongs?.find((s) => s.handle?.name === basename)?.handle
}
initialize()

async function scanFolder(dir: LocalDir): Promise<SongMetadata[]> {
  const songs: SongMetadata[] = []

  try {
    for await (const [name, handle] of dir.handle.entries()) {
      if (handle.kind === 'file') {
        const fileHandle = handle as FileSystemFileHandle
        const file = await fileHandle.getFile()

        try {
          if (isMidiFile(file)) {
            const title = name
            const id = title // for now

            let buffer = await file.arrayBuffer()
            let bytes = new Uint8Array(buffer)
            let duration = parseMidi(bytes).duration
            const songMetadata: SongMetadata = {
              id: dir.id + '/' + name,
              title,
              file: id,
              source: 'local',
              difficulty: 0,
              duration,
              handle: fileHandle,
            }

            songs.push(songMetadata)
          }
        } catch (error) {
          console.error(`Error parsing MIDI file ${name}:`, error)
        }
      }
    }
  } catch (error) {
    console.error('Error scanning folder:', error)
    throw new Error(`Failed to scan folder: ${(error as Error).message}`)
  }

  return songs
}

export function removeFolder(id: string) {
  const dirs = store.get(localDirsAtom).filter((d) => d.id !== id)
  store.set(localDirsAtom, dirs)
  idb.set(storageKeys.OBSERVED_DIRECTORIES, dirs)
  scanFolders()
}

export function hasUploadedSong(id: string): Song | null {
  return Storage.get<Song>(id)
}

export function getPersistedSongSettings(file: string) {
  return Storage.get<SongConfig>(`${file}/settings`)
}

export function setPersistedSongSettings(file: string, config: SongConfig) {
  return Storage.set(`${file}/settings`, config)
}

export async function updateExtendedMetadata(songId: string, metadata: Partial<ExtendedSongMetadata>) {
  const current = store.get(extendedMetadataAtom)
  const updated = {
    ...current,
    [songId]: {
      ...current[songId],
      ...metadata,
    },
  }
  store.set(extendedMetadataAtom, updated)
  await idb.set(storageKeys.SONG_EXTENDED_METADATA, updated)
}

export async function addToHistory(songId: string) {
  const history = store.get(playbackHistoryAtom)
  const newEntry: PlaybackHistoryEntry = { songId, timestamp: Date.now() }
  const updatedHistory = [newEntry, ...history]
  store.set(playbackHistoryAtom, updatedHistory)
  await idb.set(storageKeys.PLAYBACK_HISTORY, updatedHistory)

  // Also update playCount and lastPlayed in extended metadata
  const currentMeta = store.get(extendedMetadataAtom)[songId] || {}
  await updateExtendedMetadata(songId, {
    playCount: (currentMeta.playCount || 0) + 1,
    lastPlayed: newEntry.timestamp,
  })
}

export async function uploadMidiFile(file: File) {
  const buffer = await file.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  const duration = parseMidi(bytes).duration

  const id = `upload-${Date.now()}-${file.name}`
  const songMetadata: SongMetadata = {
    id,
    title: file.name.replace(/\.midi?$/i, ''),
    file: id,
    source: 'uploaded',
    difficulty: 0,
    duration,
  }

  uploadedFilesMap.set(id, file)
  const current = store.get(uploadedSongsAtom)
  store.set(uploadedSongsAtom, [...current, songMetadata])
}

export function getUploadedFile(id: string): File | undefined {
  return uploadedFilesMap.get(id)
}
