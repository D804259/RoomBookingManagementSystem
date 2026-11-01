# Adaptive Quiz & Scoring Experience

A responsive, frontend-only quiz application for adaptive practice. It includes a 72-question bank across six computing topics, randomized answer options, timed quizzes, adaptive difficulty, detailed results, answer review, and saved quiz history.

## Requirements

- A modern browser with JavaScript, Canvas, and Local Storage enabled.
- No package installation, build step, backend, or network connection is required.

## Run the application

1. Open `adaptive-quiz/index.html` directly in a modern browser.
2. Select **Create a quiz**, enter a student name and subject, choose a topic and starting difficulty, and set the question count and time limit.
3. Select an answer and use the question map or Previous/Next controls to navigate. Answers can be changed before final submission. Correctness, explanations, score, and ability estimates are not shown during the quiz.
4. Submit the quiz to view the Results Dashboard. Open **Review answers** to see each selected answer, the correct answer, correctness, and explanation.

An optional local static server can be used from the project directory:

```bash
cd adaptive-quiz
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser. The server only serves static files; the application does not send data to a backend.

## Project architecture

```text
adaptive-quiz/
  index.html          Accessible screens, forms, charts, and navigation controls
  css/
    styles.css        Theme, component styles, responsive layouts, and motion preferences
  js/
    questions.js      Question bank, topics, and difficulty point values
    adaptive.js       Ability estimate and adaptive question selection
    storage.js        Local Storage validation, normalization, and persistence
    chart.js          Canvas-based post-submission ability progress chart
    app.js            Quiz flow, timer, answer tracking, scoring, results, and history
  README.md           Setup, architecture, and behavior documentation
```

The scripts are plain JavaScript files loaded in dependency order at the end of `index.html`; no bundler or third-party library is used.

## Topics and questions

The question bank contains 12 questions per topic, with four questions at each difficulty:

- Web Development
- Data Structures
- Database Systems
- Operating Systems
- Computer Networks
- Discrete Mathematics

Questions and answer options are shuffled for a quiz. Question IDs are tracked to avoid repeating questions across attempts until the available set for that selection has been used.

## Adaptive difficulty

The quiz starts at the selected level: Easy (`θ = -1`), Medium (`θ = 0`), or Hard (`θ = +1`). Each question has a difficulty parameter `b` (approximately `-1`, `0`, or `+1`).

The estimated probability of a correct answer is:

`P(θ, b) = 1 / (1 + e^(-(θ - b)))`

After an answer is selected and the learner moves to another question, the ability estimate updates internally as:

`θ ← clamp(θ + 0.45 × (actual − P), -3, 3)`

Here, `actual` is `1` for correct and `0` for incorrect. The next unused question is selected closest to the updated ability. If the preferred difficulty has no unused questions, the selector falls back to neighboring levels and then any remaining question. Unanswered questions do not change ability. The estimate and question difficulty are not displayed until final results.

## Scoring and results

- Easy questions are worth 10 marks, Medium 15, and Hard 20.
- Correct answers earn the question's marks; incorrect and unanswered questions earn zero.
- Total possible marks are the sum of the values for generated questions.
- Accuracy is correct answers divided by answered questions, or `0%` when none were answered.
- Completion rate is answered questions divided by the total generated questions.
- The in-progress quiz shows no correctness feedback, answer explanations, score, or ability estimate. The Results Dashboard reveals correct, incorrect, and unanswered counts; elapsed time; final ability and its chart; topic and difficulty breakdowns; strengths; weaknesses; and suggested next steps.

An attempt is **Completed** only if it was submitted normally and every question was answered. A normal submission with unanswered questions is **Incomplete**; a timer submission is **Timed out**. Incomplete and timed-out attempts remain available for review but are excluded from completed-quiz analytics.

## Saved data and privacy

Submitted attempts, previously used question IDs, and setup preferences are stored in the browser's Local Storage. The latest 50 attempts are retained. Current answer selections stay in the active quiz state and are included when the attempt is submitted; an unfinished session is not restored after leaving or refreshing the page. Saved results persist across refreshes in the same browser profile and file origin, but are not synchronized to other devices. Clearing browser data removes them. Malformed or unavailable storage is reported, and the quiz remains usable.

## Final audit

The project was browser-checked across all six topics and Easy, Medium, and Hard starts. Examination mode was tested to confirm that answer feedback, correct answers, explanations, score, and ability estimates stay out of the quiz screen while selections remain editable and adaptive question selection continues internally. Final result calculations, ability charts, saved-attempt review, Local Storage persistence after refresh, navigation controls, and desktop/mobile layouts were also exercised. The audit found no application console errors or horizontal overflow at 1440px desktop and 390px mobile widths.
