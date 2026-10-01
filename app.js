/* InterviewPilot MVP — static mock-interview coach. No backend, no tracking. */
const ROLES = ["AI Engineer", "ML Engineer", "Full-Stack Developer", "Data Scientist"];
const DIMS = [
  { id: "clarity", name: "Clarity", desc: "Structured, easy to follow" },
  { id: "depth", name: "Technical depth", desc: "Correct detail, trade-offs" },
  { id: "relevance", name: "Relevance", desc: "Actually answered the question" },
  { id: "communication", name: "Communication", desc: "Concise, confident delivery" },
];
const BANK = {
"AI Engineer": {
"Behavioral": [
 { q: "Tell me about an AI feature you shipped end to end.", mins: 3,
   model: "Use STAR: the problem, why an LLM beat rules or a classifier, your stack (e.g. LangChain, pgvector, FastAPI), how you evaluated it, and one number — latency, cost per request, or accuracy lift. Close with what you would change.",
   tip: "Name tools and numbers. Adjectives like 'robust' score zero." },
 { q: "Your LLM feature starts hallucinating in production. Walk me through your response.", mins: 3,
   model: "Reproduce it, then add grounding: retrieval with cited sources, a confidence threshold with a safe fallback ('I don't know, here's a human'), a regression set of the failure cases, and monitoring for drift. Talk like an engineer, not a prompt tweaker.",
   tip: "They want guardrails and process, not a better prompt." },
 { q: "How do you stay current with AI?", mins: 2,
   model: "Name two or three real sources — specific papers, model changelogs, newsletters — and one recent technique you actually tried in a side project. 'I read a lot' is a non-answer.",
   tip: "Specific beats generic. One real experiment beats ten subscriptions." },
],
"Technical": [
 { q: "Explain RAG — and tell me when you would deliberately NOT use it.", mins: 4,
   model: "RAG = retrieve relevant chunks, then generate grounded on them. Use it when knowledge is private, large, or fast-changing. Skip it when the task is pure reasoning over small context, when latency budget is tight, or when fine-tuning on stable knowledge is cheaper at scale.",
   tip: "The second half of the question is the real test: trade-offs." },
 { q: "How do you cut LLM latency and cost in production?", mins: 4,
   model: "Route simple queries to smaller models, cache exact and semantic matches, stream tokens, quantize, batch requests, and compress prompts. Measure cost per successful task, not per token — a cheap model that fails twice is expensive.",
   tip: "Give numbers from real experience whenever you can." },
 { q: "What is an embedding, and how do you choose chunk size for retrieval?", mins: 3,
   model: "An embedding is a dense vector capturing meaning, so similarity search finds related content. Smaller chunks give precise Q&A hits; larger chunks preserve context for summarization. Start around 300–500 tokens with 10–20% overlap, then tune against an eval set.",
   tip: "Mentioning evaluation turns a textbook answer into an engineering one." },
],
"System Design": [
 { q: "Design a customer-support chatbot handling 10k questions a day.", mins: 8,
   model: "Chat widget → API → intent router → RAG over the docs index (vector DB) → LLM → answer with citations; low-confidence queries escalate to a human. Add caching, rate limiting, PII redaction, and an eval harness. Sketch the boxes first, then go deep on one.",
   tip: "Draw the architecture before diving into any single box." },
 { q: "Design a pipeline that keeps an AI assistant's knowledge fresh.", mins: 8,
   model: "Crawlers and webhooks feed new documents → dedupe → chunk and embed → write to a versioned index → run shadow evals comparing old vs new index → promote or roll back. Freshness is a data pipeline problem, not a model problem.",
   tip: "Say the words 'versioned' and 'rollback' out loud." },
 { q: "How would you evaluate that chatbot before launch?", mins: 5,
   model: "Build a golden Q&A set from real tickets, score faithfulness and answer relevance with an LLM judge plus human spot checks, red-team with adversarial inputs, and set a launch gate (e.g. 95% grounded answers). No evals, no launch.",
   tip: "'Evals' is the word interviewers are listening for." },
]},
"ML Engineer": {
"Behavioral": [
 { q: "Tell me about a model you took from notebook to production.", mins: 3,
   model: "Cover the handoff: how you packaged it (API, batch), what broke (data skew, latency, monitoring gaps), and what you put around it — logging, alerts, rollback. Shipping is 20% modeling, 80% plumbing.",
   tip: "They are testing whether you have felt production pain." },
 { q: "Your model's metrics decayed three months after launch. What do you do?", mins: 3,
   model: "Check for data drift and pipeline breaks first — most decay is data, not modeling. Compare live feature distributions to training, look at segment-level metrics, then decide: fix the pipeline, retrain, or redesign the target. Never retrain blindly.",
   tip: "'Check the data first' is the senior answer." },
 { q: "A stakeholder demands a complex model when a simple one would do. How do you handle it?", mins: 2,
   model: "Build the simple baseline first and put its numbers on the table — accuracy, latency, maintenance cost. Let the trade-off be visible, then agree on what lift would justify the complexity. Disagree with data, not opinions.",
   tip: "Show you optimize business outcomes, not resume keywords." },
],
"Technical": [
 { q: "Explain bias-variance tradeoff like I'm a product manager.", mins: 3,
   model: "Bias is the model being too simple and missing patterns; variance is it memorizing noise. Simple models underfit, complex ones overfit. You balance them with more data, regularization, and cross-validation — and you explain it in business terms: reliability vs flexibility.",
   tip: "If you can't simplify it, you don't own it." },
 { q: "How do you do cross-validation for time-series data?", mins: 3,
   model: "Never shuffle — use rolling-origin splits: train on the past, validate on the next window, then roll forward. Shuffled k-fold leaks the future and gives fantasy metrics. Match the validation scheme to how the model will actually be used.",
   tip: "'Rolling origin' + 'no shuffling' = full marks." },
 { q: "Your classifier has 99% accuracy but is useless. What happened?", mins: 3,
   model: "Class imbalance — predicting the majority class scores 99% while catching nothing. Switch to precision, recall, F1, or PR-AUC, look at the confusion matrix, and consider resampling, class weights, or threshold tuning. Accuracy lies; the confusion matrix doesn't.",
   tip: "Name the metric you would use instead." },
],
"System Design": [
 { q: "Design a real-time fraud scoring service (p99 under 100ms).", mins: 8,
   model: "Event stream → feature store (precomputed + real-time features) → model server (ONNX/Triton) → decision + shadow logging. Keep the hot path lean: no DB joins at request time, features materialized ahead. Fallback rules if the model is down.",
   tip: "Latency budget drives every choice — say it explicitly." },
 { q: "Design a retraining pipeline for a model that drifts monthly.", mins: 8,
   model: "Scheduled job pulls fresh labeled data → validation checks → train → evaluate against champion on holdout + business metrics → promote if better, alert if worse. Version data, code, and model together so any deploy is reproducible.",
   tip: "Champion/challenger is the pattern they expect." },
 { q: "How do you monitor an ML system in production?", mins: 5,
   model: "Three layers: system (latency, errors), data (feature drift, missing values), and model (prediction distribution, business KPI proxy). Alert on drift before users feel it, and always keep a human-readable dashboard a PM can open.",
   tip: "Data monitoring matters more than model monitoring." },
]}};
Object.assign(BANK, {
"Full-Stack Developer": {
"Behavioral": [
 { q: "Tell me about a feature you owned end to end.", mins: 3,
   model: "Pick one feature and walk the full slice: the user need, your API design, the UI, the edge cases you handled, and how you verified it in production. End-to-end ownership is the whole point of the title.",
   tip: "One deep story beats three shallow ones." },
 { q: "Tell me about a production incident you caused or fixed.", mins: 3,
   model: "What broke, how you found it, the fix, and — most important — what you changed so it can't happen again (tests, alerts, runbook). Blameless, specific, and honest about your part.",
   tip: "The follow-up prevention is what they score." },
 { q: "How do you work with designers and PMs when requirements are vague?", mins: 2,
   model: "Ask what the user is trying to do, propose the smallest shippable version, and get feedback on something clickable fast. Vague requirements are normal — your process for sharpening them is the skill.",
   tip: "Show a process, not a complaint about PMs." },
],
"Technical": [
 { q: "REST vs GraphQL — when do you pick which?", mins: 3,
   model: "REST for simple CRUD with stable contracts and great caching; GraphQL when clients need flexible queries and you want to kill over/under-fetching. GraphQL costs you caching complexity and query-cost guardrails. Choose by client needs, not hype.",
   tip: "Name one real cost of your preferred choice." },
 { q: "How do you handle authentication in a web app?", mins: 4,
   model: "Short-lived access tokens plus rotating refresh tokens in httpOnly cookies, or server sessions for simpler apps. Hash passwords with bcrypt/argon2, never roll your own crypto, add rate limiting on login, and know where your tokens live (XSS vs CSRF trade-off).",
   tip: "Token storage trade-off is the expected depth." },
 { q: "What is the N+1 query problem and how do you fix it?", mins: 3,
   model: "Loading a list then querying per item — 1 query becomes 101. Fix with eager loading / joins, batching (dataloaders), or denormalization. Spot it with query logging in development, not in production.",
   tip: "Mention how you'd detect it, not just define it." },
],
"System Design": [
 { q: "Design a URL shortener like bit.ly.", mins: 8,
   model: "API takes a long URL → hash/encode to a short key (base62 of a counter or hash) → store mapping → redirect on lookup. Cache hot keys, rate-limit creation, handle collisions, and plan for billions of rows with sharding. Keep it simple — it's a classic for a reason.",
   tip: "Nail the key-generation choice; everything else follows." },
 { q: "Design a real-time chat for a million users.", mins: 8,
   model: "WebSocket gateway → pub/sub (Redis/Kafka) → fan-out to room members → persist history to a fast store. Presence, typing indicators, and message ordering are the hard parts — solve those before worrying about scale numbers.",
   tip: "Ordering and presence are the differentiators." },
 { q: "Design a rate limiter.", mins: 5,
   model: "Token bucket or sliding-window counter in Redis, checked at the API gateway. Decide per-user vs per-IP, pick limits per endpoint, return 429 with Retry-After headers. Distributed counting is the crux — local counters lie across instances.",
   tip: "Token bucket vs fixed window: know the trade-off." },
]},
"Data Scientist": {
"Behavioral": [
 { q: "Tell me about an analysis that changed a business decision.", mins: 3,
   model: "The question, the data you pulled, the key finding, and what the business did differently because of it. Quantify the impact — revenue, cost, conversion. Analysis without a decision is a hobby.",
   tip: "End with the decision, not the chart." },
 { q: "A stakeholder doesn't trust your numbers. What do you do?", mins: 2,
   model: "Get curious, not defensive: reproduce their number first, find where the definitions diverge (date ranges, filters, metric definitions), and agree on one source of truth going forward. Trust is built on definitions.",
   tip: "'Reproduce their number first' disarms the conflict." },
 { q: "How do you handle a vague request like 'look into churn'?", mins: 3,
   model: "Clarify the decision behind the question, define churn precisely, segment it, find the drivers, and come back with a recommendation — not a dump of charts. Scope the question before touching the data.",
   tip: "Your scoping process is the answer." },
],
"Technical": [
 { q: "When is a p-value misleading?", mins: 3,
   model: "With huge samples tiny meaningless effects look 'significant'; with peeking and multiple testing, false positives pile up. Always pair it with effect size and confidence intervals, and pre-register your hypothesis when you can.",
   tip: "Effect size + CI is the complete answer." },
 { q: "How do you handle severe class imbalance?", mins: 3,
   model: "First fix the metric — PR-AUC, F1, or expected business cost instead of accuracy. Then consider class weights, resampling, or threshold tuning. And ask whether the business cares about catching positives or avoiding false alarms — that sets the threshold.",
   tip: "Tie the threshold to business cost." },
 { q: "Correlation vs causation — how do you move toward causal answers?", mins: 4,
   model: "Correlation is a clue. For causation: run experiments (A/B tests) when possible; otherwise use quasi-experimental methods like diff-in-diff or propensity matching, and always list the confounders you can't rule out. Honesty about limits builds credibility.",
   tip: "Name one method and one confounder example." },
],
"System Design": [
 { q: "Design an experimentation (A/B testing) platform.", mins: 8,
   model: "Assignment service (consistent hashing by user) → event logging → metrics pipeline → stats engine (sequential testing, guardrail metrics) → dashboard. Hard parts: avoiding peeking bias, handling overlapping experiments with mutual exclusion, and trustworthy sample-ratio checks.",
   tip: "Peeking and SRM checks show real experience." },
 { q: "Design a demand forecasting pipeline.", mins: 8,
   model: "Ingest history → feature engineering (lags, seasonality, holidays, promotions) → train challenger models with rolling-origin backtests → deploy the winner → monitor drift and auto-retrain. Backtesting scheme must mirror production usage or metrics are fiction.",
   tip: "Backtesting design is the heart of the answer." },
 { q: "Design an executive dashboard for company KPIs.", mins: 5,
   model: "Agree on metric definitions first — that IS the project. Then: clean data marts, daily refresh with data-quality checks, a handful of trends with context (vs target, vs last period), and drill-downs. Fewer metrics, trusted deeply.",
   tip: "'Define metrics first' is the senior signal." },
]}});

