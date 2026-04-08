import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { api } from "../api/client";
import { useAppStore } from "../store/appStore";

export function LoginPage(): JSX.Element {
  const navigate = useNavigate();
  const { setTokens, setUser } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login", { email, password });
      const { access_token, refresh_token } = response.data;
      setTokens(access_token, refresh_token);
      setUser({
        id: "current-user",
        fullName: email.split("@")[0],
        email,
        role: "ophthalmologist",
      });
      navigate("/dashboard");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string }; status?: number }; code?: string };
      if (axiosErr.code === "ERR_NETWORK" || axiosErr.code === "ECONNREFUSED") {
        // Offline fallback: allow access for demo purposes
        setTokens("demo-token", "demo-refresh");
        setUser({
          id: "demo-user",
          fullName: email ? email.split("@")[0] : "Demo User",
          email: email || "demo@retinaiq.ai",
          role: "ophthalmologist",
        });
        navigate("/dashboard");
      } else if (axiosErr.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError(axiosErr.response?.data?.detail || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ─── LEFT PANEL: Visual ─── */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, rgba(7,11,24,0.95) 0%, rgba(3,6,13,1) 100%)",
        }}
      >
        {/* Ambient Glow */}
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animation: "ambientFloat 20s ease-in-out infinite",
          }}
        />

        {/* Retinal Visualization Mock */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Outer ring */}
          <div
            style={{
              width: 280,
              height: 280,
              borderRadius: "50%",
              border: "1px solid rgba(0,212,170,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* Scanning ring animation */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                inset: -1,
                borderRadius: "50%",
                border: "2px solid transparent",
                borderTopColor: "var(--accent-primary)",
                borderRightColor: "rgba(0,212,170,0.3)",
              }}
            />
            {/* Middle ring */}
            <div
              style={{
                width: 200,
                height: 200,
                borderRadius: "50%",
                border: "1px solid rgba(0,212,170,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Inner glow */}
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(0,212,170,0.15) 0%, rgba(0,212,170,0.02) 70%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 60px rgba(0,212,170,0.1)",
                }}
              >
                <Eye
                  size={40}
                  color="var(--accent-primary)"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Text below visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            textAlign: "center",
            marginTop: 40,
            position: "relative",
            zIndex: 1,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            Retinal AI Analysis
          </h2>
          <p
            style={{
              color: "var(--text-tertiary)",
              fontSize: 14,
              marginTop: 8,
              maxWidth: 300,
            }}
          >
            Deep learning diagnostics with explainable visual attention mapping
          </p>
        </motion.div>
      </section>

      {/* ─── RIGHT PANEL: Login Form ─── */}
      <section
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          position: "relative",
          background: "var(--bg-base)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "100%", maxWidth: 420 }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              marginBottom: 48,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background:
                  "linear-gradient(135deg, var(--accent-primary), var(--accent-dim))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Eye size={18} color="#03060D" strokeWidth={2.5} />
            </div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 18,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              Retina<span style={{ color: "var(--accent-primary)" }}>IQ</span>
            </span>
          </Link>

          {/* Header */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            Welcome back
          </h1>
          <p
            style={{
              color: "var(--text-tertiary)",
              fontSize: 15,
              marginTop: 8,
              marginBottom: 36,
            }}
          >
            Sign in to the Clinical Portal
          </p>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 16px",
                borderRadius: 12,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                marginBottom: 20,
              }}
            >
              <AlertCircle size={16} color="#F87171" />
              <span style={{ fontSize: 13, color: "#F87171" }}>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--text-tertiary)",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                <Mail size={12} />
                Email Address
              </label>
              <input
                className="input-field"
                type="email"
                placeholder="doctor@hospital.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>

            <div>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--text-tertiary)",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                <Lock size={12} />
                Password
              </label>
              <input
                className="input-field"
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Remember / Forgot */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 13,
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  style={{ accentColor: "var(--accent-primary)" }}
                />
                Remember me
              </label>
              <a
                href="#"
                style={{
                  color: "var(--accent-primary)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Forgot password?
              </a>
            </div>

            <button
              className="glow-btn"
              type="submit"
              style={{
                width: "100%",
                padding: "14px 24px",
                fontSize: 15,
                marginTop: 8,
              }}
              disabled={loading}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    width: 20,
                    height: 20,
                    border: "2px solid #03060D",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    position: "relative",
                    zIndex: 1,
                  }}
                />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight
                    size={18}
                    style={{ position: "relative", zIndex: 1 }}
                  />
                </>
              )}
            </button>
          </form>

          {/* Disclaimer */}
          <p
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              marginTop: 32,
              lineHeight: 1.5,
            }}
          >
            By signing in, you agree that all AI-generated outputs must be
            reviewed by a qualified ophthalmologist before clinical decisions.
          </p>
        </motion.div>
      </section>

      {/* Mobile responsiveness */}
      <style>{`
        @media (max-width: 900px) {
          main { grid-template-columns: 1fr !important; }
          main > section:first-child { display: none !important; }
        }
      `}</style>
    </main>
  );
}
