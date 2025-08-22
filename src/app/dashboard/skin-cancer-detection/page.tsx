"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { analyzeSkinLesion, type SkinCancerAnalysisOutput } from "@/ai/flows/skin-cancer-analysis";
import { PageHeader } from "@/components/page-header";
import { Loader2, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";

export default function SkinCancerDetectionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<SkinCancerAnalysisOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAnalyzeImage = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please upload an image to analyze.",
      });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const imageDataUri = await fileToBase64(file);
      const output = await analyzeSkinLesion({ imageDataUri });
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to analyze the image. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const clearSelection = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-8 py-8">
      <PageHeader
        title="Skin Cancer Detection"
        description="Upload an image of a skin lesion for an AI-powered risk analysis."
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
          <CardDescription>Select a clear photo of the skin lesion.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!preview ? (
            <div className="flex h-48 w-full items-center justify-center rounded-md border-2 border-dashed">
              <label htmlFor="file-upload" className="flex cursor-pointer flex-col items-center gap-2 text-muted-foreground">
                <UploadCloud className="h-8 w-8" />
                <span>Drag & drop or click to upload</span>
              </label>
              <input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
            </div>
          ) : (
            <div className="relative h-64 w-full">
              <Image src={preview} alt="Image preview" layout="fill" objectFit="contain" className="rounded-md" />
              <Button variant="destructive" size="icon" className="absolute right-2 top-2 h-7 w-7" onClick={clearSelection}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Button onClick={handleAnalyzeImage} disabled={!file || loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Analyzing..." : "Analyze Image"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
                <div className="mb-1 flex justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Cancer Probability</span>
                    <span className="text-lg font-bold text-primary">{(result.cancerProbability * 100).toFixed(1)}%</span>
                </div>
                <Progress value={result.cancerProbability * 100} />
             </div>
             <div className={`rounded-md p-4 ${result.cancerProbability > 0.5 ? 'bg-destructive/10 text-destructive' : 'bg-accent/20 text-accent-foreground'}`}>
                <h4 className="font-semibold">Recommendation</h4>
                <p>{result.recommendation}</p>
             </div>
             <p className="text-xs text-muted-foreground">
              Disclaimer: This is an AI-powered analysis and not a substitute for a professional medical diagnosis. Please consult a dermatologist.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
