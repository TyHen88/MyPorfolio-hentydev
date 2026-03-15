import { blogPosts } from "@/lib/blog-data";

export const siteMetadata = {
  title: "Hen Ty's Portfolio | Full-Stack Engineer",
  description:
    "Full-stack engineer building frontend experiences, backend APIs, AI integrations, Telegram products, payment flows, and maintainable business systems with Spring Boot, PostgreSQL, and Next.js.",
  baseUrl: "https://www.hentydev.site",
  ownerName: "Hen Ty",
  ownerRole: "Full-Stack Engineer | Frontend, APIs, and AI Integration",
  brandLabel: "Hen Ty's Portfolio",
};

export const navigationLinks = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#blog", label: "Blog" },
  { href: "#research", label: "Research" },
  { href: "#contact", label: "Contact" },
];

export const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/TyHen88",
    description: "Browse active builds and experiments",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ty-hen-b7799b2a4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    description: "Connect for product ideas and opportunities",
  },
  {
    label: "Telegram",
    href: "https://t.me/ahh_tiii",
    description: "Ping me for quick async syncs",
  },
];

export const heroSection = {
  id: "hero",
  order: "00",
  title: "Hi, I'm Hen Ty",
  subtitle: "Full-Stack Engineer | Frontend, APIs, AI",
  eyebrow:
    "Spring Boot, Next.js, Telegram mini apps, AI integrations, and payment workflows",
  description:
    "I build friendly frontend experiences and reliable backend APIs with Spring Boot, Spring Data JPA, PostgreSQL, Next.js, and TypeScript. My work covers client integrations, AI integrations, Telegram bots and mini apps, payment and billing flows, and the product maintenance that keeps real systems running well.",
  badges: [
    "Frontend + API delivery",
    "AI integration",
    "Telegram bot & mini app",
    "Payment systems",
  ],
  profile: {
    name: "Hen Ty",
    role: "Full-Stack Engineer",
    location: "Phnom Penh, Cambodia",
    imageSrc: "/HenTy.jpg",
    imageAlt: "Portrait of Hen Ty",
    note: "Computer Science graduate from the Royal University of Phnom Penh",
  },
  ctas: [
    { label: "View My Work", href: "#projects" },
    { label: "Get In Touch", href: "#contact" },
  ],
  stats: [
    { value: "3+", label: "Years building full-stack systems" },
    { value: "REST", label: "APIs, integrations, and client services" },
    { value: "Payments", label: "Invoices, transactions, and billing" },
  ],
};

export const aboutSection = {
  id: "about",
  order: "01",
  title: "About Me",
  url: `${siteMetadata.baseUrl}/#about`,
  paragraphs: [
    "I'm Hen Ty, a full-stack engineer who enjoys building software that feels clear on the frontend and dependable on the backend. I like taking product ideas from rough requirements to working systems that teams can actually maintain.",
    "In my current work, I build both frontend features and supporting APIs. Most of my hands-on delivery is with Spring Boot, Spring Data JPA, PostgreSQL, Next.js, and TypeScript, alongside client integrations, AI integrations, Telegram bots, Telegram mini apps, WeChat integrations, FCM push notifications, SMTP mail flows, SMS messaging services, and payment-related workflows.",
    "I graduated in Information Technology with a Computer Science background from the Royal University of Phnom Penh. That foundation helped shape how I approach problem solving, system design, and practical delivery in real product teams.",
    "Across previous projects, I have worked on AI chatbots, e-commerce platforms, Telegram bots, mini apps, e-learning products, online systems, and PWA web apps. I also use AI tools heavily in my day-to-day workflow-ChatGPT, Claude Code, Cursor, Gemini, and Codex-for prompts, instructions, agent workflows, workspace rules, and faster implementation while continuing to grow in Express.js and FastAPI.",
  ],
  education: {
    degree: "Bachelor of Information Technology",
    major: "Computer Science",
    institution: "Royal University of Phnom Penh",
    description:
      "Graduated with a Computer Science background and a practical focus on software engineering and modern web systems.",
  },
  highlights: [
    {
      title: "Current Focus",
      description:
        "Building frontend experiences and backend APIs with Spring Boot, PostgreSQL, Next.js, and TypeScript",
    },
    {
      title: "Experience",
      description:
        "Maintenance work, new project setup, REST APIs, AI integrations, client integrations, and notification workflows",
    },
    {
      title: "Domain Strength",
      description:
        "Payments, invoices, transactions, customers, and billing workflows",
    },
    {
      title: "Built Products",
      description:
        "AI chatbots, e-commerce, Telegram bots, mini apps, e-learning, online platforms, and PWAs",
    },
  ],
};

