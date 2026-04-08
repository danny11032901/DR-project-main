import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  ArrowRight,
  Eye,
  Calendar,
  ScanEye,
} from "lucide-react";
import { Sidebar } from "../components/Sidebar";

const GRADE_COLORS: Record<string, string> = {
  "No DR": "var(--grade-0)",
  "Mild": "var(--grade-1)",
  "Moderate": "var(--grade-2)",
  "Severe": "var(--grade-3)",
  "PDR": "var(--grade-4)",
};

const patients = [
  {
    id: "p1",
    name: "Ananya Reddy",
    code: "CBIT-001",
    scans: 4,
    latest: "Moderate",
    initials: "AR",
    lastScan: "2026-03-12",
    diabetes: "8 yrs",
    color: "#3B82F6",
  },
  {
    id: "p2",
    name: "Rahul Sharma",
    code: "CBIT-002",
    scans: 2,
    latest: "Mild",
    initials: "RS",
    lastScan: "2026-03-11",
    diabetes: "5 yrs",
    color: "#A855F7",
  },
  {
    id: "p3",
    name: "Priya Patel",
    code: "CBIT-003",
    scans: 6,
    latest: "No DR",
    initials: "PP",
    lastScan: "2026-03-10",
    diabetes: "3 yrs",
    color: "#F59E0B",
  },
  {
    id: "p4",
    name: "Vikram Singh",
    code: "CBIT-004",
    scans: 3,
    latest: "Severe",
    initials: "VS",
    lastScan: "2026-03-09",
    diabetes: "12 yrs",
    color: "#EF4444",
  },
  {
    id: "p5",
    name: "Meera Iyer",
    code: "CBIT-005",
    scans: 5,
    latest: "Moderate",
    initials: "MI",
    lastScan: "2026-03-08",
    diabetes: "7 yrs",
    color: "#06B6D4",
  },
  {
    id: "p6",
    name: "Arjun Nair",
    code: "CBIT-006",
    scans: 1,
    latest: "Mild",
    initials: "AN",
    lastScan: "2026-03-07",
    diabetes: "2 yrs",
    color: "#10B981",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export function PatientsPage(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()),
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
              Patients
            </h1>
            <p
              style={{
                color: "var(--text-tertiary)",
                fontSize: 14,
                marginTop: 4,
              }}
            >
              {patients.length} patients registered · Manage retinal scan
              histories
            </p>
          </div>

          {/* Search */}
          <div
            style={{
              position: "relative",
              width: 280,
            }}
          >
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
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 40, fontSize: 13 }}
            />
          </div>
        </motion.header>

        {/* Patient Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 16,
          }}
        >
          {filtered.map((patient) => {
            const gradeKey = Object.keys(GRADE_COLORS).indexOf(patient.latest);

            return (
              <motion.article
                key={patient.id}
                variants={itemVariants}
                className="glass-card"
                style={{
                  padding: 24,
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Top Row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginBottom: 18,
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 13,
                      background: `linear-gradient(135deg, ${patient.color}40, ${patient.color}15)`,
                      border: `1px solid ${patient.color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      fontWeight: 700,
                      color: patient.color,
                      flexShrink: 0,
                    }}
                  >
                    {patient.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {patient.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "var(--text-muted)",
                        marginTop: 2,
                      }}
                    >
                      {patient.code}
                    </div>
                  </div>
                  <span className={`badge badge-grade-${gradeKey >= 0 ? gradeKey : 0}`}>
                    {patient.latest}
                  </span>
                </div>

                {/* Stats Row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 8,
                    marginBottom: 18,
                  }}
                >
                  {[
                    { icon: ScanEye, label: "Scans", value: patient.scans },
                    { icon: Calendar, label: "Last Scan", value: patient.lastScan.split("-").slice(1).join("/") },
                    { icon: Eye, label: "Diabetes", value: patient.diabetes },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      style={{
                        padding: "10px 8px",
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.02)",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                          fontWeight: 600,
                          letterSpacing: "0.06em",
                          marginBottom: 4,
                        }}
                      >
                        {stat.label}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontFamily: "var(--font-mono)",
                          fontWeight: 500,
                          color: "var(--text-primary)",
                        }}
                      >
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* View History Link */}
                <Link
                  to={`/patients/${patient.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "10px 0",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border-subtle)",
                    textDecoration: "none",
                    color: "var(--accent-primary)",
                    fontSize: 13,
                    fontWeight: 600,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--accent-glow)";
                    e.currentTarget.style.borderColor = "rgba(0,212,170,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = "var(--border-subtle)";
                  }}
                >
                  View History
                  <ArrowRight size={14} />
                </Link>
              </motion.article>
            );
          })}
        </motion.div>

        {filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              color: "var(--text-tertiary)",
            }}
          >
            <Users
              size={40}
              style={{ opacity: 0.3, marginBottom: 16 }}
            />
            <p>No patients match "{searchQuery}"</p>
          </div>
        )}
      </main>
    </div>
  );
}
