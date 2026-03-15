'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, GraduationCap, MapPin, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { heroSection } from '@/lib/portfolio-mock-data'

export default function Hero() {
    const [isVisible, setIsVisible] = useState(false)
    const [typedSubtitle, setTypedSubtitle] = useState('')

    useEffect(() => {
        setIsVisible(true)

        if (typeof window === 'undefined') {
            return
        }

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        if (prefersReducedMotion) {
            setTypedSubtitle(heroSection.subtitle)
            return
        }

        let currentIndex = 0
        const typingTimer = window.setInterval(() => {
            currentIndex += 1
            setTypedSubtitle(heroSection.subtitle.slice(0, currentIndex))

            if (currentIndex >= heroSection.subtitle.length) {
                window.clearInterval(typingTimer)
            }
        }, 42)

        return () => window.clearInterval(typingTimer)
    }, [])

    const revealClass = isVisible
        ? 'opacity-100 translate-y-0 blur-0'
        : 'opacity-0 translate-y-6 blur-[6px]'

    return (
        <section className="min-h-screen flex items-center pt-24 px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.2),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.16),transparent_28%)] -z-10" />
            <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl -z-10 animate-glow" />
            <div className="absolute bottom-10 left-10 h-60 w-60 rounded-full bg-accent/10 blur-3xl -z-10" />

            <div
                className={`max-w-6xl mx-auto grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] transition-all duration-1000 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
                <div className="text-left">
                    <div
                        className={`mb-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${revealClass}`}
                        style={{ transitionDelay: '80ms' }}
                    >
                        <Sparkles size={14} />
                        <span>{heroSection.eyebrow}</span>
                    </div>

                    <h1
                        className={`mb-6 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${revealClass}`}
                        style={{ transitionDelay: '160ms' }}
                    >
                        <span className="mb-3 block text-foreground">{heroSection.title}</span>
                        <span className="block min-h-[3.5rem] bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent sm:min-h-[4rem] lg:min-h-[4.5rem]">
                            {typedSubtitle}
                            <span
                                aria-hidden="true"
                                className="ml-1 inline-block h-[0.95em] w-[0.08em] translate-y-1 rounded-full bg-accent animate-type-caret"
                            />
                        </span>
                    </h1>

                    <p
                        className={`mb-6 max-w-2xl text-lg leading-relaxed text-muted-foreground transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:text-xl ${revealClass}`}
                        style={{ transitionDelay: '240ms' }}
                    >
                        {heroSection.description}
                    </p>

                    <div
                        className={`mb-8 flex flex-wrap gap-3 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${revealClass}`}
                        style={{ transitionDelay: '320ms' }}
                    >
                        {heroSection.badges.map((badge, index) => (
                            <span
                                key={badge}
                                className="hero-badge rounded-full border border-border/70 bg-card/70 px-4 py-2 text-sm text-foreground shadow-sm backdrop-blur transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                style={{ transitionDelay: `${360 + index * 70}ms` }}
                            >
                                {badge}
                            </span>
                        ))}
                    </div>

                    <div
                        className={`mb-10 flex flex-col items-start gap-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:flex-row ${revealClass}`}
                        style={{ transitionDelay: '420ms' }}
                    >
                        <Button asChild className="bg-primary px-8 py-6 text-base font-semibold text-primary-foreground hover:bg-primary/90 hover-scale">
                            <a href={heroSection.ctas[0].href}>{heroSection.ctas[0].label}</a>
                        </Button>
                        <Button asChild variant="outline" className="border-border bg-card/40 px-8 py-6 text-base font-semibold hover:bg-card hover-scale">
                            <a href={heroSection.ctas[1].href}>{heroSection.ctas[1].label}</a>
                        </Button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        {heroSection.stats.map((stat, index) => (
                            <div
                                key={stat.label}
                                className={`rounded-2xl border border-border/80 bg-card/60 p-4 shadow-lg backdrop-blur transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${revealClass}`}
                                style={{ transitionDelay: `${520 + index * 90}ms` }}
                            >
                                <div
                                    className={`text-2xl font-bold sm:text-3xl ${
                                        index === 0 ? 'text-primary' : index === 1 ? 'text-secondary' : 'text-accent'
                                    }`}
                                >
                                    {stat.value}
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    className={`relative mx-auto w-full max-w-md transition-all duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] ${revealClass}`}
                    style={{ transitionDelay: '260ms' }}
                >
                    <div className="absolute -left-6 top-8 h-24 w-24 rounded-3xl border border-primary/30 bg-primary/15 blur-xl animate-soft-float" />
                    <div className="absolute -right-6 bottom-10 h-28 w-28 rounded-full border border-accent/30 bg-accent/15 blur-2xl animate-soft-float-delayed" />
                    <div className="absolute right-8 top-12 h-4 w-4 rounded-full bg-accent/70 shadow-[0_0_16px_rgba(6,182,212,0.55)] animate-orbit-drift" />

                    <div className="profile-shell group/profile relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/75 p-5 shadow-2xl backdrop-blur">
                        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover/profile:opacity-100">
                            <div className="absolute inset-y-0 left-[-30%] w-[38%] rotate-[18deg] bg-gradient-to-r from-transparent via-white/12 to-transparent animate-shimmer-sweep" />
                        </div>
                        <div className="rounded-[1.6rem] border border-white/10 bg-gradient-to-br from-primary/15 via-card to-accent/15 p-4">
                            {heroSection.profile.imageSrc ? (
                                <img
                                    src={heroSection.profile.imageSrc}
                                    alt={heroSection.profile.imageAlt}
                                    className="aspect-[4/5] w-full rounded-[1.25rem] object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/profile:scale-[1.03]"
                                />
                            ) : (
                                <div className="relative flex aspect-[4/5] w-full items-end overflow-hidden rounded-[1.25rem] border border-border/70 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.35),transparent_35%),linear-gradient(160deg,rgba(26,31,58,0.95),rgba(10,14,39,0.98))] p-6 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/profile:scale-[1.02]">
                                    <div className="absolute right-5 top-5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
                                        Photo area
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-background/90 to-transparent" />
                                    <div className="relative">
                                        <div className="text-7xl font-bold leading-none text-white/90 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/profile:-translate-y-1 sm:text-8xl">HT</div>
                                        <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-300">
                                            Portrait-ready profile card. Replace with your real photo anytime without changing the layout.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 px-2 pb-2 pt-5">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">Profile</p>
                                <h2 className="mt-2 text-2xl font-semibold text-foreground">{heroSection.profile.name}</h2>
                                <p className="text-sm text-muted-foreground">{heroSection.profile.role}</p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-border/70 bg-background/40 p-3">
                                    <div className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
                                        <MapPin size={16} className="text-accent" />
                                        <span>{heroSection.profile.location}</span>
                                    </div>
                                    <p className="text-xs leading-relaxed text-muted-foreground">Focused on practical product delivery for real teams and live systems.</p>
                                </div>

                                <div className="rounded-2xl border border-border/70 bg-background/40 p-3">
                                    <div className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
                                        <GraduationCap size={16} className="text-primary" />
                                        <span>Education</span>
                                    </div>
                                    <p className="text-xs leading-relaxed text-muted-foreground">{heroSection.profile.note}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-soft-bob">
                <ChevronDown className="text-muted-foreground" size={32} />
            </div>
        </section>
    )
}
