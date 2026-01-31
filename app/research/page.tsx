'use client';
import { useState } from 'react';
interface Project {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    link?: string;
    github?: string;
}

export default function ResearchPage() {  
    const [projects] = useState<Project[]>([
        {
            id: '1',
            title: 'Project One',
            description: 'A brief description of your first project',
            technologies: ['React', 'TypeScript', 'Tailwind CSS'],
            link: 'https://example.com',
            github: 'https://github.com',
        },
        {
            id: '2',
            title: 'Project Two',
            description: 'A brief description of your second project',
            technologies: ['Next.js', 'Node.js', 'PostgreSQL'],
            github: 'https://github.com',
        },
    ]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-4">My Projects</h1>
                <p className="text-slate-400 mb-12">Explore my work and projects</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-slate-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
                        >
                            <h2 className="text-xl font-semibold text-white mb-2">
                                {project.title}
                            </h2>
                            <p className="text-slate-300 mb-4">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.technologies.map((tech) => (
                                    <span
                                        key={tech}
                                        className="bg-slate-600 text-slate-200 px-3 py-1 rounded text-sm"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                {project.link && (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300"
                                    >
                                        Live
                                    </a>
                                )}
                                {project.github && (
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300"
                                    >
                                        GitHub
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}