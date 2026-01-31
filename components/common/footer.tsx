'use client'

import { Heart } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-card border-t border-border mt-20">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Left side */}
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <span>Designed & engineered by Hen Ty</span>
                        <Heart size={16} className="text-primary fill-primary" />
                        {/* <span>with Next.js + Tailwind CSS</span> */}
                    </div>

                    {/* Social links */}
                    <div className="flex items-center gap-6">
                        <a href="https://github.com/TyHen88" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                            GitHub
                        </a>
                        <a href="https://www.linkedin.com/in/ty-hen-b7799b2a4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                            LinkedIn
                        </a>
                        <a href="https://t.me/ahh_tiii" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                            Telegram
                        </a>
                    </div>

                    {/* Copyright */}
                    <div className="text-sm text-muted-foreground">
                        © 2025 All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    )
}
