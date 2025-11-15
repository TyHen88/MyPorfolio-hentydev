'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, Send, X, Loader2, Sparkles } from 'lucide-react'
import Image from 'next/image'
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

const SUGGESTED_QUESTIONS = [
    "What's your experience?",
    "What technologies do you know?",
    "Show me your projects",
    "How can I contact you?",
]

export default function AiAssistant() {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hi there! I'm Hen Ty 👋 Nice to meet you! I'm here to help you learn about my portfolio, experience, and projects. Feel free to ask me about my skills, work experience, projects, blog posts, or anything else you'd like to know!",
            timestamp: new Date(),
        },
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [sessionId, setSessionId] = useState<string>(`session-${Date.now()}`)
    const [keyboardHeight, setKeyboardHeight] = useState(0)
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const inputContainerRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if (open && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [open])

    useEffect(() => {
        // Auto-resize textarea
        if (inputRef.current) {
            inputRef.current.style.height = '44px'
            inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 128)}px`
        }
    }, [input])

    // Handle mobile keyboard visibility
    useEffect(() => {
        if (!open) {
            setKeyboardHeight(0)
            setIsKeyboardOpen(false)
            return
        }

        const handleViewportResize = () => {
            if (typeof window !== 'undefined' && window.visualViewport) {
                const viewport = window.visualViewport
                const windowHeight = window.innerHeight
                const viewportHeight = viewport.height
                const heightDiff = windowHeight - viewportHeight

                // If viewport is significantly smaller, keyboard is likely open
                if (heightDiff > 150) {
                    setIsKeyboardOpen(true)
                    // Position input at the bottom of visual viewport (above keyboard)
                    // The keyboard height is the difference between window and viewport height
                    setKeyboardHeight(heightDiff)

                    // Scroll to bottom when keyboard appears
                    setTimeout(() => {
                        scrollToBottom()
                    }, 200)
                } else {
                    setIsKeyboardOpen(false)
                    setKeyboardHeight(0)
                }
            }
        }

        const handleResize = () => {
            if (typeof window !== 'undefined') {
                const isMobile = window.innerWidth < 768

                if (isMobile && window.visualViewport) {
                    handleViewportResize()
                } else {
                    setIsKeyboardOpen(false)
                    setKeyboardHeight(0)
                }
            }
        }

        // Use visual viewport API if available (mobile browsers)
        if (typeof window !== 'undefined' && window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleViewportResize)
            window.visualViewport.addEventListener('scroll', handleViewportResize)
            // Initial check
            handleViewportResize()
        }

        // Fallback for browsers without visual viewport API
        window.addEventListener('resize', handleResize)

        return () => {
            if (typeof window !== 'undefined' && window.visualViewport) {
                window.visualViewport.removeEventListener('resize', handleViewportResize)
                window.visualViewport.removeEventListener('scroll', handleViewportResize)
            }
            window.removeEventListener('resize', handleResize)
            setKeyboardHeight(0)
            setIsKeyboardOpen(false)
        }
    }, [open])


    const handleSend = async (query?: string) => {
        const queryText = query || input.trim()
        if (!queryText || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: queryText,
            timestamp: new Date(),
        }

        setMessages(prev => [...prev, userMessage])
        if (!query) {
            setInput('')
            // Reset textarea height
            if (inputRef.current) {
                inputRef.current.style.height = '44px'
            }
        }
        setIsLoading(true)

        try {
            // Prepare conversation history (exclude the initial welcome message)
            const apiHistory = messages
                .filter(msg => msg.id !== '1') // Exclude initial welcome message
                .map(msg => ({
                    role: msg.role,
                    content: msg.content,
                }))

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: userMessage.content,
                    history: apiHistory,
                    sessionId: sessionId,
                    images: [], // Can be extended for image support later
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to get response from API')
            }

            const data = await response.json()

            // Update session ID if provided
            if (data.sessionId) {
                setSessionId(data.sessionId)
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.message || "I'm sorry, I couldn't generate a response. Please try again.",
                timestamp: new Date(),
            }

            setMessages(prev => [...prev, assistantMessage])
        } catch (error) {
            console.error('Chat error:', error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm sorry, I encountered an error processing your request. Please try again.",
                timestamp: new Date(),
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleSuggestedQuestion = (question: string) => {
        handleSend(question)
    }

    const formatMessage = (content: string) => {
        // Enhanced markdown-like formatting
        const parts: React.ReactNode[] = []
        let key = 0

        // Split by lines but preserve them for proper formatting
        const lines = content.split('\n')

        lines.forEach((line, lineIndex) => {
            if (!line.trim()) {
                parts.push(<br key={`br-${key++}`} />)
                return
            }

            // Check for headers (lines starting with ## or ###)
            if (line.startsWith('### ')) {
                parts.push(
                    <h3 key={`h3-${key++}`} className="text-lg font-semibold mt-4 mb-2">
                        {formatInlineMarkdown(line.substring(4), key)}
                    </h3>
                )
                return
            }

            if (line.startsWith('## ')) {
                parts.push(
                    <h2 key={`h2-${key++}`} className="text-xl font-bold mt-4 mb-2">
                        {formatInlineMarkdown(line.substring(3), key)}
                    </h2>
                )
                return
            }

            // Check for bullet points
            if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                const listItem = line.trim().substring(2)
                parts.push(
                    <div key={`li-${key++}`} className="flex items-start gap-2 my-1">
                        <span className="text-primary mt-1.5">•</span>
                        <span className="flex-1">{formatInlineMarkdown(listItem, key)}</span>
                    </div>
                )
                return
            }

            // Check for numbered lists
            const numberedMatch = line.trim().match(/^(\d+)\.\s+(.+)$/)
            if (numberedMatch) {
                parts.push(
                    <div key={`num-${key++}`} className="flex items-start gap-2 my-1">
                        <span className="text-primary font-semibold">{numberedMatch[1]}.</span>
                        <span className="flex-1">{formatInlineMarkdown(numberedMatch[2], key)}</span>
                    </div>
                )
                return
            }

            // Regular paragraph
            const formattedLine = formatInlineMarkdown(line, key)
            parts.push(
                <p key={`p-${key++}`} className="my-2 leading-relaxed">
                    {formattedLine}
                </p>
            )
        })

        return <div className="space-y-1">{parts}</div>
    }

    const formatInlineMarkdown = (text: string, baseKey: number): React.ReactNode => {
        const parts: React.ReactNode[] = []
        let currentKey = baseKey * 1000
        let remaining = text

        // Process bold text (**text**)
        while (remaining.length > 0) {
            const boldMatch = remaining.match(/\*\*([^*]+)\*\*/)
            const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/)
            const codeMatch = remaining.match(/`([^`]+)`/)

            // Find the earliest match
            let earliestIndex = Infinity
            let matchType: 'bold' | 'link' | 'code' | null = null
            let match: RegExpMatchArray | null = null

            if (boldMatch && boldMatch.index !== undefined && boldMatch.index < earliestIndex) {
                earliestIndex = boldMatch.index
                matchType = 'bold'
                match = boldMatch
            }
            if (linkMatch && linkMatch.index !== undefined && linkMatch.index < earliestIndex) {
                earliestIndex = linkMatch.index
                matchType = 'link'
                match = linkMatch
            }
            if (codeMatch && codeMatch.index !== undefined && codeMatch.index < earliestIndex) {
                earliestIndex = codeMatch.index
                matchType = 'code'
                match = codeMatch
            }

            if (match && matchType) {
                // Add text before the match
                if (earliestIndex > 0) {
                    parts.push(
                        <span key={`text-${currentKey++}`}>
                            {remaining.substring(0, earliestIndex)}
                        </span>
                    )
                }

                // Add the formatted match
                if (matchType === 'bold') {
                    parts.push(
                        <strong key={`bold-${currentKey++}`} className="font-semibold text-foreground">
                            {match[1]}
                        </strong>
                    )
                } else if (matchType === 'link') {
                    parts.push(
                        <a
                            key={`link-${currentKey++}`}
                            href={match[2]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline hover:text-primary/80 transition-colors"
                        >
                            {match[1]}
                        </a>
                    )
                } else if (matchType === 'code') {
                    parts.push(
                        <code
                            key={`code-${currentKey++}`}
                            className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                        >
                            {match[1]}
                        </code>
                    )
                }

                // Update remaining text
                remaining = remaining.substring(earliestIndex + match[0].length)
            } else {
                // No more matches, add remaining text
                if (remaining.length > 0) {
                    parts.push(
                        <span key={`text-${currentKey++}`}>{remaining}</span>
                    )
                }
                break
            }
        }

        return parts.length > 0 ? <>{parts}</> : text
    }

    return (
        <>
            <Drawer open={open} onOpenChange={setOpen} direction="right">
                <DrawerTrigger asChild>
                    <button
                        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 h-12 w-12 sm:h-14 sm:w-14 rounded-full transition-all duration-500 hover:scale-110 active:scale-95 group cursor-pointer border-0 outline-none focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:ring-offset-2 focus:ring-offset-background"
                        aria-label="Open AI Assistant"
                        style={{
                            animation: 'float 3s ease-in-out infinite'
                        }}
                    >
                        {/* Glassmorphism sphere with gradient */}
                        <div className="relative h-full w-full rounded-full bg-gradient-to-br from-orange-300/90 via-pink-400/80 to-purple-600/95 backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_0_rgba(147,51,234,0.37)] overflow-hidden">
                            {/* Animated gradient overlay */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-200/40 via-pink-300/30 to-purple-500/40 animate-pulse" />

                            {/* Inner glow effect - top left highlight */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-white/15 to-transparent" />

                            {/* Shimmer effect */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                            {/* Sparkle icons - positioned like in the image */}
                            <div className="absolute inset-0">
                                {/* Large sparkle - left of center */}
                                <Sparkles
                                    className="absolute h-3 w-3 sm:h-4 sm:w-4 text-white left-[35%] top-[45%] drop-shadow-lg"
                                    style={{
                                        animation: 'sparkle 2s ease-in-out infinite',
                                        animationDelay: '0s'
                                    }}
                                />
                                {/* Medium sparkle - above and right */}
                                <Sparkles
                                    className="absolute h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-white left-[50%] top-[30%] drop-shadow-lg"
                                    style={{
                                        animation: 'sparkle 2.5s ease-in-out infinite',
                                        animationDelay: '0.7s'
                                    }}
                                />
                                {/* Small sparkle - below and right */}
                                <Sparkles
                                    className="absolute h-2.5 w-2.5 sm:h-3 sm:w-3 text-white left-[55%] top-[60%] drop-shadow-lg"
                                    style={{
                                        animation: 'sparkle 2.2s ease-in-out infinite',
                                        animationDelay: '1.4s'
                                    }}
                                />
                            </div>

                            {/* Hover glow effect */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/0 to-purple-600/0 group-hover:from-purple-400/40 group-hover:to-purple-600/50 transition-all duration-500" />

                            {/* Outer ring glow on hover */}
                            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-orange-300/0 via-pink-400/0 to-purple-600/0 group-hover:from-orange-300/30 group-hover:via-pink-400/30 group-hover:to-purple-600/30 blur-sm transition-all duration-500 -z-10" />
                        </div>

                        {/* Soft shadow with blur - enhanced */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600/25 via-pink-500/20 to-orange-400/15 blur-xl -z-20 translate-y-1.5 group-hover:translate-y-2 group-hover:blur-2xl group-hover:opacity-80 transition-all duration-500" />

                        {/* Additional glow rings */}
                        <div className="absolute inset-0 rounded-full border border-white/10 group-hover:border-white/20 transition-all duration-500 -z-10" />
                    </button>
                </DrawerTrigger>
                <DrawerContent side="right" className="h-full w-full sm:max-w-lg">
                    <DrawerHeader className="border-b p-2.5 sm:p-4">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                <div className="h-7 w-7 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    <Image
                                        src="/Monkey-dev-logo.png"
                                        alt="Monkey Dev AI Assistant"
                                        width={32}
                                        height={32}
                                        className="object-contain w-5 h-5 sm:w-8 sm:h-8"
                                        priority
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <DrawerTitle className="text-sm sm:text-lg truncate">AI Assistant</DrawerTitle>
                                    <DrawerDescription className="text-[10px] sm:text-sm truncate hidden sm:block">
                                        Ask me anything about this portfolio
                                    </DrawerDescription>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setOpen(false)}
                                className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0"
                            >
                                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                        </div>
                    </DrawerHeader>

                    <div className="flex-1 overflow-y-auto">
                        <div className="w-full">
                            {messages.map((message, index) => (
                                <div
                                    key={message.id}
                                    className="group w-full bg-background"
                                >
                                    <div className={cn(
                                        "flex gap-2 sm:gap-4 px-2 sm:px-4 md:px-6 py-2.5 sm:py-5",
                                        message.role === 'user' ? 'justify-end' : 'justify-start'
                                    )}>
                                        {message.role === 'assistant' && (
                                            <div className="h-6 w-6 sm:h-9 sm:w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden mt-0.5">
                                                <Image
                                                    src="/Monkey-dev-logo.png"
                                                    alt="AI Assistant"
                                                    width={32}
                                                    height={32}
                                                    className="object-contain w-4 h-4 sm:w-7 sm:h-7"
                                                />
                                            </div>
                                        )}
                                        <div className={cn(
                                            "flex-1 min-w-0",
                                            message.role === 'user' ? 'flex justify-end' : ''
                                        )}>
                                            <div className={cn(
                                                "inline-block max-w-[85%] sm:max-w-full",
                                                message.role === 'user'
                                                    ? 'bg-primary text-primary-foreground rounded-xl sm:rounded-2xl rounded-tr-sm px-3 py-2 sm:px-5 sm:py-3'
                                                    : 'bg-muted/50 dark:bg-muted/30 text-foreground rounded-xl sm:rounded-2xl rounded-tl-sm px-3 py-2 sm:px-5 sm:py-3 border border-border/30'
                                            )}>
                                                <div className="break-words prose prose-sm dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed">
                                                    {message.role === 'assistant' ? formatMessage(message.content) : (
                                                        <p className="whitespace-pre-wrap m-0 leading-relaxed text-sm sm:text-base">{message.content}</p>
                                                    )}
                                                </div>
                                                <div className={cn(
                                                    "text-[10px] sm:text-xs mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t",
                                                    message.role === 'user'
                                                        ? 'border-primary-foreground/20 text-primary-foreground/70'
                                                        : 'border-border/30 text-muted-foreground'
                                                )}>
                                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                        {message.role === 'user' && (
                                            <div className="h-6 w-6 sm:h-9 sm:w-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-xs sm:text-base font-semibold text-primary-foreground">U</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {isLoading && (
                            <div className="bg-background">
                                <div className="w-full">
                                    <div className="flex gap-2 sm:gap-4 px-2 sm:px-4 md:px-6 py-2.5 sm:py-5 justify-start">
                                        <div className="h-6 w-6 sm:h-9 sm:w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden mt-0.5">
                                            <Image
                                                src="/Monkey-dev-logo.png"
                                                alt="AI Assistant"
                                                width={32}
                                                height={32}
                                                className="object-contain w-4 h-4 sm:w-7 sm:h-7"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="inline-block bg-muted/50 dark:bg-muted/30 rounded-xl sm:rounded-2xl rounded-tl-sm px-3 py-2 sm:px-5 sm:py-3 border border-border/30">
                                                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-muted-foreground" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {messages.length === 1 && (
                            <div className="w-full px-2 sm:px-4 md:px-6 py-3 sm:py-6">
                                <p className="text-xs sm:text-base text-muted-foreground mb-2 sm:mb-4 font-medium">Try asking:</p>
                                <div className="flex flex-wrap gap-1.5 sm:gap-3">
                                    {SUGGESTED_QUESTIONS.map((question, index) => (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleSuggestedQuestion(question)}
                                            className="text-[10px] sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 h-auto rounded-full hover:bg-muted transition-colors"
                                        >
                                            {question}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <div
                        ref={inputContainerRef}
                        className="border-t bg-background/95 backdrop-blur-sm transition-all duration-200 ease-out"
                        style={{
                            position: isKeyboardOpen ? 'fixed' : 'relative',
                            bottom: isKeyboardOpen ? `${keyboardHeight}px` : 'auto',
                            left: isKeyboardOpen ? '0' : 'auto',
                            right: isKeyboardOpen ? '0' : 'auto',
                            width: isKeyboardOpen ? '100%' : 'auto',
                            zIndex: isKeyboardOpen ? 50 : 'auto',
                            paddingBottom: isKeyboardOpen ? 'env(safe-area-inset-bottom, 0px)' : '0',
                        }}
                    >
                        <div className="w-full p-2.5 sm:p-4 md:p-6">
                            <div className="flex gap-2 sm:gap-3 items-end">
                                <div className="flex-1 relative flex items-end">
                                    <textarea
                                        ref={inputRef}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault()
                                                handleSend()
                                            }
                                        }}
                                        onFocus={() => {
                                            // Scroll to bottom when input is focused
                                            setTimeout(() => {
                                                scrollToBottom()
                                            }, 300)
                                        }}
                                        placeholder="Message..."
                                        rows={1}
                                        className="w-full resize-none rounded-2xl border border-input/50 bg-background/95 backdrop-blur-sm px-4 py-2.5 sm:px-5 sm:py-3.5 text-sm sm:text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-h-32 overflow-y-auto shadow-sm"
                                        disabled={isLoading}
                                        style={{
                                            minHeight: '44px',
                                            height: 'auto',
                                        }}
                                        onInput={(e) => {
                                            const target = e.target as HTMLTextAreaElement
                                            target.style.height = '44px'
                                            target.style.height = `${Math.min(target.scrollHeight, 128)}px`
                                        }}
                                    />
                                </div>
                                <Button
                                    onClick={() => handleSend()}
                                    disabled={!input.trim() || isLoading}
                                    size="icon"
                                    className="h-11 w-11 sm:h-12 sm:w-12 flex-shrink-0 rounded-full bg-primary hover:bg-primary/90 active:bg-primary/80 transition-colors shadow-md"
                                    style={{
                                        minHeight: '44px',
                                        flexShrink: 0,
                                        alignSelf: 'flex-end',
                                    }}
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                    {isKeyboardOpen && (
                        <div style={{ height: `${inputContainerRef.current?.offsetHeight || 80}px` }} />
                    )}
                </DrawerContent>
            </Drawer>
        </>
    )
}

