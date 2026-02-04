
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

interface Question {
    question: string;
    options: string[];
    correctIndex: number;
}

interface QuizProps {
    content: {
        questions: Question[];
    };
    onComplete?: (score: number) => void;
}

export default function QuizEngine({ content, onComplete }: QuizProps) {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const currentQ = content.questions[currentIdx];

    const handleSelect = (idx: number) => {
        if (isAnswered) return;
        setSelectedOpt(idx);
        setIsAnswered(true);

        if (idx === currentQ.correctIndex) {
            setScore((prev) => prev + 1);
        }
    };

    const nextQuestion = () => {
        if (currentIdx + 1 < content.questions.length) {
            setCurrentIdx((prev) => prev + 1);
            setSelectedOpt(null);
            setIsAnswered(false);
        } else {
            setShowResult(true);
            onComplete?.(score + (selectedOpt === currentQ.correctIndex ? 0 : 0)); // Score already updated above
        }
    };

    if (showResult) {
        return (
            <Card className="text-center p-8">
                <CardTitle className="text-3xl mb-4 font-serif">Quiz Complete!</CardTitle>
                <p className="text-muted-foreground text-lg mb-6">
                    You scored {score} out of {content.questions.length}
                </p>
                <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
            </Card>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex justify-between text-sm text-muted-foreground">
                <span>Question {currentIdx + 1} of {content.questions.length}</span>
                <span>Score: {score}</span>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">{currentQ.question}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {currentQ.options.map((opt, idx) => (
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            key={idx}
                            onClick={() => handleSelect(idx)}
                            disabled={isAnswered}
                            className={cn(
                                "w-full text-left p-4 rounded-lg border transition-all hover:bg-muted/50 flex items-center justify-between",
                                isAnswered && idx === currentQ.correctIndex && "bg-green-100 border-green-500 text-green-900",
                                isAnswered && idx === selectedOpt && idx !== currentQ.correctIndex && "bg-red-100 border-red-500 text-red-900",
                                !isAnswered && selectedOpt === idx && "border-primary ring-1 ring-primary"
                            )}
                        >
                            {opt}
                            {isAnswered && idx === currentQ.correctIndex && <Check className="h-4 w-4 text-green-600" />}
                            {isAnswered && idx === selectedOpt && idx !== currentQ.correctIndex && <X className="h-4 w-4 text-red-600" />}
                        </motion.button>
                    ))}
                </CardContent>
                <CardFooter className="justify-end">
                    <Button disabled={!isAnswered} onClick={nextQuestion}>
                        {currentIdx + 1 === content.questions.length ? "Finish" : "Next"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
