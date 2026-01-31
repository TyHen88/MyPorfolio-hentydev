'use client'

import { useEffect, useRef, useState } from 'react'

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
            <div className="max-w-4xl mx-auto">
                <div ref={ref} className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <h2 className="text-3xl sm:text-5xl font-bold mb-8 flex items-center gap-3">
                        <span className="text-primary">01.</span>
                        <span>About Me</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        {/* Left side */}
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                I'm Hen Ty—a full-stack developer who loves translating ambiguous product problems into reliable,
                                user-friendly software. I move fluidly between architecting data models, building reusable React components,
                                and automating delivery so teams can ship faster with confidence.
                            </p>
                            <p>
                                My sweet spot is pairing TypeScript/Next.js interfaces with Node and Spring Boot services, PostgreSQL,
                                and cloud-native infrastructure. I obsess over measurable performance, thoughtful UX, and documentation that makes
                                future iterations easier for everyone on the team.
                            </p>
                            <p>
                                When I'm not iterating on client work, you'll find me mentoring other engineers, contributing to OSS, or writing about
                                the patterns that help me build resilient platforms end-to-end.
                            </p>
                        </div>

                        {/* Right side - Quick facts */}
                        <div className="space-y-3">
                            <div className="bg-card border border-border rounded-lg p-4 hover-lift">
                                <h3 className="font-semibold text-foreground mb-1">Technical Focus</h3>
                                <p className="text-sm text-muted-foreground">Type-safe Next.js frontends + Node/Spring Boot services</p>
                            </div>
                            <div className="bg-card border border-border rounded-lg p-4 hover-lift">
                                <h3 className="font-semibold text-foreground mb-1">Experience</h3>
                                <p className="text-sm text-muted-foreground">3 years leading cross-functional product builds</p>
                            </div>
                            <div className="bg-card border border-border rounded-lg p-4 hover-lift">
                                <h3 className="font-semibold text-foreground mb-1">Passion</h3>
                                <p className="text-sm text-muted-foreground">Crafting accessible UX backed by reliable infrastructure</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
