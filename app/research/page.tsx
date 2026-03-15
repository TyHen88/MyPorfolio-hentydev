'use client';
import { researchSection } from '@/lib/portfolio-mock-data';

export default function ResearchPage() {  
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-4">{researchSection.title}</h1>
                <p className="text-slate-400 mb-12">Explore the technical themes I am actively researching and prototyping.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {researchSection.items.map((item) => (
                        <div
                            key={item.title}
                            className="bg-slate-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
                        >
                            <h2 className="text-xl font-semibold text-white mb-2">
                                {item.title}
                            </h2>
                            <p className="text-slate-300 mb-4">{item.description}</p>
                            <div className="flex items-center justify-between text-sm text-slate-300">
                                <span>Progress</span>
                                <span className="font-semibold text-cyan-300">{item.progress}%</span>
                            </div>
                            <div className="mt-3 h-2 rounded-full bg-slate-600 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${item.progress}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
