import { notFound } from 'next/navigation'
import { getBlogPost, getAllBlogPosts } from '@/lib/blog-data'
import { Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export async function generateStaticParams() {
    const posts = getAllBlogPosts()
    return posts.map((post) => ({
        slug: post.slug,
    }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = getBlogPost(slug)

    if (!post) {
        return {
            title: 'Post Not Found',
        }
    }

    return {
        title: post.title,
        description: post.excerpt,
    }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = getBlogPost(slug)

    if (!post) {
        notFound()
    }

    return (
        <main className="min-h-screen bg-background text-foreground pt-10">
            <article className="py-10 px-4">
                <div className="max-w-4xl mx-auto">
                    <Link href="/blog">
                        <Button variant="ghost" className="mb-8" asChild>
                            <span className="flex items-center gap-2">
                                <ArrowLeft size={16} />
                                Back to Blog
                            </span>
                        </Button>
                    </Link>

                    <header className="mb-8">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-bold mb-4">{post.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Calendar size={14} /> {post.date}
                            </span>
                            <span>{post.readTime}</span>
                        </div>
                    </header>

                    <div className="prose prose-invert max-w-none">
                        <p className="text-lg text-muted-foreground mb-8">{post.excerpt}</p>
                        {post.content && (
                            <div className="blog-content">
                                {post.content.split('\n').map((paragraph, idx) => {
                                    if (paragraph.trim() === '') return null
                                    if (paragraph.startsWith('# ')) {
                                        return <h1 key={idx} className="text-3xl font-bold mt-8 mb-4">{paragraph.replace('# ', '')}</h1>
                                    }
                                    if (paragraph.startsWith('## ')) {
                                        return <h2 key={idx} className="text-2xl font-bold mt-6 mb-3">{paragraph.replace('## ', '')}</h2>
                                    }
                                    if (paragraph.startsWith('### ')) {
                                        return <h3 key={idx} className="text-xl font-semibold mt-4 mb-2">{paragraph.replace('### ', '')}</h3>
                                    }
                                    return <p key={idx} className="mb-4 leading-relaxed">{paragraph.trim()}</p>
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </article>
        </main>
    )
}