export const experienceItems = [
  {
    title: "Web Developer",
    company: "KOSIGN (Cambodia) Investment Co.,Ltd.",
    date: "2025 - Present",
    description:
      "Build and maintain both frontend experiences and supporting APIs for client-facing products. My work includes Next.js and TypeScript UI delivery, integration-ready backend work, issue resolution in live systems, and helping teams launch features for both ongoing products and new initiatives, including messaging and notification integrations.",
    technologies: [
      "Next.js",
      "TypeScript",
      "JavaScript",
      "REST APIs",
      "API Integration",
      "FCM",
      "SMTP Mail",
      "ShadCN UI",
      "GitHub",
      "GitLab",
    ],
  },
  {
    title: "Software Engineer",
    company: "KOSIGN (Cambodia) Investment Co.,Ltd.",
    date: "2023 - 2025",
    description:
      "Built and maintained backend services using Spring Boot, Spring Data JPA, and PostgreSQL. Delivered REST APIs, supported client API integrations, and worked on payment, invoice, transaction, customer, and billing-related features including ABA PayWay flows, messaging services, and third-party notifications.",
    technologies: [
      "Java",
      "Spring Boot",
      "Spring Data JPA",
      "PostgreSQL",
      "REST APIs",
      "API Integration",
      "WeChat",
      "Firebase FCM",
      "SMTP Mail",
      "SMS Service",
      "ABA PayWay",
      "GitHub",
      "GitLab",
    ],
  },
  {
    title: "Junior Full-Stack Developer",
    company: "Korea Software HRD Center (Training Program)",
    date: "2022 - 2023",
    description:
      "Contributed to the development of full-stack web applications, focusing on frontend interfaces with React and backend APIs with Java. Participated in code reviews and agile ceremonies to improve team productivity.",
    technologies: [
      "JavaScript",
      "Next.js",
      "React",
      "Java",
      "Spring Boot",
      "HTML",
      "CSS",
      "AWS",
      "Tailwind CSS",
      "Git",
      "Figma",
    ],
  },
];

export const experienceSection = {
  id: "experience",
  order: "02",
  title: "Experience",
  url: `${siteMetadata.baseUrl}/#experience`,
  items: experienceItems,
};

export const skillCategories = [
  {
    name: "Frontend",
    skills: [
      "Next.js",
      "TypeScript",
      "JavaScript",
      "React",
      "HTML",
      "CSS",
      "MUI",
      "Tailwind CSS",
      "ShadCN UI",
      "DaisyUI",
      "Flowbite",
    ],
  },
  {
    name: "Backend",
    skills: [
      "Java",
      "Spring Boot",
      "Spring Data JPA",
      "PostgreSQL",
      "REST APIs",
      "API Integration",
      "AI Integration",
      "WeChat API",
      "Firebase FCM",
      "SMTP Mail",
      "SMS Integration",
      "Express.js",
      "FastAPI",
    ],
  },
  {
    name: "Deployment & Platforms",
    skills: ["Vercel", "Netlify", "Railway", "Render", "Neon", "Supabase"],
  },
  {
    name: "Automation & Messaging",
    skills: [
      "Telegram Bot",
      "Telegram Mini App",
      "WeChat Integration",
      "Push Notifications",
      "SMTP Messaging",
      "SMS Messaging Service",
      "Webhook Flows",
      "Bot Automation",
      "PWA",
    ],
  },
  {
    name: "Collaboration & Git",
    skills: [
      "Git",
      "GitHub",
      "GitLab",
      "Client API Collaboration",
      "Maintenance Work",
      "New Project Setup",
    ],
  },
  {
    name: "AI Workflow",
    skills: [
      "Claude Code",
      "Cursor",
      "ChatGPT",
      "Gemini",
      "Codex",
      "Prompt Engineering",
      "AI Agents",
      "Workspace Rules",
      "Instructions",
    ],
  },
  {
    name: "Design Awareness",
    skills: [
      "Figma",
      "Basic UI understanding",
      "Design handoff collaboration",
      "Responsive layout implementation",
    ],
  },
];

