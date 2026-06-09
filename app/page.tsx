'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Sparkles, MessageSquareText, Search, Layers, ArrowRight, Menu, X, ChevronLeft, ChevronRight, Calendar, Plus, Trash2, Check, Clock, Sun, Moon } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}

function RevealSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useScrollReveal()
  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

const testimonials = [
  {
    quote: "I just type what I need and it appears on my calendar. It feels like magic.",
    name: "Alex Chen",
    title: "Product Designer",
    initials: "AC",
    color: "bg-primary/20 text-primary",
  },
  {
    quote: "The AI extraction is scarily accurate. Saves me at least two hours every week.",
    name: "Sarah Kim",
    title: "Freelance Developer",
    initials: "SK",
    color: "bg-secondary/20 text-secondary",
  },
  {
    quote: "Finally, a calendar that works the way I think. The natural language input is a game-changer.",
    name: "Marcus Johnson",
    title: "Engineering Lead",
    initials: "MJ",
    color: "bg-[oklch(0.6_0.2_160)]/20 text-[oklch(0.6_0.2_160)]",
  },
]

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const monthDays = [
  [null, null, null, null, 1, 2, 3],
  [4, 5, 6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15, 16, 17],
  [18, 19, 20, 21, 22, 23, 24],
  [25, 26, 27, 28, 29, 30, 31],
]

