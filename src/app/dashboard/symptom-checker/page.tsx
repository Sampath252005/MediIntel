"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { symptomChecker, type SymptomCheckerOutput } from "@/ai/flows/symptom-checker";
import { PageHeader } from "@/components/page-header";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SymptomCheckerPage() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState<SymptomCheckerOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckSymptoms = async () => {
    if (!symptoms.trim()) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please enter your symptoms before checking.",
      });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const output = await symptomChecker({ symptoms });
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to check symptoms. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadgeVariant = (severity: 'mild' | 'moderate' | 'severe'): 'default' | 'secondary' | 'destructive' => {
    switch (severity) {
      case 'mild':
        return 'default'; // Greenish because of accent color
      case 'moderate':
        return 'secondary'; // Yellowish/Grayish
      case 'severe':
        return 'destructive'; // Red
    }
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-8 py-8">
      <PageHeader
        title="Symptom Checker"
        description="Describe your symptoms, and our AI will provide a list of possible conditions."
      />
      <Card>
        <CardHeader>
          <CardTitle>Enter Your Symptoms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g., headache, fever, sore throat..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={5}
            className="resize-none"
          />
          <Button onClick={handleCheckSymptoms} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Analyzing..." : "Check Diagnosis"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Possible Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Disclaimer: This is not a medical diagnosis. Please consult a healthcare professional for accurate advice.
            </p>
            <ul className="space-y-3">
              {result.conditions.map((item, index) => (
                <li key={index} className="flex items-center justify-between rounded-md border p-4">
                  <span className="font-medium">{item.condition}</span>
                  <Badge variant={getSeverityBadgeVariant(item.severity)} className="capitalize">
                    {item.severity}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
