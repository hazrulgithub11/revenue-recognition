/**
 * Minimal quiz widget — equal-length answer labels recommended by caller.
 */
export function mountQuiz(root, { question, choices, correctIndex, explainOk, explainBad }) {
  root.innerHTML = "";
  const title = document.createElement("h3");
  title.textContent = question;
  root.appendChild(title);

  const feedback = document.createElement("div");
  feedback.className = "feedback";

  choices.forEach((label, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = label;
    btn.addEventListener("click", () => {
      const ok = i === correctIndex;
      feedback.className = "feedback " + (ok ? "ok" : "bad");
      feedback.textContent = ok ? explainOk : explainBad;
    });
    root.appendChild(btn);
  });

  root.appendChild(feedback);
}
