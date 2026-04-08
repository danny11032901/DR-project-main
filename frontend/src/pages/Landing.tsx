import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Eye,
  ScanEye,
  ShieldCheck,
  Brain,
  BarChart3,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Deep Learning Analysis",
    desc: "MobileNetV2 backbone trained on clinically validated retinal datasets with 5-class DR grading.",
    color: "var(--accent-primary)",
    bg: "var(--accent-glow)",
  },
  {
    icon: ScanEye,
    title: "Grad-CAM Explainability",
    desc: "Visual attention heatmaps show exactly which retinal regions influenced the AI's diagnosis.",
    color: "var(--blue)",
    bg: "var(--blue-glow)",
  },
  {
    icon: ShieldCheck,
    title: "Clinical-Grade Accuracy",
    desc: "Validated against expert ophthalmologists with >90% sensitivity on moderate-to-severe DR.",
    color: "var(--purple)",
    bg: "var(--purple-glow)",
  },
  {
    icon: BarChart3,
    title: "Longitudinal Tracking",
    desc: "Monitor grade progression over time with patient-linked scan history and trend analysis.",
    color: "var(--amber)",
    bg: "var(--amber-glow)",
  },
];

const stats = [
  { value: "97.2%", label: "Sensitivity" },
  { value: "<2s", label: "Inference" },
  { value: "5-Class", label: "DR Grading" },
  { value: "Grad-CAM", label: "Explainability" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export function LandingPage(): JSX.Element {
  return (
    <main
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient Orbs */}
      <div className="ambient-bg" />
      <div
        style={{
          position: "fixed",
          top: "20%",
          right: "10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.04) 0%, transparent 70%)",
          pointerEvents: "none",
          animation: "ambientFloat 20s ease-in-out infinite",
        }}
      />

      {/* ─── NAVBAR ─── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          padding: "16px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(3, 6, 13, 0.6)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
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
              boxShadow: "0 0 20px rgba(0,212,170,0.2)",
            }}
          >
            <Eye size={18} color="#03060D" strokeWidth={2.5} />
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 18,
              color: "var(--text-primary)",
            }}
          >
            Retina<span style={{ color: "var(--accent-primary)" }}>IQ</span>
          </span>
        </Link>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link
            to="/login"
            className="ghost-btn"
            style={{ padding: "8px 20px", fontSize: 13 }}
          >
            Sign In
          </Link>
          <Link
            to="/analyze"
            className="glow-btn"
            style={{ padding: "8px 20px", fontSize: 13 }}
          >
            <span>Start Screening</span>
          </Link>
        </div>
      </motion.nav>

      {/* ─── HERO ─── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 24px 80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Floating Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 16px",
            borderRadius: 999,
            background: "var(--accent-glow)",
            border: "1px solid rgba(0, 212, 170, 0.2)",
            marginBottom: 32,
            fontSize: 13,
            color: "var(--accent-bright)",
            fontWeight: 500,
          }}
        >
          <Sparkles size={14} />
          AI-Powered Retinal Diagnostics
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(40px, 6vw, 72px)",
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
            maxWidth: 800,
            margin: "0 auto",
          }}
        >
          See What Others{" "}
          <span
            style={{
              background:
                "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-bright) 50%, var(--cyan) 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "gradientShift 4s ease infinite",
            }}
          >
            Miss.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{
            fontSize: "clamp(16px, 2vw, 20px)",
            color: "var(--text-secondary)",
            maxWidth: 580,
            margin: "24px auto 0",
            lineHeight: 1.6,
          }}
        >
          Explainable deep learning framework for automated diabetic retinopathy
          screening with clinical-grade accuracy and Grad-CAM visual
          explanations.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{
            display: "flex",
            gap: 16,
            marginTop: 40,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link className="glow-btn" to="/analyze" style={{ padding: "14px 32px", fontSize: 15 }}>
            <span>Begin Screening</span>
            <ArrowRight size={18} style={{ position: "relative", zIndex: 1 }} />
          </Link>
          <Link className="ghost-btn" to="/dashboard" style={{ padding: "14px 32px", fontSize: 15 }}>
            View Dashboard
          </Link>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          style={{
            display: "flex",
            gap: 1,
            marginTop: 64,
            borderRadius: 16,
            overflow: "hidden",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              style={{
                padding: "20px 32px",
                textAlign: "center",
                borderRight:
                  i < stats.length - 1
                    ? "1px solid rgba(255,255,255,0.06)"
                    : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 22,
                  fontWeight: 600,
                  color: "var(--accent-primary)",
                  letterSpacing: "-0.02em",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-tertiary)",
                  marginTop: 4,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ─── FEATURES ─── */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          padding: "80px 40px 120px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent-primary)",
            }}
          >
            Capabilities
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginTop: 12,
              color: "var(--text-primary)",
            }}
          >
            Built for Clinical Precision
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                variants={itemVariants}
                className="glass-card"
                style={{ padding: 28 }}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: feat.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <Icon size={22} color={feat.color} />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 17,
                    fontWeight: 600,
                    marginBottom: 8,
                    color: "var(--text-primary)",
                  }}
                >
                  {feat.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {feat.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        style={{
          position: "relative",
          zIndex: 1,
          borderTop: "1px solid rgba(255,255,255,0.04)",
          padding: "32px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <span
          style={{
            fontSize: 13,
            color: "var(--text-tertiary)",
          }}
        >
          © 2026 RetinaIQ — AI-generated output must be reviewed by a qualified
          ophthalmologist.
        </span>
        <div style={{ display: "flex", gap: 24 }}>
          {["Documentation", "Research", "Privacy"].map((link) => (
            <a
              key={link}
              href="#"
              style={{
                fontSize: 13,
                color: "var(--text-tertiary)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text-primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-tertiary)")
              }
            >
              {link}
            </a>
          ))}
        </div>
      </footer>
    </main>
  );
}