const eventDays = [8, 12, 19, 24]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[50rem] h-[50rem] rounded-full bg-primary/4 blur-[180px]" />
        <div className="absolute -bottom-40 -left-40 w-[50rem] h-[50rem] rounded-full bg-secondary/4 blur-[180px]" />
        <div className="absolute top-1/4 left-1/3 w-[60rem] h-[60rem] rounded-full bg-[oklch(0.5_0.15_250)]/3 blur-[200px]" />
      </div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/12 ring-1 ring-primary/20">
                <img src="/calendar.png" alt="Better Calendar" className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-foreground">Better Calendar</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
              <div className="flex items-center gap-3">
                <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                  Sign In
                </Link>
                <Link href="/register" className={cn(buttonVariants({ variant: "default", size: "sm" }))}>
                  Get Started
                </Link>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-background/95 backdrop-blur-xl">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground py-2 transition-colors">Features</a>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground py-2 transition-colors">Testimonials</a>
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
                  Sign In
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className={cn(buttonVariants({ variant: "default" }), "w-full")}>
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge variant="outline" className="px-3 py-1 text-xs gap-1.5 border-primary/20 bg-primary/5">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span className="text-primary">AI-Powered Calendar</span>
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08]">
                  The Calendar That{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    Speaks Your Language
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
                  Stop clicking through date pickers. Type &ldquo;Dinner with friends Friday 8pm&rdquo; and watch it appear on your calendar.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/register" className={cn(buttonVariants({ variant: "default" }), "h-11 px-6 text-sm gap-2")}>
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/login" className={cn(buttonVariants({ variant: "outline" }), "h-11 px-6 text-sm")}>
                  Sign In
                </Link>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-muted-foreground">
                  <span className="text-foreground font-semibold">4.9</span> / 5.0 from early users
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-b from-primary/10 via-secondary/5 to-transparent rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl border border-white/10 bg-card/90 backdrop-blur-sm p-5 shadow-2xl shadow-primary/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>May 2026</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-px mb-1">
                  {weekDays.map(d => (
                    <div key={d} className="text-center text-[0.65rem] font-medium text-muted-foreground/60 py-1">{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-px">
                  {monthDays.flat().map((d, i) => (
                    <div key={i} className="text-center py-1.5 relative">
                      {d ? (
                        <>
                          <span className={cn(
                            'text-xs',
                            eventDays.includes(d) ? 'text-primary font-semibold' : 'text-foreground/80',
                            d === 12 && 'bg-primary/20 rounded-full px-1.5 py-0.5'
                          )}>
                            {d}
                          </span>
                          {eventDays.includes(d) && (
                            <div className={cn(
                              'absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full',
                              d === 12 ? 'bg-primary' : 'bg-primary/50'
                            )} />
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground/20">{29 + i}</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-background/50 border border-white/5">
                    <MessageSquareText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground/80">&ldquo;Lunch with Sarah next Tuesday at 1pm&rdquo;</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="w-0.5 h-8 rounded-full bg-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-foreground">Lunch with Sarah</div>
                      <div className="text-[0.65rem] text-muted-foreground">Tue, May 19 &middot; 1:00 PM &middot; 2:00 PM</div>
                    </div>
                    <Badge className="text-[0.6rem] h-4 px-1.5 bg-primary/20 text-primary border-0">AI extracted</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RevealSection>
        <section className="relative py-12 border-y border-white/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "99%", label: "Extraction accuracy" },
                { value: "10,000+", label: "Events created" },
                { value: "45+", label: "Countries" },
                { value: "4.9", label: "User rating" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      <RevealSection delay={100}>
        <section id="features" className="relative py-24 sm:py-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="outline" className="px-3 py-1 text-xs mb-4 border-primary/20 bg-primary/5">
                <span className="text-primary">Features</span>
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything at your fingertips</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                From AI-powered event creation to powerful organization — designed to stay out of your way.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2 relative group p-6 sm:p-8 rounded-2xl bg-card/40 backdrop-blur-sm border border-white/5 hover:bg-card/60 hover:border-primary/20 transition-all duration-500">
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <MessageSquareText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-lg sm:text-xl font-semibold">AI Event Extraction</h3>
                      <Badge className="text-[0.6rem] h-4 px-1.5 bg-primary/20 text-primary border-0 shrink-0">Flagship</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                      Describe your event in plain English. Our AI parses dates, times, titles, and locations with 99% accuracy — no more clicking through date pickers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative group p-6 rounded-2xl bg-card/40 backdrop-blur-sm border border-white/5 hover:bg-card/60 hover:border-primary/20 transition-all duration-500">
                <div className="w-10 h-10 rounded-xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Search className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold mb-2">Smart Search</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Find any event instantly with full-text search across your entire calendar. Fast, precise, always there.
                </p>
              </div>

              <div className="relative group p-6 rounded-2xl bg-card/40 backdrop-blur-sm border border-white/5 hover:bg-card/60 hover:border-primary/20 transition-all duration-500">
                <div className="w-10 h-10 rounded-xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Layers className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold mb-2">Multi-Day Events</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Plan trips, conferences, and week-long events seamlessly. Full multi-day support built right in.
                </p>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      <RevealSection delay={100}>
        <section className="relative py-24 sm:py-32 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-3">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-b from-primary/10 via-secondary/5 to-transparent rounded-3xl blur-2xl" />
                  <div className="relative rounded-2xl border border-white/10 bg-card/90 backdrop-blur-sm p-5 shadow-2xl shadow-primary/5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold">May 2026</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[0.55rem] h-5 px-2">Month</Badge>
                        <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-px mb-1.5">
                      {weekDays.map(d => (
                        <div key={d} className="text-center text-[0.6rem] font-medium text-muted-foreground/60 py-1">{d}</div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-px">
                      {[
                        [null, null, null, null, 1, null, null],
                        [4, 5, 6, 7, null, 9, 10],
                        [11, null, 13, 14, 15, 16, 17],
                        [18, null, 20, 21, 22, 23, null],
                        [25, 26, 27, 28, 29, 30, 31],
                      ].flat().map((d, i) => (
                        <div key={i} className={cn(
                          'text-center py-2 relative min-h-[2.5rem]',
                          d === 12 && 'bg-primary/15 rounded-lg',
                        )}>
                          {d ? (
                            <>
                              <span className={cn(
                                'text-xs',
                                d === 12 && 'text-primary font-bold',
                                d !== 12 && 'text-foreground/80'
                              )}>
                                {d}
                              </span>
                              {(d === 12) && (
                                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                              )}
                              {d === 13 && (
                                <div className="w-full mt-0.5 h-0.5 rounded-full bg-primary" />
                              )}
                              {d === 19 && (
                                <div className="w-full mt-0.5 h-0.5 rounded-full bg-secondary" />
                              )}
                              {d === 8 && (
                                <div className="w-full mt-0.5 h-0.5 rounded-full bg-primary/60" />
                              )}
                              {d === 24 && (
                                <div className="w-full mt-0.5 h-0.5 rounded-full bg-[oklch(0.8_0.17_85)]" />
                              )}
                            </>
                          ) : (
                            <span className="text-xs text-muted-foreground/15">{27 + (i % 4)}</span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 pt-4 border-t border-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold">Today &middot; May 12</span>
                        <span className="text-[0.55rem] text-muted-foreground">2 events</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-primary/10 border border-primary/20">
                          <div className="w-0.5 h-9 rounded-full bg-primary shrink-0" />
                          <div>
                            <div className="text-xs font-medium">Team Standup</div>
                            <div className="text-[0.6rem] text-muted-foreground">10:00 AM &middot; 10:15 AM</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[oklch(0.63_0.16_155)]/10 border border-[oklch(0.63_0.16_155)]/20">
                          <div className="w-0.5 h-9 rounded-full bg-[oklch(0.63_0.16_155)] shrink-0" />
                          <div>
                            <div className="text-xs font-medium">Gym Session</div>
                            <div className="text-[0.6rem] text-muted-foreground">5:00 PM &middot; 6:00 PM</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <Badge variant="outline" className="px-3 py-1 text-xs mb-4 border-primary/20 bg-primary/5">
                  <Calendar className="w-3 h-3 text-primary" />
                  <span className="text-primary">Calendar View</span>
                </Badge>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">See your schedule at a glance</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A clean, full-featured month view that shows all your events at once. Today is always highlighted, and event indicators make it easy to spot busy days.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Color-coded event dots for quick scanning",
                    "Today indicator with upcoming events panel",
                    "Month / week view toggle",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      <RevealSection delay={150}>
        <section className="relative py-24 sm:py-32 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="lg:order-2">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-b from-secondary/10 via-primary/5 to-transparent rounded-3xl blur-2xl" />
                  <div className="relative rounded-2xl border border-white/10 bg-card/90 backdrop-blur-sm p-5 shadow-2xl shadow-primary/5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                      <span className="text-xs text-muted-foreground ml-2">AI Event Input</span>
                    </div>

                    <div className="flex gap-2 mb-5">
                      <div className="flex-1 flex items-center gap-2.5 p-3 rounded-xl bg-background/60 border border-white/10">
                        <MessageSquareText className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground/80">&ldquo;Lunch with Sarah next Tuesday at 1pm at Bistro Central&rdquo;</span>
                      </div>
                      <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <Sparkles className="w-4 h-4 text-primary-foreground" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-card/60 border border-primary/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="text-[0.55rem] h-4 px-1.5 bg-primary/20 text-primary border-0">98% match</Badge>
                          <Badge className="text-[0.55rem] h-4 px-1.5 bg-[oklch(0.63_0.16_155)]/20 text-[oklch(0.63_0.16_155)] border-0">AI extracted</Badge>
                        </div>
                        <div className="text-sm font-medium text-foreground mb-0.5">Lunch with Sarah</div>
                        <div className="text-xs text-muted-foreground mb-1">Tue, May 19 &middot; 1:00 PM &middot; 2:00 PM</div>
                        <div className="text-xs text-muted-foreground mb-3">📍 Bistro Central</div>
                        <div className="flex gap-2">
                          <div className="h-7 px-3 rounded-lg bg-primary text-primary-foreground text-xs flex items-center gap-1 cursor-default">
                            <Check className="w-3 h-3" /> Save
                          </div>
                          <div className="h-7 px-3 rounded-lg bg-background/60 border border-white/10 text-muted-foreground text-xs flex items-center gap-1 cursor-default">
                            <X className="w-3 h-3" /> Discard
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-card/60 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="text-[0.55rem] h-4 px-1.5 bg-primary/20 text-primary border-0">95% match</Badge>
                          <Badge className="text-[0.55rem] h-4 px-1.5 bg-muted text-muted-foreground border-0">Suggested</Badge>
                        </div>
                        <div className="text-sm font-medium text-foreground mb-0.5">Team Standup (recurring)</div>
                        <div className="text-xs text-muted-foreground mb-3">Every weekday &middot; 10:00 AM &middot; 10:15 AM</div>
                        <div className="flex gap-2">
                          <div className="h-7 px-3 rounded-lg bg-primary text-primary-foreground text-xs flex items-center gap-1 cursor-default">
                            <Check className="w-3 h-3" /> Save
                          </div>
                          <div className="h-7 px-3 rounded-lg bg-background/60 border border-white/10 text-muted-foreground text-xs flex items-center gap-1 cursor-default">
                            <X className="w-3 h-3" /> Discard
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:order-1">
                <Badge variant="outline" className="px-3 py-1 text-xs mb-4 border-primary/20 bg-primary/5">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span className="text-primary">AI Event Extraction</span>
                </Badge>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">Describe, don&apos;t click</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Type your event in natural language and our AI extracts all the details — date, time, title, location — with 99% accuracy. Review, save, and move on.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Parses complex date references like 'next Tuesday' or 'the 15th'",
                    "Detects locations, recurring patterns, and durations",
                    "Confidence scoring with suggested event detection",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      <RevealSection delay={200}>
        <section className="relative py-24 sm:py-32 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-3">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-b from-primary/10 via-secondary/5 to-transparent rounded-3xl blur-2xl" />
                  <div className="relative rounded-2xl border border-white/10 bg-card/90 backdrop-blur-sm p-5 shadow-2xl shadow-primary/5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                      <span className="text-xs text-muted-foreground ml-2">My Events</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
                        <input
                          readOnly
                          value="Search events..."
                          className="w-full h-8 pl-8 pr-3 rounded-lg bg-background/50 border border-white/10 text-xs text-muted-foreground/60 outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs cursor-default">
                        <Plus className="w-3.5 h-3.5" />
                        Add
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1 space-y-1.5">
                        {[
                          { title: "Team Standup", date: "May 13", time: "10:00 AM", color: "bg-primary" },
                          { title: "Lunch w/ Sarah", date: "May 19", time: "1:00 PM", color: "bg-secondary" },
                          { title: "Gym Session", date: "May 12", time: "5:00 PM", color: "bg-[oklch(0.63_0.16_155)]" },
                          { title: "Conference", date: "May 24", time: "9:00 AM", color: "bg-[oklch(0.8_0.17_85)]" },
                        ].map((ev) => (
                          <div key={ev.title} className="group flex items-center gap-2.5 p-2 rounded-lg hover:bg-card/40 transition-colors cursor-default">
                            <div className={cn("w-1 h-7 rounded-full shrink-0", ev.color)} />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-foreground truncate">{ev.title}</div>
                              <div className="text-[0.6rem] text-muted-foreground">{ev.date} &middot; {ev.time}</div>
                            </div>
                            <Trash2 className="w-3 h-3 text-muted-foreground/40 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 shrink-0" />
                          </div>
                        ))}
                      </div>

                      <div className="w-52 shrink-0 p-3 rounded-xl bg-card/60 border border-white/5 hidden sm:block">
                        <div className="text-xs font-semibold mb-3">Edit Event</div>
                        <div className="space-y-2.5">
                          <div>
                            <div className="text-[0.55rem] text-muted-foreground uppercase tracking-wider mb-1">Title</div>
                            <div className="h-7 rounded-lg bg-background/50 border border-white/10 px-2.5 flex items-center text-xs text-foreground">Gym Session</div>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <div className="text-[0.55rem] text-muted-foreground uppercase tracking-wider mb-1">Date</div>
                              <div className="h-7 rounded-lg bg-background/50 border border-white/10 px-2.5 flex items-center text-xs text-foreground">05/12/26</div>
                            </div>
                            <div className="flex-1">
                              <div className="text-[0.55rem] text-muted-foreground uppercase tracking-wider mb-1">Time</div>
                              <div className="h-7 rounded-lg bg-background/50 border border-white/10 px-2.5 flex items-center text-xs text-foreground">5:00 PM</div>
                            </div>
                          </div>
                          <div>
                            <div className="text-[0.55rem] text-muted-foreground uppercase tracking-wider mb-1">Location</div>
                            <div className="h-7 rounded-lg bg-background/50 border border-white/10 px-2.5 flex items-center text-xs text-muted-foreground">FitZone Gym</div>
                          </div>
                          <div className="flex gap-2 pt-1">
                            <div className="flex-1 h-7 rounded-lg bg-primary text-primary-foreground text-xs flex items-center justify-center gap-1 cursor-default">
                              <Check className="w-3 h-3" /> Save
                            </div>
                            <div className="flex-1 h-7 rounded-lg bg-background/60 border border-white/10 text-muted-foreground text-xs flex items-center justify-center gap-1 cursor-default">
                              <Trash2 className="w-3 h-3" /> Delete
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <Badge variant="outline" className="px-3 py-1 text-xs mb-4 border-primary/20 bg-primary/5">
                  <Plus className="w-3 h-3 text-primary" />
                  <span className="text-primary">Event Management</span>
                </Badge>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">Full control, zero friction</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Add, edit, or remove events in seconds. The inline editor lets you update any detail without navigating away — and the search bar finds events instantly.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Inline editing with instant save",
                    "One-click duplicate and delete",
                    "Powerful search with auto-complete",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      <RevealSection delay={250}>
        <section className="relative py-24 sm:py-32 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="lg:order-2">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-b from-primary/10 via-secondary/5 to-transparent rounded-3xl blur-2xl" />
                  <div className="relative rounded-2xl border border-white/10 bg-card/90 backdrop-blur-sm p-5 shadow-2xl shadow-primary/5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                      <span className="text-xs text-muted-foreground ml-2">Settings</span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-card/40 border border-white/5">
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-primary" />
                          <div>
                            <div className="text-xs font-medium text-foreground">Time Format</div>
                            <div className="text-[0.6rem] text-muted-foreground">Choose between 12h and 24h</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-background/60 border border-white/10">
                          <div className="px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-[0.6rem] font-medium cursor-default">12h</div>
                          <div className="px-2.5 py-1 rounded-md text-muted-foreground text-[0.6rem] cursor-default">24h</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl bg-card/40 border border-white/5">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-primary" />
                          <div>
                            <div className="text-xs font-medium text-foreground">First Day of Week</div>
                            <div className="text-[0.6rem] text-muted-foreground">Monday, Sunday, or Saturday</div>
                          </div>
                        </div>
                        <div className="h-7 px-2.5 rounded-lg bg-background/60 border border-white/10 flex items-center text-[0.6rem] text-foreground cursor-default">
                          Monday <ChevronLeft className="w-2.5 h-2.5 ml-1 rotate-90 text-muted-foreground" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl bg-card/40 border border-white/5">
                        <div className="flex items-center gap-3">
                          <Sun className="w-4 h-4 text-primary" />
                          <div>
                            <div className="text-xs font-medium text-foreground">Theme</div>
                            <div className="text-[0.6rem] text-muted-foreground">Dark mode always on</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-background/60 border border-white/10">
                          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center cursor-default">
                            <Moon className="w-3 h-3 text-primary-foreground" />
                          </div>
                          <div className="w-6 h-6 rounded-md text-muted-foreground/40 flex items-center justify-center cursor-default">
                            <Sun className="w-3 h-3" />
                          </div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-card/40 border border-white/5">
                        <div className="flex items-center gap-3 mb-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <div>
                            <div className="text-xs font-medium text-foreground">OpenRouter API Key</div>
                            <div className="text-[0.6rem] text-muted-foreground">Used for AI extraction</div>
                          </div>
                        </div>
                        <div className="h-7 rounded-lg bg-background/60 border border-white/10 px-3 flex items-center text-xs text-muted-foreground/60 cursor-default">sk-or-v1-••••••••••••••••••</div>
                        <div className="mt-2 flex justify-end">
                          <div className="h-6 px-3 rounded-lg bg-primary text-primary-foreground text-[0.6rem] flex items-center cursor-default">Save Changes</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:order-1">
                <Badge variant="outline" className="px-3 py-1 text-xs mb-4 border-primary/20 bg-primary/5">
                  <Moon className="w-3 h-3 text-primary" />
                  <span className="text-primary">Customization</span>
                </Badge>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">Made for you</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Tailor the calendar to your workflow. Choose your time format, set the first day of the week, and connect your own AI provider for private, custom-powered extraction.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "12h or 24h time display",
                    "Monday, Sunday, or Saturday start",
                    "Custom OpenRouter API key for AI features",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      <RevealSection delay={200}>
        <section id="testimonials" className="relative py-24 sm:py-32 border-t border-white/5">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[30rem] rounded-full bg-primary/3 blur-[120px]" />
          </div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <Badge variant="outline" className="px-3 py-1 text-xs mb-4 border-primary/20 bg-primary/5">
                <span className="text-primary">Testimonials</span>
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Loved by early users</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Here&apos;s what people are saying about Better Calendar.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.name} className="group relative p-6 rounded-2xl bg-card/40 backdrop-blur-sm border border-white/5 hover:bg-card/60 hover:border-primary/20 transition-all duration-500">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0", t.color)}>
                      {t.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{t.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{t.title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      <RevealSection delay={100}>
        <section className="relative py-24 sm:py-32 border-t border-white/5">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70rem] h-[30rem] rounded-full bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 blur-[140px]" />
          </div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-2xl mx-auto">
              Ready to simplify your schedule?
            </h2>
            <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
              No credit card required. Start organizing your time the smart way in seconds.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className={cn(buttonVariants({ variant: "default" }), "h-12 px-8 text-sm gap-2 shadow-lg shadow-primary/20")}>
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/login" className={cn(buttonVariants({ variant: "outline" }), "h-12 px-8 text-sm")}>
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </RevealSection>

      <footer className="relative border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-primary/12 ring-1 ring-primary/20">
              <img src="/calendar.png" alt="Better Calendar" className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-foreground">Better Calendar</span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Better Calendar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
