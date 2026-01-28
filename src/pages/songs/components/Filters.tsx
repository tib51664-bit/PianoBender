import { Check, ChevronDown, Search, SortAsc } from 'lucide-react'
import * as React from 'react'
import { Button, Input, ListBox, ListBoxItem, Popover, Select, SelectValue } from 'react-aria-components'

export type SortOption = 'title' | 'lastPlayed' | 'playCount'

interface Props {
    search: string
    onSearch: (s: string) => void
    sortBy: SortOption
    onSortChange: (s: SortOption) => void
}

export default function Filters({ search, onSearch, sortBy, onSortChange }: Props) {
    return (
        <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/5 shadow-xl">
            <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                    placeholder="Search songs, genres..."
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
            </div>

            <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sort By</label>
                <Select
                    selectedKey={sortBy}
                    onSelectionChange={(key) => onSortChange(key as SortOption)}
                    className="relative min-w-[160px]"
                >
                    <Button className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition focus:outline-none ring-offset-black focus:ring-2 ring-indigo-500">
                        <div className="flex items-center gap-2">
                            <SortAsc className="w-4 h-4 text-indigo-400" />
                            <SelectValue className="text-sm font-medium" />
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                    </Button>
                    <Popover className="min-w-[180px] p-1 bg-[#1a1a1e] rounded-xl shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-100">
                        <ListBox className="outline-none">
                            <Option id="title">Name</Option>
                            <Option id="lastPlayed">Last Played</Option>
                            <Option id="playCount">Most Played</Option>
                        </ListBox>
                    </Popover>
                </Select>
            </div>
        </div>
    )
}

function Option({ id, children }: { id: string; children: React.ReactNode }) {
    return (
        <ListBoxItem
            id={id}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-400 cursor-pointer hover:bg-indigo-500/10 hover:text-indigo-400 outline-none transition data-[selected]:text-indigo-400 data-[selected]:bg-indigo-500/5"
        >
            {({ isSelected }) => (
                <>
                    {children}
                    {isSelected && <Check className="w-4 h-4 text-indigo-500" />}
                </>
            )}
        </ListBoxItem>
    )
}
