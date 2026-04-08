import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ScanEye,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  Eye,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/appStore";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analyze", label: "Analyze", icon: ScanEye },
  { to: "/patients", label: "Patients", icon: Users },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAppStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.fullName || "Demo User";
  const displayRole = user?.role === "ophthalmologist" ? "Ophthalmologist" : "Clinician";
  const initials = displayName
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sidebar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: collapsed ? 72 : 260,
        background:
          "linear-gradient(180deg, rgba(7, 11, 24, 0.95) 0%, rgba(3, 6, 13, 0.98) 100%)",
        backdropFilter: "blur(24px) saturate(1.4)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
        transition: "width 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        overflow: "hidden",
      }}
    >
      {/* Logo Section */}
      <div
        style={{
          padding: collapsed ? "24px 16px" : "24px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          minHeight: 80,
        }}
      >
        <Link
          to="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background:
                "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-dim) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 0 24px rgba(0, 212, 170, 0.2)",
            }}
          >
            <Eye size={20} color="#03060D" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 18,
                  letterSpacing: "-0.02em",
                  color: "var(--text-primary)",
                }}
              >
                Retina
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 18,
                  color: "var(--accent-primary)",
                }}
              >
                IQ
              </span>
            </motion.div>
          )}
        </Link>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-tertiary)",
              cursor: "pointer",
              padding: 4,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--text-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-tertiary)")
            }
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* Collapsed expand trigger */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-tertiary)",
            cursor: "pointer",
            padding: "12px 0",
            display: "flex",
            justifyContent: "center",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--text-primary)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--text-tertiary)")
          }
        >
          <ChevronLeft size={16} style={{ transform: "rotate(180deg)" }} />
        </button>
      )}

      {/* Navigation */}
      <nav
        style={{
          padding: collapsed ? "16px 8px" : "16px 12px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {!collapsed && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              padding: "0 12px",
              marginBottom: 8,
            }}
          >
            Navigation
          </span>
        )}

        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive =
            location.pathname === link.to ||
            (link.to !== "/dashboard" &&
              location.pathname.startsWith(link.to));

          return (
            <Link
              key={link.to}
              to={link.to}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: collapsed ? "12px 0" : "10px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 12,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                color: isActive
                  ? "var(--accent-primary)"
                  : "var(--text-secondary)",
                background: isActive
                  ? "var(--accent-glow)"
                  : "transparent",
                position: "relative",
                transition: "all 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background =
                    "rgba(255,255,255,0.04)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  style={{
                    position: "absolute",
                    left: collapsed ? "50%" : 0,
                    top: collapsed ? 0 : "50%",
                    transform: collapsed
                      ? "translateX(-50%)"
                      : "translateY(-50%)",
                    width: collapsed ? 24 : 3,
                    height: collapsed ? 3 : 24,
                    borderRadius: 999,
                    background: "var(--accent-primary)",
                    boxShadow: "0 0 12px var(--accent-glow-strong)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                />
              )}
              <Icon
                size={collapsed ? 20 : 18}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Profile / Footer */}
      <div
        style={{
          padding: collapsed ? "16px 8px" : "16px 12px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {!collapsed ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background:
                  "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "white",
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {displayName}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-tertiary)",
                }}
              >
                {displayRole}
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-tertiary)",
                cursor: "pointer",
                padding: 4,
                borderRadius: 8,
                display: "flex",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--rose)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-tertiary)")
              }
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background:
                  "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "white",
              }}
            >
              {initials}
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
