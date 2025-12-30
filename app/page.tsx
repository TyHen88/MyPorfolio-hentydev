"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/common/navigation";
import Hero from "@/components/common/hero";
import About from "@/components/features/about-me/about";
import Experience from "@/components/experience";
import Skills from "@/components/skills";
import Projects from "@/components/features/my-project/projects";
import Blog from "@/components/features/blog/blog";
import Research from "@/components/features/research/research";
import BestPractices from "@/components/best-practices";
import Contact from "@/components/features/about-me/contact";
import Footer from "@/components/common/footer";
import AiAssistant from "@/components/ai-assistant/AiAssistant";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
  );
}
