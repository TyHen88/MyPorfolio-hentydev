'use client'

import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'

const practices = [
    {
        category: "Code Quality",
        items: [
            "Write clean, readable, and maintainable code",
            "Use TypeScript for type safety",
            "Implement proper error handling",
            "Follow SOLID principles"
        ]
    },
    {
        category: "Performance",
        items: [
            "Optimize bundle size and lazy loading",
            "Implement code splitting",
            "Use memoization and React.memo",
            "Monitor Core Web Vitals"
        ]
    },
    {
        category: "Accessibility",
        items: [
            "Follow WCAG 2.1 guidelines",
            "Use semantic HTML",
            "Test with screen readers",
            "Ensure keyboard navigation"
        ]
    },
    {
        category: "Security",
        items: [
            "Protect against XSS attacks",
            "Implement proper authentication",
            "Validate and sanitize inputs",
            "Keep dependencies updated"
        ]
    },
]

export default function BestPractices() {
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
        <section id="best-practices" className="py-20 px-4 bg-gradient-to-b from-transparent to-card/30">
            <div className="max-w-4xl mx-auto">
                <div ref={ref}>
                    <h2 className="text-3xl sm:text-5xl font-bold mb-12 flex items-center gap-3">
                        <span className="text-accent">07.</span>
                        <span>Best Practices</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {practices.map((practice, idx) => (
                            <div
                                key={idx}
                                className={`bg-card border border-border rounded-lg p-6 transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                                    }`}
                                style={{ transitionDelay: `${idx * 100}ms` }}
                            >
                                <h3 className="text-lg font-semibold text-accent mb-4">{practice.category}</h3>
                                <ul className="space-y-3">
                                    {practice.items.map((item, itemIdx) => (
                                        <li key={itemIdx} className="flex items-start gap-3">
                                            <Check className="text-primary mt-0.5 flex-shrink-0" size={18} />
                                            <span className="text-muted-foreground text-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
