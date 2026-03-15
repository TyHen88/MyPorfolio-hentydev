"use client"

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
export default function MylearnFeature() {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef(null)

    return (
        <section id="learned" className="py-20 px-4 bg-gradient-to-b from-transparent to-card/30">
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
                        <span className="text-accent">08.</span>
                        <span>My Learned Features</span>
                    </h2>
                    <div>
                        <Link href="/my-learn">
                            <Button variant="outline" className="hover-scale">
                                View All Learned Features
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
