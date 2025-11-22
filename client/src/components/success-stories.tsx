import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const successStories = [
  { name: "Steve Johnson", score: 97, company: "Google", position: "Senior Software Engineer" },
  { name: "Sarah Chen", score: 94, company: "Meta", position: "Product Manager" },
  { name: "Michael Rodriguez", score: 96, company: "Apple", position: "AI/ML Engineer" },
  { name: "Emily Watson", score: 98, company: "Microsoft", position: "Cloud Architect" },
  { name: "David Kim", score: 95, company: "Amazon", position: "Systems Engineer" },
  { name: "Jessica Lee", score: 99, company: "Tesla", position: "Data Scientist" },
];

export function SuccessStories() {
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-primary/10 border-b border-primary/20"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-1"
          >
            <p className="text-sm lg:text-base font-black text-white uppercase tracking-wide">
              {current.name} scored {current.score} on ATS analyzer
            </p>
            <p className="text-xs lg:text-sm text-gray-300">
              Got hired at <span className="text-primary font-black">{current.company}</span> as <span className="text-primary font-black">{current.position}</span>
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-3">
          {successStories.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setAutoplay(false);
              }}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex ? "bg-primary w-8" : "bg-primary/30 w-1.5"
              }`}
              whileHover={{ scale: 1.2 }}
              data-testid={`dot-${idx}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
