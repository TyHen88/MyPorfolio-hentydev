'use client'

import { useEffect, useRef, useState } from 'react'
import { Calendar, ArrowRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getAllBlogPosts } from '@/lib/blog-data'
import { Button } from '@/components/ui/button'

const blogPosts = getAllBlogPosts()

export default function BlogPosts() {
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
        <section id="blog" className="py-20 px-4 bg-gradient-to-b from-transparent to-card/30">
            <div className="max-w-4xl mx-auto">
                <Link href="/">
                    <Button variant="ghost" className="mb-8" asChild>
                        <span className="flex items-center gap-2">
                            <ArrowLeft size={16} />
                            Back
                        </span>
                    </Button>
                </Link>
                <div ref={ref}>
                    <h2 className="text-3xl sm:text-5xl font-bold mb-12 flex items-center gap-3">
                        <span className="text-accent">05.</span>
                        <span>Latest Blog Posts</span>
                    </h2>
                    <div>
                        {blogPosts.map((post, idx) => (
                            <Link key={idx} href={`/blog/${post.slug}`}>
                                <article
                                    className="bg-card border border-border rounded-lg p-6 hover-lift transition-all duration-700 opacity-100 translate-x-0"
                                    style={{ marginBottom: idx !== blogPosts.length - 1 ? "1.5rem" : 0 }} // 1.5rem ~24px, equivalent to space-y-6
                                >
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2 group hover:text-primary transition-colors">
                                                {post.title}
                                            </h3>
                                            <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="flex flex-wrap gap-2">
                                                {post.tags.map((tag, tagIdx) => (
                                                    <span key={tagIdx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                <div className="flex items-center gap-4">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={14} /> {post.date}
                                                    </span>
                                                    <span>{post.readTime}</span>
                                                </div>
                                                <ArrowRight size={16} className="text-primary" />
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}