/* ---------------- session state ---------------- */
const $ = id => document.getElementById(id);
const state = { role: "", round: "", qi: 0, scores: [], timerId: null, secs: 0, recog: null, listening: false };

ROLES.forEach(r => { const o = document.createElement("option"); o.textContent = r; $("role").appendChild(o); });
if (window.webkitSpeechRecognition || window.SpeechRecognition) { $("micBtn").classList.remove("hidden"); }

function show(id) {
  ["screen-setup","screen-question","screen-feedback","screen-report"].forEach(s => $(s).classList.add("hidden"));
  $(id).classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function fmt(s) { return String(Math.floor(s/60)).padStart(2,"0") + ":" + String(s%60).padStart(2,"0"); }

function startSession() {
  state.role = $("role").value; state.round = $("round").value;
  state.qi = 0; state.scores = [];
  askQuestion();
}
function questions() { return BANK[state.role][state.round]; }

function askQuestion() {
  const qs = questions(), q = qs[state.qi];
  show("screen-question");
  $("qMeta").textContent = `${state.role} · ${state.round} · Question ${state.qi+1} of ${qs.length}`;
  $("qText").textContent = q.q;
  $("qTip").textContent = "Interviewer tip: " + q.tip;
  $("pbar").style.width = (state.qi / qs.length * 100) + "%";
  $("answer").value = "";
  stopListening();
  state.secs = q.mins * 60;
  $("timer").textContent = fmt(state.secs);
  $("timer").classList.remove("low");
  clearInterval(state.timerId);
  state.timerId = setInterval(() => {
    state.secs--;
    $("timer").textContent = fmt(Math.max(0, state.secs));
    if (state.secs <= 30) $("timer").classList.add("low");
    if (state.secs <= 0) { clearInterval(state.timerId); submitAnswer(true); }
  }, 1000);
}

function stopListening() {
  if (state.recog) { try { state.recog.stop(); } catch(e){} state.listening = false; $("micBtn").textContent = "🎙 Dictate"; }
}

function toggleMic() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR || !$("voiceToggle").checked) return;
  if (state.listening) { stopListening(); return; }
  state.recog = new SR();
  state.recog.lang = "en-US"; state.recog.interimResults = false;
  state.recog.onresult = e => {
    const t = Array.from(e.results).map(r => r[0].transcript).join(" ");
    $("answer").value += ($("answer").value ? " " : "") + t;
  };
  state.recog.onend = () => { state.listening = false; $("micBtn").textContent = "🎙 Dictate"; };
  state.recog.start();
  state.listening = true;
  $("micBtn").textContent = "⏹ Stop";
}

