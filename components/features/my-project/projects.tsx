'use client'

import { useEffect, useRef, useState } from 'react'
import { ExternalLink, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { projectsSection } from '@/lib/portfolio-mock-data'

const hasRealLink = (value?: string) => Boolean(value && value.trim() && value !== '#')

export default function Projects() {
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
                threshold: 0.18,
                rootMargin: '0px 0px -10% 0px'
            }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [])

    const introRevealClass = isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-8 blur-[6px]'

    return (
        <section id="projects" className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div ref={ref}>
                    <div
                        className={`mb-12 max-w-3xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${introRevealClass}`}
                    >
                        <h2 className="text-3xl sm:text-5xl font-bold mb-4 flex items-center gap-3">
                            <span className="text-primary">04.</span>
                            <span>{projectsSection.title}</span>
                        </h2>
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            {projectsSection.description}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projectsSection.items.map((project, idx) => (
                            <div
                                key={idx}
                                className={`group overflow-hidden rounded-3xl border border-border bg-card shadow-lg hover-lift transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                    isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-10 blur-[6px]'
                                }`}
                                style={{ transitionDelay: `${180 + idx * 80}ms` }}
                            >
                                <div className="relative h-52 overflow-hidden bg-muted">
                                    <img
                                        src={project.image || "/placeholder.svg"}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                                    <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-background/60 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
                                        Product work
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                                    <p className="text-muted-foreground text-sm mb-5 line-clamp-3">{project.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-5">
                                        {project.technologies.slice(0, 4).map((tech, techIdx) => (
                                            <span key={techIdx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    {hasRealLink(project.links.demo) || hasRealLink(project.links.github) ? (
                                        <div className="flex gap-3">
                                            {hasRealLink(project.links.demo) && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="flex-1 text-primary hover:bg-primary/10"
                                                    asChild
                                                >
                                                    <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink size={16} className="mr-1" /> Demo
                                                    </a>
                                                </Button>
                                            )}
                                            {hasRealLink(project.links.github) && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="flex-1 text-secondary hover:bg-secondary/10"
                                                    asChild
                                                >
                                                    <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                                                        <Github size={16} className="mr-1" /> Code
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            Case study details available on request.
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
