'use client';
import { projectsSection } from '@/lib/portfolio-mock-data';

const hasRealLink = (value?: string) => Boolean(value && value.trim() && value !== '#');

export default function MyProjectsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4 py-12">
            <div className="max-w-6xl mx-auto">
                <div className="mb-12 max-w-3xl">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Project Archive</p>
                    <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">{projectsSection.title}</h1>
                    <p className="text-lg leading-relaxed text-slate-300">{projectsSection.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projectsSection.items.map((project) => (
                        <div
                            key={project.title}
                            className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-800/90 shadow-xl transition-shadow hover:shadow-cyan-500/10"
                        >
                            <div className="h-48 overflow-hidden">
                                <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                            </div>
                            <div className="p-6">
                                <h2 className="mb-2 text-xl font-semibold text-white">{project.title}</h2>
                                <p className="mb-5 text-slate-300">{project.description}</p>
                                <div className="mb-5 flex flex-wrap gap-2">
                                    {project.technologies.map((tech) => (
                                        <span
                                            key={tech}
                                            className="rounded-full bg-slate-700 px-3 py-1 text-sm text-slate-200"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                {hasRealLink(project.links.demo) || hasRealLink(project.links.github) ? (
                                    <div className="flex gap-3">
                                        {hasRealLink(project.links.demo) && (
                                            <a
                                                href={project.links.demo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-cyan-300 hover:text-cyan-200"
                                            >
                                                Live
                                            </a>
                                        )}
                                        {hasRealLink(project.links.github) && (
                                            <a
                                                href={project.links.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-cyan-300 hover:text-cyan-200"
                                            >
                                                GitHub
                                            </a>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400">Case study details available on request.</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
