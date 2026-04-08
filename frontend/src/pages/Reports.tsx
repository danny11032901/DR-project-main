import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Search,
  Filter,
  Calendar,
} from "lucide-react";
import { Sidebar } from "../components/Sidebar";

const GRADE_INDEX: Record<string, number> = {
  "No DR": 0,
  "Mild": 1,
  "Moderate": 2,
  "Severe": 3,
  "PDR": 4,
};

const reports = [
  {
    id: "r1",
    patient: "Ananya Reddy",
    code: "CBIT-001",
    grade: "Moderate",
    confidence: "87.4%",
    date: "2026-03-12",
    status: "Reviewed",
  },
  {
    id: "r2",
    patient: "Rahul Sharma",
    code: "CBIT-002",
    grade: "Mild",
    confidence: "91.2%",
    date: "2026-03-11",
    status: "Reviewed",
  },
  {
    id: "r3",
    patient: "Priya Patel",
    code: "CBIT-003",
    grade: "No DR",
    confidence: "96.8%",
    date: "2026-03-10",
    status: "Reviewed",
  },
  {
    id: "r4",
    patient: "Vikram Singh",
    code: "CBIT-004",
    grade: "Severe",
    confidence: "78.5%",
    date: "2026-03-09",
    status: "Pending",
  },
  {
    id: "r5",
    patient: "Meera Iyer",
    code: "CBIT-005",
    grade: "Moderate",
    confidence: "84.1%",
    date: "2026-03-08",
    status: "Reviewed",
  },
  {
    id: "r6",
    patient: "Arjun Nair",
    code: "CBIT-006",
    grade: "Mild",
    confidence: "89.7%",
    date: "2026-03-07",
    status: "Pending",
  },
];

export function ReportsPage(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = reports.filter(
    (r) =>
      r.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 28,
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
              Reports
            </h1>
            <p
              style={{
                color: "var(--text-tertiary)",
                fontSize: 14,
                marginTop: 4,
              }}
            >
              {reports.length} diagnostic reports generated
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ position: "relative", width: 240 }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
              <input
                className="input-field"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: 40, fontSize: 13 }}
              />
            </div>
            <button
              className="ghost-btn"
              style={{ padding: "10px 16px", fontSize: 13 }}
            >
              <Filter size={14} />
              Filters
            </button>
          </div>
        </motion.header>

        {/* Reports Table */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card-static"
          style={{ overflow: "hidden" }}
        >
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Calendar size={12} /> Date
                    </span>
                  </th>
                  <th>Patient</th>
                  <th>ID</th>
                  <th>Grade</th>
                  <th>Confidence</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((report, i) => {
                  const gradeIdx = GRADE_INDEX[report.grade] ?? 0;
                  return (
                    <motion.tr
                      key={report.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.04 }}
                    >
                      <td
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 13,
                        }}
                      >
                        {report.date}
                      </td>
                      <td
                        style={{
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          fontSize: 14,
                        }}
                      >
                        {report.patient}
                      </td>
                      <td
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                          color: "var(--text-muted)",
                        }}
                      >
                        {report.code}
                      </td>
                      <td>
                        <span
                          className={`badge badge-grade-${gradeIdx}`}
                        >
                          {report.grade}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontWeight: 500,
                            color: "var(--text-primary)",
                            fontSize: 13,
                          }}
                        >
                          {report.confidence}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            fontSize: 12,
                            fontWeight: 500,
                            color:
                              report.status === "Reviewed"
                                ? "var(--accent-primary)"
                                : "var(--amber)",
                          }}
                        >
                          <div
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: "50%",
                              background:
                                report.status === "Reviewed"
                                  ? "var(--accent-primary)"
                                  : "var(--amber)",
                            }}
                          />
                          {report.status}
                        </span>
                      </td>
                      <td>
                        <button
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: 8,
                            padding: "6px 14px",
                            color: "var(--text-secondary)",
                            cursor: "pointer",
                            fontSize: 12,
                            fontWeight: 500,
                            fontFamily: "var(--font-body)",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "var(--accent-glow)";
                            e.currentTarget.style.color =
                              "var(--accent-primary)";
                            e.currentTarget.style.borderColor =
                              "rgba(0,212,170,0.2)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255,255,255,0.03)";
                            e.currentTarget.style.color =
                              "var(--text-secondary)";
                            e.currentTarget.style.borderColor =
                              "var(--border-subtle)";
                          }}
                        >
                          <Download size={12} />
                          PDF
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "var(--text-tertiary)",
              }}
            >
              <FileText
                size={36}
                style={{ opacity: 0.3, marginBottom: 12 }}
              />
              <p>No reports match your search</p>
            </div>
          )}
        </motion.section>
      </main>
    </div>
  );
}
