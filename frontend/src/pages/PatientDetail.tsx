import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Heart,
  Activity,
  ScanEye,
  TrendingUp,
  Clock,
  Eye,
} from "lucide-react";
import { Sidebar } from "../components/Sidebar";

const GRADE_LABELS = ["No DR", "Mild NPDR", "Moderate NPDR", "Severe NPDR", "PDR"];

const patientData: Record<string, {
  name: string;
  code: string;
  initials: string;
  color: string;
  age: number;
  diabetes: string;
  hba1c: string;
  bloodPressure: string;
  history: { date: string; grade: number; confidence: number }[];
}> = {
  p1: {
    name: "Ananya Reddy",
    code: "CBIT-001",
    initials: "AR",
    color: "#3B82F6",
    age: 54,
    diabetes: "8 years",
    hba1c: "7.4%",
    bloodPressure: "130/85",
    history: [
      { date: "2025-09-10", grade: 0, confidence: 95.2 },
      { date: "2025-12-10", grade: 1, confidence: 88.1 },
      { date: "2026-01-10", grade: 1, confidence: 91.4 },
      { date: "2026-02-10", grade: 2, confidence: 87.4 },
      { date: "2026-03-12", grade: 2, confidence: 89.1 },
    ],
  },
  p2: {
    name: "Rahul Sharma",
    code: "CBIT-002",
    initials: "RS",
    color: "#A855F7",
    age: 47,
    diabetes: "5 years",
    hba1c: "6.8%",
    bloodPressure: "122/78",
    history: [
      { date: "2026-01-05", grade: 0, confidence: 92.3 },
      { date: "2026-02-10", grade: 1, confidence: 85.7 },
      { date: "2026-03-11", grade: 1, confidence: 91.2 },
    ],
  },
};

const defaultPatient = {
  name: "Patient",
  code: "CBIT-000",
  initials: "PA",
  color: "#64748B",
  age: 50,
  diabetes: "5 years",
  hba1c: "7.0%",
  bloodPressure: "125/80",
  history: [
    { date: "2026-01-10", grade: 1, confidence: 88.0 },
    { date: "2026-02-10", grade: 2, confidence: 85.0 },
    { date: "2026-03-10", grade: 2, confidence: 87.0 },
  ],
};

export function PatientDetailPage(): JSX.Element {
  const { id } = useParams();
  const patient = patientData[id as string] || defaultPatient;
  const latestScan = patient.history[patient.history.length - 1];
  const latestGrade = latestScan.grade;

  const vitals = [
    { icon: Calendar, label: "Age", value: `${patient.age} yrs` },
    { icon: Heart, label: "HbA1c", value: patient.hba1c },
    { icon: Activity, label: "BP", value: patient.bloodPressure },
    { icon: Clock, label: "Diabetes", value: patient.diabetes },
    { icon: ScanEye, label: "Scans", value: patient.history.length.toString() },
    { icon: TrendingUp, label: "Current Grade", value: GRADE_LABELS[latestGrade] },
  ];

  return (
    <div style={{ position: "relative" }}>
      <div className="ambient-bg" />
      <Sidebar />
      <main className="page-content">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 24 }}
        >
          <Link
            to="/patients"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "var(--text-tertiary)",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 500,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--text-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-tertiary)")
            }
          >
            <ArrowLeft size={16} />
            Back to Patients
          </Link>
        </motion.div>

        {/* Patient Info Header */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card-static"
          style={{ padding: 28, marginBottom: 20 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                background: `linear-gradient(135deg, ${patient.color}40, ${patient.color}15)`,
                border: `1px solid ${patient.color}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 700,
                color: patient.color,
                flexShrink: 0,
              }}
            >
              {patient.initials}
            </div>
            <div style={{ flex: 1 }}>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                {patient.name}
              </h1>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginTop: 6,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    color: "var(--text-muted)",
                  }}
                >
                  {patient.code}
                </span>
                <span
                  className={`badge badge-grade-${latestGrade}`}
                >
                  {GRADE_LABELS[latestGrade]}
                </span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Vitals Grid */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {vitals.map((vital, i) => {
            const Icon = vital.icon;
            return (
              <motion.div
                key={vital.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="glass-card-static"
                style={{
                  padding: "16px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <Icon size={16} color="var(--text-muted)" />
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--text-muted)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {vital.label}
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      fontFamily: "var(--font-mono)",
                      color: "var(--text-primary)",
                      marginTop: 2,
                    }}
                  >
                    {vital.value}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.section>

        {/* Grade Progression Chart */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card-static"
          style={{ padding: 28, marginBottom: 20 }}
        >
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "var(--font-display)",
              fontSize: 17,
              fontWeight: 600,
              margin: "0 0 24px",
            }}
          >
            <TrendingUp size={16} color="var(--text-tertiary)" />
            Grade Progression
          </h2>
          <div style={{ height: 280, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={patient.history}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="var(--text-muted)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                />
                <YAxis
                  domain={[0, 4]}
                  stroke="var(--text-muted)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                  tickFormatter={(v: number) => GRADE_LABELS[v]?.split(" ")[0] || v.toString()}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-default)",
                    borderRadius: 12,
                    fontSize: 13,
                    color: "var(--text-primary)",
                  }}
                  formatter={(value: number) => [
                    GRADE_LABELS[value],
                    "Grade",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="grade"
                  stroke="var(--accent-primary)"
                  strokeWidth={3}
                  dot={{
                    r: 5,
                    fill: "var(--bg-card)",
                    stroke: "var(--accent-primary)",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 7,
                    fill: "var(--accent-primary)",
                    stroke: "var(--bg-card)",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        {/* Scan History Table */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card-static"
          style={{ padding: 28, overflow: "hidden" }}
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
            <Eye size={16} color="var(--text-tertiary)" />
            Scan History
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Grade</th>
                  <th>Confidence</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[...patient.history].reverse().map((scan, i) => (
                  <tr key={i}>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
                      {scan.date}
                    </td>
                    <td>
                      <span className={`badge badge-grade-${scan.grade}`}>
                        {GRADE_LABELS[scan.grade]}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontWeight: 500,
                          color: "var(--text-primary)",
                        }}
                      >
                        {scan.confidence}%
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--accent-primary)",
                          fontWeight: 500,
                        }}
                      >
                        Reviewed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
