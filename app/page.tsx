'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/navigation'
import Hero from '@/components/hero'
import About from '@/components/about'
import Experience from '@/components/experience'
import Skills from '@/components/skills'
import Projects from '@/components/projects'
import Blog from '@/components/blog'
import Research from '@/components/research'
import BestPractices from '@/components/best-practices'
import Contact from '@/components/contact'
import Footer from '@/components/footer'
import AiAssistant from '@/components/ai-assistant/AiAssistant'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Blog />
      <Research />
      <BestPractices />
      <Contact />
      <Footer />
      <AiAssistant />
    </main>
  )
}
