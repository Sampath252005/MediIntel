import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import React from "react";

interface FeatureCardProps {
  icon: React.ReactElement;
  title: string;
  description: string;
  href: string;
}

export function FeatureCard({ icon, title, description, href }: FeatureCardProps) {
  return (
    <Link href={href} className="group block">
      <Card className="h-full transition-all duration-200 hover:border-primary hover:shadow-lg">
        <CardHeader>
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              {React.cloneElement(icon, { className: "h-6 w-6" })}
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary" />
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
