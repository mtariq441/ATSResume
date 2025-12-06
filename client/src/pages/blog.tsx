import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Search, Calendar, User, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  readTime: number;
  image: string;
  slug: string;
  seoKeywords: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "How to Optimize Your Resume for ATS Systems in 2025",
    excerpt: "Learn the essential strategies to make your resume pass through Applicant Tracking Systems and land more interviews.",
    content: `Applicant Tracking Systems (ATS) are used by 98% of Fortune 500 companies to screen resumes. Understanding how to optimize your resume for ATS can significantly increase your chances of getting interviews.

## What is an ATS?

An Applicant Tracking System is software that parses resumes and job applications to filter candidates based on specific criteria. It analyzes your resume for keywords, formatting, and relevant experience.

## Key ATS Optimization Tips

### 1. Use Standard Formatting
- Stick to simple fonts like Arial, Calibri, or Times New Roman
- Avoid tables, graphics, and complex layouts
- Use standard bullet points instead of special characters
- Keep margins between 0.5 and 1 inch

### 2. Incorporate Relevant Keywords
- Mirror keywords from the job description
- Use industry-specific terminology
- Include both hard skills and soft skills
- Repeat important keywords naturally throughout

### 3. Optimize Your Contact Information
- Include full name, phone number, and email
- Add LinkedIn URL and portfolio link
- Use a professional email address
- Include city and state (not full address)

### 4. Structure Your Experience Clearly
- Use clear section headers (Experience, Education, Skills)
- List job titles, company names, and dates
- Start bullet points with action verbs
- Quantify achievements with numbers and percentages

### 5. Include a Skills Section
- List technical and soft skills
- Prioritize skills mentioned in the job description
- Use industry-standard terminology
- Keep skills relevant to your target role

## Common ATS Mistakes to Avoid

- Using headers and footers
- Including images or logos
- Using PDF format (when not requested)
- Submitting as a scanned image
- Using unusual fonts or colors
- Including graphics or tables
- Using special characters or symbols

## The Bottom Line

By following these ATS optimization strategies, you can ensure your resume reaches human recruiters and increases your chances of landing interviews. Remember, the goal is to make your resume both ATS-friendly and compelling to hiring managers.`,
    author: "Sarah Johnson",
    date: "2025-12-06",
    category: "Resume Tips",
    tags: ["ATS", "Resume", "Job Search", "Career"],
    readTime: 8,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
    slug: "optimize-resume-ats-2025",
    seoKeywords: ["ATS resume optimization", "applicant tracking system", "resume tips", "job search"],
  },
  {
    id: "2",
    title: "Top 10 Keywords Every Resume Should Include",
    excerpt: "Discover the most powerful keywords that will make your resume stand out to recruiters and ATS systems.",
    content: `Keywords are the foundation of ATS optimization. Including the right keywords in your resume can dramatically improve your chances of being selected for interviews.

## Why Keywords Matter

Recruiters and ATS systems search for specific keywords when screening resumes. By including these keywords, you increase the likelihood of your resume being found and selected.

## Top 10 Resume Keywords by Industry

### Technology
- Full-stack development
- Cloud computing (AWS, Azure, GCP)
- Machine learning
- DevOps
- API development
- Database management
- Agile/Scrum
- CI/CD pipelines

### Business & Management
- Project management
- Strategic planning
- Budget management
- Team leadership
- Process improvement
- Business analysis
- Stakeholder management
- Performance metrics

### Marketing & Sales
- Digital marketing
- SEO/SEM
- Content marketing
- Lead generation
- Sales pipeline
- Customer acquisition
- Analytics
- Brand management

### Finance & Accounting
- Financial analysis
- Budgeting
- Accounting principles
- Tax compliance
- Audit
- Financial reporting
- Risk management
- Forecasting

## How to Incorporate Keywords

1. **Match the Job Description**: Extract keywords from the job posting
2. **Use Natural Language**: Incorporate keywords naturally in your experience descriptions
3. **Repeat Strategically**: Use keywords multiple times throughout your resume
4. **Vary Your Language**: Use synonyms and related terms
5. **Prioritize Placement**: Include keywords in your summary and early sections

## Measuring Keyword Success

Track which keywords lead to interviews and adjust your resume accordingly. Use tools like ATSResume to analyze your resume's keyword match percentage.`,
    author: "Michael Chen",
    date: "2025-12-05",
    category: "Career Advice",
    tags: ["Keywords", "Resume", "Job Search", "ATS"],
    readTime: 6,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop",
    slug: "top-keywords-resume",
    seoKeywords: ["resume keywords", "ATS keywords", "job search keywords"],
  },
  {
    id: "3",
    title: "The Complete Guide to Resume Formatting for Success",
    excerpt: "Master the art of resume formatting to create a document that impresses both ATS systems and human recruiters.",
    content: `Your resume's formatting is just as important as its content. A well-formatted resume can make the difference between getting an interview and being overlooked.

## Resume Formatting Best Practices

### Font Selection
- Use readable fonts: Arial, Calibri, Helvetica, or Times New Roman
- Font size: 10-12 points for body text
- Avoid decorative or script fonts
- Keep font consistent throughout

### Spacing and Margins
- Use 0.5 to 1-inch margins
- Single space within sections
- Double space between sections
- Consistent spacing throughout

### Length Guidelines
- One page for entry-level candidates
- Two pages for mid-career professionals
- Three pages maximum for senior executives
- Remove old or irrelevant experience

### Section Organization
1. Contact Information
2. Professional Summary or Objective
3. Experience
4. Education
5. Skills
6. Certifications (if applicable)
7. Additional sections (Publications, Volunteer Work, etc.)

## Color and Design Considerations

- Use black text on white background
- Avoid colored backgrounds or text
- Keep design minimal and professional
- Use bold and italics sparingly
- Avoid graphics, images, and logos

## File Format Recommendations

- **Best**: Microsoft Word (.docx)
- **Good**: PDF (if requested)
- **Avoid**: Google Docs, Pages, or other formats
- **Never**: Scanned images or pictures

## Common Formatting Mistakes to Avoid

- Inconsistent spacing
- Multiple fonts
- Excessive use of bold/italics
- Colored text or backgrounds
- Complex tables or columns
- Headers and footers
- Unusual bullet points

## Testing Your Resume

1. Save as PDF and check formatting
2. Open in different programs
3. Print and review
4. Have others review
5. Use ATS checker tools

By following these formatting guidelines, you'll create a resume that passes ATS systems and looks professional to human recruiters.`,
    author: "Emily Rodriguez",
    date: "2025-12-04",
    category: "Resume Tips",
    tags: ["Formatting", "Resume", "Design", "ATS"],
    readTime: 7,
    image: "https://images.unsplash.com/photo-1586281380349-2be2f8c942f3?w=800&h=400&fit=crop",
    slug: "resume-formatting-guide",
    seoKeywords: ["resume formatting", "resume design", "ATS formatting"],
  },
  {
    id: "4",
    title: "How to Write a Compelling Professional Summary",
    excerpt: "Learn how to craft a professional summary that captures recruiter attention and improves your ATS score.",
    content: `Your professional summary is the first thing recruiters read. It needs to be compelling, keyword-rich, and tailored to the job you're applying for.

## What is a Professional Summary?

A professional summary is a 2-3 sentence statement at the top of your resume that highlights your key qualifications, experience, and career goals.

## Key Elements of a Strong Summary

### 1. Years of Experience
- Specify your years in the field
- Highlight relevant experience
- Mention specialized expertise

### 2. Key Achievements
- Quantify your accomplishments
- Use metrics and percentages
- Show impact and results

### 3. Core Competencies
- List 3-5 key skills
- Match job description keywords
- Highlight unique strengths

### 4. Career Goal
- Align with the target position
- Show enthusiasm for the role
- Demonstrate career progression

## Professional Summary Examples

### Example 1: Software Engineer
"Experienced Full-Stack Developer with 5+ years building scalable web applications using React, Node.js, and AWS. Proven track record of delivering projects 20% ahead of schedule while maintaining 99.9% uptime. Seeking Senior Developer role to lead technical initiatives and mentor junior developers."

### Example 2: Marketing Manager
"Results-driven Marketing Manager with 7+ years driving brand growth and customer acquisition. Led campaigns generating $2M+ in revenue and 40% increase in market share. Expert in digital marketing, SEO, and data analytics. Looking to leverage expertise in strategic marketing leadership."

### Example 3: Data Analyst
"Detail-oriented Data Analyst with 4+ years transforming complex data into actionable insights. Proficient in SQL, Python, and Tableau. Delivered 15+ analytics projects improving operational efficiency by 30%. Seeking Data Science role to apply advanced analytics skills."

## Tips for Writing Your Summary

1. **Be Specific**: Use concrete numbers and achievements
2. **Use Keywords**: Include industry-specific terms
3. **Keep It Concise**: 2-3 sentences maximum
4. **Tailor It**: Customize for each job application
5. **Show Value**: Focus on what you bring to the employer
6. **Use Action Words**: Start with strong verbs
7. **Highlight Uniqueness**: What sets you apart?

## Common Mistakes to Avoid

- Being too generic
- Using clichés or overused phrases
- Making it too long
- Focusing on what you want instead of what you offer
- Using weak language
- Not including metrics
- Ignoring job description keywords

## Optimizing for ATS

- Include relevant keywords naturally
- Use industry terminology
- Mention specific tools and technologies
- Quantify achievements
- Keep formatting simple

Your professional summary is your chance to make a strong first impression. Make it count!`,
    author: "David Park",
    date: "2025-12-03",
    category: "Resume Tips",
    tags: ["Professional Summary", "Resume", "Career", "Writing"],
    readTime: 6,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
    slug: "professional-summary-guide",
    seoKeywords: ["professional summary", "resume summary", "career summary"],
  },
  {
    id: "5",
    title: "Job Search Strategies That Actually Work in 2025",
    excerpt: "Discover proven job search strategies that will help you land your dream job faster and more efficiently.",
    content: `The job search process has evolved significantly. Here are the strategies that actually work in 2025.

## Modern Job Search Strategies

### 1. Optimize Your Online Presence
- Update LinkedIn profile completely
- Create a personal portfolio website
- Maintain active GitHub profile (for tech roles)
- Use consistent branding across platforms

### 2. Leverage AI-Powered Tools
- Use resume optimization tools like ATSResume
- Leverage job search aggregators
- Use AI to tailor applications
- Automate routine tasks

### 3. Network Strategically
- Attend industry events and conferences
- Join professional associations
- Engage on LinkedIn and Twitter
- Informational interviews with professionals

### 4. Target Your Applications
- Research companies thoroughly
- Customize resume for each position
- Tailor cover letters
- Apply to roles that match your skills

### 5. Use Multiple Channels
- Job boards (LinkedIn, Indeed, Glassdoor)
- Company websites
- Recruiter outreach
- Networking connections
- Industry-specific job boards

## Job Search Timeline

- **Week 1-2**: Prepare resume and materials
- **Week 3-4**: Begin applications
- **Week 5-8**: Interview process
- **Week 9-12**: Negotiation and offer

## Measuring Your Success

- Track applications sent
- Monitor response rates
- Schedule interviews
- Analyze feedback
- Adjust strategy as needed

## Common Job Search Mistakes

- Applying to too many jobs without customization
- Ignoring networking opportunities
- Not following up
- Giving up too early
- Applying only to posted jobs
- Neglecting your online presence

## The Bottom Line

A strategic, multi-channel approach to job searching yields the best results. Combine online applications, networking, and personal branding for maximum success.`,
    author: "Jessica Martinez",
    date: "2025-12-02",
    category: "Job Search",
    tags: ["Job Search", "Career", "Strategy", "2025"],
    readTime: 7,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
    slug: "job-search-strategies-2025",
    seoKeywords: ["job search strategies", "job search tips", "finding a job"],
  },
];