function submitAnswer(auto) {
  clearInterval(state.timerId); stopListening();
  if (auto && !$("answer").value.trim()) { /* treat as skip */ state.scores.push(null); nextStep(); return; }
  showFeedback();
}

function showFeedback() {
  const qs = questions(), q = qs[state.qi];
  show("screen-feedback");
  $("fMeta").textContent = `${state.role} · ${state.round} · Question ${state.qi+1} of ${qs.length}`;
  $("fQ").textContent = q.q;
  $("fModel").textContent = q.model;
  const box = $("sliders"); box.innerHTML = "";
  DIMS.forEach(d => {
    const row = document.createElement("div");
    row.className = "sliderRow";
    row.innerHTML = `<div class="nm">${d.name}<small>${d.desc}</small></div>
      <input type="range" min="1" max="5" value="3" data-dim="${d.id}">
      <div class="vv">3</div>`;
    const inp = row.querySelector("input"), val = row.querySelector(".vv");
    inp.oninput = () => val.textContent = inp.value;
    box.appendChild(row);
  });
}

function nextStep() {
  const inputs = document.querySelectorAll("#sliders input");
  if (inputs.length) {
    const s = {};
    inputs.forEach(i => s[i.dataset.dim] = +i.value);
    state.scores.push(s);
  }
  state.qi++;
  if (state.qi < questions().length) askQuestion(); else showReport();
}

