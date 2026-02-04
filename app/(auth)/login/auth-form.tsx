'use client'

import { useState } from 'react'
import { login, signup } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from 'next/image'

export default function AuthForm({ message, error }: { message?: string, error?: string }) {
    const [isSignup, setIsSignup] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    return (
        <Card className="w-full max-w-md border-white/20 bg-white/40 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:shadow-indigo-500/10 dark:bg-slate-950/40">
            <CardHeader className="space-y-4 pt-8">
                <div className="flex flex-col items-center gap-2">
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl shadow-lg ring-4 ring-white/50">
                        <Image
                            src="/logo.jpg"
                            alt="EdHorizon Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <CardTitle className="text-3xl font-serif font-bold text-indigo-900 dark:text-indigo-100">
                        {isSignup ? "Create Account" : "Welcome Back"}
                    </CardTitle>
                </div>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                    {message ? (
                        <span className="text-emerald-600 font-semibold">{message}</span>
                    ) : error ? (
                        <span className="text-rose-600 font-semibold">{error}</span>
                    ) : (
                        isSignup ? "Start your educational journey with EdHorizon" : "Manage your academy and learning modules"
                    )}
                </CardDescription>
            </CardHeader>
            <form onSubmit={() => setIsLoading(true)}>
                <CardContent className="grid gap-5">
                    {isSignup && (
                        <div className="grid gap-2">
                            <Label htmlFor="full_name" className="text-indigo-900/70 dark:text-indigo-100/70">Full Name</Label>
                            <Input
                                id="full_name"
                                name="full_name"
                                required
                                placeholder="John Doe"
                                className="border-indigo-100 bg-white/50 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-indigo-900/70 dark:text-indigo-100/70">Email Address</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            className="border-indigo-100 bg-white/50 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-indigo-900/70 dark:text-indigo-100/70">Password</Label>
                        </div>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="border-indigo-100 bg-white/50 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                </CardContent>
                <CardFooter className="mt-4 flex flex-col gap-4">
                    <Button
                        className="w-full bg-indigo-600 font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-300 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-600"
                        formAction={isSignup ? signup : login}
                        disabled={isLoading}
                    >
                        {isLoading ? "Preparing Horizon..." : (isSignup ? "Create Account" : "Enter Dashboard")}
                    </Button>
                    <div className="flex w-full items-center gap-2 text-sm text-slate-500">
                        <div className="h-px w-full bg-slate-200" />
                        <span className="whitespace-nowrap">or</span>
                        <div className="h-px w-full bg-slate-200" />
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-50"
                        onClick={() => setIsSignup(!isSignup)}
                        disabled={isLoading}
                    >
                        {isSignup ? "Already have an account? Sign in" : "New to EdHorizon? Create account"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
