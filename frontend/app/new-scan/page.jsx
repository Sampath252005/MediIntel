import React from "react";

const page = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Upload New Scan</h1>

      <div className="border p-6 rounded-lg bg-white">
        <input type="file" className="mb-4" />

        <textarea
          placeholder="Add annotations..."
          className="w-full border p-2 rounded h-24"
        />

        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded">
          Submit
        </button>
      </div>
    </div>
  );
};

export default page;
