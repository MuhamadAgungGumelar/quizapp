"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import withAuth from "../../components/withAuth";

function ResultsPage() {
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch username from localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    // Fetch score and answers from localStorage
    const savedScore = localStorage.getItem(`${storedUsername}_score`);
    const savedAnswers = localStorage.getItem(`${storedUsername}_userAnswers`);

    if (savedScore !== null) setScore(Number(savedScore));
    if (savedAnswers !== null) setUserAnswers(JSON.parse(savedAnswers));
  }, []);

  const handleRetry = () => {
    localStorage.removeItem(`${username}_currentQuestionIndex`); // Reset soal ke awal
    localStorage.removeItem(`${username}_score`);
    localStorage.removeItem(`${username}_timer`); // Reset timer ke nilai awal
    localStorage.removeItem(`${username}_userAnswers`);
    localStorage.removeItem("cachedQuestions"); // Optional: Remove cached questions if needed

    router.push("/quiz");
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all items from localStorage
    router.push("/login"); // Redirect to login page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Quiz Results</h1>
      {username && <p className="mb-4">Logged in as: {username}</p>}
      <p className="mb-4">Your Score: {score}</p>
      <button
        onClick={handleRetry}
        className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 mb-2"
      >
        Try Again
      </button>
      <button
        onClick={handleLogout}
        className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}

export default withAuth(ResultsPage);
