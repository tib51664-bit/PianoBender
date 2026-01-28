import { Modal } from '@/components'
import { updateExtendedMetadata } from '@/features/persist/persistence'
import { ExtendedSongMetadata, SongMetadata } from '@/types'
import { Star } from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'
import { Button, Heading, Input, Label, TextField } from 'react-aria-components'

interface Props {
    show: boolean
    onClose: () => void
    song: SongMetadata
    extendedMeta?: ExtendedSongMetadata
}

export default function MetadataModal({ show, onClose, song, extendedMeta }: Props) {
    const [genre, setGenre] = useState(extendedMeta?.genre || '')
    const [difficulty, setDifficulty] = useState(extendedMeta?.difficultyCustom || 0)
    const [score, setScore] = useState(extendedMeta?.score || 0)

    const handleSave = async () => {
        await updateExtendedMetadata(song.id, {
            genre,
            difficultyCustom: Number(difficulty),
            score,
        })
        onClose()
    }

    return (
        <Modal
            show={show}
            onClose={onClose}
            className="w-[400px] p-6 rounded-2xl bg-[#1a1a1e] shadow-2xl border border-white/10"
            modalClassName="bg-black/60 backdrop-blur-sm"
        >
            <div className="space-y-6">
                <Heading className="text-2xl font-black text-white tracking-tight">
                    Edit Song Info
                </Heading>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 truncate">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Title</p>
                    <p className="text-sm text-slate-300 font-medium truncate">{song.title}</p>
                </div>

                <div className="space-y-4">
                    <TextField className="flex flex-col gap-1.5">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Genre</Label>
                        <Input
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            placeholder="e.g. Classical, Jazz, Pop"
                            className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                    </TextField>

                    <TextField className="flex flex-col gap-1.5">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Custom Difficulty (0-100)</Label>
                        <Input
                            type="number"
                            min="0"
                            max="100"
                            value={difficulty}
                            onChange={(e) => setDifficulty(Number(e.target.value))}
                            className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                    </TextField>

                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Rating</Label>
                        <div className="flex gap-2 p-2 rounded-xl bg-white/5 border border-white/5 w-fit">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setScore(s)}
                                    className="transition transform hover:scale-110 active:scale-90"
                                >
                                    <Star
                                        className={`w-8 h-8 ${s <= score ? 'fill-amber-400 text-amber-400' : 'text-white/10'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <Button
                        onPress={onClose}
                        className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-slate-400 font-bold hover:bg-white/10 transition active:scale-95"
                    >
                        Cancel
                    </Button>
                    <Button
                        onPress={handleSave}
                        className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition active:scale-95"
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
