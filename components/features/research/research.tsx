'use client'

import { useEffect, useRef, useState } from 'react'
import { Lightbulb } from 'lucide-react'
import { researchSection } from '@/lib/portfolio-mock-data'

export default function Research() {
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
        <section id="research" className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div ref={ref}>
                    <h2 className="text-3xl sm:text-5xl font-bold mb-12 flex items-center gap-3">
                        <span className="text-secondary">06.</span>
                        <span>{researchSection.title}</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {researchSection.items.map((item, idx) => (
                            <div
                                key={idx}
                                className={`bg-card border border-border rounded-lg p-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                                style={{ transitionDelay: `${idx * 100}ms` }}
                            >
                                <div className="flex items-start gap-3 mb-4">
                                    <Lightbulb className="text-secondary mt-1 flex-shrink-0" size={20} />
                                    <h3 className="text-lg font-semibold">{item.title}</h3>
                                </div>
                                <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">Progress</span>
                                        <span className="text-secondary font-semibold">{item.progress}%</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-secondary to-accent transition-all duration-500"
                                            style={{ width: `${isVisible ? item.progress : 0}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
