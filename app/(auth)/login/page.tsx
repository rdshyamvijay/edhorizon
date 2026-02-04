import AuthForm from "./auth-form"
import Image from "next/image"

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function LoginPage(props: Props) {
    const searchParams = await props.searchParams;
    const message = typeof searchParams.message === 'string' ? searchParams.message : undefined;
    const error = typeof searchParams.error === 'string' ? searchParams.error : undefined;

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background">
            {/* Left Side: Vibrant Background (Hidden on small screens) */}
            <div className="relative hidden w-1/2 lg:block">
                <Image
                    src="/images/login-bg.png"
                    alt="Classical Learning Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-indigo-900/20 backdrop-brightness-75" />
                <div className="absolute bottom-12 left-12 text-white">
                    <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-white/20 shadow-2xl">
                            <Image
                                src="/logo.jpg"
                                alt="EdHorizon Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h1 className="text-4xl font-serif font-bold tracking-tight">EdHorizon</h1>
                            <p className="text-lg font-medium opacity-80 italic">Learning Beyond Boundaries</p>
                        </div>
                    </div>
                    <p className="mt-4 max-w-md text-base opacity-70">Empowering classical education with modern tools and seamless academy management.</p>
                </div>
            </div>

            {/* Right Side: Login Form Area */}
            <div className="flex w-full items-center justify-center p-8 lg:w-1/2 bg-gradient-to-br from-indigo-50 to-amber-50/30">
                <AuthForm
                    message={message}
                    error={error}
                />
            </div>
        </div>
    )
}
