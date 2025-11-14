export interface BlogPost {
    slug: string
    title: string
    excerpt: string
    date: string
    readTime: string
    tags: string[]
    content?: string
}

export const blogPosts: BlogPost[] = [
    {
        slug: "building-scalable-react-applications",
        title: "Building Scalable React Applications",
        excerpt: "Learn best practices for structuring large React applications with proper code splitting and state management.",
        date: "Dec 15, 2024",
        readTime: "5 min read",
        tags: ["React", "Performance", "Best Practices"],
        content: `
# Building Scalable React Applications

Building scalable React applications requires careful planning and adherence to best practices. In this article, we'll explore key strategies for creating maintainable and performant React applications.

## Code Splitting

Code splitting is essential for large applications. It allows you to load only the code needed for the current view, reducing initial load time.

## State Management

Proper state management is crucial. Consider using Context API for simple state or libraries like Redux or Zustand for complex applications.

## Component Structure

Organize your components in a logical hierarchy. Keep components small and focused on a single responsibility.
        `
    },
    {
        slug: "nextjs-15-whats-new-and-exciting",
        title: "Next.js 15: What's New and Exciting",
        excerpt: "Explore the latest features in Next.js 15 including improved performance and new API capabilities.",
        date: "Dec 10, 2024",
        readTime: "8 min read",
        tags: ["Next.js", "Web Development", "JavaScript"],
        content: `
# Next.js 15: What's New and Exciting

Next.js 15 brings exciting new features and improvements to the framework. Let's dive into what makes this release special.

## Performance Improvements

The latest version includes significant performance improvements, especially in server-side rendering and static generation.

## New API Capabilities

Next.js 15 introduces new API routes and improved middleware support, making it easier to build full-stack applications.

## Developer Experience

The developer experience has been enhanced with better error messages and improved debugging tools.
        `
    },
    {
        slug: "typescript-tips-for-better-code",
        title: "TypeScript Tips for Better Code",
        excerpt: "Discover advanced TypeScript patterns and techniques to write more maintainable and type-safe code.",
        date: "Dec 5, 2024",
        readTime: "6 min read",
        tags: ["TypeScript", "Programming", "Code Quality"],
        content: `
# TypeScript Tips for Better Code

TypeScript is a powerful tool for writing type-safe JavaScript. Here are some advanced patterns and techniques to improve your code quality.

## Type Inference

Leverage TypeScript's type inference to write cleaner code without explicit type annotations everywhere.

## Advanced Types

Explore advanced types like conditional types, mapped types, and template literal types to create powerful type utilities.

## Best Practices

Follow TypeScript best practices to write maintainable and scalable code that catches errors at compile time.
        `
    },
]

export function getBlogPost(slug: string): BlogPost | undefined {
    return blogPosts.find(post => post.slug === slug)
}

export function getAllBlogPosts(): BlogPost[] {
    return blogPosts
}

