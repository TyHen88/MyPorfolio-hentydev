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
                                I'm a passionate developer with a love for creating elegant solutions to complex problems.
                                With expertise in modern web technologies, I build scalable, performant applications that users love.
                            </p>
                            <p>
                                When I'm not coding, you can find me contributing to open source, writing technical blog posts,
                                or exploring new technologies and frameworks that push the boundaries of web development.
                            </p>
                            <p>
                                My journey in tech started with a curiosity about how things work, and it has evolved into a
                                deep passion for building products that make a meaningful impact.
                            </p>
                        </div>

                        {/* Right side - Quick facts */}
                        <div className="space-y-3">
                            <div className="bg-card border border-border rounded-lg p-4 hover-lift">
                                <h3 className="font-semibold text-foreground mb-1">Technical Focus</h3>
                                <p className="text-sm text-muted-foreground">Full-stack development with React, Next.js, TypeScript</p>
                            </div>
                            <div className="bg-card border border-border rounded-lg p-4 hover-lift">
                                <h3 className="font-semibold text-foreground mb-1">Experience</h3>
                                <p className="text-sm text-muted-foreground">5+ years building scalable web applications</p>
                            </div>
                            <div className="bg-card border border-border rounded-lg p-4 hover-lift">
                                <h3 className="font-semibold text-foreground mb-1">Passion</h3>
                                <p className="text-sm text-muted-foreground">Creating beautiful UX with clean, maintainable code</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
