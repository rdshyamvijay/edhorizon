'use client'

import { Card } from "@/components/ui/card"
import { PlayCircle, HelpCircle, FileText, Check } from "lucide-react"

const types = [
    {
        id: 'video',
        title: 'Video Capsule',
        description: 'Guided video lessons with descriptions.',
        icon: PlayCircle,
        color: 'text-rose-600',
        bg: 'bg-rose-50'
    },
    {
        id: 'quiz',
        title: 'MCQ Quiz',
        description: 'Test knowledge with multi-choice questions.',
        icon: HelpCircle,
        color: 'text-amber-600',
        bg: 'bg-amber-50'
    },
    {
        id: 'flashcards',
        title: 'Flashcards',
        description: 'Interactive cards for memory and revision.',
        icon: FileText,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50'
    }
]

export function CapsuleTypeSelector({ selected, onSelect }: { selected: string, onSelect: (id: string) => void }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {types.map((t) => (
                <Card
                    key={t.id}
                    onClick={() => onSelect(t.id)}
                    className={`rounded-[2.5rem] p-8 cursor-pointer border-2 transition-all relative overflow-hidden group ${selected === t.id ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-2xl' : 'border-border/40 hover:border-indigo-200'
                        }`}
                >
                    {selected === t.id && (
                        <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check size={14} />
                        </div>
                    )}
                    <div className={`p-4 rounded-2xl w-fit mb-6 ${t.bg} ${t.color} group-hover:scale-110 transition-transform`}>
                        <t.icon size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{t.title}</h3>
                    <p className="text-sm text-muted-foreground italic leading-relaxed">{t.description}</p>
                </Card>
            ))}
        </div>
    )
}
