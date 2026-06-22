"use client";

const proizvodi = [
  {
    naziv: "Auto kišobran 1+1 GRATIS",
    cijena: "14,90 KM",
    slika: "https://i.imgur.com/CcVTxn2.png",
    url: "/auto-kisobran",
    badge: "1+1 GRATIS",
  },
  {
    naziv: "Zakačke za zaštitnu mrežu 100kom",
    cijena: "15,00 KM",
    slika: "https://klikomkupi.com/cdn/shop/files/dd37d215-1e3a-4812-b5a2-5222b0b2f0d7.jpg?v=1737664208",
    url: "/zakacke",
    badge: "AKCIJA",
  },
  {
    naziv: "Makita aku set 4u1",
    cijena: "165,00 KM",
    slika: "https://i.imgur.com/zq6UeUi.jpeg",
    url: "/mak-4u1",
    badge: "3 god. garancija",
  },
  {
    naziv: "Milwaukee aku set 4u1",
    cijena: "199,90 KM",
    slika: "https://i.imgur.com/nLNcYqP.jpeg",
    url: "/milwaukee-4u1",
    badge: "3 god. garancija",
  },
  {
    naziv: "DeWalt aku set 3u1",
    cijena: "129,90 KM",
    slika: "https://i.imgur.com/y7u1FHV.png",
    url: "/dewalt-3u1",
    badge: "3 god. garancija",
  },
  {
    naziv: "Mini projektor",
    cijena: "39,90 KM",
    slika: "https://i.imgur.com/2wCiHNE.jpeg",
    url: "/projektor",
    badge: "SP 2026",
  },
  {
    naziv: "Električna muhalica 1+1",
    cijena: "29,90 KM",
    slika: "https://i.imgur.com/Zv2qWmd.png",
    url: "/elektricna-muhalica",
    badge: "1+1 GRATIS",
  },
  {
    naziv: "Makita aku freza za zemlju",
    cijena: "69,90 KM",
    slika: "https://i.imgur.com/gi8Q06R.png",
    url: "/makita-freza",
    badge: "3 god. garancija",
  },
  {
    naziv: "Aku trimer 4 rotora",
    cijena: "117,00 KM",
    slika: "https://i.imgur.com/YTfFjJp.jpeg",
    url: "/aku-trimer",
    badge: "4 rotora",
  },
];

