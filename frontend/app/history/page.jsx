"use client"
import React from "react";
import { scans } from "../components/DummyData";
import { useRouter } from "next/navigation";
const page = () => {
  const router = useRouter();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Scan History</h1>

      {scans.map((scan) => (
        <div
          key={scan.id}
          onClick={() => router.push(`/scan/${scan.id}`)}
          className="block border bg-white p-4 rounded-lg mb-3"
        >
          <h3 className="font-semibold">{scan.label}</h3>
          <p className="text-sm text-gray-600">{scan.date}</p>
        </div>
      ))}
    </div>
  );
};

export default page;
