import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const SCREENS = ["intro", "profile", "upload", "evaluate"];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
  width: 100%;
  min-height: 100%;
}
  :root {
    --cream: #F5F0E8;
    --ink: #1A1612;
    --warm: #C8622A;
    --warm-light: #E8A87C;
    --muted: #8A7F74;
    --card: #FDFAF5;
    --border: #DDD5C8;
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--ink); }

  .app {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

  /* NAV */
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 48px;
    border-bottom: 1px solid var(--border);
    background: var(--cream);
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .nav-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: -0.5px;
  }
  .nav-logo span { color: var(--warm); }
  .nav-steps {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .nav-step {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: 100px;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid transparent;
  }
  .nav-step:hover {
    background: var(--ink);
    color: var(--cream);
    border-color: var(--ink);
  }
  .nav-step:hover .step-num {
    background: var(--cream);
    color: var(--ink);
  }
  .nav-step.active {
    background: var(--ink);
    color: var(--cream);
  }
  .nav-step.done {
    color: var(--warm);
    border-color: var(--warm-light);
  }
  .step-num {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: currentColor;
    color: var(--cream);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    font-weight: 700;
    flex-shrink: 0;
  }
  .nav-step.active .step-num { background: var(--cream); color: var(--ink); }
  .nav-step.done .step-num { background: var(--warm); color: white; }

  /* SCREENS */
  .screen {
    flex: 1;
    animation: fadeIn 0.4s ease;
  }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

  /* --- INTRO SCREEN --- */
  .intro-hero {
    padding: 80px 48px 60px;
    max-width: 900px;
    margin: 0 auto;
  }
  .intro-tag {
    display: inline-block;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--warm);
    border: 1px solid var(--warm-light);
    padding: 4px 12px;
    border-radius: 100px;
    margin-bottom: 28px;
  }
  .intro-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.4rem, 5vw, 3.8rem);
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -1px;
    margin-bottom: 24px;
  }
  .intro-title em {
    font-style: italic;
    color: var(--warm);
  }
  .intro-sub {
    font-size: 1.1rem;
    color: var(--muted);
    line-height: 1.7;
    max-width: 600px;
    margin-bottom: 48px;
    font-weight: 300;
  }

  .intro-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 56px;
  }
  .intro-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px 24px;
    position: relative;
    overflow: hidden;
  }
  .intro-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--warm);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  .intro-card:hover::before { transform: scaleX(1); }
  .card-icon {
    font-size: 2rem;
    margin-bottom: 16px;
  }
  .card-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .card-desc {
    font-size: 0.88rem;
    color: var(--muted);
    line-height: 1.6;
  }
  .card-step {
    position: absolute;
    top: 20px; right: 20px;
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--border);
    letter-spacing: 1px;
  }

  .intro-cta {
    display: flex;
    gap: 16px;
    align-items: center;
  }
  .btn-primary {
    background: var(--ink);
    color: var(--cream);
    border: none;
    padding: 14px 32px;
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .btn-primary:hover { background: var(--warm); transform: translateY(-1px); }
  .btn-primary:disabled:hover { transform: none; }
  .btn-spinner {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid rgba(245, 240, 232, 0.3);
    border-top-color: var(--cream);
    border-radius: 50%;
    animation: btn-spin 0.7s linear infinite;
    vertical-align: middle;
    margin-right: 10px;
  }
  @keyframes btn-spin {
    to { transform: rotate(360deg); }
  }
  .btn-secondary {
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--border);
    padding: 14px 24px;
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-secondary:hover { border-color: var(--ink); color: var(--ink); }

  .intro-divider {
    border: none;
    border-top: 1px solid var(--border);
    margin: 56px 0;
  }
  .intro-team {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 32px;
    display: flex;
    gap: 40px;
    align-items: flex-start;
  }
  .team-label {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }
  .team-value {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem;
    font-weight: 600;
  }
  .team-block { flex: 1; }

  /* --- PROFILE SCREEN --- */
  .form-screen {
    max-width: 640px;
    margin: 60px auto;
    padding: 0 24px;
  }
  .screen-header {
    margin-bottom: 40px;
  }
  .screen-label {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--warm);
    margin-bottom: 12px;
  }
  .screen-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 10px;
  }
  .screen-sub {
    color: var(--muted);
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .form-group {
    margin-bottom: 24px;
  }
  .form-label {
    display: block;
    font-size: 0.85rem;
    font-weight: 500;
    margin-bottom: 8px;
    color: var(--ink);
  }
  .form-hint { color: var(--muted); font-weight: 300; }
  .form-input, .form-select, .form-textarea {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--card);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    color: var(--ink);
    outline: none;
    transition: border-color 0.2s;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    border-color: var(--warm);
  }
  .form-textarea { resize: vertical; min-height: 100px; }

  .radio-group {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }
  .radio-option {
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background: var(--card);
  }
  .radio-option:hover { border-color: var(--warm-light); }
  .radio-option.selected { border-color: var(--warm); background: #FDF0E8; }
  .radio-option .ro-icon { font-size: 1.4rem; margin-bottom: 6px; }
  .radio-option .ro-label { font-size: 0.78rem; font-weight: 500; }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 36px;
  }

  /* --- UPLOAD SCREEN --- */
  .upload-screen {
    max-width: 640px;
    margin: 60px auto;
    padding: 0 24px;
  }
  .dropzone {
    border: 2px dashed var(--border);
    border-radius: 20px;
    padding: 60px 40px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background: var(--card);
    margin-bottom: 24px;
  }
  .dropzone:hover { border-color: var(--warm); background: #FDF8F3; }
  .dropzone.has-file { border-color: var(--warm); border-style: solid; background: #FDF0E8; }
  .dz-icon { font-size: 3rem; margin-bottom: 16px; }
  .dz-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    margin-bottom: 8px;
  }
  .dz-sub { font-size: 0.85rem; color: var(--muted); }
  .dz-types {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-top: 16px;
  }
  .dz-type {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 1px;
    padding: 3px 10px;
    border-radius: 100px;
    background: var(--border);
    color: var(--muted);
  }

  .file-info {
    display: flex;
    align-items: center;
    gap: 16px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 24px;
  }
  .file-icon { font-size: 2rem; }
  .file-name { font-weight: 500; font-size: 0.95rem; }
  .file-size { font-size: 0.8rem; color: var(--muted); }
  .file-remove {
    margin-left: auto;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--muted);
    font-size: 1.1rem;
    transition: color 0.2s;
  }
  .file-remove:hover { color: var(--warm); }

  .profile-summary {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 32px;
  }
  .ps-label {
    font-size: 0.72rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 12px;
    font-weight: 500;
  }
  .ps-row {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
  }
  .ps-item { }
  .ps-key { font-size: 0.78rem; color: var(--muted); }
  .ps-val { font-size: 0.9rem; font-weight: 500; }

  /* --- EVALUATE SCREEN --- */
  .eval-screen {
    max-width: 760px;
    margin: 60px auto;
    padding: 0 24px;
  }
  .eval-placeholder {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 64px;
    text-align: center;
  }
  .ep-icon { font-size: 4rem; margin-bottom: 20px; }
  .ep-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    margin-bottom: 12px;
  }
  .ep-sub {
    color: var(--muted);
    font-size: 0.95rem;
    line-height: 1.7;
    max-width: 400px;
    margin: 0 auto 32px;
  }
  .ep-features {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-bottom: 32px;
    flex-wrap: wrap;
  }
  .ep-feat {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 8px 18px;
    font-size: 0.82rem;
    color: var(--muted);
  }
  .coming-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #FDF0E8;
    color: var(--warm);
    border: 1px solid var(--warm-light);
    border-radius: 100px;
    padding: 6px 16px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  /* AI result markdown */
  .result-box {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px 32px;
    margin-bottom: 32px;
  }
  .result-box h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.25rem;
    margin-bottom: 20px;
    color: var(--ink);
  }
  .result-box .md-content {
    font-size: 0.95rem;
    line-height: 1.75;
    color: var(--ink);
  }
  .result-box .md-content h1, .result-box .md-content h2, .result-box .md-content h3 {
    font-family: 'Playfair Display', serif;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-weight: 600;
  }
  .result-box .md-content h1 { font-size: 1.4rem; }
  .result-box .md-content h2 { font-size: 1.2rem; }
  .result-box .md-content h3 { font-size: 1.05rem; }
  .result-box .md-content p { margin-bottom: 1em; }
  .result-box .md-content p:last-child { margin-bottom: 0; }
  .result-box .md-content ul, .result-box .md-content ol {
    margin: 0.75em 0;
    padding-left: 1.5em;
  }
  .result-box .md-content li { margin-bottom: 0.35em; }
  .result-box .md-content code {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 2px 8px;
    font-size: 0.88em;
    font-family: ui-monospace, monospace;
  }
  .result-box .md-content pre {
    background: var(--ink);
    color: var(--cream);
    border-radius: 10px;
    padding: 16px 20px;
    overflow-x: auto;
    margin: 1em 0;
  }
  .result-box .md-content pre code {
    background: none;
    border: none;
    padding: 0;
    color: inherit;
  }
  .result-box .md-content blockquote {
    border-left: 4px solid var(--warm);
    margin: 1em 0;
    padding: 8px 0 8px 20px;
    color: var(--muted);
  }
  .result-box .md-content strong { font-weight: 600; }
  .result-box .md-content a {
    color: var(--warm);
    text-decoration: none;
  }
  .result-box .md-content a:hover { text-decoration: underline; }
  .result-box .md-content hr { border: none; border-top: 1px solid var(--border); margin: 1.5em 0; }
  .result-box .md-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
  }
  .result-box .md-content th, .result-box .md-content td {
    border: 1px solid var(--border);
    padding: 10px 14px;
    text-align: left;
  }
  .result-box .md-content th {
    background: var(--cream);
    font-weight: 600;
  }
