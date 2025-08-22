
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <Logo />
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tighter md:text-6xl">
              Your Unified AI Health Assistant
            </h1>
            <p className="max-w-3xl text-lg text-muted-foreground">
              Empower your health journey with MediMind AI. We provide intelligent tools to help you understand your symptoms, check drug interactions, and get personalized health insights.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg">
                <Link href="/signup">Get Started for Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/dashboard">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto mt-8 h-[500px] w-full max-w-5xl">
            <Image
              src="https://placehold.co/1200x600.png"
              alt="MediMind AI Dashboard Preview"
              layout="fill"
              objectFit="cover"
              className="rounded-lg border shadow-lg"
              data-ai-hint="dashboard health"
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        </section>
      </main>
      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by MediMind Co.
          </p>
        </div>
      </footer>
    </div>
  );
}
