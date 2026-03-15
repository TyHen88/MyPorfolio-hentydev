'use client'

import { useEffect, useRef, useState } from 'react'
import { GraduationCap, Layers3, Sparkles } from 'lucide-react'
import { aboutSection } from '@/lib/portfolio-mock-data'

export default function About() {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true)
            }
        })

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <section id="about" className="py-20 px-4 bg-gradient-to-b from-transparent to-card/30">
            <div className="max-w-6xl mx-auto">
                <div ref={ref} className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="mb-10 max-w-3xl">
                        <h2 className="text-3xl sm:text-5xl font-bold mb-4 flex items-center gap-3">
                            <span className="text-primary">01.</span>
                            <span>{aboutSection.title}</span>
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            A clearer picture of how I work, what I build, and the background that shaped my approach to software delivery.
                        </p>
                    </div>

                    <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] items-start">
                        <div className="space-y-5 text-muted-foreground leading-relaxed">
                            {aboutSection.paragraphs.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                            ))}

                            <div className="rounded-3xl border border-primary/20 bg-primary/8 p-6 shadow-lg">
                                <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                                    <Sparkles size={16} />
                                    <span>How I Like To Work</span>
                                </div>
                                <p className="text-sm leading-relaxed text-foreground/90">
                                    I enjoy product work that needs both thoughtful frontend experience and reliable backend delivery. That usually means UI implementation, API design, integrations, cleanup work, and making existing systems easier to maintain for the next release.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-3xl border border-border bg-card/75 p-6 shadow-xl backdrop-blur">
                                <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                                    <GraduationCap size={16} />
                                    <span>Education</span>
                                </div>
                                <h3 className="text-xl font-semibold text-foreground">{aboutSection.education.degree}</h3>
                                <p className="mt-1 text-sm font-medium text-foreground/90">{aboutSection.education.major}</p>
                                <p className="mt-2 text-sm text-muted-foreground">{aboutSection.education.institution}</p>
                                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{aboutSection.education.description}</p>
                            </div>

                            <div className="rounded-3xl border border-border bg-card/50 p-4 shadow-lg">
                                <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
                                    <Layers3 size={16} />
                                    <span>Quick Snapshot</span>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                                    {aboutSection.highlights.map((highlight) => (
                                        <div key={highlight.title} className="rounded-2xl border border-border/80 bg-background/40 p-4 hover-lift">
                                            <h3 className="font-semibold text-foreground mb-1">{highlight.title}</h3>
                                            <p className="text-sm text-muted-foreground">{highlight.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