export const skillsSection = {
  id: "skills",
  order: "03",
  title: "Skills",
  url: `${siteMetadata.baseUrl}/#skills`,
  description:
    "My current stack centers on Spring Boot, Spring Data JPA, PostgreSQL, Next.js, and TypeScript, with hands-on work across REST APIs, AI integrations, notification and messaging integrations, Telegram experiences, deployment platforms, AI-assisted workflows, and product maintenance.",
  categories: skillCategories,
};

export const featuredProjects = [
  {
    title: "Payment & Billing Platform",
    description:
      "Business workflow system covering payments, invoices, transactions, customers, and billing journeys. Built around Spring Boot REST APIs, Spring Data JPA, PostgreSQL, and a Next.js frontend.",
    image: "/analytics-dashboard.png",
    technologies: [
      "Spring Boot",
      "Spring Data JPA",
      "PostgreSQL",
      "Next.js",
      "TypeScript",
      "ABA PayWay",
    ],
    links: { demo: "#", github: "#" },
  },
  {
    title: "AI Chatbot & Integration Experience",
    description:
      "AI-powered chat and assistant workflows integrated into product experiences, combining prompt design, backend orchestration, and frontend delivery for more useful customer and internal tools.",
    image: "/task-management-app.png",
    technologies: [
      "AI Integration",
      "OpenAI",
      "Next.js",
      "TypeScript",
      "REST APIs",
      "Prompt Engineering",
    ],
    links: { demo: "#", github: "#" },
  },
  {
    title: "Telegram Bot & Mini App Platform",
    description:
      "Telegram-based product flows for automation, user interactions, and lightweight embedded app experiences, backed by APIs and business logic for faster customer-facing delivery.",
    image: "/ai-content-generator-interface.png",
    technologies: [
      "Telegram Bot",
      "Telegram Mini App",
      "Spring Boot",
      "Webhook Flows",
      "Next.js",
      "TypeScript",
    ],
    links: { demo: "#", github: "#" },
  },
  {
    title: "E-Commerce Platform",
    description:
      "Commerce-focused web application work covering catalog, product browsing, customer flows, order handling, and the integration patterns needed to support reliable digital transactions.",
    image: "/documentation-website-interface.jpg",
    technologies: [
      "Next.js",
      "TypeScript",
      "Spring Boot",
      "PostgreSQL",
      "REST APIs",
      "Payments",
    ],
    links: { demo: "#", github: "#" },
  },
  {
    title: "E-Learning Platform",
    description:
      "Learning-focused web experiences with structured content, student journeys, progress-oriented flows, and the backend services needed to support scalable educational products.",
    image: "/analytics-dashboard.png",
    technologies: [
      "Next.js",
      "TypeScript",
      "Spring Boot",
      "PostgreSQL",
      "Content Flows",
      "UI/UX",
    ],
    links: { demo: "#", github: "#" },
  },
  {
    title: "PWA & Online Platform Delivery",
    description:
      "Installable web app and online platform work focused on responsive UX, app-like behavior, and maintainable architecture for teams that need accessible products across devices.",
    image: "/task-management-app.png",
    technologies: [
      "PWA",
      "Next.js",
      "TypeScript",
      "Responsive Design",
      "Performance",
      "Web App Architecture",
    ],
    links: { demo: "#", github: "#" },
  },
];

export const projectsSection = {
  id: "projects",
  order: "04",
  title: "Featured Projects",
  description:
    "A mix of product work across payments, AI, commerce, education, messaging, and platform delivery. I usually contribute across frontend UI, backend APIs, integrations, and the maintenance work that keeps products healthy after launch.",
  url: `${siteMetadata.baseUrl}/#projects`,
  route: `${siteMetadata.baseUrl}/my-project`,
  items: featuredProjects,
};

export const blogSection = {
  id: "blog",
  order: "05",
  title: "Latest Blog Posts",
  url: `${siteMetadata.baseUrl}/#blog`,
  route: `${siteMetadata.baseUrl}/blog`,
  description:
    "I document the systems thinking behind my full-stack work-architecture notes, performance tuning tips, and lessons from pairing product strategy with modern web tooling.",
  posts: blogPosts.map((post) => ({
    ...post,
    url: `${siteMetadata.baseUrl}/blog/${post.slug}`,
  })),
};

