'use client'

import { useState, useRef, useEffect } from 'react'
import { Mail, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Contact() {
    const [isVisible, setIsVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
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
        setLoading(true)
        setSuccess('')
        setError('')

        const form = e.currentTarget
        const data = {
            name: (form.name as HTMLInputElement).value,
            email: (form.email as HTMLInputElement).value,
            message: (form.message as HTMLTextAreaElement).value
        }

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            const result = await res.json().catch(() => ({}))

            if (res.ok) {
                setSuccess("Thanks for reaching out! I'll get back to you soon.")
                form.reset()
            } else {
                setError(result?.error || 'Unable to send message. Please try again later.')
            }
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
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
                        Building a new product, modernizing a legacy system, or looking for a fractional full-stack partner?
                        Let's chat about how I can help with architecture, delivery, and everything between design reviews and production support.
                    </p>

                    {/* Contact Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                        <input
                            type="text"
                            name="name"
                            placeholder="Your name"
                            required
                            className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your email address"
                            required
                            className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        <textarea
                            placeholder="Your message"
                            name="message"
                            rows={5}
                            required
                            className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                        />
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 font-semibold"
                        >
                            {loading ? (
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

                    {success && (
                        <div className="px-4 py-3 rounded-lg mb-8 animate-fade-in-up border bg-primary/10 border-primary text-primary">
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="px-4 py-3 rounded-lg mb-8 animate-fade-in-up border bg-destructive/10 border-destructive text-destructive">
                            {error}
                        </div>
                    )}

                    {/* Alternative Contact Methods */}
                    <div className="grid sm:grid-cols-4 gap-4 pt-8 border-t border-border">
                        <a
                            href="mailto:hentyn11@gmail.com"
                            className="bg-card hover:bg-card/80 border border-border rounded-lg p-4 transition-colors group"
                        >
                            <div className="text-primary font-semibold mb-1 group-hover:text-secondary transition-colors">Email</div>
                            <div className="text-sm text-muted-foreground">hentyn11@gmail.com — share context & specs</div>
                        </a>
                        <a
                            href="https://www.linkedin.com/in/ty-hen-b7799b2a4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-card hover:bg-card/80 border border-border rounded-lg p-4 transition-colors group"
                        >
                            <div className="text-primary font-semibold mb-1 group-hover:text-secondary transition-colors">LinkedIn</div>
                            <div className="text-sm text-muted-foreground">Swap product ideas & opportunities</div>
                        </a>
                        <a
                            href="https://github.com/TyHen88"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-card hover:bg-card/80 border border-border rounded-lg p-4 transition-colors group"
                        >
                            <div className="text-primary font-semibold mb-1 group-hover:text-secondary transition-colors">GitHub</div>
                            <div className="text-sm text-muted-foreground">Browse active builds & experiments</div>
                        </a>
                        <a
                            href="https://t.me/ahh_tiii"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-card hover:bg-card/80 border border-border rounded-lg p-4 transition-colors group"
                        >
                            <div className="text-primary font-semibold mb-1 group-hover:text-secondary transition-colors">Telegram</div>
                            <div className="text-sm text-muted-foreground">Ping me for quick async syncs</div>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
