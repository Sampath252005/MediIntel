import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const links = [
    { name: "Dashboard", href: "/dashBoard" },
    { name: "New Scan", href: "/new-scan" },
    { name: "History", href: "/history" },
    { name: "Assistant", href: "/assistant" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <aside className="w-60 border-r h-screen p-4 bg-white">
      <h2 className="text-xl font-bold mb-6">Menu</h2>
      <nav className="flex flex-col gap-3">
        {links.map((l) => (
          <span
            key={l.name}
            onClick={() => router.push(l.href)}
            className="hover:text-blue-600 cursor-pointer"
          >
            {l.name}
          </span>
        ))}
      </nav>
    </aside>
  );
}
