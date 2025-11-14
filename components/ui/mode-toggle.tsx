"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle({ open, setOpen, onThemeChange }: { open: boolean, setOpen: (open: boolean) => void, onThemeChange?: () => void }) {
    const { setTheme, theme } = useTheme()

    const getCurrentModeLabel = () => {
        if (theme === "dark") return "Developer"
        if (theme === "light") return "Light"
        return "System"
    }

    const getCurrentIcon = () => {
        if (theme === "dark") return <Moon className="mr-2 h-4 w-4" />
        if (theme === "light") return <Sun className="mr-2 h-4 w-4" />
        return <Moon className="mr-2 h-4 w-4" />
    }

    const handleThemeChange = (newTheme: "dark" | "light" | "system") => {
        setTheme(newTheme)
        setOpen(false)
        if (onThemeChange) {
            onThemeChange()
        }
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="justify-start w-full" tabIndex={0} type="button">
                    {getCurrentIcon()}
                    {getCurrentModeLabel()}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" sideOffset={4}>
                <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
                    Developer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange("system")}>
                    System
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}
