import { useState } from "react";
import FloatingHearts from "@/components/FloatingHearts";
import Background3D from "@/components/Background3D";
import CursorHearts from "@/components/CursorHearts";
import HeroSection from "@/components/HeroSection";
import LoveLetter from "@/components/LoveLetter";
import LovePoem from "@/components/LovePoem";
import ReasonsSection from "@/components/ReasonsSection";
import WishesSection from "@/components/WishesSection";
import SurpriseButton from "@/components/SurpriseButton";
import PhotoGallery from "@/components/PhotoGallery";
import Footer from "@/components/Footer";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import MemoryTimeline from "@/components/MemoryTimeline";
import DistanceBetweenUs from "@/components/DistanceBetweenUs";

const Index = () => {
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden scroll-smooth">
      {!hasEntered && <WelcomeOverlay onEnter={() => setHasEntered(true)} />}
      
      <div className={`transition-opacity duration-700 ${hasEntered ? 'opacity-100' : 'opacity-0'}`}>
        <Background3D />
        <CursorHearts />
        <FloatingHearts />
        <HeroSection />
        <MemoryTimeline />
        <DistanceBetweenUs />
        <LoveLetter />
        <LovePoem />
        <ReasonsSection />
        <WishesSection />
        <SurpriseButton />
        <PhotoGallery />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
