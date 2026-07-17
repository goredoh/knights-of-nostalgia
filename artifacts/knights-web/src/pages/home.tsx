import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Camera, Heart, History, MapPin, Sparkles, Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// A simple fade-in intersection observer hook
function useFadeIn() {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
          }
        });
      },
      { threshold: 0.15 }
    );
    
    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return { domRef, isVisible };
}

function FadeInSection({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) {
  const { domRef, isVisible } = useFadeIn();
  return (
    <div 
      ref={domRef}
      className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-[100dvh] w-full bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-background/50 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <img src={`${import.meta.env.BASE_URL}assets/kon-icon.png`} alt="Knights of Nostalgia" className="w-8 h-8 opacity-90 drop-shadow-[0_0_8px_hsla(var(--primary)/0.5)]" />
          <span className="font-serif text-xl tracking-wide text-primary">Knights of Nostalgia</span>
        </div>
        <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground rounded-full px-6 transition-all duration-300">
          Sign In
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center pt-20 px-6">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}assets/kon-hero.jpg`} 
            alt="Suburban street at dusk" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 mt-12">
          <FadeInSection>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm mb-6 font-medium tracking-wide">
              <Sparkles className="w-4 h-4" />
              <span>A Wishing Well for Lost Moments</span>
            </div>
          </FadeInSection>
          
          <FadeInSection delay={200}>
            <h1 className="text-5xl md:text-7xl font-serif leading-tight text-glow">
              Helping strangers carry <br className="hidden md:block"/> their memories forward.
            </h1>
          </FadeInSection>

          <FadeInSection delay={400}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              Post a wish for a place, a thing, or a moment you miss. Local Knights will capture photos, videos, and sounds to fulfill it—bringing your past back into the light.
            </p>
          </FadeInSection>

          <FadeInSection delay={600} className="pt-8">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-primary text-primary-foreground hover:bg-accent hover:shadow-[0_0_30px_-5px_hsla(var(--primary)/0.5)] transition-all duration-500">
              Join the Community
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </FadeInSection>
        </div>

        {/* Ambient glowing orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      </section>

      {/* The Manifesto */}
      <section className="py-24 px-6 bg-background relative border-b border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <FadeInSection>
            <h2 className="text-2xl md:text-3xl font-serif text-primary mb-6">Our Manifesto</h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
              Time moves only forward, but memory lets us look back. We believe that no place you loved should be forgotten simply because you had to leave it behind. We are an order of volunteers dedicated to preserving the echoes of the past for those who need them today.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-3xl md:text-5xl">The Cycle of a Memory</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">A simple act of kindness connects two strangers across distance, preserving a moment in time forever.</p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

            <FadeInSection delay={100} className="relative z-10">
              <div className="space-y-6 text-center">
                <div className="w-24 h-24 mx-auto rounded-full glass-panel flex items-center justify-center relative group">
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all duration-500"></div>
                  <Star className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl mb-2">1. The Wish</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Someone leaves a request: "Can someone photograph the old oak tree on Elm Street? I used to read under it."</p>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={300} className="relative z-10">
              <div className="space-y-6 text-center">
                <div className="w-24 h-24 mx-auto rounded-full glass-panel flex items-center justify-center relative group">
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all duration-500"></div>
                  <Camera className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl mb-2">2. The Knight</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">A local community member accepts the quest, visiting the location to capture its current state.</p>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={500} className="relative z-10">
              <div className="space-y-6 text-center">
                <div className="w-24 h-24 mx-auto rounded-full glass-panel flex items-center justify-center relative group">
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all duration-500"></div>
                  <Heart className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl mb-2">3. The Fulfillment</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">The memory is delivered. A connection is made. The archive grows richer with everyday history.</p>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Featured Memory */}
      <section className="py-24 px-6 bg-card/30 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeInSection>
              <div className="space-y-8">
                <h2 className="text-3xl md:text-5xl leading-tight">Stories lit by <br/><span className="text-primary italic">streetlamps</span>.</h2>
                <div className="space-y-6">
                  <Card className="glass-panel border-0 bg-transparent shadow-none">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="font-serif text-primary">E</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">Elena requested</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3"/> Portland, OR</p>
                          </div>
                        </div>
                        <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full border border-primary/20">Fulfilled</span>
                      </div>
                      <p className="text-muted-foreground italic">"I moved away 10 years ago. There was a small coffee shop on 4th Ave that had a blue neon sign. I miss the sound of the rain against their window. Is it still there?"</p>
                      
                      <div className="pt-4 mt-4 border-t border-border flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                          <span className="font-serif text-accent">M</span>
                        </div>
                        <div>
                          <p className="text-sm">Knight Marcus replied</p>
                          <p className="text-sm text-muted-foreground mt-1">"The neon sign is gone, but the shop is still serving the same roast. I sat by the window for you today."</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </FadeInSection>
            
            <FadeInSection delay={200}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] border border-border group">
                <img 
                  src={`${import.meta.env.BASE_URL}assets/kon-hero.jpg`} 
                  alt="Atmospheric street view" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="font-serif text-2xl text-primary mb-2">Sunset on Elm</p>
                  <p className="text-sm text-foreground/80">Captured Oct 14th</p>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Archive / History */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}assets/kon-archive.jpg`} 
            alt="Vintage items archive" 
            className="w-full h-full object-cover opacity-20 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="max-w-2xl">
            <FadeInSection>
              <div className="inline-flex items-center gap-2 text-primary mb-6">
                <History className="w-5 h-5" />
                <span className="uppercase tracking-widest text-sm font-semibold">The Archive</span>
              </div>
              <h2 className="text-4xl md:text-6xl mb-8 font-serif text-glow">Building a museum <br/>of the mundane.</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                Every fulfilled wish becomes a permanent part of the nostalgia archive. We are collectively mapping the emotional geography of our cities—capturing the places that matter to someone, before they fade away.
              </p>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-4xl font-serif text-primary mb-2">14,205</div>
                  <div className="text-sm text-muted-foreground">Wishes Fulfilled</div>
                </div>
                <div>
                  <div className="text-4xl font-serif text-accent mb-2">8,492</div>
                  <div className="text-sm text-muted-foreground">Active Knights</div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Active Quests Board */}
      <section className="py-24 px-6 bg-card/20 border-b border-white/5 relative">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif mb-4">Open Quests</h2>
                <p className="text-muted-foreground">Local requests waiting for a Knight.</p>
              </div>
              <Button variant="outline" className="text-primary border-primary/30 hover:bg-primary hover:text-primary-foreground">
                View All Quests
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { location: "Chicago, IL", title: "The Red Door Bookstore", desc: "Is the painting of the ship still on the back wall?", date: "Posted 2 hrs ago" },
                { location: "Austin, TX", title: "Miller's Pond Park", desc: "Could someone record the sound of the frogs at dusk? I miss that sound.", date: "Posted 5 hrs ago" },
                { location: "London, UK", title: "Camden Lock Bridge", desc: "A photo of the old brick archway in the rain, please.", date: "Posted 1 day ago" }
              ].map((quest, i) => (
                <Card key={i} className="glass-panel border-white/5 hover:border-primary/30 transition-colors duration-500 cursor-pointer group">
                  <CardContent className="p-6 flex flex-col h-full justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-primary mb-3">
                        <MapPin className="w-3 h-3" />
                        {quest.location}
                      </div>
                      <h3 className="font-serif text-xl mb-2 group-hover:text-primary transition-colors">{quest.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">"{quest.desc}"</p>
                    </div>
                    <div className="text-xs text-muted-foreground/70 font-mono">
                      {quest.date}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto relative z-10 space-y-10">
          <FadeInSection>
            <img src={`${import.meta.env.BASE_URL}assets/kon-icon.png`} alt="Knights of Nostalgia" className="w-20 h-20 mx-auto mb-8 opacity-80" />
            <h2 className="text-4xl md:text-6xl font-serif">Be a light in the dark.</h2>
            <p className="text-xl text-muted-foreground mt-6 max-w-xl mx-auto">
              Whether you are seeking a piece of your past, or offering to be the lens for someone else's—your journey begins here.
            </p>
          </FadeInSection>
          
          <FadeInSection delay={200}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full bg-primary text-primary-foreground hover:bg-accent transition-all">
                Download the App
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full border-border hover:bg-card hover:text-primary transition-all">
                Explore the Archive
              </Button>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border/50">
        <p>&copy; {new Date().getFullYear()} Knights of Nostalgia. A community project.</p>
      </footer>
    </div>
  );
}
