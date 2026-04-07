import { Heart, MapPin, Navigation } from "lucide-react";
import distanceMapImg from "@/assets/distance-map.jpg";

const DistanceBetweenUs = () => {
  return (
    <section className="relative py-24 px-4 overflow-hidden" id="distance">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
            <Navigation className="w-5 h-5 text-gold" />
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>
          <h2 className="font-script text-5xl md:text-6xl text-primary mb-3">
            Distance Between Us
          </h2>
          <p className="font-body text-muted-foreground text-sm tracking-widest uppercase">
            55 kilometers apart, but our hearts beat as one
          </p>
        </div>

        {/* Map illustration */}
        <div className="relative mb-12">
          <div className="rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 border border-border/50">
            <img
              src={distanceMapImg}
              alt="Map showing the distance between Sukkur and Garhi Yasin - 55 KM of love"
              className="w-full h-auto"
              loading="lazy"
              width={1280}
              height={640}
            />
          </div>
        </div>

        {/* Location cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Mohid's location */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-lg text-center hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-elegant text-2xl text-foreground mb-2">Mohid</h3>
            <p className="font-body text-muted-foreground text-sm mb-1">Lives in</p>
            <p className="font-elegant text-xl text-primary">Sukkur, Sindh</p>
            <p className="font-body text-muted-foreground text-xs mt-2">Pakistan</p>
          </div>

          {/* Hasina's location */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-lg text-center hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-elegant text-2xl text-foreground mb-2">Hasina</h3>
            <p className="font-body text-muted-foreground text-sm mb-1">Lives in</p>
            <p className="font-elegant text-xl text-primary">Garhi Yasin, Distt. Shikarpur</p>
            <p className="font-body text-muted-foreground text-xs mt-2">Sindh, Pakistan</p>
          </div>
        </div>

        {/* Distance highlight */}
        <div className="text-center">
          <div className="inline-flex items-center gap-4 bg-card/80 backdrop-blur-sm rounded-full px-10 py-5 border border-primary/20 shadow-lg">
            <Heart className="w-6 h-6 text-primary fill-primary/50 animate-heartbeat" />
            <div>
              <p className="font-script text-3xl text-primary">~55 KM</p>
              <p className="font-body text-muted-foreground text-xs tracking-widest uppercase mt-1">
                But love knows no distance
              </p>
            </div>
            <Heart className="w-6 h-6 text-primary fill-primary/50 animate-heartbeat" style={{ animationDelay: "0.5s" }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DistanceBetweenUs;
