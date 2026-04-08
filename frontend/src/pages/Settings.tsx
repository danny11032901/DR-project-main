import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Moon,
  Sun,
  Bell,
  ShieldCheck,
  Save,
  Building,
  Mail,
  Smartphone,
  Palette,
  Lock,
  HelpCircle,
  CheckCircle,
} from "lucide-react";
import { Sidebar } from "../components/Sidebar";

export function SettingsPage(): JSX.Element {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [notifications, setNotifications] = useState({
    analysisComplete: true,
    compliance: true,
  });
  const [profile, setProfile] = useState({
    name: "Dr. Navya",
    email: "navya@hospital.ai",
    hospital: "Central Retinal Institute",
    role: "Senior Ophthalmologist",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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
            Settings
          </h1>
          <p
            style={{
              color: "var(--text-tertiary)",
              fontSize: 14,
              marginTop: 4,
            }}
          >
            Manage your professional profile and application preferences
          </p>
        </motion.header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            alignItems: "start",
          }}
        >
          {/* ─── LEFT COLUMN ─── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Medical Profile */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-card-static"
              style={{ padding: 28 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "var(--accent-glow)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <User size={18} color="var(--accent-primary)" />
                </div>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 17,
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  Medical Profile
                </h2>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        marginBottom: 8,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      <User size={11} /> Full Name
                    </label>
                    <input
                      className="input-field"
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        marginBottom: 8,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      <Mail size={11} /> Email
                    </label>
                    <input
                      className="input-field"
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      marginBottom: 8,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    <Building size={11} /> Hospital / Clinic
                  </label>
                  <input
                    className="input-field"
                    type="text"
                    value={profile.hospital}
                    onChange={(e) =>
                      setProfile({ ...profile, hospital: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      marginBottom: 8,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    <ShieldCheck size={11} /> Role
                  </label>
                  <input
                    className="input-field"
                    type="text"
                    value={profile.role}
                    onChange={(e) =>
                      setProfile({ ...profile, role: e.target.value })
                    }
                  />
                </div>

                <button
                  className="glow-btn"
                  style={{ marginTop: 4, padding: "12px 24px", alignSelf: "flex-start" }}
                  onClick={handleSave}
                >
                  {saved ? (
                    <>
                      <CheckCircle
                        size={16}
                        style={{ position: "relative", zIndex: 1 }}
                      />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save
                        size={16}
                        style={{ position: "relative", zIndex: 1 }}
                      />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </motion.section>

            {/* Security */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass-card-static"
              style={{ padding: 28 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "var(--rose-glow)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Lock size={18} color="var(--rose)" />
                </div>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 17,
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  Security
                </h2>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  {
                    label: "Change Password",
                    desc: "Update your account password",
                  },
                  {
                    label: "Two-Factor Auth",
                    desc: "Add an extra layer of security",
                  },
                  {
                    label: "Active Sessions",
                    desc: "Manage your active login sessions",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 16px",
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid var(--border-subtle)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        "var(--border-default)";
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-subtle)";
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.02)";
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: "var(--text-primary)",
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--text-muted)",
                          marginTop: 2,
                        }}
                      >
                        {item.desc}
                      </div>
                    </div>
                    <span
                      style={{
                        color: "var(--text-muted)",
                        fontSize: 18,
                      }}
                    >
                      ›
                    </span>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* ─── RIGHT COLUMN ─── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Appearance */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="glass-card-static"
              style={{ padding: 28 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "var(--purple-glow)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Palette size={18} color="var(--purple)" />
                </div>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 17,
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  Appearance
                </h2>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 18px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  {theme === "dark" ? (
                    <Moon size={18} color="var(--text-tertiary)" />
                  ) : (
                    <Sun size={18} color="var(--amber)" />
                  )}
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "var(--text-primary)",
                      }}
                    >
                      Interface Theme
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--text-muted)",
                        marginTop: 2,
                      }}
                    >
                      {theme === "dark"
                        ? "Dark Mode — Optimized for clinical environments"
                        : "Light Mode"}
                    </div>
                  </div>
                </div>
                <button
                  className={`toggle-switch ${theme === "light" ? "active" : ""}`}
                  onClick={() =>
                    setTheme(theme === "dark" ? "light" : "dark")
                  }
                  aria-label="Toggle theme"
                >
                  <span className="toggle-knob" />
                </button>
              </div>
            </motion.section>

            {/* Notifications */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="glass-card-static"
              style={{ padding: 28 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "var(--blue-glow)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Bell size={18} color="var(--blue)" />
                </div>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 17,
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  Notifications
                </h2>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {[
                  {
                    key: "analysisComplete" as const,
                    label: "Analysis Complete",
                    desc: "Get notified when batch analysis finishes",
                    icon: Smartphone,
                  },
                  {
                    key: "compliance" as const,
                    label: "Compliance Alerts",
                    desc: "Security updates and regulatory notices",
                    icon: ShieldCheck,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "14px 16px",
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <Icon size={16} color="var(--text-muted)" />
                        <div>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                              color: "var(--text-primary)",
                            }}
                          >
                            {item.label}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "var(--text-muted)",
                              marginTop: 2,
                            }}
                          >
                            {item.desc}
                          </div>
                        </div>
                      </div>
                      <button
                        className={`toggle-switch ${
                          notifications[item.key] ? "active" : ""
                        }`}
                        onClick={() =>
                          setNotifications({
                            ...notifications,
                            [item.key]: !notifications[item.key],
                          })
                        }
                        aria-label={`Toggle ${item.label}`}
                      >
                        <span className="toggle-knob" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.section>

            {/* Help & About */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="glass-card-static"
              style={{ padding: 28 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "var(--amber-glow)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <HelpCircle size={18} color="var(--amber)" />
                </div>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 17,
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  About
                </h2>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {[
                  { label: "Version", value: "1.0.0" },
                  { label: "Model Architecture", value: "EfficientNetV2-B3" },
                  { label: "Framework", value: "TensorFlow + FastAPI" },
                  { label: "Explainability", value: "Grad-CAM + LIME" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        color: "var(--text-tertiary)",
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--text-primary)",
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>
        </div>

        <style>{`
          @media (max-width: 1024px) {
            .page-content > div {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </main>
    </div>
  );
}
