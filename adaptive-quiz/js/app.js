/**
 * Quiz screens, navigation, timed sessions, scoring, and saved-data views.
 */
(function () {
  const screens = {
    dashboard: document.getElementById("screen-dashboard"),
    setup: document.getElementById("screen-setup"),
    quiz: document.getElementById("screen-quiz"),
    results: document.getElementById("screen-results"),
    review: document.getElementById("screen-review"),
    history: document.getElementById("screen-history")
  };

  const els = {
    navDashboard: document.getElementById("nav-dashboard"),
    navHistory: document.getElementById("nav-history"),
    setupForm: document.getElementById("setup-form"),
    learnerName: document.getElementById("learner-name"),
    subject: document.getElementById("subject-input"),
    topicSelect: document.getElementById("topic-select"),
    difficultySelect: document.getElementById("difficulty-select"),
    lengthSelect: document.getElementById("length-select"),
    questionAvailability: document.getElementById("question-availability"),
    durationSelect: document.getElementById("duration-select"),
    setupError: document.getElementById("setup-error"),
    questionText: document.getElementById("question-text"),
    options: document.getElementById("options"),
    nextBtn: document.getElementById("next-question"),
    previousBtn: document.getElementById("previous-question"),
    finishBtn: document.getElementById("finish-quiz"),
    quitBtn: document.getElementById("quit-quiz"),
    progressTrack: document.querySelector(".quiz-progress-row + .progress-track"),
    progressFill: document.getElementById("progress-fill"),
    progressLabel: document.getElementById("progress-label"),
    completionLabel: document.getElementById("completion-label"),
    topicBadge: document.getElementById("topic-badge"),
    questionIndex: document.getElementById("question-index"),
    palette: document.getElementById("question-palette"),
    paletteCount: document.getElementById("palette-count"),
    timer: document.getElementById("timer"),
    timerValue: document.getElementById("timer-value"),
    quizSessionLabel: document.getElementById("quiz-session-label"),
    recentAttempts: document.getElementById("recent-attempts"),
    metricTopics: document.getElementById("metric-topics"),
    metricTopicNote: document.getElementById("metric-topic-note"),
    metricCompleted: document.getElementById("metric-completed"),
    metricBest: document.getElementById("metric-best"),
    metricAccuracy: document.getElementById("metric-accuracy"),
    analyticsUpdated: document.getElementById("analytics-updated"),
    resultScore: document.getElementById("result-score"),
    resultPercentage: document.getElementById("result-percentage"),
    resultCategory: document.getElementById("result-category"),
    resultStatus: document.getElementById("result-status"),
    resultAbilityChart: document.getElementById("result-ability-chart"),
    resultGreeting: document.getElementById("results-greeting"),
    resultSummary: document.getElementById("result-summary"),
    topicStats: document.getElementById("topic-stats"),
    difficultyStats: document.getElementById("difficulty-stats"),
    strengthsList: document.getElementById("strengths-list"),
    weaknessesList: document.getElementById("weaknesses-list"),
    suggestionsList: document.getElementById("suggestions-list"),
    reviewList: document.getElementById("review-list"),
    reviewSubtitle: document.getElementById("review-subtitle"),
    reviewTotal: document.getElementById("review-total"),
    historyList: document.getElementById("history-list"),
    historyMetrics: document.getElementById("history-metrics"),
    historyTopicStats: document.getElementById("history-topic-stats"),
    historyProgressChart: document.getElementById("history-progress-chart"),
    clearHistory: document.getElementById("clear-history"),
    announcement: document.getElementById("app-announcement")
  };

  const state = {
    settings: {
      learnerName: "",
      subject: "Computer Science",
      topic: "All topics",
      difficulty: "Medium",
      questionCount: 10,
      durationMinutes: 15
    },
    bank: [],
    questions: [],
    usedIds: new Set(),
    currentIndex: 0,
    startingAbility: 0,
    ability: 0,
    abilityHistory: [0],
    secondsRemaining: 0,
    timerId: null,
    startedAt: null,
    currentAttempt: null,
    timerWarnings: new Set(),
    finished: false,
    attempts: QuizStorage.readAttempts()
  };

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function announce(message) {
    els.announcement.textContent = "";
    window.requestAnimationFrame(() => {
      els.announcement.textContent = message;
    });
  }

  function showScreen(name) {
    Object.entries(screens).forEach(([screenName, node]) => {
      const active = screenName === name;
      node.hidden = !active;
    });
    els.navDashboard.classList.toggle("is-current", name !== "history");
    els.navHistory.classList.toggle("is-current", name === "history");
    if (name === "dashboard") {
      renderDashboard();
    } else if (name === "history") {
      renderHistory();
    } else if (name === "results" && state.currentAttempt) {
      AbilityChart.drawChart(els.resultAbilityChart, state.currentAttempt.abilityHistory);
    }
  }

  function fillTopicSelect() {
    els.topicSelect.replaceChildren();
    ["All topics", ...window.TOPICS].forEach((topic) => {
      const option = document.createElement("option");
      option.value = topic;
      option.textContent = topic;
      els.topicSelect.appendChild(option);
    });
  }

  function filteredBank(topic = els.topicSelect.value) {
    return AdaptiveEngine.filterBank(window.QUESTION_BANK, topic);
  }

  function updateQuestionLimit() {
    const bank = filteredBank();
    const seenIds = QuizStorage.readSeenQuestionIds();
    const freshCount = bank.filter((question) => !seenIds.has(question.id)).length;
    const startsNewCycle = bank.length > 0 && freshCount === 0;
    const available = startsNewCycle ? bank.length : freshCount;
    els.lengthSelect.max = String(available);
    els.lengthSelect.setCustomValidity("");
    if (Number(els.lengthSelect.value) > available) {
      els.lengthSelect.value = String(Math.max(1, available));
    }
    if (startsNewCycle) {
      els.questionAvailability.textContent = `You’ve practiced all ${bank.length} questions in this selection. A fresh cycle will begin, so questions can repeat.`;
    } else {
      els.questionAvailability.textContent = `${freshCount} fresh ${freshCount === 1 ? "question" : "questions"} available. Completed quiz questions won’t repeat until this selection is complete.`;
    }
  }

  function saveCurrentSettings() {
    const settings = {
      learnerName: els.learnerName.value.trim(),
      subject: els.subject.value.trim(),
      topic: els.topicSelect.value,
      difficulty: els.difficultySelect.value,
      questionCount: Number(els.lengthSelect.value),
      durationMinutes: Number(els.durationSelect.value)
    };
    QuizStorage.writeSettings(settings);
  }

  function restoreSettings() {
    const saved = QuizStorage.readSettings();
    const hasTopic = ["All topics", ...window.TOPICS].includes(saved.topic);
    const hasDifficulty = window.DIFFICULTIES.includes(saved.difficulty);
    els.learnerName.value = typeof saved.learnerName === "string" ? saved.learnerName.slice(0, 40) : "";
    els.subject.value = typeof saved.subject === "string" ? saved.subject.slice(0, 60) : "Computer Science";
    els.topicSelect.value = hasTopic ? saved.topic : "All topics";
    els.difficultySelect.value = hasDifficulty ? saved.difficulty : "Medium";
    els.lengthSelect.value = Number.isInteger(saved.questionCount) ? String(saved.questionCount) : "10";
    els.durationSelect.value = Number.isInteger(saved.durationMinutes) ? String(saved.durationMinutes) : "15";
    updateQuestionLimit();
  }

  function openSetup() {
    updateQuestionLimit();
    showScreen("setup");
    els.setupError.hidden = true;
    els.learnerName.focus();
  }

  function resetQuizState() {
    stopTimer();
    state.bank = [];
    state.questions = [];
    state.usedIds = new Set();
    state.currentIndex = 0;
    state.startingAbility = 0;
    state.ability = 0;
    state.abilityHistory = [0];
    state.secondsRemaining = 0;
    state.startedAt = null;
    state.timerWarnings = new Set();
    state.finished = false;
  }

  function createAttemptId() {
    if (typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  function shuffledOptionOrder() {
    const order = [0, 1, 2, 3];
    for (let index = order.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
    }
    return order;
  }

  function startQuiz(settings = null) {
    const proposed = settings || {
      learnerName: els.learnerName.value.trim(),
      subject: els.subject.value.trim(),
      topic: els.topicSelect.value,
      difficulty: els.difficultySelect.value,
      questionCount: Number(els.lengthSelect.value),
      durationMinutes: Number(els.durationSelect.value)
    };
    const selectedBank = AdaptiveEngine.filterBank(window.QUESTION_BANK, proposed.topic);
    const previouslySeenIds = QuizStorage.readSeenQuestionIds();
    const freshBank = selectedBank.filter((question) => !previouslySeenIds.has(question.id));
    const startsNewCycle = freshBank.length === 0;
    const bank = startsNewCycle ? selectedBank : freshBank;
    const questionCount = Number(proposed.questionCount);
    const durationMinutes = Number(proposed.durationMinutes);

    if (
      typeof proposed.learnerName !== "string" ||
      !proposed.learnerName.trim() ||
      proposed.learnerName.trim().length > 40 ||
      typeof proposed.subject !== "string" ||
      !proposed.subject.trim() ||
      proposed.subject.trim().length > 60 ||
      !["All topics", ...window.TOPICS].includes(proposed.topic) ||
      !window.DIFFICULTIES.includes(proposed.difficulty) ||
      !Number.isInteger(questionCount) ||
      questionCount < 1 ||
      questionCount > bank.length ||
      bank.length === 0 ||
      !Number.isInteger(durationMinutes) ||
      durationMinutes < 1 ||
      durationMinutes > 180
    ) {
      els.setupError.textContent = "Check the name, subject, question count, and time limit before starting.";
      els.setupError.hidden = false;
      return false;
    }

    resetQuizState();
    state.settings = {
      learnerName: proposed.learnerName.trim(),
      subject: proposed.subject.trim(),
      topic: proposed.topic,
      difficulty: proposed.difficulty,
      questionCount,
      durationMinutes
    };
    state.bank = bank;
    state.usedIds = startsNewCycle ? new Set() : previouslySeenIds;
    state.startingAbility = AdaptiveEngine.initialAbilityForDifficulty(state.settings.difficulty);
    state.ability = state.startingAbility;
    state.abilityHistory = [state.ability];
    state.secondsRemaining = durationMinutes * 60;
    state.startedAt = Date.now();
    els.quizSessionLabel.textContent = `${state.settings.subject} · ${state.settings.topic}`;
    addNextQuestion();
    showScreen("quiz");
    renderQuestion();
    updateTimerDisplay();
    state.timerId = window.setInterval(tickTimer, 250);
    return true;
  }

  function addNextQuestion() {
    if (state.questions.length >= state.settings.questionCount) {
      return false;
    }
    const question = AdaptiveEngine.selectNextQuestion(state.bank, state.usedIds, state.ability);
    if (!question) {
      return false;
    }

    state.usedIds.add(question.id);
    const optionOrder = shuffledOptionOrder();
    const randomizedQuestion = {
      ...question,
      options: optionOrder.map((optionIndex) => question.options[optionIndex]),
      answer: optionOrder.indexOf(question.answer)
    };
    state.questions.push({
      question: randomizedQuestion,
      optionOrder,
      status: "unanswered",
      selectedIndex: null,
      isCorrect: false,
      abilityBefore: state.ability,
      abilityAfter: state.ability
    });
    return true;
  }

  function updateAbility() {
    const result = AdaptiveEngine.calculateAbilityHistory(state.questions, state.startingAbility);
    state.ability = result.ability;
    state.abilityHistory = result.history;
  }

  function countAnswered() {
    return state.questions.filter((item) => item.selectedIndex !== null).length;
  }

  function renderQuestionProgress() {
    const answeredCount = countAnswered();
    const total = state.settings.questionCount;
    const progress = Math.round((answeredCount / total) * 100);

    els.completionLabel.textContent = `${answeredCount} answered · ${total - answeredCount} remaining`;
    els.progressFill.style.width = `${progress}%`;
    els.progressTrack.setAttribute("aria-valuenow", String(progress));
    els.paletteCount.textContent = `${answeredCount} / ${total}`;
  }

  function renderQuestion() {
    const entry = state.questions[state.currentIndex];
    if (!entry) {
      return;
    }
    const question = entry.question;
    const questionNumber = state.currentIndex + 1;
    const total = state.settings.questionCount;

    els.questionText.textContent = question.question;
    els.topicBadge.textContent = question.topic;
    els.questionIndex.textContent = `${String(questionNumber).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
    els.progressLabel.textContent = `Question ${questionNumber} of ${total}`;
    renderQuestionProgress();
    els.previousBtn.disabled = state.currentIndex === 0;
    els.nextBtn.hidden = state.currentIndex >= total - 1;
    els.finishBtn.textContent = "Submit quiz";

    renderOptions(entry);
    renderPalette();
  }

  function renderOptions(entry) {
    els.options.replaceChildren();
    entry.question.options.forEach((label, index) => {
      const button = document.createElement("button");
      const key = document.createElement("span");
      const text = document.createElement("span");
      button.type = "button";
      button.className = "option";
      button.setAttribute("aria-pressed", String(entry.selectedIndex === index));
      if (entry.selectedIndex === index) {
        button.classList.add("is-selected");
      }
      key.className = "option-key";
      key.textContent = String.fromCharCode(65 + index);
      text.textContent = label;
      button.append(key, text);
      button.addEventListener("click", () => selectOption(index));
      els.options.appendChild(button);
    });
  }

  function selectOption(index) {
    const entry = state.questions[state.currentIndex];
    if (!entry || index < 0 || index >= entry.question.options.length) {
      return;
    }
    const wasAnswered = entry.status === "answered";
    entry.selectedIndex = index;
    entry.status = "selected";
    entry.isCorrect = false;
    if (wasAnswered) {
      updateAbility();
    }
    [...els.options.children].forEach((button, buttonIndex) => {
      const selected = buttonIndex === index;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    renderQuestionProgress();
    renderPalette();
  }

  function recordAnswer(entry) {
    if (!entry || entry.selectedIndex === null) {
      return false;
    }

    entry.isCorrect = entry.selectedIndex === entry.question.answer;
    entry.status = "answered";
    updateAbility();
    return true;
  }

  function moveNext() {
    if (state.finished) {
      return;
    }
    const current = state.questions[state.currentIndex];
    if (!current || state.currentIndex >= state.settings.questionCount - 1) {
      return;
    }
    recordAnswer(current);

    if (state.currentIndex === state.questions.length - 1) {
      if (!addNextQuestion()) {
        finishQuiz({ timedOut: false });
        return;
      }
    }
    state.currentIndex += 1;
    renderQuestion();
    els.questionText.focus();
  }

  function movePrevious() {
    if (state.finished || state.currentIndex === 0) {
      return;
    }
    recordAnswer(state.questions[state.currentIndex]);
    state.currentIndex -= 1;
    renderQuestion();
    els.questionText.focus();
  }

  function renderPalette() {
    els.palette.replaceChildren();
    for (let index = 0; index < state.settings.questionCount; index += 1) {
      const entry = state.questions[index];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "palette-button";
      button.textContent = String(index + 1);
      button.setAttribute("aria-label", `Question ${index + 1}${entry ? entry.selectedIndex === null ? ", unanswered" : ", answered" : ", not yet available"}`);
      button.disabled = !entry;
      if (index === state.currentIndex) {
        button.classList.add("is-current");
        button.setAttribute("aria-current", "step");
      }
      if (entry && entry.selectedIndex !== null) {
        button.classList.add("is-answered");
      }
      button.addEventListener("click", () => {
        if (!entry) {
          return;
        }
        recordAnswer(state.questions[state.currentIndex]);
        state.currentIndex = index;
        renderQuestion();
        els.questionText.focus();
      });
      els.palette.appendChild(button);
    }
  }

  function formatDuration(seconds) {
    const safeSeconds = Math.max(0, Math.floor(seconds));
    const minutes = Math.floor(safeSeconds / 60);
    const remainder = safeSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  }

  function updateTimerDisplay() {
    els.timerValue.textContent = formatDuration(state.secondsRemaining);
    const isLow = state.secondsRemaining <= 60;
    els.timer.classList.toggle("is-low", isLow);
    if (state.secondsRemaining < 60 && !state.timerWarnings.has(60)) {
      state.timerWarnings.add(60);
      announce("One minute remaining.");
    }
    if (state.secondsRemaining <= 10 && !state.timerWarnings.has(10)) {
      state.timerWarnings.add(10);
      announce("Ten seconds remaining.");
    }
  }

  function tickTimer() {
    if (state.finished || !state.startedAt || state.timerId === null) {
      return;
    }
    const elapsed = Math.floor((Date.now() - state.startedAt) / 1000);
    state.secondsRemaining = Math.max(0, state.settings.durationMinutes * 60 - elapsed);
    updateTimerDisplay();
    if (state.secondsRemaining === 0) {
      finishQuiz({ timedOut: true });
    }
  }

  function stopTimer() {
    if (state.timerId !== null) {
      window.clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function answerRecords() {
    return state.questions.map((entry) => {
      const question = entry.question;
      const answered = entry.status === "answered";
      const isCorrect = answered && entry.isCorrect;
      const points = window.POINTS_BY_DIFFICULTY[question.difficulty] || 10;
      return {
        id: question.id,
        topic: question.topic,
        difficulty: question.difficulty,
        question: question.question,
        options: question.options,
        selectedIndex: answered ? entry.selectedIndex : null,
        correctIndex: question.answer,
        explanation: question.explanation,
        isCorrect,
        points: isCorrect ? points : 0,
        possiblePoints: points,
        abilityBefore: entry.abilityBefore,
        abilityAfter: entry.abilityAfter
      };
    });
  }

  function groupedStats(answers, field) {
    const stats = new Map();
    answers.forEach((answer) => {
      const key = answer[field];
      if (!stats.has(key)) {
        stats.set(key, { label: key, correct: 0, attempted: 0, total: 0 });
      }
      const row = stats.get(key);
      row.total += 1;
      if (answer.selectedIndex !== null) {
        row.attempted += 1;
      }
      if (answer.isCorrect) {
        row.correct += 1;
      }
    });
    return [...stats.values()].map((row) => ({
      ...row,
      accuracy: row.attempted ? Math.round((row.correct / row.attempted) * 100) : 0
    }));
  }

  function performanceCategory(scorePercentage) {
    if (scorePercentage >= 90) {
      return "Excellent";
    }
    if (scorePercentage >= 75) {
      return "Strong progress";
    }
    if (scorePercentage >= 55) {
      return "Building confidence";
    }
    return "Keep practicing";
  }

  function buildAttempt(timedOut) {
    updateAbility();
    const answers = answerRecords();
    const correctCount = answers.filter((answer) => answer.isCorrect).length;
    const answeredCount = answers.filter((answer) => answer.selectedIndex !== null).length;
    const incorrectCount = answeredCount - correctCount;
    const unansweredCount = answers.length - answeredCount;
    const score = answers.reduce((sum, answer) => sum + answer.points, 0);
    const maxScore = answers.reduce((sum, answer) => sum + answer.possiblePoints, 0);
    const accuracy = answeredCount ? Math.round((correctCount / answeredCount) * 100) : 0;
    const elapsedSeconds = Math.min(
      state.settings.durationMinutes * 60,
      Math.max(0, Math.floor((Date.now() - state.startedAt) / 1000))
    );

    return {
      id: createAttemptId(),
      title: `${state.settings.subject} · ${state.settings.topic}`,
      name: state.settings.learnerName,
      subject: state.settings.subject,
      topic: state.settings.topic,
      startingDifficulty: state.settings.difficulty,
      date: new Date().toISOString(),
      score,
      maxScore,
      correctCount,
      incorrectCount,
      unansweredCount,
      accuracy,
      completionRate: answers.length ? Math.round((answeredCount / answers.length) * 100) : 0,
      abilityHistory: state.abilityHistory.slice(),
      finalAbility: state.ability,
      answers,
      seenQuestionIds: answers.map((answer) => answer.id),
      topicStats: groupedStats(answers, "topic"),
      difficultyStats: groupedStats(answers, "difficulty"),
      questionCount: answers.length,
      durationSeconds: state.settings.durationMinutes * 60,
      elapsedSeconds,
      timedOut,
      status: timedOut ? "timed_out" : unansweredCount === 0 ? "completed" : "incomplete",
      performance: performanceCategory(maxScore ? (score / maxScore) * 100 : accuracy)
    };
  }

  function ensureAllQuestions() {
    while (state.questions.length < state.settings.questionCount) {
      updateAbility();
      if (!addNextQuestion()) {
        break;
      }
    }
  }

  function finishQuiz({ timedOut }) {
    if (state.finished || state.timerId === null) {
      return;
    }
    recordAnswer(state.questions[state.currentIndex]);
    state.finished = true;
    stopTimer();
    ensureAllQuestions();
    updateAbility();
    const attempt = buildAttempt(timedOut);
    state.currentAttempt = attempt;
    state.attempts = [
      attempt,
      ...state.attempts.filter((savedAttempt) => savedAttempt.id !== attempt.id)
    ].slice(0, 50);
    renderResults(attempt);
    showScreen("results");
    if (!QuizStorage.saveAttempt(attempt)) {
      window.alert("Your results are shown, but this browser could not save the attempt. Check your storage settings and try again.");
    } else {
      state.attempts = QuizStorage.readAttempts();
    }
    if (timedOut) {
      announce("Time is up. Your quiz was submitted automatically.");
    }
  }

  function renderMetric(label, value, note, icon, color) {
    return `<article class="metric-card"><span class="metric-icon ${color}" aria-hidden="true">${icon}</span><div><p class="metric-label">${escapeHtml(label)}</p><strong>${escapeHtml(value)}</strong><span class="metric-foot">${escapeHtml(note)}</span></div></article>`;
  }

  function renderDashboard() {
    const attempts = state.attempts;
    const completedAttempts = attempts.filter((attempt) => attempt.status === "completed");
    els.metricTopics.textContent = String(window.TOPICS.length);
    els.metricTopicNote.textContent = `${window.QUESTION_BANK.length} questions across ${window.TOPICS.length} topics`;
    els.metricCompleted.textContent = String(completedAttempts.length);
    if (completedAttempts.length > 0) {
      const bestScore = Math.max(...completedAttempts.map((attempt) => (
        attempt.maxScore ? (attempt.score / attempt.maxScore) * 100 : 0
      )));
      const averageAccuracy = Math.round(
        completedAttempts.reduce((sum, attempt) => sum + attempt.accuracy, 0) / completedAttempts.length
      );
      els.metricBest.textContent = `${Math.round(bestScore)}%`;
      els.metricAccuracy.textContent = `${averageAccuracy}%`;
    } else {
      els.metricBest.textContent = "—";
      els.metricAccuracy.textContent = "—";
    }
    els.analyticsUpdated.textContent = attempts.length
      ? `${attempts.length} saved ${attempts.length === 1 ? "attempt" : "attempts"}`
      : "Results save in this browser";

    if (attempts.length === 0) {
      els.recentAttempts.innerHTML = '<div class="empty-state"><strong>Your first session starts here.</strong>Complete a quiz to see your progress and results.</div>';
      return;
    }

    els.recentAttempts.innerHTML = attempts.slice(0, 3).map((attempt) => `
      <article class="recent-row">
        <div><p class="recent-title">${escapeHtml(attempt.subject)} · ${escapeHtml(attempt.topic)}</p><p class="recent-meta">${escapeHtml(new Date(attempt.date).toLocaleDateString())} · ${attempt.questionCount} questions · ${attempt.accuracy}% accuracy · ${escapeHtml(statusLabel(attempt.status))}</p></div>
        <div class="recent-result-actions"><span class="recent-score">${attempt.score} / ${attempt.maxScore}</span><button class="history-review" type="button" data-review="${escapeHtml(attempt.id)}">View result</button></div>
      </article>
    `).join("");
  }

  function renderAnalysisRows(rows) {
    if (!rows.length) {
      return '<p class="analysis-empty">No questions in this group.</p>';
    }
    return rows.map((row) => `
      <div class="analysis-row">
        <div class="analysis-row-top"><strong>${escapeHtml(row.label)}</strong><span>${row.correct}/${row.attempted} answered · ${row.total} total · ${row.accuracy}%</span></div>
        <div class="mini-track" role="progressbar" aria-label="${escapeHtml(row.label)} accuracy" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${row.accuracy}"><div class="mini-fill" style="width:${row.accuracy}%"></div></div>
      </div>
    `).join("");
  }

  function createInsights(attempt) {
    const topicRows = attempt.topicStats || groupedStats(attempt.answers, "topic");
    const difficultyRows = attempt.difficultyStats || groupedStats(attempt.answers, "difficulty");
    const strengths = [...topicRows, ...difficultyRows]
      .filter((row) => row.attempted > 0 && row.accuracy >= 70)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 2)
      .map((row) => `${row.label}: ${row.accuracy}% accuracy`);
    const weakest = [...topicRows, ...difficultyRows]
      .filter((row) => row.attempted > 0 && row.accuracy < 75)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 2);
    const suggestions = weakest.length
      ? weakest.map((row) => `Revisit ${row.label} with a short focused practice set.`)
      : ["Try a higher starting difficulty to keep building on this progress."];
    if (attempt.unansweredCount > 0) {
      const unansweredText = attempt.unansweredCount === 1
        ? "1 question was left unanswered. Try to complete every question."
        : `${attempt.unansweredCount} questions were left unanswered. Try to complete every question.`;
      suggestions.unshift(unansweredText);
    }
    const weaknesses = weakest.map((row) => `${row.label}: ${row.accuracy}% accuracy`);
    return { strengths, weaknesses, suggestions };
  }

  function renderResults(attempt) {
    const percentage = attempt.maxScore
      ? Math.round((attempt.score / attempt.maxScore) * 100)
      : 0;
    const category = performanceCategory(percentage);
    const elapsed = formatDuration(attempt.elapsedSeconds);
    const topicStats = groupedStats(attempt.answers, "topic");
    const difficultyStats = groupedStats(attempt.answers, "difficulty");
    const insights = createInsights({ ...attempt, topicStats, difficultyStats });

    els.resultGreeting.textContent = `${attempt.name}, here’s how your ${attempt.topic === "All topics" ? "quiz" : attempt.topic} practice went.`;
    els.resultScore.innerHTML = `${attempt.score} <small>/ ${attempt.maxScore}</small>`;
    els.resultPercentage.textContent = `${percentage}% of available marks`;
    els.resultCategory.textContent = category;
    els.resultStatus.textContent = statusLabel(attempt.status);
    els.resultStatus.dataset.status = attempt.status;
    els.resultSummary.innerHTML = [
      renderMetric("Questions attempted", String(attempt.correctCount + attempt.incorrectCount), "Answered before submission", "✓", "icon-green"),
      renderMetric("Total questions", String(attempt.questionCount), "In this quiz", "▦", "icon-violet"),
      renderMetric("Correct answers", String(attempt.correctCount), "Of attempted questions", "↗", "icon-blue"),
      renderMetric("Incorrect answers", String(attempt.incorrectCount), "Of attempted questions", "↘", "icon-amber"),
      renderMetric("Unanswered", String(attempt.unansweredCount), "Not selected before submission", "○", "icon-violet"),
      renderMetric("Accuracy", `${attempt.accuracy}%`, "Of answered questions", "◎", "icon-blue"),
      renderMetric("Completion", `${attempt.completionRate}%`, "Of total questions", "✓", "icon-green"),
      renderMetric("Time taken", elapsed, attempt.timedOut ? "Time limit reached" : "Focused practice", "◷", "icon-violet"),
      renderMetric("Final ability", attempt.finalAbility.toFixed(2), "Ability estimate (θ)", "θ", "icon-violet")
    ].join("");
    els.topicStats.innerHTML = renderAnalysisRows(topicStats);
    els.difficultyStats.innerHTML = renderAnalysisRows(
      ["Easy", "Medium", "Hard"].map((difficulty) => (
        difficultyStats.find((row) => row.label === difficulty) || {
          label: difficulty,
          correct: 0,
          attempted: 0,
          total: 0,
          accuracy: 0
        }
      ))
    );
    els.strengthsList.innerHTML = `<div class="insight-block"><h3>Strengths</h3><ul>${(insights.strengths.length ? insights.strengths : ["Your confidence estimate will grow with more answered questions."]).map((text) => `<li>${escapeHtml(text)}</li>`).join("")}</ul></div>`;
    els.weaknessesList.innerHTML = `<div class="insight-block"><h3>Areas to strengthen</h3><ul>${(insights.weaknesses.length ? insights.weaknesses : ["No clear gaps yet; keep practicing to build a detailed profile."]).map((text) => `<li>${escapeHtml(text)}</li>`).join("")}</ul></div>`;
    els.suggestionsList.innerHTML = `<div class="insight-block"><h3>Suggestions</h3><ul>${insights.suggestions.map((text) => `<li>${escapeHtml(text)}</li>`).join("")}</ul></div>`;
  }

  function renderReview(attempt) {
    els.reviewSubtitle.textContent = `${attempt.subject} · ${attempt.topic} · ${new Date(attempt.date).toLocaleString()}`;
    els.reviewTotal.textContent = `${attempt.answers.length} questions`;
    els.reviewList.innerHTML = attempt.answers.map((answer, index) => {
      const isUnanswered = answer.selectedIndex === null;
      const selectedAnswer = isUnanswered ? "Not answered" : answer.options[answer.selectedIndex];
      const correctness = isUnanswered ? "Unanswered" : answer.isCorrect ? "Correct" : "Incorrect";
      const cardClass = isUnanswered ? "is-unanswered" : answer.isCorrect ? "is-correct" : "is-wrong";
      return `
        <article class="review-card ${cardClass}">
          <header><span class="review-number">QUESTION ${String(index + 1).padStart(2, "0")}</span><span class="badge" data-level="${escapeHtml(answer.difficulty)}">${escapeHtml(answer.difficulty)}</span><span class="badge badge-topic">${escapeHtml(answer.topic)}</span><span class="badge">${correctness}</span></header>
          <p class="review-question">${escapeHtml(answer.question)}</p>
          <p class="review-answer ${isUnanswered ? "is-missing" : ""}"><strong>Your answer:</strong> ${escapeHtml(selectedAnswer)}</p>
          <p class="review-answer"><strong>Correct answer:</strong> ${escapeHtml(answer.options[answer.correctIndex])}</p>
          <p class="review-explanation"><strong>Explanation:</strong> ${escapeHtml(answer.explanation || "No explanation is available for this question.")}</p>
        </article>
      `;
    }).join("");
  }

  function renderHistory() {
    const attempts = state.attempts;
    els.clearHistory.disabled = attempts.length === 0;
    renderHistoryAnalytics(attempts);
    if (attempts.length === 0) {
      els.historyList.innerHTML = '<div class="empty-state"><strong>No saved attempts yet.</strong>Your completed quiz results will appear here.</div>';
      return;
    }

    els.historyList.innerHTML = attempts.map((attempt) => `
      <article class="history-card">
        <div><p class="history-title">${escapeHtml(attempt.subject)} · ${escapeHtml(attempt.topic)}</p><p class="history-meta">${escapeHtml(attempt.name)} · ${escapeHtml(new Date(attempt.date).toLocaleString())} · ${attempt.questionCount} questions · ${attempt.correctCount} correct · ${attempt.incorrectCount} incorrect · ${escapeHtml(statusLabel(attempt.status))}</p></div>
        <div class="history-card-right"><span class="history-score">${attempt.score} / ${attempt.maxScore}</span><button type="button" class="history-review" data-review="${escapeHtml(attempt.id)}">View results</button></div>
      </article>
    `).join("");
  }

  function renderHistoryAnalytics(attempts) {
    const completedAttempts = attempts.filter((attempt) => attempt.status === "completed");
    const totalCorrect = completedAttempts.reduce((sum, attempt) => sum + attempt.correctCount, 0);
    const totalAnswered = completedAttempts.reduce((sum, attempt) => sum + attempt.correctCount + attempt.incorrectCount, 0);
    const averageScore = completedAttempts.length
      ? Math.round(completedAttempts.reduce((sum, attempt) => (
        sum + (attempt.maxScore ? attempt.score / attempt.maxScore * 100 : 0)
      ), 0) / completedAttempts.length)
      : 0;
    const highestScore = completedAttempts.length
      ? Math.round(Math.max(...completedAttempts.map((attempt) => (
        attempt.maxScore ? attempt.score / attempt.maxScore * 100 : 0
      ))))
      : 0;
    const topicAnswers = completedAttempts.flatMap((attempt) => attempt.answers);
    const topicStats = groupedStats(topicAnswers, "topic")
      .sort((first, second) => second.total - first.total || first.label.localeCompare(second.label));

    els.historyMetrics.innerHTML = [
      renderMetric("Total quizzes", String(completedAttempts.length), "Successfully completed", "▦", "icon-violet"),
      renderMetric("Average score", completedAttempts.length ? `${averageScore}%` : "—", "Weighted marks earned", "↗", "icon-blue"),
      renderMetric("Highest score", completedAttempts.length ? `${highestScore}%` : "—", "Best completed result", "✦", "icon-green"),
      renderMetric("Overall accuracy", totalAnswered ? `${Math.round(totalCorrect / totalAnswered * 100)}%` : "—", "Correct of all answered questions", "◎", "icon-amber")
    ].join("");
    els.historyTopicStats.innerHTML = renderAnalysisRows(topicStats);
    drawHistoryProgress(completedAttempts);
  }

  function statusLabel(status) {
    return {
      completed: "Completed",
      incomplete: "Incomplete",
      timed_out: "Timed out"
    }[status] || "Incomplete";
  }

  function drawHistoryProgress(attempts) {
    const canvas = els.historyProgressChart;
    const context = canvas.getContext("2d");
    const bounds = canvas.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio || 1;
    const width = Math.max(1, bounds.width);
    const height = 190;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    context.scale(pixelRatio, pixelRatio);
    context.clearRect(0, 0, width, height);

    if (attempts.length === 0) {
      context.fillStyle = "#8992a6";
      context.font = "13px DM Sans, sans-serif";
      context.fillText("Complete a quiz to see your progress.", 10, 32);
      return;
    }

    const recent = attempts.slice(0, 10).reverse();
    const points = recent.map((attempt, index) => ({
      x: recent.length === 1 ? width / 2 : 18 + index * (width - 36) / (recent.length - 1),
      y: height - 20 - (attempt.maxScore ? attempt.score / attempt.maxScore : 0) * (height - 44),
      percentage: attempt.maxScore ? Math.round(attempt.score / attempt.maxScore * 100) : 0
    }));

    context.strokeStyle = "#e9edf4";
    context.lineWidth = 1;
    [0, 0.5, 1].forEach((ratio) => {
      const y = height - 20 - ratio * (height - 44);
      context.beginPath();
      context.moveTo(12, y);
      context.lineTo(width - 12, y);
      context.stroke();
    });

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach((point) => context.lineTo(point.x, point.y));
    context.strokeStyle = "#7169e4";
    context.lineWidth = 3;
    context.lineJoin = "round";
    context.stroke();

    points.forEach((point, index) => {
      context.beginPath();
      context.arc(point.x, point.y, 4, 0, Math.PI * 2);
      context.fillStyle = "#7169e4";
      context.fill();
      if (recent.length <= 6 || index === 0 || index === points.length - 1) {
        context.fillStyle = "#66718a";
        context.font = "11px DM Sans, sans-serif";
        context.textAlign = "center";
        context.fillText(`${point.percentage}%`, point.x, Math.max(13, point.y - 10));
      }
    });
  }

  function openAttempt(id) {
    const attempt = state.attempts.find((savedAttempt) => savedAttempt.id === id) || null;
    if (!attempt) {
      announce("That saved attempt could not be found.");
      renderHistory();
      return;
    }
    state.currentAttempt = attempt;
    renderResults(attempt);
    showScreen("results");
  }

  function retryCurrentAttempt() {
    const attempt = state.currentAttempt;
    if (!attempt) {
      openSetup();
      return;
    }
    const retried = startQuiz({
      learnerName: attempt.name,
      subject: attempt.subject,
      topic: attempt.topic,
      difficulty: attempt.startingDifficulty,
      questionCount: Math.min(attempt.questionCount, AdaptiveEngine.filterBank(window.QUESTION_BANK, attempt.topic).length),
      durationMinutes: Math.max(1, Math.round((attempt.durationSeconds || 900) / 60))
    });
    if (!retried) {
      openSetup();
    }
  }

  function leaveQuiz() {
    if (state.timerId !== null && !window.confirm("Leave this quiz? Your current progress will not be saved.")) {
      return;
    }
    stopTimer();
    showScreen("dashboard");
  }

  function goToHistory() {
    if (state.timerId !== null && !window.confirm("Leave this quiz? Your current progress will not be saved.")) {
      return;
    }
    stopTimer();
    renderHistory();
    showScreen("history");
  }

  function bindEvents() {
    document.getElementById("brand-home").addEventListener("click", (event) => {
      event.preventDefault();
      leaveQuiz();
    });
    document.getElementById("new-quiz").addEventListener("click", openSetup);
    document.getElementById("setup-back").addEventListener("click", () => showScreen("dashboard"));
    document.getElementById("dashboard-history").addEventListener("click", goToHistory);
    document.getElementById("history-dashboard").addEventListener("click", () => showScreen("dashboard"));
    els.navDashboard.addEventListener("click", leaveQuiz);
    els.navHistory.addEventListener("click", goToHistory);
    els.topicSelect.addEventListener("change", () => {
      updateQuestionLimit();
      saveCurrentSettings();
    });
    [els.learnerName, els.subject, els.difficultySelect, els.lengthSelect, els.durationSelect]
      .forEach((field) => field.addEventListener("change", saveCurrentSettings));
    els.setupForm.addEventListener("submit", (event) => {
      event.preventDefault();
      els.setupError.hidden = true;
      if (!els.setupForm.reportValidity()) {
        return;
      }
      if (startQuiz()) {
        saveCurrentSettings();
      }
    });
    els.nextBtn.addEventListener("click", moveNext);
    els.previousBtn.addEventListener("click", movePrevious);
    els.finishBtn.addEventListener("click", () => finishQuiz({ timedOut: false }));
    els.quitBtn.addEventListener("click", leaveQuiz);
    document.getElementById("review-answers").addEventListener("click", () => {
      if (state.currentAttempt) {
        renderReview(state.currentAttempt);
        showScreen("review");
      }
    });
    document.getElementById("review-back").addEventListener("click", () => showScreen("results"));
    document.getElementById("retry-quiz").addEventListener("click", retryCurrentAttempt);
    document.getElementById("review-retry").addEventListener("click", retryCurrentAttempt);
    document.getElementById("new-quiz-from-results").addEventListener("click", openSetup);
    document.getElementById("review-new-quiz").addEventListener("click", openSetup);
    document.getElementById("results-to-dashboard").addEventListener("click", () => showScreen("dashboard"));
    document.getElementById("review-dashboard").addEventListener("click", () => showScreen("dashboard"));
    els.clearHistory.addEventListener("click", () => {
      if (state.attempts.length === 0) {
        return;
      }
      if (window.confirm("Clear all saved quiz attempts from this browser?")) {
        if (QuizStorage.clearAttempts()) {
          state.attempts = [];
          updateQuestionLimit();
          renderHistory();
          renderDashboard();
        } else {
          window.alert("Saved attempts could not be cleared from this browser.");
        }
      }
    });
    els.historyList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-review]");
      if (button) {
        openAttempt(button.dataset.review);
      }
    });
    els.recentAttempts.addEventListener("click", (event) => {
      const button = event.target.closest("[data-review]");
      if (button) {
        openAttempt(button.dataset.review);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (screens.quiz.hidden || event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }
      const map = { a: 0, b: 1, c: 2, d: 3 };
      const key = event.key.toLowerCase();
      if (Object.hasOwn(map, key)) {
        selectOption(map[key]);
      } else if (event.key === "Enter" && !els.nextBtn.hidden) {
        event.preventDefault();
        moveNext();
      }
    });

    window.addEventListener("resize", () => {
      if (!screens.results.hidden && state.currentAttempt) {
        AbilityChart.drawChart(els.resultAbilityChart, state.currentAttempt.abilityHistory);
      }
      if (!screens.history.hidden) {
        drawHistoryProgress(state.attempts);
      }
    });
    window.addEventListener("storage", (event) => {
      if (event.key === QuizStorage.ATTEMPTS_KEY || event.key === QuizStorage.SEEN_QUESTION_IDS_KEY) {
        state.attempts = QuizStorage.readAttempts();
        renderDashboard();
        renderHistory();
        updateQuestionLimit();
      }
    });
  }

  fillTopicSelect();
  restoreSettings();
  bindEvents();
  renderDashboard();
  renderHistory();
  showScreen("dashboard");
})();
