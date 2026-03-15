'use client'

import { Heart } from 'lucide-react'
import { footerContent } from '@/lib/portfolio-mock-data'

export default function Footer() {
    return (
        <footer className="bg-card border-t border-border mt-20">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Left side */}
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <span>{footerContent.credit}</span>
                        <Heart size={16} className="text-primary fill-primary" />
                        {/* <span>with Next.js + Tailwind CSS</span> */}
                    </div>

                    {/* Social links */}
                    <div className="flex items-center gap-6">
                        {footerContent.socialLinks.map((link) => (
                            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Copyright */}
                    <div className="text-sm text-muted-foreground">
                        {footerContent.copyright}
                    </div>
                </div>
            </div>
        </footer>
    )
}
