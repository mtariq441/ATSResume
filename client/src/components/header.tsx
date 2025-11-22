import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const successStories = [
  { name: "Steve Johnson", score: 97, company: "Google", position: "Senior Software Engineer" },
  { name: "Sarah Chen", score: 94, company: "Meta", position: "Product Manager" },
  { name: "Michael Rodriguez", score: 96, company: "Apple", position: "AI/ML Engineer" },
  { name: "Emily Watson", score: 98, company: "Microsoft", position: "Cloud Architect" },
  { name: "David Kim", score: 95, company: "Amazon", position: "Systems Engineer" },
  { name: "Jessica Lee", score: 99, company: "Tesla", position: "Data Scientist" },
];

export function Header() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % successStories.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoplay]);

  const current = successStories[currentIndex];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background border-b border-primary/20"
    >
      {/* Success Stories Section */}
      <div className="bg-primary/8 border-b border-primary/15">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 py-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-0.5"
            >
              <p className="text-sm font-black text-white uppercase tracking-wider">
                {current.name} scored {current.score}
              </p>
              <p className="text-xs text-gray-300">
                Now at <span className="text-primary font-black">{current.company}</span> • <span className="text-primary font-black">{current.position}</span>
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-2.5">
            {successStories.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setAutoplay(false);
                }}
                className={`rounded-full transition-all ${
                  idx === currentIndex ? "bg-primary w-6 h-1" : "bg-primary/25 w-1 h-1"
                }`}
                whileHover={{ scale: 1.2 }}
                data-testid={`dot-${idx}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="px-6 lg:px-16 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className="flex items-center gap-2.5" data-testid="link-logo">
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Sparkles className="w-5 h-5 text-primary" />
              </motion.div>
              <span className="text-white font-black text-sm uppercase tracking-wider hidden sm:block">ATS Analyzer</span>
            </Link>
          </motion.div>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-12">
            <Link href="/" className="text-xs font-black text-gray-400 hover:text-primary transition-colors uppercase" data-testid="link-home">
              Home
            </Link>
            <Link href="/#reviews" className="text-xs font-black text-gray-400 hover:text-primary transition-colors uppercase" data-testid="link-reviews">
              Reviews
            </Link>
            <Link href="/" className="text-xs font-black text-gray-400 hover:text-primary transition-colors uppercase" data-testid="link-features">
              Features
            </Link>
          </div>

          {/* Try Free Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/">
              <Button size="sm" className="font-black px-6 rounded-full uppercase text-xs tracking-wide" data-testid="button-try-free">
                Try Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
