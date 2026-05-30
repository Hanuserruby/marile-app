import React, { useState, useEffect } from "react";
import api from "../api/axios";
import "../styles/LandingPage.css";

function LandingPage() {
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
    <div>
      {/* --- HEADER --- */}
      <header>
        <div className="logo-container">
          <img
            src="/assets/img/logo_marile.png"
            alt="Logo"
            className="logo-img"
          />
          MARILE
        </div>
        <nav>
          <a href="#beranda">Beranda</a>
          <a href="#menu">Menu</a>
          <a href="#contact">Contact Us</a>
          <a href="/login" className="btn-signin">
            Sign In
          </a>
        </nav>
      </header>

      {/* --- BEST SELLER --- */}
      <div className="section-title" id="beranda">
        <span>See Our</span>
        <h2>Best Seller</h2>
      </div>

      <section className="best-seller">
        {loading ? (
          <p style={{ color: "white", textAlign: "center" }}>Memuat...</p>
        ) : bestSeller.length === 0 ? (
          <p style={{ color: "white", textAlign: "center" }}>
            Belum ada data best seller.
          </p>
        ) : (
          bestSeller.slice(0, 3).map((product, index) => (
            <div
              className={`best-item ${index === 1 ? "center" : "side"}`}
              key={product.product_id}
            >
              <img
               src={product.image_url ? `http://localhost:8000${product.image_url}` : "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400"}
                alt={product.product_name}
              />
              <div
                className="badge"
                style={index === 1 ? { padding: "10px 50px" } : {}}
              >
                {product.product_name}
              </div>
            </div>
          ))
        )}
      </section>

      {/* --- MAIN MENU --- */}
      <div className="section-title" id="menu">
        <span>Main</span>
        <h2>Menu</h2>
      </div>

      <section className="menu-section">
        <div className="menu-grid">
          {loading ? (
            <p
              style={{
                color: "white",
                textAlign: "center",
                gridColumn: "1 / -1",
              }}
            >
              Memuat menu...
            </p>
          ) : menu.length === 0 ? (
            <p
              style={{
                color: "white",
                textAlign: "center",
                gridColumn: "1 / -1",
              }}
            >
              Belum ada menu tersedia.
            </p>
          ) : (
            menu.map((product) => (
              <div className="menu-card" key={product.id}>
                <img
                  src={product.image_url ? `http://localhost:8000${product.image_url}` : "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400"}
                  alt={product.name}
                />
                <h4>{product.name}</h4>
                <p>Rp {product.price.toLocaleString("id-ID")}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* --- FIND US --- */}
      <section className="find-us">
        <div className="section-title" style={{ marginTop: 0 }}>
          <h2>Find Us</h2>
        </div>
        <div className="location-box">
          <div className="loc-circle">
            <img
              src="/assets/img/location.png"
              alt="Loc"
              className="loc-icon-img"
            />
          </div>
          <div className="loc-text">
            <h3>Warung Mbak Wulan</h3>
            <div className="loc-badge">
              Jl. Kumudasmoro Tengah Raya No.401, Bongsari, Kec. Semarang Barat,
              Semarang
            </div>
          </div>
        </div>
        <div className="map-container">
          <iframe
            title="Google Maps Marile"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.226038481335!2d110.395521974187!3d-6.982635968378776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708b350616b3f7%3A0x6b6c8696c2162635!2sJl.%20Kumudasmoro%20Tengah%20Raya%20No.401%2C%20Bongsari%2C%20Kec.%20Semarang%20Barat%2C%20Kota%20Semarang!5e0!3m2!1sid!2sid!4v1715100000000!5m2!1sid!2sid"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer>
        <div className="footer-info" id="contact">
          <div className="logo-container">
            <img
              src="/assets/img/logo_marile.png"
              alt="Logo"
              className="logo-img"
            />
            MARILE
          </div>
          <p>
            Marinasi Lezat Dan Nikmat,
            <br />
            Harga Bersahabat
          </p>
        </div>
        <div className="footer-nav">
          <div className="footer-col">
            <h4>Menu</h4>
            <ul>
              <li>
                <a href="#beranda">Beranda</a>
              </li>
              <li>
                <a href="#about">About Us</a>
              </li>
              <li>
                <a href="#pesan">Pesan Sekarang</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact Us</h4>
            <ul>
              <li>
                <a
                  href="https://instagram.com/marile.col"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="/assets/img/instagram.png"
                    alt="IG"
                    className="footer-icon"
                  />{" "}
                  @marile.col
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="/assets/img/whatsapp.png"
                    alt="WA"
                    className="footer-icon"
                  />{" "}
                  +62 812-3456-7890
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
