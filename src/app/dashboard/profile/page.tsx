"use client";

import { PageHeader } from "@/components/page-header";
import { useAuth } from "@/providers/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, FileText, DownloadCloud, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for uploaded files
const uploadedFiles = [
  { name: "Blood Test Results.pdf", date: "2023-10-15", size: "1.2 MB" },
  { name: "X-Ray Scan.jpg", date: "2023-09-22", size: "3.5 MB" },
  { name: "Prescription_Dr_Smith.pdf", date: "2023-09-20", size: "256 KB" },
];

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Profile Management"
        description="View and manage your personal information and documents."
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                <AvatarFallback className="text-3xl">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User />}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <CardTitle>{user.displayName}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
             <Button className="w-full">Edit Profile</Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Your Documents</CardTitle>
              <CardDescription>Upload and manage your medical files.</CardDescription>
            </div>
             <Button>
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload File
             </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{file.date} &middot; {file.size}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <DownloadCloud className="h-5 w-5 text-muted-foreground hover:text-primary" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