const DRILLS = {
  clarity: ["Record yourself answering one behavioral question, then transcribe it — cut every sentence that doesn't add evidence.", "Use the STAR structure (Situation, Task, Action, Result) for every story until it's automatic."],
  depth: ["For each technical answer, force yourself to add one trade-off: 'the cost of this choice is…'.", "Rebuild one project concept from memory on a whiteboard, naming every component and why it's there."],
  relevance: ["Before answering, repeat the question back in your own words — then check your answer addressed exactly that.", "Practice the 30-second rule: if you can't state your point in 30 seconds, you're rambling."],
  communication: ["Do one full mock round standing up and speaking out loud — typing hides delivery problems.", "Cut filler: record audio and count your 'um's and 'like's, then redo the answer."],
};

function showReport() {
  show("screen-report");
  const valid = state.scores.filter(Boolean);
  const avg = {};
  DIMS.forEach(d => {
    const vals = valid.map(s => s[d.id]).filter(v => v != null);
    avg[d.id] = vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : 0;
  });
  const overall = DIMS.reduce((a,d)=>a+avg[d.id],0)/DIMS.length;
  $("rScore").textContent = valid.length ? overall.toFixed(1) + " / 5" : "—";
  const weak = DIMS.reduce((a,b)=> avg[a.id]<=avg[b.id]?a:b);
  const strong = DIMS.reduce((a,b)=> avg[a.id]>=avg[b.id]?a:b);
  $("rSummary").textContent = valid.length
    ? `You answered ${valid.length} of ${questions().length} ${state.round.toLowerCase()} questions for the ${state.role} track. Strongest: ${strong.name.toLowerCase()}. Focus area: ${weak.name.toLowerCase()}.`
    : "You skipped every question — the rubric can't score silence. Run it back and attempt each one.";
  const rd = $("rDims"); rd.innerHTML = "";
  DIMS.forEach(d => {
    const el = document.createElement("div");
    el.className = "dim";
    el.innerHTML = `<div class="lab"><span>${d.name}</span><span>${avg[d.id].toFixed(1)} / 5</span></div>
      <div class="bar"><i style="width:${avg[d.id]/5*100}%"></i></div>`;
    rd.appendChild(el);
  });
  const plan = $("rPlan"); plan.innerHTML = "";
  const items = [
    `<b>Attack ${weak.name.toLowerCase()} first</b> — it's your cheapest source of points: ${DRILLS[weak.id][0]}`,
    DRILLS[weak.id][1],
    `<b>Redo this ${state.round.toLowerCase()} round tomorrow</b> — same questions, spoken out loud, aiming for ${Math.min(5, Math.ceil(overall)+1)}+ average.`,
    `<b>Keep your ${strong.name.toLowerCase()} sharp</b> — teach one answer to a friend; teaching exposes hidden gaps.`,
  ];
  items.forEach(t => { const li = document.createElement("li"); li.innerHTML = t; plan.appendChild(li); });
}

$("startBtn").onclick = startSession;
$("submitBtn").onclick = () => submitAnswer(false);
$("skipBtn").onclick = () => { state.scores.push(null); state.qi++; state.qi < questions().length ? askQuestion() : showReport(); };
$("nextBtn").onclick = nextStep;
$("micBtn").onclick = toggleMic;
$("againBtn").onclick = () => show("screen-setup");
$("retryBtn").onclick = () => { state.qi = 0; state.scores = []; askQuestion(); };
$("answer").addEventListener("keydown", e => { if ((e.ctrlKey||e.metaKey) && e.key === "Enter") submitAnswer(false); });
