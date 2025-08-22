"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { drugInteractionChecker, type DrugInteractionCheckerOutput } from "@/ai/flows/drug-interaction-checker";
import { PageHeader } from "@/components/page-header";
import { Loader2, Plus, X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DrugCheckerPage() {
  const [medications, setMedications] = useState<string[]>([""]);
  const [result, setResult] = useState<DrugInteractionCheckerOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleMedicationChange = (index: number, value: string) => {
    const newMedications = [...medications];
    newMedications[index] = value;
    setMedications(newMedications);
  };

  const addMedicationInput = () => {
    setMedications([...medications, ""]);
  };

  const removeMedicationInput = (index: number) => {
    const newMedications = medications.filter((_, i) => i !== index);
    setMedications(newMedications);
  };

  const handleCheckInteractions = async () => {
    const filteredMeds = medications.filter(med => med.trim() !== "");
    if (filteredMeds.length < 2) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please enter at least two medications to check.",
      });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const output = await drugInteractionChecker({ medications: filteredMeds });
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to check interactions. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-8 py-8">
      <PageHeader
        title="Drug Interaction Checker"
        description="Enter a list of medications to check for potentially harmful interactions."
      />
      <Card>
        <CardHeader>
          <CardTitle>Enter Medications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {medications.map((med, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder={`Medication ${index + 1}`}
                  value={med}
                  onChange={(e) => handleMedicationChange(index, e.target.value)}
                />
                <Button variant="ghost" size="icon" onClick={() => removeMedicationInput(index)} disabled={medications.length === 1}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={addMedicationInput}>
              <Plus className="mr-2 h-4 w-4" /> Add Medication
            </Button>
            <Button onClick={handleCheckInteractions} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Checking..." : "Check Safety"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Alert variant={result.safe ? "default" : "destructive"} className={result.safe ? 'border-green-500 bg-green-50' : ''}>
          {result.safe ? (
             <CheckCircle2 className="h-4 w-4" color="#66BB6A" />
          ) : (
             <AlertTriangle className="h-4 w-4" />
          )}
          <AlertTitle>{result.safe ? "Safe to Use" : "Interaction Warning"}</AlertTitle>
          <AlertDescription>
            {result.warnings.length > 0 ? (
              <ul className="list-disc space-y-1 pl-5">
                {result.warnings.map((warning, index) => <li key={index}>{warning}</li>)}
              </ul>
            ) : (
              "No significant interactions were found. Always consult your doctor."
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
