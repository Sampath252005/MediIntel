"use client";

import { BotMessageSquare, HeartPulse, Pill, Scan } from "lucide-react";
import { FeatureCard } from "@/components/feature-card";
import { PageHeader } from "@/components/page-header";

const features = [
  {
    icon: <HeartPulse />,
    title: "Symptom Checker",
    description: "Analyze your symptoms to identify possible conditions.",
    href: "/dashboard/symptom-checker",
  },
  {
    icon: <BotMessageSquare />,
    title: "AI Health Chatbot",
    description: "Get instant answers to your health questions from our AI.",
    href: "/dashboard/chatbot",
  },
  {
    icon: <Pill />,
    title: "Drug Interaction Checker",
    description: "Check for harmful interactions between your medications.",
    href: "/dashboard/drug-checker",
  },
  {
    icon: <Scan />,
    title: "Skin Cancer Detection",
    description: "Upload an image of a lesion for an AI-powered risk analysis.",
    href: "/dashboard/skin-cancer-detection",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome back, User!"
        description="Here are your AI-powered tools to help you manage your health."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </div>
  );
}