export const researchItems = [
  {
    title: "Node.js APIs with Express.js",
    description:
      "Deepening my understanding of backend patterns in Node.js, Express.js routing, middleware, validation, and service structure.",
    progress: 75,
  },
  {
    title: "Python APIs with FastAPI",
    description:
      "Learning FastAPI for lightweight Python services, async endpoints, validation, and clean API design.",
    progress: 60,
  },
  {
    title: "AI Tooling and Agent Workflows",
    description:
      "Improving prompt quality, instructions, workspace rules, and AI agent workflows to make engineering delivery faster and more reliable.",
    progress: 70,
  },
  {
    title: "Deployment Patterns Across Modern Platforms",
    description:
      "Comparing deployment workflows and tradeoffs across Netlify, Vercel, Railway, Render, Neon, and Supabase.",
    progress: 50,
  },
];

export const researchSection = {
  id: "research",
  order: "06",
  title: "Research & Learning",
  url: `${siteMetadata.baseUrl}/#research`,
  route: `${siteMetadata.baseUrl}/research`,
  items: researchItems,
};

export const bestPracticeCategories = [
  {
    category: "Code Quality",
    items: [
      "Model domains with TypeScript types that mirror API contracts",
      "Document shared UI primitives inside a reusable component library",
      "Automate unit, integration, and contract tests across the stack",
      "Review pull requests with architectural context, not just syntax",
    ],
  },
  {
    category: "Performance",
    items: [
      "Measure Core Web Vitals and API latency with real telemetry",
      "Lean on server components, streaming, and code splitting to reduce payloads",
      "Apply layered caching (CDN, Redis, database) based on access patterns",
      "Load test critical flows before toggling features on for customers",
    ],
  },
  {
    category: "Accessibility",
    items: [
      "Prefer semantic HTML and ARIA-first components",
      "Pair automated axe checks with manual keyboard and screen reader passes",
      "Design contrast and motion systems that respect user preferences",
      "Document accessible patterns inside the design system",
    ],
  },
  {
    category: "Security",
    items: [
      "Enforce least-privilege IAM and rotated secrets in CI/CD",
      "Validate every request with centralized schema validation",
      "Adopt secure auth flows with token rotation and short-lived sessions",
      "Continuously patch dependencies and monitor CVEs",
    ],
  },
];

export const bestPracticesSection = {
  id: "best-practices",
  order: "07",
  title: "Best Practices",
  url: `${siteMetadata.baseUrl}/#best-practices`,
  categories: bestPracticeCategories,
};

export const contactMethods = [
  {
    label: "Email",
    href: "mailto:hentyna11@gmail.com",
    description: "hentyna11@gmail.com - share context and specs",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ty-hen-b7799b2a4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    description: "Swap product ideas and opportunities",
  },
  {
    label: "GitHub",
    href: "https://github.com/TyHen88",
    description: "Browse active builds and experiments",
  },
  {
    label: "Telegram",
    href: "https://t.me/ahh_tiii",
    description: "Ping me for quick async syncs",
  },
];

export const contactSection = {
  id: "contact",
  order: "08",
  title: "Get In Touch",
  url: `${siteMetadata.baseUrl}/#contact`,
  description:
    "Building a new product, modernizing a legacy system, or looking for a fractional full-stack partner? Let's chat about how I can help with architecture, delivery, and everything between design reviews and production support.",
  form: {
    namePlaceholder: "Your name",
    emailPlaceholder: "Your email address",
    messagePlaceholder: "Your message",
    submitLabel: "Send Message",
    loadingLabel: "Sending...",
    successMessage: "Thanks for reaching out! I'll get back to you soon.",
    fallbackErrorMessage: "Unable to send message. Please try again later.",
    genericErrorMessage: "Something went wrong. Please try again.",
  },
  methods: contactMethods,
};

export const footerContent = {
  credit: "Designed & engineered by Hen Ty",
  copyright: "© 2026 All rights reserved.",
  socialLinks,
};

