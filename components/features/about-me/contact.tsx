'use client'

import { useState, useRef, useEffect } from 'react'
import { Mail, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { contactSection } from '@/lib/portfolio-mock-data'

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
        const formData = new FormData(form)
        const data = {
            name: String(formData.get('name') ?? ''),
            email: String(formData.get('email') ?? ''),
            message: String(formData.get('message') ?? '')
        }

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            const result = await res.json().catch(() => ({}))

            if (res.ok) {
                setSuccess(contactSection.form.successMessage)
                form.reset()
            } else {
                setError(result?.error || contactSection.form.fallbackErrorMessage)
            }
        } catch (err) {
            setError(contactSection.form.genericErrorMessage)
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
                        <span>{contactSection.title}</span>
                    </h2>

                    <p className="text-muted-foreground text-lg mb-12 max-w-xl mx-auto">
                        {contactSection.description}
                    </p>

                    {/* Contact Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                        <input
                            type="text"
                            name="name"
                            placeholder={contactSection.form.namePlaceholder}
                            required
                            className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder={contactSection.form.emailPlaceholder}
                            required
                            className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        <textarea
                            placeholder={contactSection.form.messagePlaceholder}
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
                                    {contactSection.form.loadingLabel}
                                </>
                            ) : (
                                <>
                                    <Mail className="mr-2" size={18} />
                                    {contactSection.form.submitLabel}
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
                        {contactSection.methods.map((method) => (
                            <a
                                key={method.label}
                                href={method.href}
                                target={method.href.startsWith('http') ? '_blank' : undefined}
                                rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className="bg-card hover:bg-card/80 border border-border rounded-lg p-4 transition-colors group"
                            >
                                <div className="text-primary font-semibold mb-1 group-hover:text-secondary transition-colors">{method.label}</div>
                                <div className="text-sm text-muted-foreground">{method.description}</div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
