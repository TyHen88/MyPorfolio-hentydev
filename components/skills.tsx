'use client'

import { useEffect, useRef, useState } from 'react'

const skillCategories = [
    {
        name: "Frontend",
        skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Shadcn/UI", "HTML", "CSS", "JavaScript", "MUI"]
    },
    {
        name: "Backend",
        skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "REST APIs", "GraphQL", "Spring Boot", "Spring Security", "Spring Data JPA", "Spring Cloud", "Spring Batch"]
    },
    {
        name: "Tools & DevOps",
        skills: ["Git", "Docker", "AWS", "Vercel", "CI/CD", "Webpack"]
    },
    {
        name: "Design & UX",
        skills: ["Figma", "Responsive Design", "Accessibility", "UI/UX Principles", "Performance", "SEO"]
    }
]

export default function Skills() {
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
        <section id="skills" className="py-20 px-4 bg-gradient-to-b from-transparent to-card/30">
            <div className="max-w-4xl mx-auto">
                <div ref={ref}>
                    <h2 className="text-3xl sm:text-5xl font-bold mb-12 flex items-center gap-3">
                        <span className="text-primary">03.</span>
                        <span>Skills</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {skillCategories.map((category, idx) => (
                            <div
                                key={idx}
                                className={`bg-card border border-border rounded-lg p-6 hover-lift transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                                style={{ transitionDelay: `${idx * 100}ms` }}
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
