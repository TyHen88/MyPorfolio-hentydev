'use client'

import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Hero() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    return (
        <section className="min-h-screen flex flex-col items-center justify-center pt-16 px-4 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 -z-10" />
            <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10 animate-glow" />

            <div className={`max-w-2xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                {/* Greeting */}
                <div className="mb-4 inline-block">
                    <span className="text-sm font-semibold text-accent uppercase tracking-widest bg-accent/10 px-4 py-1 rounded-full">
                        Shipping dependable web products
                    </span>
                </div>

                {/* Main heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                    <span className="block text-foreground mb-2">Hi, I'm Hen Ty</span>
                    <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                        Full-Stack Product Engineer
                    </span>
                </h1>

                {/* Description */}
                <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
                    I design, build, and scale web platforms end-to-end. From highly interactive React/Next.js experiences to resilient APIs in Node and Spring Boot backed by PostgreSQL on AWS, I turn complex product ideas into measured outcomes.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                    <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-semibold hover-scale">
                        <a href="#projects">View My Work</a>
                    </Button>
                    <Button asChild variant="outline" className="border-border hover:bg-card px-8 py-6 text-base font-semibold hover-scale">
                        <a href="#contact">Get In Touch</a>
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-8 text-center">
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <div className="text-2xl sm:text-3xl font-bold text-primary">45+</div>
                        <div className="text-sm text-muted-foreground">End-to-end launches</div>
                    </div>
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div className="text-2xl sm:text-3xl font-bold text-secondary">3+</div>
                        <div className="text-sm text-muted-foreground">Years full-stack</div>
                    </div>
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <div className="text-2xl sm:text-3xl font-bold text-accent">99.9%</div>
                        <div className="text-sm text-muted-foreground">Uptime goals</div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <ChevronDown className="text-muted-foreground" size={32} />
            </div>
        </section>
    )
}
