'use client'

import { useEffect, useRef, useState } from 'react'

const experiences = [
    {
        title: "Senior Frontend Engineer",
        company: "Tech Company Inc.",
        date: "2022 - Present",
        description: "Led frontend development for enterprise applications, mentored junior developers, and implemented performance optimizations.",
        technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS"]
    },
    {
        title: "Full-Stack Developer",
        company: "StartUp Co.",
        date: "2020 - 2022",
        description: "Built end-to-end features for SaaS platform, managed database design, and improved app performance by 40%.",
        technologies: ["React", "Node.js", "PostgreSQL", "AWS"]
    },
    {
        title: "Junior Web Developer",
        company: "Digital Agency",
        date: "2018 - 2020",
        description: "Developed responsive websites and web applications, collaborated with design team, and learned best practices.",
        technologies: ["HTML", "CSS", "JavaScript", "React"]
    },
]

export default function Experience() {
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
        <section id="experience" className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div ref={ref}>
                    <h2 className="text-3xl sm:text-5xl font-bold mb-12 flex items-center gap-3">
                        <span className="text-primary">02.</span>
                        <span>Experience</span>
                    </h2>

                    <div className="space-y-8">
                        {experiences.map((exp, idx) => (
                            <div
                                key={idx}
                                className={`border-l-2 border-primary pl-6 pb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                                    }`}
                                style={{ transitionDelay: `${idx * 100}ms` }}
                            >
                                <div className="absolute -left-3 -top-2 w-4 h-4 bg-primary rounded-full" />

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                                    <h3 className="text-xl font-semibold text-foreground">{exp.title}</h3>
                                    <span className="text-sm text-muted-foreground">{exp.date}</span>
                                </div>

                                <p className="text-primary font-medium mb-2">{exp.company}</p>
                                <p className="text-muted-foreground mb-4">{exp.description}</p>

                                <div className="flex flex-wrap gap-2">
                                    {exp.technologies.map((tech, techIdx) => (
                                        <span
                                            key={techIdx}
                                            className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full"
                                        >
                                            {tech}
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
