import React from "react";

export default function Results({ questions, userAnswers, score, onRetry }) {
  return (
    <div>
      <h2>Your score: {score} / {questions.length}</h2>

      <div style={{ marginTop: "2rem" }}>
        {questions.map((q) => (
          <div key={q.id} className="question-card">
            <h3>{q.question}</h3>
            {q.options.map((option) => {
              let className = "answer-option";
              if (option === q.correct) {
                className += " correct";
              } else if (userAnswers[q.id] === option) {
                className += " incorrect";
              }

              return (
                <div key={option} className={className}>
                  {option}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <button onClick={onRetry}>Take Another Quiz</button>
    </div>
  );
}
