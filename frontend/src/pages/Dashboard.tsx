import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  Zap,
  CheckCircle,
  Target,
  TrendingUp,
  Database,
  Cpu,
  Clock,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import { api } from "../api/client";

interface DashboardStats {
  total_scans: number;
  scans_this_week: number;
  scans_today: number;
  average_confidence: number;
  model_accuracy: number;
  model_auc: number;
  grade_distribution: Record<string, number>;
  model_status: {
    tier2_loaded: boolean;
    tier1_loaded: boolean;
    gpu_available: boolean;
    avg_inference_ms: number;
  };
}

const COLORS = ["#10B981", "#84CC16", "#EAB308", "#F97316", "#EF4444"];
const LABELS = ["No DR", "Mild", "Moderate", "Severe", "PDR"];



const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function DashboardPage(): JSX.Element {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentScans, setRecentScans] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const statsRes = await api.get("/dashboard/stats");
        setStats(statsRes.data);
        
        try {
          const scansRes = await api.get("/dashboard/recent-scans");
          setRecentScans(scansRes.data);
        } catch (e) {
          console.warn("Could not fetch recent scans", e);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    }
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  const chartData = stats
    ? Object.entries(stats.grade_distribution).map(([grade, count]) => ({
        name: LABELS[parseInt(grade)],
        value: count,
      }))
    : [];

  const kpis = [
    {
      label: "Total Scans",
      value: stats?.total_scans ?? "—",
      icon: Activity,
      color: "var(--blue)",
      bg: "var(--blue-glow)",
      sub: stats ? `${stats.scans_today} today` : "—",
    },
    {
      label: "Model Accuracy",
      value: stats ? `${(stats.model_accuracy * 100).toFixed(1)}%` : "—",
      icon: CheckCircle,
      color: "var(--accent-primary)",
      bg: "var(--accent-glow)",
      sub: "Validated",
    },
    {
      label: "Model AUC",
      value: stats ? stats.model_auc.toFixed(3) : "—",
      icon: Target,
      color: "var(--purple)",
      bg: "var(--purple-glow)",
      sub: "ROC curve",
    },
    {
      label: "Avg Confidence",
      value: stats ? `${(stats.average_confidence * 100).toFixed(1)}%` : "—",
      icon: Zap,
      color: "var(--amber)",
      bg: "var(--amber-glow)",
      sub: stats
        ? `${stats.model_status.avg_inference_ms.toFixed(0)}ms inference`
        : "—",
    },
  ];

  return (
    <div style={{ position: "relative" }}>
      <div className="ambient-bg" />
      <Sidebar />
      <main className="page-content">
        {/* ─── HEADER ─── */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 32,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Dashboard
            </h1>
            <p
              style={{
                color: "var(--text-tertiary)",
                fontSize: 14,
                marginTop: 4,
              }}
            >
              Clinical analysis · Retinal diagnostic pipeline
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <div
              className="badge-live"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 14px",
                borderRadius: 10,
                fontSize: 12,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: stats ? "#34D399" : "#F87171",
                  boxShadow: stats ? "0 0 8px #34D399" : "0 0 8px #F87171",
                  animation: stats ? "pulse-glow 2s infinite" : "none",
                }}
              />
              {stats ? "Pipeline Active" : "Connecting..."}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(0,212,170,0.06)",
                border: "1px solid rgba(0,212,170,0.15)",
                borderRadius: 10,
                padding: "8px 14px",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--accent-primary)",
              }}
            >
              <Cpu size={14} />
              GPU{" "}
              {stats?.model_status.gpu_available ? "Enabled" : "Simulated"}
            </div>
          </div>
        </motion.header>

        {/* ─── KPI CARDS ─── */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 28,
          }}
        >
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.label}
                variants={itemVariants}
                className="glass-card kpi-card"
                style={{ padding: 24 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 16,
                  }}
                >
                  <div
                    className="kpi-icon-wrap"
                    style={{ background: kpi.bg }}
                  >
                    <Icon size={20} color={kpi.color} />
                  </div>
                  <TrendingUp
                    size={14}
                    style={{ color: "var(--accent-primary)", opacity: 0.6 }}
                  />
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-tertiary)",
                    margin: 0,
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {kpi.label}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 30,
                    fontWeight: 600,
                    margin: "4px 0 0",
                    letterSpacing: "-0.02em",
                    color: "var(--text-primary)",
                  }}
                >
                  {kpi.value}
                </h3>
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    marginTop: 6,
                    display: "block",
                  }}
                >
                  {kpi.sub}
                </span>
              </motion.div>
            );
          })}
        </motion.section>

        {/* ─── MAIN GRID ─── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
          }}
        >
          {/* Diagnostic Distribution Chart */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
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
                marginBottom: 24,
                margin: "0 0 24px",
              }}
            >
              <Database size={16} color="var(--text-tertiary)" />
              Diagnostic Distribution
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 28,
              }}
            >
              <div style={{ height: 220, width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={
                        chartData.length > 0
                          ? chartData
                          : [{ name: "Awaiting data", value: 1 }]
                      }
                      dataKey="value"
                      nameKey="name"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={4}
                      stroke="none"
                    >
                      {chartData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-default)",
                        borderRadius: 12,
                        fontSize: 13,
                        color: "var(--text-primary)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
                {(chartData.length > 0
                  ? chartData
                  : LABELS.map((l) => ({ name: l, value: 0 }))
                ).map((entry, index) => (
                  <div
                    key={entry.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 3,
                          backgroundColor: COLORS[index],
                        }}
                      />
                      <span
                        style={{
                          fontSize: 13,
                          color: "var(--text-secondary)",
                        }}
                      >
                        {entry.name}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 13,
                          color: "var(--text-primary)",
                          fontWeight: 500,
                          minWidth: 30,
                          textAlign: "right",
                        }}
                      >
                        {entry.value}
                      </span>
                      <div
                        style={{
                          width: 80,
                          height: 4,
                          background: "rgba(255,255,255,0.04)",
                          borderRadius: 999,
                          overflow: "hidden",
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${
                              stats && stats.total_scans > 0
                                ? (entry.value / stats.total_scans) * 100
                                : 0
                            }%`,
                          }}
                          transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                          style={{
                            height: "100%",
                            backgroundColor: COLORS[index],
                            borderRadius: 999,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Recent Scans */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
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
              <BarChart3 size={16} color="var(--text-tertiary)" />
              Recent Scans
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {recentScans.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px 0", color: "var(--text-tertiary)", fontSize: 13 }}>
                  No recent scans
                </div>
              ) : (
                recentScans.slice(0, 5).map((scan: any, i: number) => {
                  const gradeIdx = scan.dr_grade;
                  const confidenceDisplay = `${(scan.confidence * 100).toFixed(1)}%`;
                  const scanDate = new Date(scan.timestamp);
                  const minutesAgo = Math.floor((Date.now() - scanDate.getTime()) / 60000);
                  const timeStr = minutesAgo < 60 ? `${Math.max(1, minutesAgo)} min ago` : `${Math.floor(minutesAgo/60)} hr ago`;

                  return (
                    <motion.div
                      key={scan.prediction_id || i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.08 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 14px",
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid var(--border-subtle)",
                        transition: "all 0.2s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                        e.currentTarget.style.borderColor = "var(--border-default)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                        e.currentTarget.style.borderColor = "var(--border-subtle)";
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 9,
                            background: `${COLORS[gradeIdx] || "#000"}15`,
                            border: `1px solid ${COLORS[gradeIdx] || "#000"}30`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 700,
                            color: COLORS[gradeIdx] || "#fff",
                          }}
                        >
                          G{gradeIdx}
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: "var(--text-primary)",
                            }}
                          >
                            {scan.patient_id ? `Patient ${scan.patient_id.substring(0,8)}` : "Unknown Patient"}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "var(--text-tertiary)",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              marginTop: 2,
                            }}
                          >
                            <Clock size={10} />
                            {timeStr}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span
                          className={`badge badge-grade-${gradeIdx}`}
                        >
                          {scan.dr_label_short}
                        </span>
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--text-tertiary)",
                            fontFamily: "var(--font-mono)",
                            marginTop: 4,
                          }}
                        >
                          {confidenceDisplay}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.section>
        </div>

        {/* ─── MODEL STATUS ─── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass-card-static"
          style={{
            padding: 24,
            marginTop: 20,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
          }}
        >
          {[
            {
              label: "Tier-2 Model",
              value: stats?.model_status.tier2_loaded ? "Loaded" : "Pending",
              ok: stats?.model_status.tier2_loaded,
            },
            {
              label: "Tier-1 Model",
              value: stats?.model_status.tier1_loaded ? "Loaded" : "Pending",
              ok: stats?.model_status.tier1_loaded,
            },
            {
              label: "GPU Acceleration",
              value: stats?.model_status.gpu_available ? "Active" : "CPU Mode",
              ok: stats?.model_status.gpu_available,
            },
            {
              label: "Inference Latency",
              value: stats
                ? `${stats.model_status.avg_inference_ms.toFixed(0)}ms`
                : "—",
              ok: stats
                ? stats.model_status.avg_inference_ms < 2000
                : undefined,
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.02)",
              }}
            >
              {item.ok === true ? (
                <CheckCircle size={16} color="var(--accent-primary)" />
              ) : item.ok === false ? (
                <AlertTriangle size={16} color="var(--amber)" />
              ) : (
                <div className="skeleton" style={{ width: 16, height: 16 }} />
              )}
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: item.ok
                      ? "var(--accent-primary)"
                      : "var(--text-secondary)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </motion.section>
      </main>

      {/* Responsive */}
      <style>{`
        @media (max-width: 1024px) {
          .page-content > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