`;

const LEVEL_OPTIONS = [
  { icon: "🌱", label: "Beginner" },
  { icon: "📘", label: "Intermediate" },
  { icon: "🔬", label: "Advanced" },
  { icon: "🎓", label: "Expert" },
];

export default function App() {
  const [screen, setScreen] = useState("intro");
  const [profile, setProfile] = useState({
    name: "",
    background: "",
    level: "Beginner",
    goal: "",
  });
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);

  const goTo = (s) => setScreen(s);

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log("Backend response:", data);

      setResult(data);
      setScreen("evaluate");
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const navSteps = [
    { id: "intro", label: "Intro" },
    { id: "profile", label: "Your Profile" },
    { id: "upload", label: "Upload" },
    { id: "evaluate", label: "Evaluate" },
  ];

  const screenIndex = SCREENS.indexOf(screen);

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo">
            Learn<span>Lens</span>
          </div>
          <div className="nav-steps">
            {navSteps.map((s, i) => (
              <button
                key={s.id}
                className={`nav-step ${screen === s.id ? "active" : ""} ${i < screenIndex ? "done" : ""}`}
                onClick={() => goTo(s.id)}
              >
                <div className="step-num">{i < screenIndex ? "✓" : i + 1}</div>
                {s.label}
              </button>
            ))}
          </div>
        </nav>

        {/* INTRO */}
        {screen === "intro" && (
          <div className="screen">
            <div className="intro-hero">
              <div className="intro-tag">Internship Project · Week 1</div>
              <h1 className="intro-title">
                Learning that speaks
                <br />
                <em>your language</em>
              </h1>
              <p className="intro-sub">
                LearnLens transforms any textbook or document into a
                personalized learning experience — tailored to who you are, what
                you know, and where you want to go.
              </p>

              <div className="intro-cards">
                <div className="intro-card">
                  <div className="card-step">STEP 01</div>
                  <div className="card-icon">🧠</div>
                  <div className="card-title">Build Your Profile</div>
                  <p className="card-desc">
                    Tell us your background, expertise level, and what you're
                    trying to learn.
                  </p>
                </div>
                <div className="intro-card">
                  <div className="card-step">STEP 02</div>
                  <div className="card-icon">📄</div>
                  <div className="card-title">Upload a Document</div>
                  <p className="card-desc">
                    Drop in any PDF — textbook, paper, manual — and we'll make
                    it yours.
                  </p>
                </div>
                <div className="intro-card">
                  <div className="card-step">STEP 03</div>
                  <div className="card-icon">✏️</div>
                  <div className="card-title">Get Evaluated</div>
                  <p className="card-desc">
                    Answer AI-generated questions and see exactly what you've
                    understood.
                  </p>
                </div>
              </div>

              <div className="intro-cta">
                <button className="btn-primary" onClick={() => goTo("profile")}>
                  Get Started →
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => goTo("upload")}
                >
                  Skip to Upload
                </button>
              </div>

              <hr className="intro-divider" />

              <div className="intro-team">
                <div className="team-block">
                  <div className="team-label">Project</div>
                  <div className="team-value">
                    Textbook Personalization System
                  </div>
                </div>
                <div className="team-block">
                  <div className="team-label">Your Mission</div>
                  <div className="team-value">
                    Build the AI layer that powers this
                  </div>
                </div>
                <div className="team-block">
                  <div className="team-label">Timeline</div>
                  <div className="team-value">Week 1 — UI Shell</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {screen === "profile" && (
          <div className="screen">
            <div className="form-screen">
              <div className="screen-header">
                <div className="screen-label">Step 1 of 3</div>
                <h2 className="screen-title">Tell us about yourself</h2>
                <p className="screen-sub">
                  This profile shapes how the system personalizes your document
                  and generates your evaluation questions.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Your Name{" "}
                  <span className="form-hint">(so we can address you)</span>
                </label>
                <input
                  className="form-input"
                  placeholder="e.g. Amara Osei"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Background / Field of Study
                </label>
                <input
                  className="form-input"
                  placeholder="e.g. Electrical Engineering, 3rd year"
                  value={profile.background}
                  onChange={(e) =>
                    setProfile({ ...profile, background: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Expertise Level{" "}
                  <span className="form-hint">
                    (on the topic you're uploading)
                  </span>
                </label>
                <div className="radio-group">
                  {LEVEL_OPTIONS.map((o) => (
                    <div
                      key={o.label}
                      className={`radio-option ${profile.level === o.label ? "selected" : ""}`}
                      onClick={() => setProfile({ ...profile, level: o.label })}
                    >
                      <div className="ro-icon">{o.icon}</div>
                      <div className="ro-label">{o.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Learning Goal{" "}
                  <span className="form-hint">
                    (what do you want to walk away with?)
                  </span>
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="e.g. Understand enough to implement a basic PID controller in an embedded system"
                  value={profile.goal}
                  onChange={(e) =>
                    setProfile({ ...profile, goal: e.target.value })
                  }
                />
              </div>

              <div className="form-actions">
                <button className="btn-secondary" onClick={() => goTo("intro")}>
                  Back
                </button>
                <button className="btn-primary" onClick={() => goTo("upload")}>
                  Continue →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* UPLOAD */}
        {screen === "upload" && (
          <div className="screen">
            <div className="upload-screen">
              <div className="screen-header">
                <div className="screen-label">Step 2 of 3</div>
                <h2 className="screen-title">Upload your document</h2>
                <p className="screen-sub">
                  Upload a PDF and LearnLens will personalize it to match your
                  profile.
                </p>
              </div>

              {file ? (
                <div className="file-info">
                  <div className="file-icon">📄</div>
                  <div>
                    <div className="file-name">{file.name}</div>
                    <div className="file-size">
                      {(file.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                  <button className="file-remove" onClick={() => setFile(null)}>
                    ✕
                  </button>
                </div>
              ) : (
                <section
                  className="dropzone"
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    hidden
                    onChange={(e) =>
                      e.target.files[0] && setFile(e.target.files[0])
                    }
                  />
                  <div className="dz-icon">📂</div>
                  <div className="dz-title">Drop your PDF here</div>
                  <p className="dz-sub">or click to browse files</p>
                  <div className="dz-types">
                    <span className="dz-type">PDF</span>
                  </div>
                </section>
              )}

              {profile.name && (
                <div className="profile-summary">
                  <div className="ps-label">Personalizing for</div>
                  <div className="ps-row">
                    <div className="ps-item">
                      <div className="ps-key">Name</div>
                      <div className="ps-val">{profile.name || "—"}</div>
                    </div>
                    <div className="ps-item">
                      <div className="ps-key">Background</div>
                      <div className="ps-val">{profile.background || "—"}</div>
                    </div>
                    <div className="ps-item">
                      <div className="ps-key">Level</div>
                      <div className="ps-val">{profile.level}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button
                  className="btn-secondary"
                  onClick={() => goTo("profile")}
                >
                  Back
                </button>
                <button
                  className="btn-primary"
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  style={{ opacity: file && !isUploading ? 1 : 0.4 }}
                >
                  {isUploading ? (
                    <>
                      <span className="btn-spinner" aria-hidden />
                      Personalizing…
                    </>
                  ) : (
                    "Personalize & Continue →"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EVALUATE */}
        {screen === "evaluate" && (
          <div className="screen">
            <div className="eval-screen">
              <div className="screen-header">
                <div className="screen-label">Step 3 of 3</div>
                <h2 className="screen-title">Knowledge Evaluation</h2>
                <p className="screen-sub">
                  This is where you find out what you've really understood.
                </p>
              </div>

              {result && (
                <div className="result-box">
                  <h3>AI Analysis</h3>
                  <div className="md-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {result.aiOutput ?? ""}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              <div className="eval-placeholder">
                <div className="ep-icon">🧩</div>
                <h3 className="ep-title">Evaluation Engine</h3>
                <p className="ep-sub">
                  The AI will generate questions based on your document and
                  score your answers against the source material.
                </p>
                <div className="ep-features">
                  <div className="ep-feat">📝 Generated Q&A</div>
                  <div className="ep-feat">🎯 Adaptive Difficulty</div>
                  <div className="ep-feat">📊 Comprehension Report</div>
                  <div className="ep-feat">🔁 Review Suggestions</div>
                </div>
                <div className="coming-badge">⚡ Week 2 — You build this</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
