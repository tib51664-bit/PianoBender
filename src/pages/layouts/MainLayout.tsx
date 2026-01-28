import { NavLink, Outlet } from 'react-router'
import { Music, Play, Info, History, Mail } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: any[]) {
    return twMerge(clsx(inputs))
}

export default function MainLayout() {
    const navItems = [
        { name: 'Recently Played', to: '/', icon: History },
        { name: 'Play Song', to: '/play-song', icon: Music },
        { name: 'Free Play', to: '/free-play', icon: Play },
        { name: 'Credits', to: '/credits', icon: Info },
    ]

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#0a0a0c] text-slate-200 font-sans">
            {/* Sidebar */}
            <aside className="w-20 md:w-64 flex flex-col border-r border-white/5 bg-[#111114]/80 backdrop-blur-xl transition-all duration-300 ease-in-out">
                <div className="p-6 flex items-center justify-center">
                    <img
                        src="/images/Logo.png"
                        alt="Logo"
                        className="md:hidden w-10 h-10 object-contain drop-shadow-lg"
                    />
                    <img
                        src="/images/Banner.png"
                        alt="PianoBender"
                        className="hidden md:block w-full h-auto object-contain"
                    />
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative',
                                    isActive
                                        ? 'bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className={cn(
                                        "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                                        isActive ? "text-indigo-400" : ""
                                    )} />
                                    <span className="hidden md:block font-medium">{item.name}</span>
                                    {isActive && (
                                        <div className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-6 mt-auto">
                    <a
                        href="mailto:pianobendersupport@atomicmail.io"
                        className="hidden md:block p-4 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all duration-300 group"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover:animate-ping" />
                            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Feedback</p>
                        </div>
                        <p className="text-[13px] text-slate-300 font-medium leading-snug group-hover:text-white transition-colors">
                            Report an error or write a suggestion
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-slate-500 group-hover:text-indigo-400 transition-colors">
                            <Mail className="w-4 h-4" />
                            <span className="text-[11px] font-semibold tracking-tight">Support & Suggestions</span>
                        </div>
                    </a>
                    <a
                        href="mailto:pianobendersupport@atomicmail.io"
                        className="md:hidden flex justify-center p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all active:scale-95"
                        title="Report an error or write a suggestion"
                    >
                        <Mail className="w-5 h-5 text-indigo-400" />
                    </a>
                </div>
            </aside>

            {/* Main Content Area */}
            {/* Main Content Area */}
            <main className="flex-1 relative flex flex-col min-w-0 overflow-hidden bg-[#0a0a0c]">
                {/* Subtle Background Glows */}
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] pointer-events-none rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-purple-500/10 blur-[120px] pointer-events-none rounded-full" />

                <div className="relative z-10 flex-1 flex flex-col min-h-0 w-full overflow-hidden">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
