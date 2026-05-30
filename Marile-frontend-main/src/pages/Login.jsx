import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  Eye,
  EyeOff,
  Fish,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import heroFish from "../assets/hero-fish-4.jpg";
import "../styles/login.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { username, password });
      const role = res.data.data.user.role;

      if (role === "admin") navigate("/admin");
      else navigate("/cashier");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Username atau password salah.");
      } else if (err.response?.status === 404) {
        setError("Username tidak ditemukan.");
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login min-h-screen bg-background paper-grain grid lg:grid-cols-2">
      {/* Left — Brand visual */}
      <aside className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden bg-ink text-cream">
        <img
          src={heroFish}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink/90 via-ink/60 to-primary/40" />

        <div className="relative z-10 flex items-center gap-2">
          <img src="/assets/img/logo_marile.png" className="w-10"></img>
          <span className="text-background-light font-serif text-2xl  tracking-tight">
            Marile
          </span>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cream/30 bg-cream/10 backdrop-blur-sm text-xs uppercase tracking-[0.2em]">
            <Sparkles className="h-3 w-3" /> POINT OF SALE SYSTEM
          </div>
          <h1 className="font-serif text-5xl xl:text-6xl leading-[1.05] tracking-tight">
            Selamat datang{" "}
            <span className="font-script text-secondary">kembali</span>
          </h1>
          <p className="text-cream/80 text-base leading-relaxed">
            Masuk untuk mengelola transaksi penjualan, memantau inventaris,
            melihat laporan bisnis, dan mengelola operasional toko secara
            real-time.
          </p>
          <div className="flex items-center gap-6 pt-4 text-sm text-cream/70">
            <div>
              <div className="font-serif text-3xl text-cream">10K+</div>
              <div className="uppercase tracking-wider text-xs">Transaksi</div>
            </div>
            <div className="h-10 w-px bg-cream/20" />
            <div>
              <div className="font-serif text-3xl text-cream">99.9%</div>
              <div className="uppercase tracking-wider text-xs">Uptime</div>
            </div>
            <div className="h-10 w-px bg-cream/20" />
            <div>
              <div className="font-serif text-3xl text-cream">24/7</div>
              <div className="uppercase tracking-wider text-xs">
                Akses Sistem
              </div>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-cream/60">
          © {new Date().getFullYear()} POS Management System. Mendukung
          operasional bisnis Anda setiap hari.
        </p>
      </aside>

      {/* Right — Form */}
      <main className="flex flex-col items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">
          <div className="space-y-2 mb-8">
            <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">
              Portal Admin & Kasir
            </span>
            <h2 className="font-serif text-4xl text-ink leading-tight">
              Masuk ke Dashboard POS.
            </h2>
            <p className="text-muted-foreground text-sm">
              Gunakan akun Admin atau Kasir untuk melanjutkan.
              {/* <Link to="/" className="text-primary font-medium hover:underline">
                Daftar gratis
              </Link> */}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-ink">
                Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username123"
                  className="w-full h-12 pl-10 pr-3 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-ink"
                >
                  Kata Sandi
                </label>
                <a href="#" className="text-xs text-primary hover:underline">
                  Lupa kata sandi?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 pl-10 pr-10 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                  aria-label={
                    showPassword
                      ? "Sembunyikan kata sandi"
                      : "Tampilkan kata sandi"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group w-full h-12 rounded-lg bg-primary text-primary-foreground font-medium inline-flex items-center justify-center gap-2 hover:bg-primary/90 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Masuk ke Dashboard"}
              {!loading && (
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              )}
            </button>
          </form>

          <p className="mt-8 text-xs text-center text-muted-foreground">
            Dengan masuk, Anda menyetujui{" "}
            <a href="#" className="underline hover:text-foreground">
              Syarat & Ketentuan
            </a>{" "}
            dan{" "}
            <a href="#" className="underline hover:text-foreground">
              Kebijakan Privasi
            </a>{" "}
            kami.
          </p>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              ← Kembali ke beranda
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
