"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  // const [students, setStudents] = useState([]);
  // const [name, setName] = useState("");
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const router = useRouter();

  // useEffect(() => {
  //   getStudents();
  // }, []);

  // const getStudents = async () => {
  // try {
  //   let response = await fetch("http://localhost:8000/student", {
  //     method: "GET",
  //     credentials: "include",
  //   });

  //   console.log(response);

  //   if (response.status === 403 || response.status === 401) {
  //     const refreshRes = await fetch("http://localhost:8000/refresh", {
  //       method: "POST",
  //       credentials: "include",
  //     });

  //     if (!refreshRes.ok) {
  //       console.warn("Refresh token invalid or expired");
  //       router.push("/login");
  //       return;
  //     }

  //     response = await fetch("http://localhost:8000/student", {
  //       method: "GET",
  //       credentials: "include",
  //     });
  //   }

  //   if (!response.ok) {
  //     const errorData = await response.json().catch(() => null);
  //     const message = errorData?.message || "Failed to fetch students";
  //     setError(message);
  //     return;
  //   }

  //   const data = await response.json();
  //   setStudents(data);
  // } catch (err) {
  //   setError("Network or server error");
  // } finally {
  //   setLoading(false);
  // }
  // };

  // const addStudent = async (e) => {
  //   e.preventDefault();

  //   if (!name) {
  //     setError("Please provide name");
  //     return;
  //   }

  //   try {
  //     const response = await fetch("http://localhost:8000/student", {
  //       method: "POST",
  //       credentials: "include",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         id: 4,
  //         name,
  //       }),
  //     });

  //     if (response.status === 403) {
  //       const refreshRes = await fetch("http://localhost:8000/refresh", {
  //         method: "POST",
  //         credentials: "include",
  //       });

  //       if (!refreshRes.ok) {
  //         router.push("/login");
  //         return;
  //       }

  //       await addStudent(e); // retry
  //       return;
  //     }

  //     if (!response.ok) {
  //       const data = await response.json().catch(() => null);
  //       const message = data?.message || "Failed to add student";
  //       setError(message);
  //       return;
  //     }

  //     setName("");
  //     setError(null);
  //     await getStudents(); // Refresh list
  //   } catch (err) {
  //     console.error("Add student error:", err);
  //     setError("Failed to add student due to network/server error");
  //   }
  // };

  // const logout = async () => {
  //   try {
  //     const res = await fetch("http://localhost:8000/logout", {
  //       method: "POST",
  //       credentials: "include",
  //     });

  //     if (res.ok) {
  //       router.push("/login");
  //     } else {
  //       const data = await res.json().catch(() => null);
  //       const message = data?.message || "Failed to logout";
  //       setError(message);
  //     }
  //   } catch (err) {
  //     setError("Logout failed due to network/server error");
  //   }
  // };


  return (
    // <div className="p-4 text-gray-900 dark:text-white">
    //   <div className="flex justify-between items-center mb-4">
    //     <h1 className="text-2xl font-bold">Student List</h1>
    //     <button
    //       onClick={logout}
    //       className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    //     >
    //       Logout
    //     </button>
    //   </div>

    //   <form onSubmit={addStudent} className="mb-6 space-y-4">
    //     <div>
    //       <label className="block mb-1">Name</label>
    //       <input
    //         type="text"
    //         value={name}
    //         onChange={(e) => setName(e.target.value)}
    //         className="w-full px-3 py-2 border rounded dark:bg-gray-700"
    //       />
    //     </div>

    //     <button
    //       type="submit"
    //       className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    //     >
    //       Add Student
    //     </button>
    //   </form>

    //   {loading && <p>Loading students...</p>}
    //   {error && <p className="text-red-500">{error}</p>}

    //   {!loading && students.length === 0 && (
    //     <p className="text-gray-500">No students found.</p>
    //   )}

    //   <ul className="space-y-4">
    //     {students.map((student) => (
    //       <li
    //         key={student.id}
    //         className="border rounded p-4 bg-white dark:bg-gray-800 shadow"
    //       >
    //         <p><strong>ID:</strong> {student.id}</p>
    //         <p><strong>Name:</strong> {student.name}</p>
    //       </li>
    //     ))}
    //   </ul>
    // </div>
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">AI Medical Scan Analyzer</h1>
      <p className="text-gray-600 mb-6">Upload → Analyze → Compare → Export</p>

      <div
        onClick={()=>router.push("/dashBoard")}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
      >
        Get Started
      </div>
    </div>
  );
}
