import React from "react";
import {scans} from "../../components/DummyData"
const scanReport = () => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {/* LEFT COLUMN — Image */}
      <div className="col-span-2">
        <img src={scans.image} className="rounded-lg border" />
      </div>

      {/* RIGHT COLUMN — Analysis */}
      <div>
        <h2 className="text-xl font-bold mb-2">{scans.label}</h2>
        <p>Probability: {(scans.probability * 100).toFixed(1)}%</p>

        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default scanReport;
