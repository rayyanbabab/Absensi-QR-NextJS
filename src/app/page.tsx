"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Loader2,
  School,
  QrCode,
  Camera,
  Users,
  UserCheck,
  FileText,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

function HomeLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectUrl = searchParams.get("redirect") || "/admin";
  const errorParam = searchParams.get("error");

  const [activeTab, setActiveTab] = useState<"admin" | "ortu">("admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    let isMounted = true;
    const checkSessions = async () => {
      try {
        const resAdmin = await fetch("/api/auth/me");
        const dataAdmin = await resAdmin.json();
        if (dataAdmin?.user && isMounted) {
          router.replace(redirectUrl);
          return;
        }

        const resOrtu = await fetch("/api/ortu/me");
        const dataOrtu = await resOrtu.json();
        if (dataOrtu?.user && isMounted) {
          if (!errorParam) {
            router.replace("/ortu/dashboard");
            return;
          }
        }
      } catch {}
      if (isMounted) setCheckingAuth(false);
    };

    checkSessions();
    return () => {
      isMounted = false;
    };
  }, [redirectUrl, router, errorParam]);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login pengelola gagal.");
      } else {
        router.push(redirectUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "Koneksi ke server bermasalah.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--background)",
        color: "var(--text-main)",
      }}
    >
      {/* Top Header Navigation */}
      <header
        style={{
          borderBottom: "1px solid var(--border-app)",
          backgroundColor: "var(--bg-surface)",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              backgroundColor: "var(--brand-primary)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <QrCode size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.01em" }}>
              Presensi QR
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              SMK 1 Indonesia
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Link
            href="/scan"
            className="btn btn-secondary btn-sm"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            <Camera size={15} style={{ color: "var(--brand-primary)" }} />
            <span>Terminal Scan Kamera</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Login Area */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "36px 16px 48px",
          maxWidth: "1100px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {checkingAuth ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <Loader2
              size={32}
              className="animate-spin"
              style={{ margin: "0 auto 16px", color: "var(--brand-primary)" }}
            />
            <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>Memeriksa sesi login...</div>
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              maxWidth: "460px",
            }}
          >
            {/* Header Greeting */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "var(--bg-subtle)",
                  border: "1px solid var(--border-app)",
                  color: "var(--text-main)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                }}
              >
                <School size={24} strokeWidth={1.8} />
              </div>
              <h1 style={{ fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
                Portal Masuk Sistem
              </h1>
              <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Silakan autentikasi untuk mengakses fitur presensi dan data sekolah
              </p>
            </div>

            {/* Warning if Orang Tua was restricted from admin */}
            {errorParam === "ortu_restricted" && (
              <div
                style={{
                  padding: "14px 16px",
                  background: "var(--status-danger-bg)",
                  border: "1px solid var(--status-danger-border)",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "20px",
                }}
              >
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <ShieldAlert size={18} style={{ color: "var(--status-danger-text)", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--status-danger-text)" }}>
                      Akses Dibatasi untuk Akun Wali Murid
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-body)", marginTop: "3px", lineHeight: 1.45 }}>
                      Anda terdeteksi masuk sebagai <strong>Wali Murid / Orang Tua</strong>. Panel administrasi dan kelola data hanya diizinkan untuk Guru & Petugas Sekolah.
                    </div>
                    <div style={{ marginTop: "10px" }}>
                      <Link
                        href="/ortu/dashboard"
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: "0.78rem" }}
                      >
                        <Users size={14} />
                        Buka Dashboard Orang Tua
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Login Card */}
            <div
              className="app-card"
              style={{
                padding: "28px 24px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)",
              }}
            >
              {/* Role Toggle Switcher */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "4px",
                  padding: "4px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-subtle)",
                  marginBottom: "22px",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("admin");
                    setError(null);
                  }}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: activeTab === "admin" ? "var(--bg-surface)" : "transparent",
                    color: activeTab === "admin" ? "var(--brand-primary)" : "var(--text-muted)",
                    fontWeight: activeTab === "admin" ? 700 : 500,
                    fontSize: "0.82rem",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: activeTab === "admin" ? "0 1px 3px rgba(0, 0, 0, 0.08)" : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    transition: "all 0.15s ease",
                  }}
                >
                  <ShieldCheck size={15} />
                  <span>Admin / Petugas</span>
                </button>

                <Link
                  href="/ortu/login"
                  style={{
                    padding: "8px 12px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "transparent",
                    color: "var(--text-muted)",
                    fontWeight: 500,
                    fontSize: "0.82rem",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Users size={15} />
                  <span>Portal Wali &rarr;</span>
                </Link>
              </div>

              {/* Admin Login Form */}
              {error && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 14px",
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.25)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--color-danger)",
                    fontSize: "0.82rem",
                    marginBottom: "16px",
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleAdminSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div className="form-group">
                  <label className="form-label">Username atau Email</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="superadmin"
                      className="form-input"
                      style={{ paddingLeft: "34px", fontSize: "0.85rem" }}
                    />
                    <User
                      size={15}
                      style={{
                        position: "absolute",
                        left: "11px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--text-muted)",
                      }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Kata Sandi</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="form-input"
                      style={{ paddingLeft: "34px", fontSize: "0.85rem" }}
                    />
                    <Lock
                      size={15}
                      style={{
                        position: "absolute",
                        left: "11px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--text-muted)",
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                  style={{ width: "100%", padding: "10px", marginTop: "6px", justifyContent: "center" }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Memvalidasi...</span>
                    </>
                  ) : (
                    "Masuk ke Panel Admin"
                  )}
                </button>
              </form>

              {/* Default Credentials Hint */}
              <div
                style={{
                  marginTop: "20px",
                  padding: "10px 12px",
                  background: "var(--bg-sunken)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-app)",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  textAlign: "center",
                }}
              >
                <div>Akun pengelola bawaan:</div>
                <div style={{ color: "var(--text-main)", fontWeight: 600, marginTop: "2px" }}>
                  Username: <code style={{ fontFamily: "var(--font-mono)" }}>superadmin</code> &bull; Password: <code style={{ fontFamily: "var(--font-mono)" }}>superadmin</code>
                </div>
              </div>
            </div>

            {/* Quick Service Links Grid */}
            <div
              style={{
                marginTop: "24px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              <Link
                href="/scan"
                className="app-card"
                style={{
                  padding: "12px 14px",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "border-color 0.15s ease",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--bg-subtle)",
                    border: "1px solid var(--border-app)",
                    color: "var(--text-main)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Camera size={17} strokeWidth={1.8} />
                </div>
                <div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-main)" }}>
                    Terminal Scan
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    Kamera QR presensi
                  </div>
                </div>
              </Link>

              <Link
                href="/ortu/login"
                className="app-card"
                style={{
                  padding: "12px 14px",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "border-color 0.15s ease",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--bg-subtle)",
                    border: "1px solid var(--border-app)",
                    color: "var(--text-main)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Users size={17} strokeWidth={1.8} />
                </div>
                <div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-main)" }}>
                    Portal Wali
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    Login orang tua
                  </div>
                </div>
              </Link>

              <Link
                href="/cek-presensi"
                className="app-card"
                style={{
                  padding: "12px 14px",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "border-color 0.15s ease",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--bg-subtle)",
                    border: "1px solid var(--border-app)",
                    color: "var(--text-main)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <UserCheck size={17} strokeWidth={1.8} />
                </div>
                <div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-main)" }}>
                    Cek Presensi
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    Cari via NIS siswa
                  </div>
                </div>
              </Link>

              <Link
                href="/izin"
                className="app-card"
                style={{
                  padding: "12px 14px",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "border-color 0.15s ease",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--bg-subtle)",
                    border: "1px solid var(--border-app)",
                    color: "var(--text-main)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <FileText size={17} strokeWidth={1.8} />
                </div>
                <div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-main)" }}>
                    Pengajuan Izin
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    Formulir izin / sakit
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border-app)",
          padding: "16px 24px",
          textAlign: "center",
          fontSize: "0.78rem",
          color: "var(--text-muted)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        Hak Cipta &copy; 2025 SMK 1 Indonesia. Sistem Presensi Siswa dan Guru Terintegrasi.
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Loader2 size={32} className="animate-spin" style={{ color: "var(--brand-primary)" }} />
        </div>
      }
    >
      <HomeLoginContent />
    </Suspense>
  );
}
