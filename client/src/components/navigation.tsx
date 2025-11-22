import { Link } from "wouter";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Navigation() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-20 z-50 bg-background/95 backdrop-blur-md border-b border-primary/20"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className="flex items-center gap-2.5" data-testid="link-logo">
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Sparkles className="w-5 h-5 text-primary" />
              </motion.div>
              <span className="text-white font-black text-base uppercase tracking-wider hidden sm:block">ATS Analyzer</span>
            </Link>
          </motion.div>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-xs font-black text-gray-400 hover:text-white transition-colors uppercase" data-testid="link-home">
              Home
            </Link>
            <Link href="/#reviews" className="text-xs font-black text-gray-400 hover:text-white transition-colors uppercase" data-testid="link-reviews">
              Reviews
            </Link>
            <Link href="/" className="text-xs font-black text-gray-400 hover:text-white transition-colors uppercase" data-testid="link-features">
              Features
            </Link>
          </div>

          {/* Right CTA */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/">
              <Button size="sm" className="font-black px-6 rounded-full uppercase text-xs tracking-wide" data-testid="button-try-free">
                Try Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
