import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-4">
      <h1 className="text-2xl font-bold">Welcome to Quiz App</h1>
      <a
        href="login"
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Login
      </a>
    </main>
  );
}
