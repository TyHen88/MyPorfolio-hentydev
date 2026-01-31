'use client'

import { useEffect, useRef, useState } from 'react'
import { ExternalLink, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'

const projects = [
    {
        title: "E-Commerce Platform",
        description: "Headless commerce stack built with Next.js App Router, server actions for checkout, Stripe billing, and event-driven inventory sync powered by PostgreSQL.",
        image: "/ecommerce-dashboard.png",
        technologies: ["Next.js", "TypeScript", "Stripe", "PostgreSQL", "Tailwind CSS"],
        links: { demo: "#", github: "#" }
    },
    {
        title: "Task Management App",
        description: "Collaborative task platform featuring optimistic drag-and-drop boards, WebSocket presence, and role-based permissions that keep distributed teams aligned.",
        image: "/task-management-app.png",
        technologies: ["React", "Firebase", "Framer Motion", "Tailwind CSS"],
        links: { demo: "#", github: "#" }
    },
    {
        title: "AI Content Generator",
        description: "AI authoring tool that orchestrates OpenAI, custom prompt chains, and background workers to produce long-form content with brand-ready exports.",
        image: "/ai-content-generator-interface.png",
        technologies: ["Next.js", "OpenAI", "TypeScript", "PostgreSQL"],
        links: { demo: "#", github: "#" }
    },
    {
        title: "Analytics Dashboard",
        description: "Streaming analytics dashboard ingesting Kafka topics, exposing drill-down filters, and visualizing KPI trends with reusable React data viz primitives.",
        image: "/analytics-dashboard.png",
        technologies: ["React", "Recharts", "TypeScript", "API Integration"],
        links: { demo: "#", github: "#" }
    },
    {
        title: "Social Media App",
        description: "Edge-ready social platform with secure auth, Socket.io messaging, MongoDB change streams, and personalized feed algorithms.",
        image: "/social-media-application-interface.jpg",
        technologies: ["Next.js", "Socket.io", "MongoDB", "Tailwind CSS"],
        links: { demo: "#", github: "#" }
    },
    {
        title: "Documentation Site",
        description: "MDX-powered documentation system featuring Algolia search, automated versioning, and an offline-ready PWA shell for field teams.",
        image: "/documentation-website-interface.jpg",
        technologies: ["Next.js", "MDX", "Algolia", "Tailwind CSS"],
        links: { demo: "#", github: "#" }
    },
]

export default function Projects() {
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
        <section id="projects" className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div ref={ref}>
                    <h2 className="text-3xl sm:text-5xl font-bold mb-12 flex items-center gap-3">
                        <span className="text-primary">04.</span>
                        <span>Featured Projects</span>
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project, idx) => (
                            <div
                                key={idx}
                                className={`group bg-card border border-border rounded-lg overflow-hidden hover-lift transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                                style={{ transitionDelay: `${idx * 80}ms` }}
                            >
                                {/* Project Image */}
                                <div className="relative h-48 overflow-hidden bg-muted">
                                    <img
                                        src={project.image || "/placeholder.svg"}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                                </div>

                                {/* Project Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>

                                    {/* Technologies */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.technologies.slice(0, 3).map((tech, techIdx) => (
                                            <span key={techIdx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Links */}
                                    <div className="flex gap-3">
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
