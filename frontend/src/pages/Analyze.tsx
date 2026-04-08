import { useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  Eye,
  Sparkles,
  Layers,
  Activity,
  Stethoscope,
  Timer,
  CheckCircle,
  AlertTriangle,
  Zap,
  Brain,
  Microscope,
  ShieldAlert,
  ChevronRight,
  RefreshCw,
  WifiOff,
} from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import { api } from "../api/client";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

interface ImageQuality {
  blur_score: number;
  contrast_score: number;
  brightness_mean: number;
  snr_score: number;
  composite_score: number;
  quality_label: string;
  warning: string | null;
}

interface ExplainabilityPayload {
  gradcam_overlay_b64: string;
  gradcam_heatmap_b64: string;
  gradcam_original_b64: string;
  attention_regions: { x: number; y: number; w: number; h: number }[];
  lime_explanation_b64: string;
  shap_available: boolean;
}

interface ClinicalPayload {
  recommendation: string;
  urgency: string;
  referral_guideline: string;
  follow_up_months: number;
  disclaimer: string;
}

interface PerformancePayload {
  preprocessing_ms: number;
  inference_ms: number;
  gradcam_ms: number;
  lime_ms: number;
  total_ms: number;
}

interface PredictionResponse {
  prediction_id: string;
  patient_id: string | null;
  analyzed_by: string;
  timestamp: string;
  model_used: string;
  model_tier: number;
  image_quality: ImageQuality;
  preprocessing_applied: Record<string, unknown>;
  dr_grade: number;
  dr_label: string;
  dr_label_short: string;
  confidence: number;
  class_probabilities: Record<string, number>;
  explainability: ExplainabilityPayload;
  clinical: ClinicalPayload;
  performance: PerformancePayload;
}

/* ═══════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════ */

const GRADE_MAP: Record<
  number,
  { label: string; desc: string; color: string; severity: string; urgencyColor: string }
> = {
  0: { label: "No DR", desc: "No visible signs of diabetic retinopathy detected.", color: "var(--grade-0)", severity: "Normal", urgencyColor: "#10B981" },
  1: { label: "Mild NPDR", desc: "Microaneurysms only — early signs of non-proliferative DR.", color: "var(--grade-1)", severity: "Low", urgencyColor: "#84CC16" },
  2: { label: "Moderate NPDR", desc: "More than just microaneurysms but less than severe NPDR.", color: "var(--grade-2)", severity: "Medium", urgencyColor: "#EAB308" },
  3: { label: "Severe NPDR", desc: "Extensive hemorrhages, venous beading, or intraretinal microvascular abnormalities.", color: "var(--grade-3)", severity: "High", urgencyColor: "#F97316" },
  4: { label: "Proliferative DR", desc: "Neovascularization, vitreous/preretinal hemorrhages requiring urgent intervention.", color: "var(--grade-4)", severity: "Critical", urgencyColor: "#EF4444" },
};

const PROB_LABELS = ["No DR", "Mild", "Moderate", "Severe", "PDR"];
const PROB_COLORS = ["#10B981", "#84CC16", "#EAB308", "#F97316", "#EF4444"];
const XAI_TABS = ["Grad-CAM", "LIME", "Clinical", "Performance"] as const;
type XaiTab = (typeof XAI_TABS)[number];

