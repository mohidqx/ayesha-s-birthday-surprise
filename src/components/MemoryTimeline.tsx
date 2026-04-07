import { Heart, Sparkles, Calendar, Star } from "lucide-react";
import { useState } from "react";

interface Milestone {
  date: string;
  title: string;
  description: string;
  icon: "heart" | "sparkles" | "star";
}

const milestones: Milestone[] = [
  {
    date: "April 13, 2022",
    title: "The Day I Fell in Love",
    description:
      "Something changed in my heart that day. I looked at you and knew — you were the one I'd been waiting for. I liked you since this day, and my feelings only grew stronger.",
    icon: "heart",
  },
  {
    date: "May 2022",
    title: "Our First Date",
    description:
      "Nervous hearts, shy smiles, and a connection that felt like it was written in the stars. That first date was the beginning of everything beautiful.",
    icon: "star",
  },
  {
    date: "October 1, 2022",
    title: "Her First Birthday Together",
    description:
      "The first time I got to celebrate your special day. Every moment spent making you smile was worth more than anything in the world.",
    icon: "sparkles",
  },
  {
    date: "February 14, 2023",
    title: "First Valentine's Day",
    description:
      "Our first Valentine's — a day dedicated to love, but every day with you already felt like Valentine's Day.",
    icon: "heart",
  },
  {
    date: "April 13, 2023",
    title: "One Year of Loving You",
    description:
      "365 days of carrying you in my heart. A whole year of loving you silently, deeply, and unconditionally.",
    icon: "star",
  },
  {
    date: "October 1, 2023",
    title: "First Gift for Her",
    description:
      "Choosing the perfect gift for you — something that could capture even a fraction of what you mean to me. Your smile when you received it made everything worth it.",
    icon: "sparkles",
  },
  {
    date: "June 18, 2025",
    title: "Our First Kiss",
    description:
      "A stolen moment, a secret kiss — my heart was racing but it felt so right. I kissed you secretly, and in that moment, the whole world disappeared.",
    icon: "heart",
  },
  {
    date: "June 26, 2025",
    title: "She Confessed Her Love",
    description:
      "The most magical day — Hasina confessed her feelings for me, and I told her everything too. After loving her since April 13, 2022, hearing those words was the most beautiful reward my heart could ever receive.",
    icon: "heart",
  },
  {
    date: "June 26, 2025",
    title: "Our Real First Kiss",
    description:
      "This time, with her permission, with her love, with her heart saying yes — I kissed her. A kiss that sealed our love story forever. 💕",
    icon: "sparkles",
  },
];
const iconMap = {
  heart: Heart,
  sparkles: Sparkles,
  star: Star,
};

const MemoryTimeline = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="relative py-24 px-4 overflow-hidden" id="timeline">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
            <Calendar className="w-5 h-5 text-gold" />
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>
          <h2 className="font-script text-5xl md:text-6xl text-primary mb-3">
            Our Story
          </h2>
          <p className="font-body text-muted-foreground text-sm tracking-widest uppercase">
            Moments that changed everything
          </p>
        </div>

        {/* Timeline line */}
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />

          {milestones.map((milestone, index) => {
            const Icon = iconMap[milestone.icon];
            const isLeft = index % 2 === 0;
            const isActive = activeIndex === index;

            return (
              <div
                key={index}
                className="relative mb-20 last:mb-0"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {/* Center dot */}
                <div className="absolute left-1/2 -translate-x-1/2 top-6 z-10">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isActive
                        ? "bg-primary shadow-lg shadow-primary/30 scale-110"
                        : "bg-card border-2 border-primary/30"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors duration-300 ${
                        isActive
                          ? "text-primary-foreground fill-primary-foreground/50"
                          : "text-primary fill-primary/30"
                      }`}
                    />
                  </div>
                </div>

                {/* Card */}
                <div
                  className={`w-[calc(50%-3rem)] transition-all duration-500 ${
                    isLeft ? "mr-auto text-right pr-4" : "ml-auto text-left pl-4"
                  } ${isActive ? "scale-[1.02]" : "scale-100"}`}
                >
                  <div
                    className={`bg-card/80 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-500 ${
                      isActive
                        ? "border-primary/30 shadow-xl shadow-primary/10"
                        : "border-border/50 shadow-md"
                    }`}
                  >
                    <span className="font-body text-xs tracking-[0.3em] uppercase text-gold font-medium">
                      {milestone.date}
                    </span>
                    <h3 className="font-elegant text-xl md:text-2xl text-foreground mt-2 mb-3">
                      {milestone.title}
                    </h3>
                    <p className="font-body text-muted-foreground text-sm leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* End heart */}
          <div className="flex justify-center pt-4">
            <Heart className="w-6 h-6 text-primary fill-primary/50 animate-heartbeat" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemoryTimeline;
