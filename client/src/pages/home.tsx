import { useState, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import { Upload, FileText, Sparkles, CheckCircle2, ArrowRight, Zap, Shield, Clock, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { GoogleReviews } from "@/components/google-reviews";
import type { AnalysisResult } from "@shared/schema";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const floatingVariants = {
  animate: {
    y: [0, -15, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isExtractingText, setIsExtractingText] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let animationFrame: NodeJS.Timeout;
    if (displayScore < 76) {
      animationFrame = setTimeout(() => setDisplayScore(d => Math.min(d + 2, 76)), 20);
    }
    return () => clearTimeout(animationFrame);
  }, [displayScore]);

  const analyzeMutation = useMutation({
    mutationFn: async (data: { resume_text: string; job_description: string; file_name?: string }) => {
      const response = await apiRequest("POST", "/api/analyze", data);
      const result: AnalysisResult = await response.json();
      return result;
    },
    onSuccess: (result) => {
      setLocation(`/results/${result.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze resume. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = useCallback(async (file: File) => {
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
    ];

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, DOC, DOCX, or TXT file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setResumeFile(file);
    setIsExtractingText(true);
    try {
      if (file.type === "text/plain") {
        const extractedText = await file.text();
        setResumeText(extractedText.trim());
        toast({
          title: "Resume Loaded",
          description: `Successfully extracted ${extractedText.trim().length} characters`,
        });
        setIsExtractingText(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      console.log(`Uploading file: ${file.name}, size: ${file.size}, type: ${file.type}`);

      const response = await fetch("/api/extract-text", {
        method: "POST",
        body: formData,
        // Don't set Content-Type header - let the browser set it with the boundary
      });

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        let errorMessage = "Failed to extract text from file";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON, try to get text
          try {
            const text = await response.text();
            console.error("Response text:", text);
          } catch (e2) {
            console.error("Could not read response");
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const extractedText = data.text;

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error("No text could be extracted from the file. The file may be empty or contain only images.");
      }

      setResumeText(extractedText.trim());
      toast({
        title: "Resume Loaded",
        description: `Successfully extracted ${extractedText.trim().length} characters`,
      });
    } catch (error) {
      console.error("Text extraction error:", error);
      const errorMessage = error instanceof Error ? error.message : "Could not extract text from file.";
      toast({
        title: "Extraction Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setResumeFile(null);
    } finally {
      setIsExtractingText(false);
    }
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  }, [handleFileChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleAnalyze = () => {
    if (!resumeText.trim()) {
      toast({
        title: "Resume Required",
        description: "Please upload a resume to analyze",
        variant: "destructive",
      });
      return;
    }

    if (!jobDescription.trim()) {
      toast({
        title: "Job Description Required",
        description: "Please enter a job description",
        variant: "destructive",
      });
      return;
    }

    analyzeMutation.mutate({
      resume_text: resumeText,
      job_description: jobDescription,
      file_name: resumeFile?.name,
    });
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Premium Dark Green Hero */}
      <motion.div
        className="relative pt-32 pb-24 lg:pt-40 lg:pb-32"
        style={{
          background: 'linear-gradient(135deg, rgba(29, 191, 115, 0.1) 0%, rgba(29, 191, 115, 0.05) 50%, transparent 100%)'
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Decorative Blobs */}
        <motion.div
          className="absolute top-10 -right-40 w-96 h-96 bg-primary/15 rounded-full blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, -50, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-16">
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/20 border border-primary/40 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">AI-Powered ATS Matching</span>
            </motion.div>
          </motion.div>

          {/* Main Headline */}
          <motion.div variants={itemVariants} className="text-center mb-12 max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-black tracking-widest leading-tight text-white uppercase mb-4">
              Get Your Resume
              <motion.span
                className="block text-primary font-black mt-2"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                Score Instantly
              </motion.span>
            </h1>

            <p className="text-base lg:text-lg text-gray-300 font-semibold max-w-2xl mx-auto">
              Free ATS checker used by 50,000+ professionals • Beat algorithms in seconds
            </p>
          </motion.div>

          {/* Score Animation */}
          <motion.div variants={itemVariants} className="flex justify-center items-center gap-8 mb-16">
            <div className="text-center">
              <motion.div className="text-5xl lg:text-6xl font-black text-primary">
                {displayScore}%
              </motion.div>
              <p className="text-sm text-gray-400 mt-2 font-medium">Before</p>
            </div>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <ArrowRight className="w-8 h-8 text-primary" />
            </motion.div>
            <div className="text-center">
              <motion.div className="text-5xl lg:text-6xl font-black text-primary">
                96%
              </motion.div>
              <p className="text-sm text-gray-400 mt-2 font-medium">After</p>
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-8 mb-20">
            <div className="flex items-center gap-2.5 text-sm font-semibold text-gray-200">
              <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-primary" />
              </div>
              100% Free
            </div>
            <div className="flex items-center gap-2.5 text-sm font-semibold text-gray-200">
              <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-primary" />
              </div>
              No Sign-up
            </div>
            <div className="flex items-center gap-2.5 text-sm font-semibold text-gray-200">
              <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-primary" />
              </div>
              Private & Secure
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-3 gap-6 mb-24"
          >
            {[
              { icon: Zap, title: "Lightning Fast", desc: "Analysis in seconds" },
              { icon: Shield, title: "100% Secure", desc: "Data never stored" },
              { icon: Lightbulb, title: "AI-Powered", desc: "Smart recommendations" },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(29, 191, 115, 0.2)" }}
                className="bg-card/60 backdrop-blur-sm border border-primary/25 rounded-2xl p-7 text-center shadow-md hover:shadow-lg transition-all"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/25 mb-4 mx-auto">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-black text-white mb-2 uppercase tracking-wide text-lg">{feature.title}</h3>
                <p className="text-sm text-gray-300 font-semibold">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Main CTA Card */}
          <motion.div variants={itemVariants}>
            <Card className="max-w-4xl mx-auto p-8 lg:p-12 bg-card/90 backdrop-blur-sm border border-primary/30 rounded-3xl shadow-2xl">
              <div className="space-y-8">
                {/* Upload Section */}
                <div>
                  <Label className="text-lg font-black mb-4 block text-white uppercase tracking-wide">Upload Your Resume</Label>
                  <motion.div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    role="button"
                    tabIndex={0}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer
                      ${isDragging ? "border-primary bg-primary/25 scale-105" : "border-primary/40 hover:border-primary/60 bg-card/50"}
                      ${resumeFile ? "border-primary/50 bg-primary/15" : ""}
                    `}
                    data-testid="dropzone-resume"
                  >
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                      className="hidden"
                      id="resume-upload"
                      data-testid="input-resume-file"
                    />

                    {!resumeFile ? (
                      <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        <motion.div variants={floatingVariants} animate="animate">
                          <Upload className="w-16 h-16 mx-auto mb-4 text-primary" />
                        </motion.div>
                        <h3 className="text-3xl font-black mb-2 text-white uppercase tracking-wide">DROP YOUR RESUME HERE</h3>
                        <p className="text-base text-gray-300 mb-6 font-semibold">
                          or click to browse (PDF, DOC, DOCX, TXT)
                        </p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="lg"
                            className="px-8 font-semibold rounded-lg"
                            onClick={() => document.getElementById("resume-upload")?.click()}
                            data-testid="button-browse-resume"
                          >
                            Browse Files
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </motion.div>
                        <p className="text-xs text-gray-400 mt-6">
                          Max 10MB • Takes 2-5 seconds
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div variants={itemVariants} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <motion.div
                            className="p-3 rounded-lg bg-primary/25"
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <FileText className="w-8 h-8 text-primary" />
                          </motion.div>
                          <div className="text-left">
                            <p className="font-bold text-white text-sm">{resumeFile.name}</p>
                            <p className="text-xs text-gray-400">
                              {(resumeFile.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setResumeFile(null);
                            setResumeText("");
                          }}
                          data-testid="button-remove-resume"
                        >
                          Change
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                {/* Job Description Section */}
                <div>
                  <Label htmlFor="job-description" className="text-lg font-black mb-4 block text-white uppercase tracking-wide">
                    Paste Job Description
                  </Label>
                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <Textarea
                      id="job-description"
                      placeholder="Paste the job description here for accurate analysis..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="min-h-[160px] resize-none text-sm border-primary/30 rounded-lg bg-card/70 backdrop-blur-sm text-white placeholder:text-gray-500 focus:bg-card"
                      data-testid="textarea-job-description"
                    />
                  </motion.div>
                  <p className="text-xs text-gray-400 mt-3">
                    Include job title, requirements, and responsibilities
                  </p>
                </div>

                {/* Analyze Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    onClick={handleAnalyze}
                    disabled={analyzeMutation.isPending || isExtractingText || !resumeText || !jobDescription}
                    className="w-full text-lg font-bold h-14 rounded-lg"
                    data-testid="button-analyze"
                  >
                    {isExtractingText ? (
                      <>
                        <div className="w-5 h-5 mr-3 border-2 border-background border-t-transparent rounded-full animate-spin" />
                        Extracting...
                      </>
                    ) : analyzeMutation.isPending ? (
                      <>
                        <Sparkles className="w-5 h-5 mr-3 animate-pulse" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Get Your ATS Score
                        <ArrowRight className="w-5 h-5 ml-3" />
                      </>
                    )}
                  </Button>
                </motion.div>

                {/* Progress */}
                {analyzeMutation.isPending && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                    <Progress value={undefined} className="h-2 rounded-full" />
                    <p className="text-xs text-center text-gray-400 animate-pulse">
                      AI analyzing your resume...
                    </p>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Google Reviews Section */}
      <GoogleReviews />
    </div>
  );
}