const URGENCY_STYLES: Record<string, { bg: string; border: string; text: string; icon: typeof CheckCircle }> = {
  none: { bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)", text: "#34D399", icon: CheckCircle },
  routine: { bg: "rgba(132,204,22,0.08)", border: "rgba(132,204,22,0.2)", text: "#A3E635", icon: CheckCircle },
  moderate: { bg: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.2)", text: "#FACC15", icon: AlertTriangle },
  urgent: { bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.2)", text: "#FB923C", icon: AlertTriangle },
  emergency: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", text: "#F87171", icon: ShieldAlert },
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export function AnalyzePage(): JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelPref, setModelPref] = useState("auto");
  const [activeTab, setActiveTab] = useState<XaiTab>("Grad-CAM");

  const onDrop = useMemo(
    () => (acceptedFiles: File[]) => {
      const f = acceptedFiles[0];
      if (!f) return;
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setFileName(f.name);
      setResult(null);
      setError(null);
    },
    [],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".tiff", ".bmp"] },
    multiple: false,
  });

  /* ── Real API Call ── */
  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("model_preference", modelPref);

      const response = await api.post<PredictionResponse>(
        "/predict/analyze",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 120000,
        },
      );
      setResult(response.data);
      setActiveTab("Grad-CAM");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string }; status?: number }; code?: string };
      if (axiosErr.code === "ERR_NETWORK" || axiosErr.code === "ECONNREFUSED") {
        setError("Cannot connect to backend. Please ensure the server is running (docker-compose up).");
      } else if (axiosErr.response?.status === 413) {
        setError("File too large. Maximum size is 20MB.");
      } else if (axiosErr.response?.status === 400) {
        setError(axiosErr.response.data?.detail || "Invalid image format.");
      } else {
        setError(axiosErr.response?.data?.detail || "Analysis failed. Please try again.");
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const gradeInfo = result ? GRADE_MAP[result.dr_grade] : null;

  /* ── Probability Data ── */
  const probData = result
    ? Object.entries(result.class_probabilities).map(([key, value], i) => ({
        label: PROB_LABELS[i] || key,
        value: value * 100,
        color: PROB_COLORS[i],
        isMax: i === result.dr_grade,
      }))
    : [];

  return (
    <div style={{ position: "relative" }}>
      <div className="ambient-bg" />
      <Sidebar />
      <main className="page-content">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 28 }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Analyze Scan
          </h1>
          <p
            style={{
              color: "var(--text-tertiary)",
              fontSize: 14,
              marginTop: 4,
            }}
          >
            Upload a retinal fundus image for AI-powered DR grading with
            explainable visual evidence
          </p>
        </motion.header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: result ? "380px 1fr" : "1fr 1fr",
            gap: 24,
            alignItems: "start",
            transition: "grid-template-columns 0.5s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* ─── LEFT: Upload Panel ─── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card-static"
            style={{ padding: 28 }}
          >
            <h2
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontFamily: "var(--font-display)",
                fontSize: 17,
                fontWeight: 600,
                margin: "0 0 20px",
              }}
            >
              <Upload size={16} color="var(--text-tertiary)" />
              Upload & Configure
            </h2>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`dropzone ${isDragActive ? "active" : ""}`}
              style={{
                minHeight: preview ? "auto" : 240,
                borderColor: isDragActive
                  ? "var(--accent-primary)"
                  : preview
                    ? "var(--border-default)"
                    : undefined,
                padding: preview ? 8 : undefined,
              }}
            >
              <input {...getInputProps()} />
              {preview ? (
                <div style={{ position: "relative", width: "100%" }}>
                  <img
                    src={preview}
                    alt="Retinal preview"
                    style={{
                      width: "100%",
                      maxHeight: 280,
                      objectFit: "cover",
                      borderRadius: 14,
                    }}
                  />
                  {analyzing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(3,6,13,0.75)",
                        backdropFilter: "blur(6px)",
                        borderRadius: 14,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 14,
                      }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 size={36} color="var(--accent-primary)" />
                      </motion.div>
                      <span style={{ fontSize: 14, fontWeight: 500, color: "var(--accent-primary)" }}>
                        Analyzing retinal patterns...
                      </span>
                      <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
                        Running Grad-CAM & LIME explainability
                      </span>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 16,
                      background: "var(--accent-glow)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ImageIcon size={28} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 6px" }}>
                      {isDragActive ? "Drop your image here" : "Drop retinal image here"}
                    </p>
                    <p style={{ fontSize: 13, color: "var(--text-tertiary)", margin: 0 }}>
                      or click to browse · JPG, PNG, TIFF, BMP
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* File info */}
            {fileName && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12,
                  color: "var(--text-tertiary)",
                  padding: "8px 12px",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: 8,
                }}
              >
                <ImageIcon size={12} />
                {fileName}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreview(null);
                    setFileName("");
                    setFile(null);
                    setResult(null);
                    setError(null);
                  }}
                  style={{
                    marginLeft: "auto",
                    background: "transparent",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    fontSize: 11,
                    textDecoration: "underline",
                  }}
                >
                  Remove
                </button>
              </motion.div>
            )}

            {/* Model Tier Selector */}
            <div style={{ marginTop: 16 }}>
              <label
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 8,
                }}
              >
                <Layers size={11} />
                Model Tier
              </label>
              <select
                value={modelPref}
                onChange={(e) => setModelPref(e.target.value)}
                className="input-field"
                style={{
                  fontSize: 13,
                  cursor: "pointer",
                  appearance: "auto",
                }}
              >
                <option value="auto">Auto (Recommended)</option>
                <option value="tier1">Tier 1 — EfficientNet-B0 (Fast)</option>
                <option value="tier2">Tier 2 — EfficientNetV2-B3 (Accurate)</option>
                <option value="mobilenetv3">MobileNetV3-Large</option>
                <option value="densenet121">DenseNet-121</option>
              </select>
            </div>

            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  style={{
                    marginTop: 16,
                    display: "flex",
                    gap: 10,
                    padding: 14,
                    borderRadius: 12,
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.2)",
                  }}
                >
                  <WifiOff size={16} color="#F87171" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <p style={{ fontSize: 13, color: "#F87171", margin: 0, fontWeight: 600 }}>
                      Connection Error
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "4px 0 0" }}>
                      {error}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Analyze Button */}
            <button
              className="glow-btn"
              style={{ marginTop: 20, width: "100%", padding: "14px 24px" }}
              onClick={handleAnalyze}
              disabled={!preview || analyzing}
            >
              {analyzing ? (
                <>
                  <Loader2
                    size={18}
                    style={{
                      position: "relative",
                      zIndex: 1,
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  <span>Analyzing...</span>
                </>
              ) : error ? (
                <>
                  <RefreshCw size={18} style={{ position: "relative", zIndex: 1 }} />
                  <span>Retry Analysis</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} style={{ position: "relative", zIndex: 1 }} />
                  <span>Analyze Image</span>
                </>
              )}
            </button>
          </motion.section>

          {/* ─── RIGHT: Results Panel ─── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card-static"
            style={{ padding: 0, overflow: "hidden" }}
          >
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 500,
                    gap: 16,
                    textAlign: "center",
                    padding: 40,
                  }}
                >
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 24,
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid var(--border-subtle)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Brain size={36} color="var(--text-muted)" />
                  </div>
                  <div>
                    <p style={{ color: "var(--text-secondary)", fontSize: 16, fontWeight: 600, margin: "0 0 6px" }}>
                      Explainable AI Results
                    </p>
                    <p style={{ color: "var(--text-tertiary)", fontSize: 13, margin: 0, maxWidth: 320, lineHeight: 1.6 }}>
                      Upload and analyze a retinal image to see diagnostic results
                      with Grad-CAM & LIME visual explanations
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 24, marginTop: 12 }}>
                    {[
                      { icon: Eye, label: "Grad-CAM" },
                      { icon: Microscope, label: "LIME" },
                      { icon: Stethoscope, label: "Clinical" },
                    ].map((item) => (
                      <div key={item.label} style={{ textAlign: "center" }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 12,
                          background: "rgba(255,255,255,0.02)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          margin: "0 auto 6px",
                        }}>
                          <item.icon size={18} color="var(--text-muted)" />
                        </div>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* ═══ Grade Header Strip ═══ */}
                  <div style={{
                    padding: "24px 28px",
                    background: `linear-gradient(135deg, ${gradeInfo!.color}0A 0%, transparent 60%)`,
                    borderBottom: "1px solid var(--border-subtle)",
                  }}>
                    {/* Model Training Banner */}
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 12px",
                        borderRadius: 8,
                        background: "rgba(245,158,11,0.08)",
                        border: "1px solid rgba(245,158,11,0.15)",
                        marginBottom: 16,
                        fontSize: 11,
                        color: "var(--amber)",
                        fontWeight: 500,
                      }}
                    >
                      <AlertTriangle size={12} />
                      Model in Training Mode — Results are for demonstration purposes. Clinical validation pending.
                    </motion.div>

                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                      {/* Grade Circle */}
                      <div style={{ position: "relative", width: 80, height: 80 }}>
                        <svg viewBox="0 0 80 80" width={80} height={80}>
                          <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                          <motion.circle
                            cx="40" cy="40" r="34" fill="none"
                            stroke={gradeInfo!.color}
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 34}`}
                            initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - result.confidence) }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            transform="rotate(-90 40 40)"
                            style={{ filter: `drop-shadow(0 0 6px ${gradeInfo!.color}60)` }}
                          />
                        </svg>
                        <div style={{
                          position: "absolute", inset: 0, display: "flex",
                          flexDirection: "column", alignItems: "center", justifyContent: "center",
                        }}>
                          <span style={{
                            fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 700,
                            color: gradeInfo!.color,
                          }}>
                            G{result.dr_grade}
                          </span>
                        </div>
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                          {gradeInfo!.label}
                        </div>
                        <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
                          {result.dr_label}
                        </div>
                        <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                          <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                            Confidence: <strong style={{ color: "var(--accent-primary)", fontFamily: "var(--font-mono)" }}>
                              {(result.confidence * 100).toFixed(1)}%
                            </strong>
                          </span>
                          <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                            Model: <strong style={{ color: "var(--text-secondary)" }}>{result.model_used}</strong>
                          </span>
                          <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                            Tier {result.model_tier}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ═══ Probability Distribution ═══ */}
                  <div style={{ padding: "20px 28px", borderBottom: "1px solid var(--border-subtle)" }}>
                    <div style={{
                      fontSize: 11, fontWeight: 600, color: "var(--text-muted)",
                      textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14,
                      display: "flex", alignItems: "center", gap: 6,
                    }}>
                      <Activity size={12} /> Class Probability Distribution
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {probData.map((p, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{
                            fontSize: 12, color: "var(--text-secondary)", width: 70,
                            fontWeight: p.isMax ? 700 : 400,
                          }}>
                            {p.label}
                          </span>
                          <div style={{
                            flex: 1, height: 8, background: "rgba(255,255,255,0.04)",
                            borderRadius: 999, overflow: "hidden",
                          }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${p.value}%` }}
                              transition={{ duration: 0.8, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
                              style={{
                                height: "100%", borderRadius: 999,
                                background: p.isMax
                                  ? `linear-gradient(90deg, ${p.color}, ${p.color}CC)`
                                  : p.color,
                                boxShadow: p.isMax ? `0 0 12px ${p.color}50` : "none",
                                opacity: p.isMax ? 1 : 0.5,
                              }}
                            />
                          </div>
                          <span style={{
                            fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600,
                            color: p.isMax ? p.color : "var(--text-tertiary)",
                            minWidth: 48, textAlign: "right",
                          }}>
                            {p.value.toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ═══ Image Quality ═══ */}
                  <div style={{ padding: "16px 28px", borderBottom: "1px solid var(--border-subtle)" }}>
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                      <div style={{
                        fontSize: 11, fontWeight: 600, color: "var(--text-muted)",
                        textTransform: "uppercase", letterSpacing: "0.06em",
                        display: "flex", alignItems: "center", gap: 6,
                      }}>
                        <Zap size={12} /> Image Quality
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
                        background: result.image_quality.quality_label === "Good"
                          ? "rgba(16,185,129,0.12)" : result.image_quality.quality_label === "Acceptable"
                          ? "rgba(234,179,8,0.12)" : "rgba(239,68,68,0.12)",
                        color: result.image_quality.quality_label === "Good"
                          ? "#34D399" : result.image_quality.quality_label === "Acceptable"
                          ? "#FACC15" : "#F87171",
                      }}>
                        {result.image_quality.quality_label}
                      </span>
                    </div>
                    {result.image_quality.warning && (
                      <div style={{
                        marginTop: 8, fontSize: 12, color: "var(--amber)",
                        display: "flex", alignItems: "center", gap: 6,
                      }}>
                        <AlertTriangle size={12} />
                        {result.image_quality.warning}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                      {[
                        { label: "Composite", value: result.image_quality.composite_score.toFixed(1) },
                        { label: "Blur", value: result.image_quality.blur_score.toFixed(1) },
                        { label: "Contrast", value: (result.image_quality.contrast_score * 100).toFixed(0) + "%" },
                        { label: "SNR", value: result.image_quality.snr_score.toFixed(1) },
                      ].map((q) => (
                        <div key={q.label} style={{
                          flex: 1, textAlign: "center", padding: "8px 4px",
                          background: "rgba(255,255,255,0.02)", borderRadius: 8,
                        }}>
                          <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            {q.label}
                          </div>
                          <div style={{ fontSize: 14, fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--text-primary)", marginTop: 2 }}>
                            {q.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ═══ XAI Tab Navigation ═══ */}
                  <div style={{
                    display: "flex", borderBottom: "1px solid var(--border-subtle)",
                    padding: "0 28px",
                  }}>
                    {XAI_TABS.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                          background: "none", border: "none", cursor: "pointer",
                          padding: "14px 16px", fontSize: 13, fontWeight: 600,
                          fontFamily: "var(--font-body)",
                          color: activeTab === tab ? "var(--accent-primary)" : "var(--text-tertiary)",
                          borderBottom: activeTab === tab ? "2px solid var(--accent-primary)" : "2px solid transparent",
                          transition: "all 0.2s",
                          display: "flex", alignItems: "center", gap: 6,
                        }}
                      >
                        {tab === "Grad-CAM" && <Eye size={14} />}
                        {tab === "LIME" && <Microscope size={14} />}
                        {tab === "Clinical" && <Stethoscope size={14} />}
                        {tab === "Performance" && <Timer size={14} />}
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* ═══ Tab Content ═══ */}
                  <div style={{ padding: "24px 28px" }}>
                    <AnimatePresence mode="wait">
                      {/* ── Grad-CAM Tab ── */}
                      {activeTab === "Grad-CAM" && (
                        <motion.div key="gradcam"
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                        >
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                            {[
                              { label: "Original Image", src: result.explainability.gradcam_original_b64 },
                              { label: "Grad-CAM Overlay", src: result.explainability.gradcam_overlay_b64 },
                              { label: "Heatmap Only", src: result.explainability.gradcam_heatmap_b64 },
                            ].map((img) => (
                              <div key={img.label}>
                                <div style={{
                                  fontSize: 10, fontWeight: 600, color: "var(--text-muted)",
                                  textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8,
                                }}>
                                  {img.label}
                                </div>
                                <div style={{
                                  borderRadius: 12, overflow: "hidden",
                                  border: "1px solid var(--border-subtle)",
                                  background: "rgba(0,0,0,0.3)",
                                }}>
                                  <img
                                    src={img.src}
                                    alt={img.label}
                                    style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Attention Regions */}
                          {result.explainability.attention_regions.length > 0 && (
                            <div style={{ marginTop: 20 }}>
                              <div style={{
                                fontSize: 11, fontWeight: 600, color: "var(--text-muted)",
                                textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10,
                                display: "flex", alignItems: "center", gap: 6,
                              }}>
                                <ChevronRight size={12} /> Detected Attention Regions
                              </div>
                              <div style={{ display: "flex", gap: 8 }}>
                                {result.explainability.attention_regions.map((r, i) => (
                                  <div key={i} style={{
                                    flex: 1, padding: "10px 12px", borderRadius: 10,
                                    background: "rgba(0,212,170,0.05)",
                                    border: "1px solid rgba(0,212,170,0.12)",
                                  }}>
                                    <div style={{ fontSize: 11, color: "var(--accent-primary)", fontWeight: 600, marginBottom: 4 }}>
                                      Region {i + 1}
                                    </div>
                                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-tertiary)" }}>
                                      ({r.x}, {r.y}) · {r.w}×{r.h}px
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* ── LIME Tab ── */}
                      {activeTab === "LIME" && (
                        <motion.div key="lime"
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                        >
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div>
                              <div style={{
                                fontSize: 10, fontWeight: 600, color: "var(--text-muted)",
                                textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8,
                              }}>
                                Original
                              </div>
                              <div style={{
                                borderRadius: 12, overflow: "hidden",
                                border: "1px solid var(--border-subtle)", background: "rgba(0,0,0,0.3)",
                              }}>
                                <img
                                  src={result.explainability.gradcam_original_b64}
                                  alt="Original" style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }}
                                />
                              </div>
                            </div>
                            <div>
                              <div style={{
                                fontSize: 10, fontWeight: 600, color: "var(--text-muted)",
                                textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8,
                              }}>
                                LIME Superpixel Explanation
                              </div>
                              <div style={{
                                borderRadius: 12, overflow: "hidden",
                                border: "1px solid var(--border-subtle)", background: "rgba(0,0,0,0.3)",
                              }}>
                                <img
                                  src={result.explainability.lime_explanation_b64}
                                  alt="LIME" style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }}
                                />
                              </div>
                            </div>
                          </div>
                          <div style={{
                            marginTop: 16, padding: 14, borderRadius: 12,
                            background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)",
                          }}>
                            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
                              <strong style={{ color: "var(--text-primary)" }}>LIME</strong> (Local Interpretable Model-agnostic Explanations) highlights
                              superpixel regions that positively (green) and negatively (red) influenced the model's decision.
                              Brighter boundaries indicate stronger contribution to the predicted grade.
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {/* ── Clinical Tab ── */}
                      {activeTab === "Clinical" && (
                        <motion.div key="clinical"
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                          style={{ display: "flex", flexDirection: "column", gap: 16 }}
                        >
                          {/* Urgency Badge */}
                          {(() => {
                            const style = URGENCY_STYLES[result.clinical.urgency] || URGENCY_STYLES.routine;
                            const UrgIcon = style.icon;
                            return (
                              <div style={{
                                display: "flex", alignItems: "center", gap: 14, padding: "18px 20px",
                                borderRadius: 14, background: style.bg, border: `1px solid ${style.border}`,
                              }}>
                                <div style={{
                                  width: 44, height: 44, borderRadius: 12,
                                  background: `${style.text}15`, display: "flex",
                                  alignItems: "center", justifyContent: "center",
                                }}>
                                  <UrgIcon size={22} color={style.text} />
                                </div>
                                <div>
                                  <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                    Urgency Level
                                  </div>
                                  <div style={{ fontSize: 18, fontWeight: 700, color: style.text, textTransform: "capitalize", marginTop: 2 }}>
                                    {result.clinical.urgency}
                                  </div>
                                </div>
                                {result.clinical.follow_up_months > 0 && (
                                  <div style={{ marginLeft: "auto", textAlign: "right" }}>
                                    <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>
                                      Follow-up
                                    </div>
                                    <div style={{ fontSize: 16, fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--text-primary)", marginTop: 2 }}>
                                      {result.clinical.follow_up_months >= 1
                                        ? `${result.clinical.follow_up_months} mo`
                                        : `${Math.round(result.clinical.follow_up_months * 30)} days`}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })()}

                          {/* Recommendation */}
                          <div style={{
                            padding: 20, borderRadius: 14,
                            background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)",
                          }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                              <Stethoscope size={12} /> Clinical Recommendation
                            </div>
                            <p style={{ fontSize: 14, color: "var(--text-primary)", lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
                              {result.clinical.recommendation}
                            </p>
                            <div style={{ marginTop: 12, fontSize: 12, color: "var(--text-tertiary)" }}>
                              Guideline: <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{result.clinical.referral_guideline}</span>
                            </div>
                          </div>

                          {/* Disclaimer */}
                          <div style={{
                            display: "flex", gap: 10, padding: 14, borderRadius: 12,
                            background: "var(--amber-glow)", border: "1px solid rgba(245,158,11,0.15)",
                          }}>
                            <AlertCircle size={16} color="var(--amber)" style={{ flexShrink: 0, marginTop: 2 }} />
                            <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                              {result.clinical.disclaimer}
                            </p>
                          </div>

                          {/* Grade Description */}
                          <div style={{
                            padding: 16, borderRadius: 12,
                            background: `${gradeInfo!.color}08`, border: `1px solid ${gradeInfo!.color}15`,
                          }}>
                            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                              {gradeInfo!.desc}
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {/* ── Performance Tab ── */}
                      {activeTab === "Performance" && (
                        <motion.div key="perf"
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                        >
                          {/* Pipeline Timeline */}
                          <div style={{
                            fontSize: 11, fontWeight: 600, color: "var(--text-muted)",
                            textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16,
                            display: "flex", alignItems: "center", gap: 6,
                          }}>
                            <Timer size={12} /> Pipeline Execution Breakdown
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {[
                              { label: "Preprocessing", ms: result.performance.preprocessing_ms, color: "#3B82F6", desc: "CLAHE, denoise, resize" },
                              { label: "Model Inference", ms: result.performance.inference_ms, color: "#A855F7", desc: result.model_used },
                              { label: "Grad-CAM", ms: result.performance.gradcam_ms, color: "#00D4AA", desc: "Attention heatmap generation" },
                              { label: "LIME", ms: result.performance.lime_ms, color: "#F59E0B", desc: "Superpixel explanation" },
                            ].map((stage) => {
                              const pct = result.performance.total_ms > 0
                                ? (stage.ms / result.performance.total_ms) * 100 : 0;
                              return (
                                <div key={stage.label} style={{
                                  padding: "14px 16px", borderRadius: 12,
                                  background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)",
                                }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                    <div>
                                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{stage.label}</span>
                                      <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 8 }}>{stage.desc}</span>
                                    </div>
                                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, color: stage.color }}>
                                      {stage.ms}ms
                                    </span>
                                  </div>
                                  <div style={{ height: 4, background: "rgba(255,255,255,0.04)", borderRadius: 999, overflow: "hidden" }}>
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${pct}%` }}
                                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                      style={{ height: "100%", background: stage.color, borderRadius: 999, opacity: 0.7 }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Total */}
                          <div style={{
                            marginTop: 16, padding: "16px 20px", borderRadius: 14,
                            background: "rgba(0,212,170,0.05)", border: "1px solid rgba(0,212,170,0.12)",
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                          }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                              Total Pipeline Time
                            </span>
                            <span style={{
                              fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700,
                              color: "var(--accent-primary)",
                            }}>
                              {result.performance.total_ms}ms
                            </span>
                          </div>

                          {/* Preprocessing Config */}
                          <div style={{ marginTop: 20 }}>
                            <div style={{
                              fontSize: 11, fontWeight: 600, color: "var(--text-muted)",
                              textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10,
                            }}>
                              Preprocessing Applied
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                              {Object.entries(result.preprocessing_applied).map(([key, val]) => (
                                <div key={key} style={{
                                  padding: "8px 12px", borderRadius: 8,
                                  background: "rgba(255,255,255,0.02)",
                                  display: "flex", justifyContent: "space-between",
                                }}>
                                  <span style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 500 }}>
                                    {key.replace(/_/g, " ")}
                                  </span>
                                  <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
                                    {String(val)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        </div>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @media (max-width: 1024px) {
            .page-content > div { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </main>
    </div>
  );
}
