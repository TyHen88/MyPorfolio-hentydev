'use client'

import { useEffect, useRef, useState } from 'react'
import { Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getAllBlogPosts } from '@/lib/blog-data'

const blogPosts = getAllBlogPosts()

export default function Blog() {
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
                <div ref={ref}>
                    <h2 className="text-3xl sm:text-5xl font-bold mb-12 flex items-center gap-3">
                        <span className="text-primary">05.</span>
                        <span>Latest Blog Posts</span>
                    </h2>

                    <div className="space-y-6">
                        {blogPosts.map((post, idx) => (
                            <article
                                key={idx}
                                className={`bg-card border border-border rounded-lg p-6 hover-lift transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                                    }`}
                                style={{ transitionDelay: `${idx * 100}ms` }}
                            >
                                <Link href={`/blog/${post.slug}`}>
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2 group hover:text-primary transition-colors cursor-pointer">
                                                {post.title}
                                            </h3>
                                            <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="flex flex-wrap gap-2">
                                                {post.tags.map((tag, tagIdx) => (
                                                    <span
                                                        key={tagIdx}
                                                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                                                    >
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
                                </Link>
                            </article>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <Button asChild variant="outline" className="hover-scale">
                            <a href="/blog">View All Articles</a>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