export const publicRoutes = [
  {
    path: "/",
    title: "Portfolio Home",
    description:
      "Landing page with hero, about, experience, skills, projects, blog, research, best practices, contact, and the AI assistant.",
    status: "active",
  },
  {
    path: "/blog",
    title: "Blog Index",
    description:
      "Lists all technical blog posts with tags, dates, and reading time.",
    status: "active",
  },
  {
    path: "/blog/[slug]",
    title: "Blog Detail",
    description: "Renders individual blog articles from local mock content.",
    status: "active",
  },
  {
    path: "/my-project",
    title: "Project Showcase",
    description: "Dedicated page for featured projects.",
    status: "active",
  },
  {
    path: "/research",
    title: "Research Page",
    description: "Dedicated page for current research and learning areas.",
    status: "active",
  },
  {
    path: "/my-learn",
    title: "Learned Features",
    description: "Supporting route for learning-related feature content.",
    status: "active",
  },
  {
    path: "/admin",
    title: "Admin Contents",
    description:
      "Internal admin UI for managing structured content records backed by Google Sheets.",
    status: "active",
  },
];

export const apiFeatures = [
  {
    name: "AI Chat API",
    route: "/api/chat",
    method: "POST",
    description:
      "OpenAI-powered assistant endpoint grounded on the portfolio mock data and conversation history.",
  },
  {
    name: "Contact API",
    route: "/api/contact",
    method: "POST",
    description:
      "Receives get-in-touch form submissions and sends email notifications.",
  },
  {
    name: "Content Sheet API",
    route: "/api/sheet",
    method: "GET, POST, PUT, DELETE",
    description:
      "Google Sheets-backed content API used by the admin panel for CRUD operations.",
  },
];

export const projectFeatures = [
  {
    name: "AI-Assisted Development Workflow",
    description:
      "Daily use of Claude Code, Cursor, ChatGPT, Gemini, and Codex for prompting, instructions, AI agents, workspace rules, and faster implementation.",
  },
  {
    name: "AI Integration Delivery",
    description:
      "Experience integrating AI capabilities into product workflows, including chatbot-style experiences and AI-backed user assistance.",
  },
  {
    name: "Payment and Billing Domain Experience",
    description:
      "Hands-on delivery experience with ABA PayWay, invoices, transactions, customers, bills, and related business workflows.",
  },
  {
    name: "REST API and Integration Delivery",
    description:
      "Building Spring Boot APIs, integrating client APIs, and supporting both maintenance work and new project setup across WeChat, Firebase FCM, SMTP mail, SMS services, and other third-party flows.",
  },
  {
    name: "Telegram Ecosystem Experience",
    description:
      "Building Telegram bots and Telegram mini apps to support automation, customer interaction, and lightweight embedded product experiences.",
  },
  {
    name: "Messaging and Notification Integrations",
    description:
      "Hands-on integration work for WeChat, Firebase FCM push notifications, SMTP mail delivery, and SMS messaging services inside product workflows.",
  },
  {
    name: "Deployment Platform Fluency",
    description:
      "Shipping projects with Netlify, Vercel, Railway, and Render, and working with PostgreSQL platforms like Neon and Supabase.",
  },
  {
    name: "Polyglot Backend Growth",
    description:
      "Strongest today in Java and Spring Boot, with active learning in Node.js with Express.js and Python with FastAPI.",
  },
];

export const careerPositioning = {
  primaryTitle: "Full-Stack Engineer",
  summary:
    "Your strongest positioning right now is Full-Stack Engineer with a backend-leaning profile in Spring Boot and PostgreSQL, strong frontend delivery in Next.js and TypeScript, and growing differentiation in AI integrations, notification systems, and Telegram-based product experiences.",
  targetRoles: [
    "Full-Stack Engineer",
    "Backend Engineer (Java / Spring Boot)",
    "Software Engineer",
    "API Integration Engineer",
    "AI Integration Engineer",
  ],
};

export const portfolioMockData = {
  siteMetadata,
  navigationLinks,
  heroSection,
  aboutSection,
  experienceSection,
  skillsSection,
  projectsSection,
  blogSection,
  researchSection,
  bestPracticesSection,
  contactSection,
  footerContent,
  publicRoutes,
  apiFeatures,
  projectFeatures,
  careerPositioning,
};
