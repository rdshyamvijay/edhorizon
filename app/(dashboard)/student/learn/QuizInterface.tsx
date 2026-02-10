'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, ArrowRight, Trophy, RefreshCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { saveQuizResult } from "./actions"
import Link from "next/link"

interface Option {
    id: string;
    text: string;
}

interface Question {
    id: string;
    text: string;
    options: Option[];
    correctOptionId: string;
}

interface QuizInterfaceProps {
    capsuleId: string;
    title: string;
    content: {
        questions: Question[];
    };
}

export function QuizInterface({ capsuleId, title, content }: QuizInterfaceProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
    const [isAnswered, setIsAnswered] = useState(false)
    const [score, setScore] = useState(0)
    const [isFinished, setIsFinished] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const questions = content.questions || [];
    const totalSteps = questions.length;
    const currentQuestion = questions[currentStep];
    const progress = (currentStep / totalSteps) * 100;

    const handleCheck = () => {
        if (!selectedOptionId) return;

        const isCorrect = selectedOptionId === currentQuestion.correctOptionId;
        if (isCorrect) {
            setScore(prev => prev + 1);
        }
        setIsAnswered(true);
    }

    const handleNext = async () => {
        if (currentStep + 1 < totalSteps) {
            setCurrentStep(prev => prev + 1);
            setSelectedOptionId(null);
            setIsAnswered(false);
        } else {
            setIsSaving(true);
            try {
                await saveQuizResult(capsuleId, score, totalSteps);
                setIsFinished(true);
            } catch (error) {
                console.error("Failed to save result", error);
                alert("Failed to save result. Check console.");
            } finally {
                setIsSaving(false);
            }
        }
    }

    if (totalSteps === 0) {
        return (
            <div className="text-center py-20 bg-muted/20 rounded-[3rem] border-2 border-dashed">
                <p className="italic text-muted-foreground">This quiz has no questions yet.</p>
                <Link href="/student/learn">
                    <Button variant="link" className="mt-4">Go Back</Button>
                </Link>
            </div>
        )
    }

    if (isFinished) {
        const percentage = Math.round((score / totalSteps) * 100);
        return (
            <div className="max-w-2xl mx-auto text-center space-y-12 animate-in fade-in zoom-in duration-500">
                <div className="space-y-4">
                    <div className="inline-block p-6 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl">
                        <Trophy size={64} />
                    </div>
                    <h2 className="text-4xl font-serif font-bold">Quiz Complete!</h2>
                    <p className="text-muted-foreground italic">Amazing work on mastering {title}.</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-card border border-border/40 rounded-[2rem] p-8 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Final Score</p>
                        <p className="text-4xl font-bold">{score} / {totalSteps}</p>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-[2rem] p-8 shadow-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1">Mastery</p>
                        <p className="text-4xl font-bold text-indigo-700">{percentage}%</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/student/learn" className="w-full sm:w-auto">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-xs gap-3">
                            Back to Journey
                            <ArrowRight size={18} />
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                        className="w-full sm:w-auto border-indigo-600 text-indigo-600 rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-xs gap-3"
                    >
                        <RefreshCcw size={18} />
                        Try Again
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto space-y-12">
            {/* Nav Header */}
            <div className="flex items-center gap-6">
                <Link href="/student/learn">
                    <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                        <XCircle className="text-muted-foreground" size={24} />
                    </Button>
                </Link>
                <div className="flex-1">
                    <Progress value={progress} className="h-3 bg-muted rounded-full overflow-hidden" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
                    {currentStep + 1} / {totalSteps}
                </div>
            </div>

            <div className="space-y-12">
                <div className="text-center space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600 italic">Level UP • {title}</h3>
                    <h2 className="text-3xl font-serif font-bold tracking-tight">{currentQuestion.text}</h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {currentQuestion.options.map((opt) => (
                        <button
                            key={opt.id}
                            disabled={isAnswered}
                            onClick={() => setSelectedOptionId(opt.id)}
                            className={cn(
                                "flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all text-left group",
                                selectedOptionId === opt.id
                                    ? "border-indigo-600 bg-indigo-50 shadow-md"
                                    : "border-border/40 hover:border-indigo-200 hover:bg-indigo-50/30",
                                isAnswered && opt.id === currentQuestion.correctOptionId && "border-emerald-500 bg-emerald-50",
                                isAnswered && selectedOptionId === opt.id && opt.id !== currentQuestion.correctOptionId && "border-red-500 bg-red-50"
                            )}
                        >
                            <span className={cn(
                                "font-bold text-lg",
                                selectedOptionId === opt.id ? "text-indigo-900" : "text-foreground",
                                isAnswered && opt.id === currentQuestion.correctOptionId && "text-emerald-900",
                                isAnswered && selectedOptionId === opt.id && opt.id !== currentQuestion.correctOptionId && "text-red-900"
                            )}>
                                {opt.text}
                            </span>

                            {isAnswered && opt.id === currentQuestion.correctOptionId && (
                                <CheckCircle2 className="text-emerald-500" size={24} />
                            )}
                            {isAnswered && selectedOptionId === opt.id && opt.id !== currentQuestion.correctOptionId && (
                                <XCircle className="text-red-500" size={24} />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className={cn(
                "fixed bottom-0 left-0 right-0 p-8 border-t bg-background transition-all transform",
                isAnswered ? "translate-y-0" : "translate-y-full md:translate-y-0 md:bg-transparent md:border-none md:relative md:p-0"
            )}>
                <div className="max-w-3xl mx-auto flex items-center justify-between gap-6">
                    {isAnswered ? (
                        <div className="flex items-center gap-4">
                            {selectedOptionId === currentQuestion.correctOptionId ? (
                                <div className="flex items-center gap-3 text-emerald-600 font-bold">
                                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <span>Excellent! Correct answer.</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 text-red-600 font-bold">
                                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                        <XCircle size={24} />
                                    </div>
                                    <span>Not quite. Let's learn!</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="hidden md:block italic text-muted-foreground text-sm font-medium">Select an option to check your knowledge...</div>
                    )}

                    {!isAnswered ? (
                        <Button
                            disabled={!selectedOptionId}
                            onClick={handleCheck}
                            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-14 px-12 font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-indigo-200"
                        >
                            Check Answer
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            className={cn(
                                "w-full md:w-auto rounded-2xl h-14 px-12 font-black uppercase tracking-widest text-xs gap-3 shadow-xl transition-colors",
                                selectedOptionId === currentQuestion.correctOptionId
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
                                    : "bg-red-600 hover:bg-red-700 text-white shadow-red-200"
                            )}
                        >
                            {isSaving ? "Saving..." : (currentStep + 1 === totalSteps ? "Finish Quiz" : "Continue")}
                            <ArrowRight size={18} />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