export default function KatalogPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f5f5; }

        .wrap {
          font-family: 'Nunito', sans-serif;
          background: #f5f5f5;
          min-height: 100vh;
          color: #1a1a1a;
        }

        /* ── HEADER ── */
        .header {
          background: #111;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 12px rgba(0,0,0,0.3);
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .logo-icon {
          width: 36px;
          height: 36px;
          background: #dc2626;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
        .logo-text {
          font-size: 20px;
          font-weight: 900;
          color: #fff;
          letter-spacing: .04em;
        }
        .logo-text span { color: #dc2626; }
        .header-sub {
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.4);
        }

        /* ── HERO BANNER ── */
        .hero-banner {
          background: linear-gradient(135deg, #111, #1f1f1f);
          padding: 28px 20px;
          text-align: center;
          border-bottom: 3px solid #dc2626;
        }
        .hero-title {
          font-size: 22px;
          font-weight: 900;
          color: #fff;
          margin-bottom: 6px;
        }
        .hero-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          font-weight: 600;
        }
        .hero-tags {
          display: flex;
          gap: 8px;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 14px;
        }
        .hero-tag {
          background: rgba(220,38,38,0.15);
          border: 1px solid rgba(220,38,38,0.3);
          color: #f87171;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 50px;
        }

        /* ── GRID ── */
        .grid-section {
          max-width: 960px;
          margin: 0 auto;
          padding: 24px 16px 40px;
        }
        .section-label {
          font-size: 13px;
          font-weight: 800;
          color: #888;
          text-transform: uppercase;
          letter-spacing: .06em;
          margin-bottom: 16px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        @media (min-width: 600px) {
          .grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 900px) {
          .grid { grid-template-columns: repeat(4, 1fr); }
        }

        /* ── KARTICA ── */
        .card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          border: 1.5px solid #e5e7eb;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          display: block;
          transition: transform .2s, box-shadow .2s, border-color .2s;
        }
        .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          border-color: #dc2626;
        }
        .card-img-wrap {
          position: relative;
          width: 100%;
          padding-top: 100%;
          background: #f9fafb;
          overflow: hidden;
        }
        .card-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .3s;
        }
        .card:hover .card-img { transform: scale(1.05); }
        .card-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          background: #dc2626;
          color: #fff;
          font-size: 10px;
          font-weight: 900;
          padding: 3px 8px;
          border-radius: 6px;
          letter-spacing: .04em;
          text-transform: uppercase;
        }
        .card-body {
          padding: 12px;
        }
        .card-naziv {
          font-size: 13px;
          font-weight: 800;
          color: #111;
          line-height: 1.35;
          min-height: 36px;
        }
        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
        }
        .card-cijena {
          font-size: 16px;
          font-weight: 900;
          color: #16a34a;
        }
        .card-cta {
          background: #dc2626;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          padding: 5px 12px;
          border-radius: 8px;
          letter-spacing: .03em;
        }

        /* ── FOOTER ── */
        .footer {
          background: #111;
          padding: 24px 20px;
          text-align: center;
        }
        .footer-logo {
          font-size: 18px;
          font-weight: 900;
          color: #fff;
          margin-bottom: 10px;
        }
        .footer-logo span { color: #dc2626; }
        .footer-links {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }
        .footer-link {
          color: rgba(255,255,255,0.45);
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
        }
        .footer-link:hover { color: #fff; }
        .footer-copy {
          font-size: 11px;
          color: rgba(255,255,255,0.25);
          font-weight: 600;
        }
      `}</style>

      <div className="wrap">

        {/* ── HEADER ── */}
        <header className="header">
          <a href="/" className="logo">
            <div className="logo-icon">📺</div>
            <div>
              <div className="logo-text">TV<span>-</span>SHOP</div>
              <div className="header-sub">tvshopbh.com</div>
            </div>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a" }} />
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 700 }}>
              Plaćanje pouzećem
            </span>
          </div>
        </header>

        {/* ── HERO ── */}
        <div className="hero-banner">
          <div className="hero-title">🛒 Sve na jednom mjestu</div>
          <div className="hero-sub">Kvalitetni proizvodi · Dostava 2–4 dana · Plaćanje pouzećem</div>
          <div className="hero-tags">
            <span className="hero-tag">✅ Plaćanje pouzećem</span>
            <span className="hero-tag">🚚 Dostava po BiH</span>
            <span className="hero-tag">🔄 Povrat moguć</span>
            <span className="hero-tag">📞 Potvrda pozivom</span>
          </div>
        </div>

        {/* ── GRID PROIZVODA ── */}
        <div className="grid-section">
          <div className="section-label">🏷️ Svi proizvodi ({proizvodi.length})</div>
          <div className="grid">
            {proizvodi.map((p) => (
              <a key={p.url} href={p.url} className="card">
                <div className="card-img-wrap">
                  <img
                    src={p.slika}
                    alt={p.naziv}
                    className="card-img"
                  />
                  {p.badge && <span className="card-badge">{p.badge}</span>}
                </div>
                <div className="card-body">
                  <div className="card-naziv">{p.naziv}</div>
                  <div className="card-footer">
                    <span className="card-cijena">{p.cijena}</span>
                    <span className="card-cta">Naruči →</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer className="footer">
          <div className="footer-logo">TV<span>-</span>SHOP</div>
          <div className="footer-links">
            <a href="/privatnost" className="footer-link">Politika privatnosti</a>
            <a href="/impressum" className="footer-link">Impressum</a>
            <a href="/uslovi" className="footer-link">Uslovi korištenja</a>
          </div>
          <div className="footer-copy">© 2025 TV-SHOP · tvshopbh.com · Sva prava zadržana</div>
        </footer>

      </div>
    </>
  );
}