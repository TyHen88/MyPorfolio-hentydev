'use client'

import { useEffect, useRef, useState } from 'react'
import { skillsSection } from '@/lib/portfolio-mock-data'

export default function Skills() {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.unobserve(entry.target)
                }
            },
            {
                threshold: 0.2,
                rootMargin: '0px 0px -12% 0px'
            }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [])

    const introRevealClass = isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-8 blur-[6px]'

    return (
        <section id="skills" className="py-20 px-4 bg-gradient-to-b from-transparent to-card/30">
            <div className="max-w-4xl mx-auto">
                <div ref={ref}>
                    <div
                        className={`mb-10 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${introRevealClass}`}
                    >
                        <h2 className="text-3xl sm:text-5xl font-bold mb-4 flex items-center gap-3">
                            <span className="text-primary">03.</span>
                            <span>{skillsSection.title}</span>
                        </h2>
                        <p className="text-muted-foreground max-w-3xl">
                            {skillsSection.description}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {skillsSection.categories.map((category, idx) => (
                            <div
                                key={idx}
                                className={`bg-card border border-border rounded-lg p-6 hover-lift transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                    isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-10 blur-[6px]'
                                }`}
                                style={{ transitionDelay: `${180 + idx * 90}ms` }}
                            >
                                <h3 className="text-xl font-semibold text-primary mb-4">{category.name}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {category.skills.map((skill, skillIdx) => (
                                        <span
                                            key={skillIdx}
                                            className="bg-gradient-to-r from-primary/20 to-secondary/20 text-foreground px-3 py-1 rounded-full text-sm font-medium border border-primary/20"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
