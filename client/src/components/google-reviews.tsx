import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    content: "This tool helped me identify gaps in my resume. Got 3 interviews within a week!",
    rating: 5,
    avatar: "SJ",
  },
  {
    name: "Michael Chen",
    role: "Product Manager",
    content: "AI recommendations are incredibly accurate. Boosted my ATS score from 67 to 94!",
    rating: 5,
    avatar: "MC",
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director",
    content: "Simple, fast, and effective. No signup, just instant results. Perfect!",
    rating: 5,
    avatar: "ER",
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function GoogleReviews() {
  return (
    <section id="reviews" className="py-24 bg-gradient-to-b from-background via-primary/8 to-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        {/* Section Header */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl lg:text-6xl font-black text-white mb-6 uppercase tracking-widest">
            Trusted by Job Seekers
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-primary text-primary" />
            ))}
          </div>
          <p className="text-lg text-gray-300 font-black uppercase tracking-wide">
            4.9/5 from 2,500+ Users
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 mb-12"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(29, 191, 115, 0.2)" }}
            >
              <Card className="bg-card/70 backdrop-blur-sm border border-primary/25 rounded-2xl shadow-md hover:shadow-lg transition-all h-full">
                <CardContent className="p-6">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-200 text-sm leading-relaxed mb-6 line-clamp-4 font-semibold">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-primary/20">
                    <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center font-black text-primary text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-black text-white text-sm uppercase">{testimonial.name}</p>
                      <p className="text-xs text-gray-400 font-semibold">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Card */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Card className="max-w-2xl mx-auto bg-card/70 backdrop-blur-sm border border-primary/25 rounded-2xl shadow-md">
            <CardContent className="py-12 px-8 text-center">
              <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-wide">
                Share Your Experience
              </h3>
              <p className="text-gray-300 mb-8 font-semibold">
                Help others discover this tool by leaving a review
              </p>
              <Button 
                size="lg"
                className="rounded-lg"
                data-testid="button-leave-review"
              >
                <Star className="w-5 h-5 mr-2" />
                Leave a Review
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
