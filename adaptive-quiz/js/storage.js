/**
 * Local persistence for quiz attempts and setup preferences.
 * Invalid or unavailable browser storage is reported and never breaks the quiz.
 */
(function (global) {
  const ATTEMPTS_KEY = "aqse_attempts_v1";
  const SETTINGS_KEY = "aqse_settings_v1";
  const SEEN_QUESTION_IDS_KEY = "aqse_seen_question_ids_v1";
  const MAX_ATTEMPTS = 50;

  function getStorage() {
    try {
      return global.localStorage;
    } catch (error) {
      console.warn("Browser storage is unavailable.", error);
      return null;
    }
  }

  function isFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function normalizeAnswer(answer) {
    if (!answer || typeof answer !== "object" || !Array.isArray(answer.options)) {
      return null;
    }

    const options = answer.options.filter((option) => typeof option === "string");
    const correctIndex = Number(answer.correctIndex);
    if (
      typeof answer.question !== "string" ||
      typeof answer.topic !== "string" ||
      !["Easy", "Medium", "Hard"].includes(answer.difficulty) ||
      options.length !== answer.options.length ||
      options.length === 0 ||
      !Number.isInteger(correctIndex) ||
      correctIndex < 0 ||
      correctIndex >= options.length
    ) {
      return null;
    }

    const selectedIndex = Number.isInteger(answer.selectedIndex)
      && answer.selectedIndex >= 0
      && answer.selectedIndex < options.length
      ? answer.selectedIndex
      : null;
    const isCorrect = selectedIndex !== null && selectedIndex === correctIndex;
    const possiblePoints = { Easy: 10, Medium: 15, Hard: 20 }[answer.difficulty];

    return {
      id: typeof answer.id === "string" ? answer.id : "",
      topic: answer.topic,
      difficulty: answer.difficulty,
      question: answer.question,
      options,
      selectedIndex,
      correctIndex,
      explanation: typeof answer.explanation === "string" ? answer.explanation : "",
      isCorrect,
      points: isCorrect ? possiblePoints : 0,
      possiblePoints,
      abilityBefore: isFiniteNumber(answer.abilityBefore) ? answer.abilityBefore : 0,
      abilityAfter: isFiniteNumber(answer.abilityAfter) ? answer.abilityAfter : 0
    };
  }

  function normalizeAttempt(attempt) {
    if (!attempt || typeof attempt !== "object" || !Array.isArray(attempt.answers)) {
      return null;
    }

    const answers = attempt.answers.map(normalizeAnswer);
    if (answers.some((answer) => answer === null)) {
      return null;
    }

    const correctCount = answers.filter((answer) => answer.isCorrect).length;
    const answeredCount = answers.filter((answer) => answer.selectedIndex !== null).length;
    const questionCount = answers.length;
    const timedOut = attempt.timedOut === true || attempt.status === "timed_out";
    const status = timedOut
      ? "timed_out"
      : answeredCount === questionCount
        ? "completed"
        : "incomplete";
    const maxScore = answers.reduce((sum, answer) => sum + answer.possiblePoints, 0);
    const score = answers.reduce((sum, answer) => sum + answer.points, 0);
    const date = typeof attempt.date === "string" && Number.isFinite(Date.parse(attempt.date))
      ? attempt.date
      : new Date(0).toISOString();
    const validTopic = attempt.topic === "All topics" || global.TOPICS.includes(attempt.topic);

    return {
      id: typeof attempt.id === "string" ? attempt.id : `saved-${date}-${Math.random().toString(36).slice(2)}`,
      name: typeof attempt.name === "string" ? attempt.name : "Learner",
      subject: typeof attempt.subject === "string" ? attempt.subject.slice(0, 60) : "Computer Science",
      topic: validTopic ? attempt.topic : "All topics",
      startingDifficulty: ["Easy", "Medium", "Hard"].includes(attempt.startingDifficulty)
        ? attempt.startingDifficulty
        : "Medium",
      date,
      score,
      maxScore,
      correctCount,
      incorrectCount: answeredCount - correctCount,
      unansweredCount: answers.length - answeredCount,
      accuracy: answeredCount ? Math.round((correctCount / answeredCount) * 100) : 0,
      completionRate: questionCount ? Math.round((answeredCount / questionCount) * 100) : 0,
      abilityHistory: Array.isArray(attempt.abilityHistory)
        ? attempt.abilityHistory.filter(isFiniteNumber)
        : [0],
      finalAbility: isFiniteNumber(attempt.finalAbility) ? attempt.finalAbility : 0,
      answers,
      seenQuestionIds: Array.isArray(attempt.seenQuestionIds)
        ? attempt.seenQuestionIds.filter((id) => typeof id === "string")
        : answers.map((answer) => answer.id).filter(Boolean),
      topicStats: Array.isArray(attempt.topicStats) ? attempt.topicStats : [],
      questionCount,
      durationSeconds: isFiniteNumber(attempt.durationSeconds) ? attempt.durationSeconds : 0,
      elapsedSeconds: isFiniteNumber(attempt.elapsedSeconds) ? attempt.elapsedSeconds : 0,
      timedOut,
      status,
      performance: typeof attempt.performance === "string" ? attempt.performance : ""
    };
  }

  function readAttempts() {
    const storage = getStorage();
    if (!storage) {
      return [];
    }

    try {
      const raw = storage.getItem(ATTEMPTS_KEY);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        console.warn("Saved quiz history is not a list and was ignored.");
        return [];
      }

      const attempts = parsed.map(normalizeAttempt);
      if (attempts.some((attempt) => attempt === null)) {
        console.warn("Malformed saved quiz attempts were ignored.");
      }
      return attempts.filter(Boolean).slice(0, MAX_ATTEMPTS);
    } catch (error) {
      console.warn("Could not read saved quiz attempts.", error);
      return [];
    }
  }

  function writeAttempts(attempts) {
    const storage = getStorage();
    if (!storage) {
      return false;
    }

    try {
      storage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts.slice(0, MAX_ATTEMPTS)));
      return true;
    } catch (error) {
      console.error("Could not save quiz history.", error);
      return false;
    }
  }

  function readSeenQuestionIds() {
    const storage = getStorage();
    if (!storage) {
      return new Set();
    }

    try {
      const savedIds = JSON.parse(storage.getItem(SEEN_QUESTION_IDS_KEY) || "[]");
      const currentIds = new Set(Array.isArray(savedIds)
        ? savedIds.filter((id) => typeof id === "string")
        : []);
      readAttempts().forEach((attempt) => {
        attempt.seenQuestionIds.forEach((id) => currentIds.add(id));
      });
      return currentIds;
    } catch (error) {
      console.warn("Could not read the previously used quiz questions.", error);
      return new Set(readAttempts().flatMap((attempt) => attempt.seenQuestionIds));
    }
  }

  function writeSeenQuestionIds(ids) {
    const storage = getStorage();
    if (!storage) {
      return false;
    }

    try {
      storage.setItem(SEEN_QUESTION_IDS_KEY, JSON.stringify([...new Set(ids)]));
      return true;
    } catch (error) {
      console.error("Could not save quiz question history.", error);
      return false;
    }
  }

  function saveAttempt(attempt) {
    const normalized = normalizeAttempt(attempt);
    if (!normalized) {
      console.error("Could not save an invalid quiz result.");
      return false;
    }
    const existingAttempts = readAttempts();
    const attemptsSaved = writeAttempts([
      normalized,
      ...existingAttempts.filter((item) => item.id !== normalized.id)
    ]);
    if (!attemptsSaved) {
      return false;
    }

    const seenQuestionIds = readSeenQuestionIds();
    normalized.seenQuestionIds.forEach((id) => seenQuestionIds.add(id));
    return writeSeenQuestionIds(seenQuestionIds);
  }

  function getAttempt(id) {
    return readAttempts().find((item) => item.id === id) || null;
  }

  function clearAttempts() {
    const storage = getStorage();
    if (!storage) {
      return false;
    }

    try {
      storage.removeItem(ATTEMPTS_KEY);
      storage.removeItem(SEEN_QUESTION_IDS_KEY);
      return true;
    } catch (error) {
      console.error("Could not clear saved quiz history.", error);
      return false;
    }
  }

  function readSettings() {
    const storage = getStorage();
    if (!storage) {
      return {};
    }

    try {
      const parsed = JSON.parse(storage.getItem(SETTINGS_KEY) || "{}");
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch (error) {
      console.warn("Could not read saved quiz preferences.", error);
      return {};
    }
  }

  function writeSettings(settings) {
    const storage = getStorage();
    if (!storage) {
      return false;
    }

    try {
      storage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.warn("Could not save quiz preferences.", error);
      return false;
    }
  }

  global.QuizStorage = {
    ATTEMPTS_KEY,
    SETTINGS_KEY,
    SEEN_QUESTION_IDS_KEY,
    readAttempts,
    readSeenQuestionIds,
    saveAttempt,
    getAttempt,
    clearAttempts,
    readSettings,
    writeSettings
  };
})(window);
