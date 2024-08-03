"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import withAuth from "../../components/withAuth";

// Define types for the question and answers
interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface UserAnswers {
  [key: number]: string;
}

function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [timer, setTimer] = useState<number>(60); // 60 seconds
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  // Fetch username from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Fetch questions and user data from localStorage or API
  useEffect(() => {
    if (username) {
      const fetchQuestions = async () => {
        try {
          const cachedQuestions = localStorage.getItem("cachedQuestions");
          if (cachedQuestions) {
            setQuestions(JSON.parse(cachedQuestions));
            setIsLoading(false);
            return;
          }

          const response = await axios.get(
            "https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=boolean"
          );

          setQuestions(response.data.results);
          localStorage.setItem(
            "cachedQuestions",
            JSON.stringify(response.data.results)
          );
          setIsLoading(false);
        } catch (error) {
          console.error(error);
          setError(
            "Failed to load quiz questions due to API rate limits. Please try again later."
          );
          setIsLoading(false);
        }
      };

      fetchQuestions();

      const savedQuestionIndex = localStorage.getItem(
        `${username}_currentQuestionIndex`
      );
      const savedScore = localStorage.getItem(`${username}_score`);
      const savedTimer = localStorage.getItem(`${username}_timer`);
      const savedUserAnswers = localStorage.getItem(`${username}_userAnswers`);

      if (savedQuestionIndex !== null)
        setCurrentQuestionIndex(Number(savedQuestionIndex));
      if (savedScore !== null) setScore(Number(savedScore));
      if (savedTimer !== null) setTimer(Number(savedTimer));
      if (savedUserAnswers !== null)
        setUserAnswers(JSON.parse(savedUserAnswers));
    }
  }, [username]);

  // Handle timer countdown
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(countdown);
            handleSubmit();
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [timer]);

  // Save user data to localStorage
  useEffect(() => {
    if (username) {
      localStorage.setItem(
        `${username}_currentQuestionIndex`,
        currentQuestionIndex.toString()
      );
      localStorage.setItem(`${username}_score`, score.toString());
      localStorage.setItem(`${username}_timer`, timer.toString());
      localStorage.setItem(
        `${username}_userAnswers`,
        JSON.stringify(userAnswers)
      );
    }
  }, [username, currentQuestionIndex, score, timer, userAnswers]);

  const handleAnswer = (answer: string) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex]: answer,
    }));

    if (answer === questions[currentQuestionIndex].correct_answer) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (username) {
      localStorage.setItem(
        `${username}_userAnswers`,
        JSON.stringify(userAnswers)
      );
      localStorage.setItem(`${username}_score`, score.toString());
      localStorage.removeItem(`${username}_currentQuestionIndex`);
      localStorage.removeItem(`${username}_timer`);
    }

    router.push("/results");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (questions.length === 0) return <div>No questions available.</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-2">Quiz</h1>
      {username && <p className="mb-4">Logged in as: {username}</p>}
      <p className="mb-4">Time remaining: {timer}s</p>
      <h2 className="text-xl mb-3">
        {questions[currentQuestionIndex].question}
      </h2>
      <ul>
        {questions[currentQuestionIndex].incorrect_answers
          .concat(questions[currentQuestionIndex].correct_answer)
          .map((answer, index) => (
            <li key={index} className="mb-2">
              <button
                onClick={() => handleAnswer(answer)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                {answer}
              </button>
            </li>
          ))}
      </ul>
      <p className="mt-4">
        Question {currentQuestionIndex + 1} of {questions.length}
      </p>
    </div>
  );
}

export default withAuth(QuizPage);
