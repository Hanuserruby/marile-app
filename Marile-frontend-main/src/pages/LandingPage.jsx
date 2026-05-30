import React, { useState, useEffect } from "react";
import api from "../api/axios";
import {
  ArrowRight,
  Clock,
  Fish,
  Heart,
  //   Instagram,
  Leaf,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Utensils,
  Wallet,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import "../styles/LandingPage.css";

/* IMPORT IMAGES */
import heroFish1 from "../assets/hero-fish-1.png";
import heroFish2 from "../assets/hero-fish-2.png";
import heroFish3 from "../assets/hero-fish-3.png";

const heroSlides = [
  {
    img: heroFish1,
    eyebrow: "~ Segar Setiap Hari ~",
    title: "Rasa Laut, dimasak dengan cinta.",
    desc: "Marile adalah marinasi ikan segar khas Nusantara.",
  },
  {
    img: heroFish2,
    eyebrow: "~ Bumbu Pilihan ~",
    title: "Rempah asli Nusantara.",
    desc: "Racikan rempah turun-temurun yang meresap sempurna.",
  },
  {
    img: heroFish3,
    eyebrow: "~ Tinggal Goreng ~",
    title: "Praktis untuk keluarga.",
    desc: "Bersih, sudah dimarinasi, dan siap dimasak. Hemat waktu, hidangan istimewa di meja makan dalam hitungan menit.",
  },
];

export default function LandingPage() {
  const [bestSeller, setBestSeller] = useState([]);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/public/menu?category=protein")
      .then((res) => {
        setBestSeller(res.data.data.best_seller || []);
        setMenu(res.data.data.menu || []);
      })
      .catch((err) => console.error("Gagal mengambil data:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white text-black landing">
      <Nav />
      <Hero />
      <Manifesto />
      <Advantages />
      <BestSeller bestSeller={bestSeller} />
      <MainMenu menu={menu} />
      <FindUs />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-primary border-b border-border/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2 text-ink">
          <img src="/assets/img/logo_marile.png" className="w-10"></img>
          <span className="font-serif text-2xl font-bold tracking-tight">
            Marile
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-10 text-sm text-foreground">
          <a href="#beranda" className="hover:text-white transition">
            Beranda
          </a>
          <a href="#menu" className="hover:text-white transition">
            Menu
          </a>
          <a href="#tentang" className="hover:text-white transition">
            Tentang
          </a>
          <a href="#kontak" className="hover:text-white transition">
            Kontak
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-ink text-primary-foreground px-8 py-2.5 text-sm font-medium hover:bg-zinc-700 transition"
          >
            Masuk
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const [selected, setSelected] = useState(0);
  const [textVisible, setTextVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade text out
      setTextVisible(false);
      setTimeout(() => {
        setSelected((prev) => (prev + 1) % heroSlides.length);
        setTextVisible(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goTo = (i) => {
    if (i === selected) return;
    setTextVisible(false);
    setTimeout(() => {
      setSelected(i);
      setTextVisible(true);
    }, 300);
  };

  const slide = heroSlides[selected];

  return (
    <section id="beranda" className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* LEFT */}
          <div className="lg:col-span-6 relative z-10 flex flex-col">
            <div
              className="min-h-[420px] flex flex-col justify-center"
              style={{
                opacity: textVisible ? 1 : 0,
                transform: textVisible ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 0.8s ease, transform 0.8s ease",
              }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-12 bg-primary" />
                <span className="font-script text-2xl text-primary">
                  {slide.eyebrow}
                </span>
              </div>

              <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl leading-[0.95] text-ink">
                {slide.title}
              </h1>

              <p className="mt-10 max-w-md text-base text-muted-foreground leading-relaxed">
                {slide.desc}
              </p>
            </div>

            {/* STATIC BUTTONS */}
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <a
                href="#menu"
                className="group inline-flex items-center gap-3 bg-ink text-primary-foreground px-7 py-4 rounded-full text-sm font-medium hover:bg-primary transition"
              >
                Lihat Menu
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </a>

              <a
                href="#kontak"
                className="text-sm text-ink underline underline-offset-8 decoration-secondary decoration-2 hover:text-primary transition"
              >
                Hubungi kami
              </a>
            </div>
          </div>

          {/* RIGHT: crossfade images */}
          <div className="lg:col-span-6 relative">
            <div className="absolute -top-10 -left-6 lg:-left-20 ghost-text text-[10rem] lg:text-[14rem] -z-0 hidden md:block">
              MARILE
            </div>
            <div className="relative aspect-square max-w-xl mx-auto">
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl" />

              <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl z-10">
                {heroSlides.map((s, i) => (
                  <img
                    key={i}
                    src={s.img}
                    alt="Ikan marinasi segar Marile"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      opacity: selected === i ? 1 : 0,
                      transition: "opacity 0.8s ease-in-out",
                    }}
                  />
                ))}
              </div>

              <div className="absolute -top-4 -right-2 z-20 bg-secondary text-secondary-foreground rounded-full h-24 w-24 flex flex-col items-center justify-center rotate-12 shadow-xl">
                <Sparkles className="h-4 w-4 mb-1" />
                <span className="font-script text-lg leading-none">Baru</span>
                <span className="text-[10px] uppercase tracking-widest">
                  2026
                </span>
              </div>
              <div className="absolute -bottom-6 -left-6 z-20 bg-background-light border border-border rounded-2xl px-5 py-3 shadow-lg flex items-center gap-3">
                <Leaf className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Bumbu rempah</p>
                  <p className="text-sm font-medium text-ink">100% Alami</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dots */}
      {/* <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              selected === i ? "w-8 bg-ink" : "w-2 bg-ink/30"
            }`}
          />
        ))}
      </div> */}
    </section>
  );
}

const advantages = [
  {
    icon: Clock,
    title: "Hemat Waktu",
    desc: "Sudah dibersihkan dan dimarinasi — tinggal goreng atau bakar, hidangan siap dalam hitungan menit.",
  },
  {
    icon: Utensils,
    title: "Rasa Meresap",
    desc: "Direndam berjam-jam dalam racikan rempah, sehingga bumbu meresap sampai ke serat terdalam.",
  },
  {
    icon: ShieldCheck,
    title: "Tanpa Pengawet",
    desc: "100% bahan alami — tidak ada MSG berlebih, pewarna, atau pengawet buatan.",
  },
  {
    icon: Leaf,
    title: "Bumbu Alami",
    desc: "Kunyit, jahe, bawang, dan rempah pilihan langsung dari pasar lokal terpercaya.",
  },
  {
    icon: Wallet,
    title: "Harga Bersahabat",
    desc: "Kualitas restoran dengan harga rumahan — cocok untuk konsumsi harian keluarga.",
  },
  {
    icon: Heart,
    title: "Disukai Keluarga",
    desc: "Cita rasa yang familiar di lidah Nusantara — anak-anak sampai orang tua pasti suka.",
  },
];

function Manifesto() {
  return (
    <section id="tentang" className="bg-ink text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 grid md:grid-cols-12 gap-10 items-start">
        <div className="md:col-span-4">
          <p className="text-xs tracking-[0.3em] uppercase text-secondary mb-4">
            Selamat Datang
          </p>
          <h2 className="font-serif text-3xl leading-tight">
            Dari dapur kami,
            <br /> untuk meja Anda.
          </h2>
        </div>
        <div className="md:col-span-8 text-sm md:text-base text-primary-foreground/70 leading-relaxed space-y-4">
          <p>
            Setiap potong ikan Marile dipilih dari nelayan lokal, dibersihkan
            dengan tangan, lalu direndam dalam racikan bumbu rempah khas
            Nusantara. Tidak ada pengawet, tidak ada pemanis buatan — hanya
            kesegaran dan rasa yang jujur.
          </p>
          <p>
            Kami percaya makanan terbaik lahir dari bahan terbaik. Itulah
            sebabnya Marile hadir di meja Anda dalam kondisi paling segar, siap
            dimasak menjadi hidangan istimewa untuk keluarga.
          </p>
        </div>
      </div>
    </section>
  );
}

function Advantages() {
  return (
    <section id="keunggulan" className="relative py-28 overflow-hidden">
      <div className="absolute -top-10 left-0 ghost-text text-[10rem] lg:text-[14rem] hidden lg:block">
        KENAPA
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-5">
            <p className="font-script text-3xl text-primary mb-2">
              Kenapa Marile?
            </p>
            <h2 className="font-serif text-5xl md:text-6xl text-ink leading-[1.05]">
              Keunggulan ikan{" "}
              <em className="text-primary italic font-normal">marinasi</em>.
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 flex items-end">
            <p className="text-base text-muted-foreground leading-relaxed">
              Memilih ikan marinasi Marile berarti memilih kepraktisan tanpa
              mengorbankan rasa. Kami siapkan dari proses memilih hingga
              membumbui, sehingga Anda tinggal menikmati momen makan bersama
              keluarga.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-3xl overflow-hidden border border-border">
          {advantages.map((adv) => (
            <article
              key={adv.title}
              className="bg-background p-8 lg:p-10 group hover:bg-cream transition"
            >
              <div className="h-12 w-12 rounded-full bg-cream group-hover:bg-background border border-border flex items-center justify-center mb-6 transition">
                <adv.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl text-ink mb-3">{adv.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {adv.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BestSeller({ bestSeller }) {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <div>
            <p className="font-script text-3xl text-primary mb-2">Lihat menu</p>
            <h2 className="font-serif text-5xl md:text-6xl text-ink">
              Paling Digemari
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Tiga pilihan favorit pelanggan kami — diolah dengan resep yang sudah
            teruji puluhan tahun di dapur keluarga.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {bestSeller.slice(0, 3).map((item, i) => (
            <article
              key={item.name}
              className={`group ${i === 1 ? "md:-translate-y-8" : ""}`}
            >
              <div className="relative overflow-hidden rounded-3xl bg-cream aspect-[4/5]">
                <img
                  src={
                    item.image_url
                    ? `http://localhost:5000${item.image_url}`
                    : "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400"
                  }
                  alt={item.product_name}
                  width={800}
                  height={1000}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
              </div>
              <div className="mt-6">
                <h3 className="font-serif text-2xl text-ink mb-2">
                  {item.product_name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
                <a
                  href="#menu"
                  className="inline-flex items-center gap-2 mt-4 text-sm text-ink hover:text-primary transition"
                >
                  Pesan sekarang <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function MainMenu({ menu }) {
  return (
    <section id="menu" className="bg-cream py-28 relative overflow-hidden">
      <div className="absolute top-10 right-0 ghost-text text-[12rem] hidden lg:block">
        MENU
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <div className="text-center mb-16">
          <p className="font-script text-2xl text-primary mb-2">
            Pilihan lengkap
          </p>
          <h2 className="font-serif text-5xl md:text-6xl text-ink">
            Menu Utama
          </h2>
          <p className="mt-5 text-sm text-muted-foreground max-w-md mx-auto">
            Beragam pilihan ikan segar marinasi, semua disiapkan dengan standar
            kualitas yang sama.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {menu.map((item) => (
            <article key={item.name} className="group cursor-pointer">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-background">
                <img
                  src={
                    item.image_url
                    ? `http://localhost:5000${item.image_url}`
                    : "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400"
                  }
                  alt={item.name}
                  width={400}
                  height={400}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <h3 className="font-serif text-base text-ink">{item.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Rp. {item.price} / kg
              </p>
            </article>
          ))}
        </div>

        <div className="text-center mt-16">
          <a
            href="#kontak"
            className="inline-flex items-center gap-3 bg-ink text-primary-foreground px-7 py-4 rounded-full text-sm font-medium hover:bg-primary transition"
          >
            Lihat semua menu
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function FindUs() {
  return (
    <section id="kontak" className="py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center mb-14">
          <p className="font-script text-2xl text-primary mb-2">Mampir yuk</p>
          <h2 className="font-serif text-5xl md:text-6xl text-ink">
            Temui Kami
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-stretch">
          <div className="lg:col-span-2 bg-cream rounded-3xl p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-secondary-foreground" />
                </div>
                <h3 className="font-serif text-2xl text-ink">
                  Warung Mbak Wulan
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Jl. Kumudasmoro Tengah Raya No. 401,
                <br />
                Bongsari, Kec. Semarang Barat,
                <br />
                Kota Semarang, Jawa Tengah 50148
              </p>
            </div>
            <div className="mt-8 pt-8 border-t border-border space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />{" "}
                    <span className="text-ink">+62 812 3456 7890</span>
                  </div>
                </a>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com/marile.col"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="flex items-center gap-2">
                    <FaInstagram className="h-4 w-4 text-primary" /> <span className="text-ink">@marile.co.id</span>
                  </div>
                </a>
                
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 rounded-3xl overflow-hidden border border-border min-h-[400px]">
            <iframe
              title="Lokasi Marile"
              src="https://www.google.com/maps?q=Jl.%20Kumudasmoro%20Tengah%20Raya%20No.401%20Semarang&output=embed"
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-ink text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <img src="/assets/img/logo_marile.png" className="w-10"></img>
            <span className="font-serif text-2xl font-bold">Marile</span>
          </div>
          <p className="font-script text-2xl text-secondary mb-2">
            Marinasi lezat & nikmat
          </p>
          <p className="text-sm text-primary-foreground/60 max-w-sm">
            Ikan segar marinasi khas Nusantara, diolah dari resep keluarga
            dengan harga bersahabat untuk setiap meja makan.
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-primary-foreground/50 mb-4">
            Menu
          </p>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="#beranda" className="hover:text-secondary transition">
                Beranda
              </a>
            </li>
            <li>
              <a href="#tentang" className="hover:text-secondary transition">
                Tentang Kami
              </a>
            </li>
            <li>
              <a href="#menu" className="hover:text-secondary transition">
                Menu
              </a>
            </li>
            <li>
              <a href="#kontak" className="hover:text-secondary transition">
                Pesan Sekarang
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-primary-foreground/50 mb-4">
            Kontak
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <a
                href="https://instagram.com/marile.col"
                target="_blank"
                rel="noreferrer"
              >
                <div className="flex items-center gap-2">
                  <FaInstagram className="h-4 w-4" /> @marile.col
                </div>
              </a>
            </li>
            <li className="flex items-center gap-2">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noreferrer"
              >
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> +62 812 3456 7890
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 text-xs text-primary-foreground/50 flex justify-between flex-wrap gap-2">
          <span>© 2026 Marile. Semua hak dilindungi.</span>
          <span>Dibuat dengan ❤ di Semarang</span>
        </div>
      </div>
    </footer>
  );
}
