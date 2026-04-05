import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isBirthday, setIsBirthday] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      
      let birthdayDate = new Date(currentYear, 9, 1);
      
      if (now > birthdayDate) {
        birthdayDate = new Date(currentYear + 1, 9, 1);
      }

      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const birthdayThisYear = new Date(currentYear, 9, 1);
      
      if (today.getTime() === birthdayThisYear.getTime()) {
        setIsBirthday(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const difference = birthdayDate.getTime() - now.getTime();
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isBirthday) {
    return (
      <div className="text-center animate-fade-in-up">
        <h2 className="font-script text-5xl md:text-7xl text-primary mb-4 animate-heartbeat">
          🎂 Happy Birthday! 🎂
        </h2>
        <p className="font-elegant text-xl text-muted-foreground italic">
          Today is your special day, my love!
        </p>
      </div>
    );
  }

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center group">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl group-hover:bg-primary/20 transition-colors duration-500" />
        
        <div className="relative luxury-card p-4 md:p-6 min-w-[75px] md:min-w-[110px] border-rose-medium/40 group-hover:border-gold/40 transition-colors duration-300">
          <span className="font-heading text-3xl md:text-5xl font-semibold text-primary block">
            {String(value).padStart(2, '0')}
          </span>
        </div>
      </div>
      <span className="mt-3 text-xs md:text-sm text-muted-foreground font-body tracking-[0.2em] uppercase">
        {label}
      </span>
    </div>
  );

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="w-8 h-px bg-gradient-to-r from-transparent to-gold/50" />
        <Heart className="w-4 h-4 text-primary fill-primary/50" />
        <p className="font-body text-muted-foreground tracking-[0.3em] uppercase text-xs">
          Countdown to Your Day
        </p>
        <Heart className="w-4 h-4 text-primary fill-primary/50" />
        <div className="w-8 h-px bg-gradient-to-l from-transparent to-gold/50" />
      </div>
      
      <div className="flex justify-center gap-3 md:gap-5">
        <TimeBlock value={timeLeft.days} label="Days" />
        <div className="flex items-center text-primary/30 font-heading text-2xl md:text-4xl pt-2">:</div>
        <TimeBlock value={timeLeft.hours} label="Hours" />
        <div className="flex items-center text-primary/30 font-heading text-2xl md:text-4xl pt-2">:</div>
        <TimeBlock value={timeLeft.minutes} label="Mins" />
        <div className="flex items-center text-primary/30 font-heading text-2xl md:text-4xl pt-2">:</div>
        <TimeBlock value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  );
};

export default CountdownTimer;
