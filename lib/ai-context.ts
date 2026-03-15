import { portfolioMockData } from '@/lib/portfolio-mock-data'

type PortfolioReference = {
    label: string
    url: string
    type: 'section' | 'route' | 'blog' | 'contact' | 'feature'
}

const isRealLink = (value?: string) => Boolean(value && value.trim() && value !== '#')

export function buildPortfolioKnowledgeBase() {
    const references: PortfolioReference[] = [
        ...[
            portfolioMockData.aboutSection,
            portfolioMockData.experienceSection,
            portfolioMockData.skillsSection,
            portfolioMockData.projectsSection,
            portfolioMockData.blogSection,
            portfolioMockData.researchSection,
            portfolioMockData.bestPracticesSection,
            portfolioMockData.contactSection
        ]
            .filter((section) => isRealLink(section.url))
            .map((section) => ({
                label: `${section.title} section`,
                url: section.url,
                type: 'section' as const
            })),
        ...portfolioMockData.blogSection.posts
            .filter((post) => isRealLink(post.url))
            .map((post) => ({
                label: post.title,
                url: post.url,
                type: 'blog' as const
            })),
        ...portfolioMockData.contactSection.methods
            .filter((method) => isRealLink(method.href))
            .map((method) => ({
                label: method.label,
                url: method.href,
                type: 'contact' as const
            })),
        ...portfolioMockData.publicRoutes.map((route) => ({
            label: route.title,
            url: `${portfolioMockData.siteMetadata.baseUrl}${route.path === '/' ? '' : route.path}`,
            type: 'route' as const
        })),
        ...portfolioMockData.apiFeatures.map((feature) => ({
            label: feature.name,
            url: `${portfolioMockData.siteMetadata.baseUrl}${feature.route}`,
            type: 'feature' as const
        }))
    ]

    return {
        owner: {
            name: portfolioMockData.siteMetadata.ownerName,
            role: portfolioMockData.siteMetadata.ownerRole
        },
        site: portfolioMockData.siteMetadata,
        navigation: portfolioMockData.navigationLinks,
        sections: [
            {
                id: portfolioMockData.heroSection.id,
                title: portfolioMockData.heroSection.title,
                summary: portfolioMockData.heroSection.description,
                ctas: portfolioMockData.heroSection.ctas,
                stats: portfolioMockData.heroSection.stats,
                badges: portfolioMockData.heroSection.badges,
                profile: portfolioMockData.heroSection.profile
            },
            {
                id: portfolioMockData.aboutSection.id,
                title: portfolioMockData.aboutSection.title,
                url: portfolioMockData.aboutSection.url,
                paragraphs: portfolioMockData.aboutSection.paragraphs,
                highlights: portfolioMockData.aboutSection.highlights,
                education: portfolioMockData.aboutSection.education
            },
            {
                id: portfolioMockData.experienceSection.id,
                title: portfolioMockData.experienceSection.title,
                url: portfolioMockData.experienceSection.url,
                items: portfolioMockData.experienceSection.items
            },
            {
                id: portfolioMockData.skillsSection.id,
                title: portfolioMockData.skillsSection.title,
                url: portfolioMockData.skillsSection.url,
                description: portfolioMockData.skillsSection.description,
                categories: portfolioMockData.skillsSection.categories
            },
            {
                id: portfolioMockData.projectsSection.id,
                title: portfolioMockData.projectsSection.title,
                url: portfolioMockData.projectsSection.url,
                route: portfolioMockData.projectsSection.route,
                description: portfolioMockData.projectsSection.description,
                items: portfolioMockData.projectsSection.items.map((project) => ({
                    ...project,
                    links: {
                        demo: isRealLink(project.links.demo) ? project.links.demo : undefined,
                        github: isRealLink(project.links.github) ? project.links.github : undefined
                    }
                }))
            },
            {
                id: portfolioMockData.blogSection.id,
                title: portfolioMockData.blogSection.title,
                url: portfolioMockData.blogSection.url,
                route: portfolioMockData.blogSection.route,
                description: portfolioMockData.blogSection.description
            },
            {
                id: portfolioMockData.researchSection.id,
                title: portfolioMockData.researchSection.title,
                url: portfolioMockData.researchSection.url,
                route: portfolioMockData.researchSection.route,
                items: portfolioMockData.researchSection.items
            },
            {
                id: portfolioMockData.bestPracticesSection.id,
                title: portfolioMockData.bestPracticesSection.title,
                url: portfolioMockData.bestPracticesSection.url,
                categories: portfolioMockData.bestPracticesSection.categories
            },
            {
                id: portfolioMockData.contactSection.id,
                title: portfolioMockData.contactSection.title,
                url: portfolioMockData.contactSection.url,
                description: portfolioMockData.contactSection.description,
                methods: portfolioMockData.contactSection.methods
            }
        ],
        blogPosts: portfolioMockData.blogSection.posts,
        publicRoutes: portfolioMockData.publicRoutes,
        apiFeatures: portfolioMockData.apiFeatures,
        projectFeatures: portfolioMockData.projectFeatures,
        references
    }
}

export function buildPortfolioKnowledgeBaseString() {
    return JSON.stringify(buildPortfolioKnowledgeBase(), null, 2)
}
