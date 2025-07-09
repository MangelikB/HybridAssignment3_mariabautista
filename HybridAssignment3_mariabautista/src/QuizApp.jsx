import React, { useEffect, useState } from "react";
import Results from "./Results";

const decodeHtml = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

export default function QuizApp() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const fetchQuestions = async () => {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=5&category=27&difficulty=medium&type=multiple"
    );
    const data = await response.json();

    const formatted = data.results.map((q, index) => {
      const options = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
      return {
        id: index,
        question: decodeHtml(q.question),
        options: options.map(decodeHtml),
        correct: decodeHtml(q.correct_answer),
      };
    });

    setQuestions(formatted);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSelect = (qid, answer) => {
    if (!submitted) {
      setAnswers((prev) => ({ ...prev, [qid]: answer }));
    }
  };

  const handleSubmit = () => {
    let total = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        total++;
      }
    });
    setScore(total);
    setSubmitted(true);
  };

  const handleRetry = () => {
    fetchQuestions();
  };

  return (
    <div className="quiz-container">
      <h1>Animals Trivia Quiz</h1>

      {!submitted ? (
        <>
          {questions.map((q) => (
            <div key={q.id} className="question-card">
              <h3>{q.question}</h3>
              {q.options.map((option) => {
                const isSelected = answers[q.id] === option;
                let className = "answer-option";
                if (isSelected) className += " selected";

                return (
                  <div
                    key={option}
                    onClick={() => handleSelect(q.id, option)}
                    className={className}
                  >
                    {option}
                  </div>
                );
              })}
            </div>
          ))}

          <div className="button-container">
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < questions.length}
            >
              Submit Quiz
            </button>
          </div>
        </>
      ) : (
        <Results
          questions={questions}
          userAnswers={answers}
          score={score}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}
