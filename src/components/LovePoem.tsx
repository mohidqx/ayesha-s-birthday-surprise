import { Heart, Star, Feather } from "lucide-react";

const LovePoem = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden bg-background/80 backdrop-blur-sm">
      {/* Soft background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      
      {/* Decorative stars */}
      {[...Array(8)].map((_, i) => (
        <Star
          key={i}
          className="absolute text-gold/20 fill-gold/10 animate-twinkle"
          size={8 + Math.random() * 6}
          style={{
            left: `${5 + i * 12}%`,
            top: `${10 + (i % 3) * 35}%`,
            animationDelay: `${i * 0.6}s`,
          }}
        />
      ))}
      
      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14 animate-fade-in-up">
          <Feather className="w-9 h-9 mx-auto text-gold mb-5 animate-float" />
          <h2 className="font-script text-5xl md:text-6xl text-primary mb-3">
            A Poem For You
          </h2>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold" />
            <Heart className="w-4 h-4 text-primary fill-primary/60" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold" />
          </div>
        </div>

        {/* Poem Card */}
        <div className="luxury-card p-10 md:p-16 animate-fade-in-up animation-delay-200 relative">
          {/* Ornate corner decorations */}
          <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-gold/30 rounded-tl-2xl" />
          <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-gold/30 rounded-tr-2xl" />
          <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-gold/30 rounded-bl-2xl" />
          <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-gold/30 rounded-br-2xl" />
          
          {/* Poem content */}
          <div className="text-center space-y-8">
            <div className="space-y-1">
              <p className="font-elegant text-xl md:text-2xl text-foreground/90 italic leading-relaxed">
                In a world of endless faces,
              </p>
              <p className="font-elegant text-xl md:text-2xl text-foreground/90 italic leading-relaxed">
                Yours is the one my heart embraces.
              </p>
            </div>

            <Star className="w-4 h-4 mx-auto text-gold fill-gold/50" />

            <div className="space-y-1">
              <p className="font-elegant text-xl md:text-2xl text-foreground/90 italic leading-relaxed">
                Your smile, a sunrise in my soul,
              </p>
              <p className="font-elegant text-xl md:text-2xl text-foreground/90 italic leading-relaxed">
                With you beside me, I am whole.
              </p>
            </div>

            <Star className="w-4 h-4 mx-auto text-gold fill-gold/50" />

            <div className="space-y-1">
              <p className="font-elegant text-xl md:text-2xl text-foreground/90 italic leading-relaxed">
                Through every season, storm, and shine,
              </p>
              <p className="font-elegant text-xl md:text-2xl text-foreground/90 italic leading-relaxed">
                I'm blessed to call you mine.
              </p>
            </div>

            <Star className="w-4 h-4 mx-auto text-gold fill-gold/50" />

            <div className="space-y-1">
              <p className="font-elegant text-xl md:text-2xl text-foreground/90 italic leading-relaxed">
                On this day, your special day,
              </p>
              <p className="font-elegant text-xl md:text-2xl text-foreground/90 italic leading-relaxed">
                I promise to love you, come what may.
              </p>
            </div>

            <div className="pt-8 border-t border-rose-medium/30 mt-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Heart className="w-5 h-5 text-primary fill-primary/60" />
                <p className="font-script text-3xl text-gradient-gold">
                  Forever and Always
                </p>
                <Heart className="w-5 h-5 text-primary fill-primary/60" />
              </div>
              <p className="font-body text-sm text-muted-foreground tracking-wider">
                — Written with love by Mohid, for Hasina
              </p>
            </div>
          </div>
        </div>

        {/* Decorative hearts below */}
        <div className="flex justify-center mt-10 gap-4">
          {[...Array(3)].map((_, i) => (
            <Heart 
              key={i} 
              className="w-5 h-5 text-primary fill-primary/70 animate-heartbeat"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LovePoem;
