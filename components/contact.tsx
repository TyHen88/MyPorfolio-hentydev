'use client'

import { useState, useRef, useEffect } from 'react'
import { Mail, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Contact() {
    const [isVisible, setIsVisible] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState('')
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate form submission
        setTimeout(() => {
            setMessage('Thanks for reaching out! I\'ll get back to you soon.')
            setIsSubmitting(false)
            e.currentTarget.reset()

            setTimeout(() => setMessage(''), 3000)
        }, 1500)
    }

    return (
        <section id="contact" className="py-20 px-4">
            <div className="max-w-2xl mx-auto">
                <div ref={ref} className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <h2 className="text-3xl sm:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
                        <span className="text-primary">08.</span>
                        <span>Get In Touch</span>
                    </h2>

                    <p className="text-muted-foreground text-lg mb-12 max-w-xl mx-auto">
                        Have a project in mind or just want to chat? Feel free to reach out. I'm always interested in hearing about new opportunities.
                    </p>

                    {/* Contact Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                        <input
                            type="email"
                            placeholder="Your email address"
                            required
                            className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        <textarea
                            placeholder="Your message"
                            rows={5}
                            required
                            className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                        />
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 font-semibold"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={18} />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Mail className="mr-2" size={18} />
                                    Send Message
                                </>
                            )}
                        </Button>
                    </form>

                    {message && (
                        <div className="bg-primary/10 border border-primary text-primary px-4 py-3 rounded-lg mb-8 animate-fade-in-up">
                            {message}
                        </div>
                    )}

                    {/* Alternative Contact Methods */}
                    <div className="grid sm:grid-cols-3 gap-4 pt-8 border-t border-border">
                        <a
                            href="mailto:hello@example.com"
                            className="bg-card hover:bg-card/80 border border-border rounded-lg p-4 transition-colors group"
                        >
                            <div className="text-primary font-semibold mb-1 group-hover:text-secondary transition-colors">Email</div>
                            <div className="text-sm text-muted-foreground">hello@example.com</div>
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-card hover:bg-card/80 border border-border rounded-lg p-4 transition-colors group"
                        >
                            <div className="text-primary font-semibold mb-1 group-hover:text-secondary transition-colors">LinkedIn</div>
                            <div className="text-sm text-muted-foreground">Connect with me</div>
                        </a>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-card hover:bg-card/80 border border-border rounded-lg p-4 transition-colors group"
                        >
                            <div className="text-primary font-semibold mb-1 group-hover:text-secondary transition-colors">GitHub</div>
                            <div className="text-sm text-muted-foreground">View my projects</div>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
