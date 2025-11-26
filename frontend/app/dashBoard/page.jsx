import React from "react";
import {scans} from "../components/DummyData"

const page = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        {scans.slice(0, 3).map((scan) => (
          <div key={scan.id} className="p-4 border bg-white rounded-lg">
            <img src={scan.image} className="rounded mb-3" />
            <h3 className="font-semibold">{scan.label}</h3>
            <p className="text-gray-500 text-sm">ID: {scan.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
