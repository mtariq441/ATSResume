import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Download, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ScoreCircle } from "@/components/score-circle";
import { ScoreBreakdownChart } from "@/components/score-breakdown-chart";
import type { AnalysisResult } from "@shared/schema";
import { useState } from "react";

export default function Results() {
  const [, params] = useRoute("/results/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());

  const { data: result, isLoading } = useQuery<AnalysisResult>({
    queryKey: ["/api/analysis", params?.id],
    enabled: !!params?.id,
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItems(new Set(copiedItems).add(label));
    setTimeout(() => {
      setCopiedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(label);
        return newSet;
      });
    }, 2000);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Skeleton className="h-10 w-32 mb-8" />
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Skeleton className="h-[400px] w-full" />
              <Skeleton className="h-[300px] w-full" />
            </div>
            <Skeleton className="h-[700px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle data-testid="heading-not-found">Analysis Not Found</CardTitle>
            <CardDescription data-testid="text-not-found-description">This analysis does not exist or has expired.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/")} data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
          <Button variant="outline" data-testid="button-export-pdf">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Score Section */}
          <div className="space-y-6">
            {/* Overall Score Card */}
            <Card className="backdrop-blur-sm bg-card/50 border-card-border">
              <CardHeader>
                <CardTitle className="text-2xl" data-testid="heading-match-score">ATS Match Score</CardTitle>
                <CardDescription data-testid="text-match-score-description">How well your resume matches the job description</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center py-8">
                <ScoreCircle score={result.match_score} />
                <div className="mt-6 text-center">
                  <Badge
                    variant={getScoreBadgeVariant(result.match_score)}
                    className="text-base px-4 py-1"
                    data-testid="badge-score-level"
                  >
                    {result.match_score >= 80 ? "Excellent Match" : result.match_score >= 60 ? "Good Match" : "Needs Improvement"}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-4 max-w-md" data-testid="text-summary">
                    {result.one_sentence_summary}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Score Breakdown Card */}
            <Card className="backdrop-blur-sm bg-card/50 border-card-border">
              <CardHeader>
                <CardTitle data-testid="heading-score-breakdown">Score Breakdown</CardTitle>
                <CardDescription data-testid="text-breakdown-description">Detailed analysis of each category</CardDescription>
              </CardHeader>
              <CardContent>
                <ScoreBreakdownChart breakdown={result.score_breakdown} />
                <div className="mt-6 space-y-3">
                  {Object.entries(result.score_breakdown).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className={`font-mono font-semibold ${getScoreColor(value)}`} data-testid={`score-${key}`}>
                        {value}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recommendations */}
          <Card className="backdrop-blur-sm bg-card/50 border-card-border">
            <CardHeader>
              <CardTitle className="text-2xl" data-testid="heading-recommendations">Recommendations</CardTitle>
              <CardDescription data-testid="text-recommendations-description">Actionable improvements to boost your score</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="keywords" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="keywords" data-testid="tab-keywords">Missing Keywords</TabsTrigger>
                  <TabsTrigger value="bullets" data-testid="tab-bullets">Add Bullets</TabsTrigger>
                  <TabsTrigger value="improve" data-testid="tab-improve">Improve</TabsTrigger>
                </TabsList>

                {/* Missing Keywords Tab */}
                <TabsContent value="keywords" className="space-y-6">
                  {Object.entries(result.missing_keywords).map(([category, keywords]) => (
                    <div key={category}>
                      <h4 className="font-semibold mb-3 text-base" data-testid={`heading-category-${category.toLowerCase().replace(/\s+/g, '-')}`}>{category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {keywords.map((keyword, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="cursor-pointer hover-elevate"
                            onClick={() => copyToClipboard(keyword, `keyword-${category}-${idx}`)}
                            data-testid={`keyword-${category}-${idx}`}
                          >
                            {copiedItems.has(`keyword-${category}-${idx}`) ? (
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                            ) : (
                              <Copy className="w-3 h-3 mr-1" />
                            )}
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </TabsContent>

                {/* New Bullets Tab */}
                <TabsContent value="bullets" className="space-y-4">
                  {result.new_bullet_points_to_add.map((bullet, idx) => (
                    <Card key={idx} className="p-4 hover-elevate">
                      <p className="text-sm leading-relaxed mb-3" data-testid={`bullet-new-${idx}`}>{bullet}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(bullet, `bullet-${idx}`)}
                        data-testid={`button-copy-bullet-${idx}`}
                      >
                        {copiedItems.has(`bullet-${idx}`) ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 mr-2" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                    </Card>
                  ))}
                </TabsContent>

                {/* Improve Tab */}
                <TabsContent value="improve" className="space-y-6">
                  {result.bullets_to_rephrase.map((bullet, idx) => (
                    <div key={idx}>
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Before</h4>
                        <Card className="p-4 bg-destructive/5 border-destructive/20">
                          <p className="text-sm" data-testid={`text-original-bullet-${idx}`}>{bullet.original}</p>
                        </Card>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">After</h4>
                        <Card className="p-4 bg-success/5 border-success/20 hover-elevate">
                          <p className="text-sm leading-relaxed mb-3" data-testid={`text-improved-bullet-${idx}`}>
                            {bullet.improved}
                          </p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(bullet.improved, `improved-${idx}`)}
                            data-testid={`button-copy-improved-${idx}`}
                          >
                            {copiedItems.has(`improved-${idx}`) ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 mr-2" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 mr-2" />
                                Copy Improved Version
                              </>
                            )}
                          </Button>
                        </Card>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