export default function Blog() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get unique categories and tags
  const categories = Array.from(new Set(blogPosts.map(post => post.category)));
  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));

  // Filter posts based on search and filters
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.seoKeywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = !selectedCategory || post.category === selectedCategory;
      const matchesTag = !selectedTag || post.tags.includes(selectedTag);
      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [searchQuery, selectedCategory, selectedTag]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* SEO Meta Tags */}
      <head>
        <title>ATSResume Blog - Resume Tips, Job Search Strategies & Career Advice</title>
        <meta name="description" content="Read expert tips on resume optimization, ATS systems, job search strategies, and career advice. Learn how to land your dream job." />
        <meta name="keywords" content="resume tips, ATS optimization, job search, career advice, resume formatting, keywords" />
        <meta property="og:title" content="ATSResume Blog - Resume & Career Tips" />
        <meta property="og:description" content="Expert advice on resume optimization and job search strategies" />
        <meta property="og:type" content="website" />
      </head>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-primary/80 text-white py-16 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-black mb-4 uppercase tracking-tight">ATSResume Blog</h1>
          <p className="text-xl text-primary-foreground/90">Expert Tips on Resume Optimization, Job Search & Career Success</p>
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-6xl mx-auto px-4 py-12"
      >
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search articles by title, topic, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6 text-lg"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase">Categories</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              size="sm"
            >
              All
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Tag Filter */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                size="sm"
                className="gap-1"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-8">
          Showing {filteredPosts.length} of {blogPosts.length} articles
        </p>
      </motion.div>

      {/* Blog Posts Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-4 pb-20"
      >
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                onClick={() => setLocation(`/blog/${post.slug}`)}
                className="cursor-pointer group"
              >
                <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-black mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.author}
                      </div>
                      <div>{post.readTime} min read</div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Read More Button */}
                    <Button variant="ghost" className="gap-2 p-0 h-auto text-primary group-hover:translate-x-1 transition-transform">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div variants={itemVariants} className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No articles found matching your search.</p>
            <Button onClick={() => {
              setSearchQuery("");
              setSelectedCategory(null);
              setSelectedTag(null);
            }}>
              Clear Filters
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-primary/10 border-t border-primary/20 py-16 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4 uppercase">Ready to Optimize Your Resume?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Use ATSResume to analyze your resume against job descriptions and get AI-powered recommendations.
          </p>
          <Button size="lg" onClick={() => setLocation("/")}>
            Get Started Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
