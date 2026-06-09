"use client";

import { useMemo, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export default function Page() {
  const [giftPack, setGiftPack] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [openFaq, setOpenFaq]   = useState<number | null>(null);
  const orderRef = useRef<HTMLElement | null>(null);

  const scrollToOrder = () =>
    orderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const baseTotal = 57.9; // 47.90 + 10 dostava
  const total = useMemo(() => (giftPack ? baseTotal + 5 : baseTotal), [giftPack]);

  const benefits = [
    { icon: "📺", text: "Slika do 150 inča – gledaj utakmice kao u bioskopu, kod kuće" },
    { icon: "🔊", text: "Ugrađeni zvučnik – nema potrebe za dodatnom opremom" },
    { icon: "📱", text: "Spoji telefon, laptop, USB ili HDMI – radi sa svime" },
    { icon: "🌙", text: "Radi i danju i noću – idealan za dnevni boravak ili dvorište" },
    { icon: "🎮", text: "Nije samo za fudbal – filmovi, serije, gaming, YouTube" },
    { icon: "✈️", text: "Kompaktan i lagan – ponesi ga na vikendicu, terasu ili kamp" },
  ];

  const testimonials = [
    { text: "Gledali smo zadnje utakmice na zidu u dvorištu. Komšije su se same pojavile. Fenomenalno iskustvo za tu cijenu!", author: "Emir K.", city: "Sarajevo" },
    { text: "Kupio sam projektor sedmicu prije Mundijala. Sad nikad više ne bih gledao fudbal na malom TV-u.", author: "Dragan M.", city: "Banja Luka" },
    { text: "Postavio sam ga u dnevnoj sobi. Slika na cijelom zidu, zvuk odličan. Djeca su oduševljena.", author: "Adnan R.", city: "Tuzla" },
    { text: "Nosio sam ga na roštilj kod prijatelja. Gledali utakmicu napolju na bijelom zidu. Svi su pitali odakle to.", author: "Ivan P.", city: "Mostar" },
    { text: "Za ovu cijenu nisam očekivao ovako dobru sliku. Projektujem na plahtu u dvorištu, izgleda odlično.", author: "Lejla H.", city: "Zenica" },
    { text: "Moja djeca gledaju crtane na velikom zidu. A ja utakmice. Svako dobija svoje.", author: "Tarik B.", city: "Bihać" },
  ];

  const faqs = [
    { q: "Koliko velika slika može biti?", a: "Slika može biti do 150 inča, ovisno o udaljenosti od zida. Idealna udaljenost za oštru sliku je 2–4 metra." },
    { q: "Kako spojiti telefon ili laptop?", a: "Projektor ima HDMI i USB ulaz. Telefon možete spojiti kablom ili bežično putem screen mirroring funkcije." },
    { q: "Može li raditi danju?", a: "Da, ali slika je najjasnja u zamračenom prostoru ili navečer. Za dvorište je idealan u večernjim satima." },
    { q: "Da li ima zvučnik?", a: "Da, projektor ima ugrađeni zvučnik. Za još bolji zvuk možete spojiti vanjske zvučnike putem priključka." },
    { q: "Kako se plaća?", a: "Plaćanje je pouzećem – platiš kuriru tek kada preuzmeš paket na svojoj adresi. Nema rizika." },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const fd   = new FormData(form);

    const order = {
      product_name:  "Mini projektor",
      full_name:     String(fd.get("ime") || ""),
      phone:         String(fd.get("telefon") || ""),
      address_place: String(fd.get("adresa") || ""),
      postal_code:   String(fd.get("postanski") || ""),
      gift_pack:     giftPack,
      shipping:      10,
      product_price: 47.9,
      total:         Number(total.toFixed(2)),
      status:        "novo",
      source:        "mini-projektor",
    };

    if (!order.full_name || !order.phone || !order.address_place || !order.postal_code) {
      alert("Molimo popunite sva polja.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("orders").insert(order);
    if (error) { alert("Greška pri slanju. Pokušajte ponovo."); setLoading(false); return; }

    if (window.fbq) {
      window.fbq("track", "Lead", { content_name: order.product_name, value: order.total, currency: "BAM" });
    }

    form.reset();
    setGiftPack(false);
    setLoading(false);
    setSuccess(true);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f5f5; }

        .page {
          font-family: 'Nunito', sans-serif;
          background: #f5f5f5;
          color: #1a1a1a;
          min-height: 100vh;
          max-width: 480px;
          margin: 0 auto;
        }

        /* ── WORLD CUP TOPBAR ── */
        .topbar {
          background: linear-gradient(90deg, #1a3a1a, #15601a, #1a3a1a);
          color: #fff;
          text-align: center;
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: .02em;
        }

        /* ── WORLD CUP BANNER ── */
        .wc-banner {
          background: linear-gradient(135deg, #0a1628, #1a3a6e, #0a1628);
          color: #fff;
          padding: 20px 16px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .wc-banner::before {
          content: '⚽';
          position: absolute;
          font-size: 120px;
          opacity: .05;
          top: -20px;
          right: -10px;
        }
        .wc-year {
          font-size: 48px;
          font-weight: 900;
          color: #fbbf24;
          line-height: 1;
        }
        .wc-title {
          font-size: 18px;
          font-weight: 900;
          color: #fff;
          margin-top: 4px;
        }
        .wc-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.65);
          margin-top: 6px;
          line-height: 1.5;
        }
        .wc-flags {
          font-size: 22px;
          margin-top: 10px;
          letter-spacing: 4px;
        }

        /* ── HERO ── */
        .hero {
          background: #fff;
          padding: 20px 16px 24px;
          border-bottom: 3px solid #f0f0f0;
        }
        .hero-badge {
          display: inline-block;
          background: #fef2f2;
          color: #dc2626;
          font-size: 12px;
          font-weight: 800;
          padding: 5px 12px;
          border-radius: 6px;
          border: 1px solid #fecaca;
          margin-bottom: 12px;
        }
        .hero h1 {
          font-size: 26px;
          font-weight: 900;
          line-height: 1.2;
          color: #111;
          margin-bottom: 8px;
        }
        .hero-sub {
          font-size: 14px;
          color: #555;
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .hero-img {
          width: 100%;
          border-radius: 14px;
          overflow: hidden;
          border: 2px solid #e5e7eb;
          position: relative;
          margin-bottom: 16px;
          background: #f9fafb;
        }
        .hero-img img { width: 100%; display: block; }
        .hero-img-badge {
          position: absolute;
          top: 12px; left: 12px;
          background: #dc2626;
          color: #fff;
          font-size: 13px;
          font-weight: 900;
          padding: 5px 12px;
          border-radius: 8px;
        }
        .hero-img-price {
          position: absolute;
          top: 12px; right: 12px;
          background: #16a34a;
          color: #fff;
          font-size: 15px;
          font-weight: 900;
          padding: 5px 12px;
          border-radius: 8px;
        }

        .price-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .price-new { font-size: 36px; font-weight: 900; color: #16a34a; }
        .price-sub-tag {
          background: #fef9c3;
          color: #854d0e;
          font-size: 12px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid #fde68a;
        }

        .cta-btn {
          width: 100%;
          padding: 18px;
          background: #dc2626;
          color: #fff;
          font-family: 'Nunito', sans-serif;
          font-size: 18px;
          font-weight: 900;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: background .15s, transform .15s;
          box-shadow: 0 4px 14px rgba(220,38,38,0.3);
        }
        .cta-btn:hover { background: #b91c1c; transform: translateY(-1px); }

        .trust-row {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 12px;
          flex-wrap: wrap;
        }
        .trust-item { font-size: 12px; font-weight: 700; color: #555; }

        /* ── SCREEN SIZE VISUAL ── */
        .screen-box {
          background: #0a1628;
          border-radius: 14px;
          padding: 20px 16px;
          text-align: center;
          margin-bottom: 0;
        }
        .screen-inner {
          border: 3px solid #fbbf24;
          border-radius: 8px;
          padding: 16px;
          position: relative;
        }
        .screen-pitch {
          font-size: 48px;
          line-height: 1;
        }
        .screen-label {
          color: #fbbf24;
          font-size: 22px;
          font-weight: 900;
          margin-top: 8px;
        }
        .screen-sub {
          color: rgba(255,255,255,0.6);
          font-size: 12px;
          font-weight: 600;
          margin-top: 4px;
        }

        .section {
          background: #fff;
          margin-top: 8px;
          padding: 22px 16px;
        }
        .section-title {
          font-size: 20px;
          font-weight: 900;
          color: #111;
          margin-bottom: 16px;
        }

        .benefit-list { display: flex; flex-direction: column; gap: 10px; }
        .benefit-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          color: #1a1a1a;
        }
        .benefit-icon { font-size: 20px; flex-shrink: 0; }

        /* spec grid */
        .spec-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .spec-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 14px;
          text-align: center;
        }
        .spec-icon { font-size: 24px; }
        .spec-val { font-size: 16px; font-weight: 900; color: #111; margin-top: 6px; }
        .spec-lbl { font-size: 11px; font-weight: 700; color: #888; margin-top: 2px; text-transform: uppercase; letter-spacing: .04em; }

        .t-list { display: flex; flex-direction: column; gap: 10px; }
        .t-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-left: 3px solid #16a34a;
          border-radius: 10px;
          padding: 14px;
        }
        .t-stars { color: #f59e0b; font-size: 13px; margin-bottom: 6px; }
        .t-text { font-size: 13px; color: #333; line-height: 1.65; }
        .t-author { font-size: 12px; font-weight: 800; color: #16a34a; margin-top: 8px; }

        .urgency {
          background: #fef2f2;
          border: 2px solid #fecaca;
          border-radius: 12px;
          padding: 14px 16px;
          text-align: center;
          margin-top: 8px;
        }
        .urgency-title { font-size: 16px; font-weight: 900; color: #dc2626; margin-bottom: 4px; }
        .urgency-sub { font-size: 13px; font-weight: 600; color: #555; }

        .faq-item {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 8px;
          background: #fff;
        }
        .faq-q {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 16px;
          cursor: pointer;
          user-select: none;
          gap: 10px;
        }
        .faq-q-text { font-size: 14px; font-weight: 800; color: #111; }
        .faq-icon {
          width: 24px; height: 24px; border-radius: 50%;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 700; color: #16a34a;
          flex-shrink: 0; transition: transform .2s;
        }
        .faq-item.open .faq-icon { transform: rotate(45deg); }
        .faq-a {
          font-size: 13px; color: #555; line-height: 1.7;
          max-height: 0; overflow: hidden; padding: 0 16px;
          transition: max-height .3s ease, padding .3s ease;
        }
        .faq-item.open .faq-a { max-height: 200px; padding: 0 16px 15px; }

        .form-section {
          background: #fff;
          margin-top: 8px;
          padding: 24px 16px 32px;
          border-top: 4px solid #dc2626;
        }
        .form-header { text-align: center; margin-bottom: 20px; }
        .form-header-badge {
          display: inline-block;
          background: #dc2626;
          color: #fff;
          font-size: 12px;
          font-weight: 800;
          padding: 5px 14px;
          border-radius: 6px;
          margin-bottom: 10px;
        }
        .form-title { font-size: 24px; font-weight: 900; color: #111; margin-bottom: 4px; }
        .form-sub { font-size: 13px; color: #555; font-weight: 600; }

        .inp {
          width: 100%;
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          padding: 14px 16px;
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #111;
          transition: border-color .2s;
          outline: none;
        }
        .inp::placeholder { color: #aaa; font-weight: 600; }
        .inp:focus { border-color: #16a34a; background: #fff; }

        .gift-label {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          padding: 14px;
          cursor: pointer;
          transition: border-color .2s, background .2s;
        }
        .gift-label.checked { border-color: #16a34a; background: #f0fdf4; }
        .gift-label input { accent-color: #16a34a; width: 18px; height: 18px; margin-top: 1px; flex-shrink: 0; }
        .gift-lbl-title { font-size: 14px; font-weight: 800; color: #111; }
        .gift-lbl-sub { font-size: 12px; font-weight: 600; color: #666; margin-top: 2px; }

        .summary-box {
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          font-weight: 600;
          color: #555;
          padding: 4px 0;
        }
        .summary-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          padding-top: 12px;
          border-top: 2px solid #e5e7eb;
        }
        .summary-total-lbl { font-size: 18px; font-weight: 900; color: #111; }
        .summary-total-val { font-size: 26px; font-weight: 900; color: #16a34a; }

        .submit-btn {
          width: 100%;
          padding: 18px;
          background: #dc2626;
          color: #fff;
          font-family: 'Nunito', sans-serif;
          font-size: 20px;
          font-weight: 900;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: background .15s, transform .15s;
          box-shadow: 0 4px 16px rgba(220,38,38,0.3);
        }
        .submit-btn:hover:not(:disabled) { background: #b91c1c; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: .65; cursor: not-allowed; }
        .form-note { text-align: center; font-size: 12px; font-weight: 600; color: #888; margin-top: 10px; }

        @keyframes scaleIn { from { transform: scale(.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .success-wrap { text-align: center; padding: 40px 16px; animation: scaleIn .4s ease both; }
        .success-icon { font-size: 64px; margin-bottom: 16px; }
        .success-title { font-size: 26px; font-weight: 900; color: #16a34a; margin-bottom: 8px; }
        .success-sub { font-size: 15px; font-weight: 600; color: #555; line-height: 1.6; }

        .footer {
          background: #f5f5f5;
          padding: 20px 16px;
          text-align: center;
          font-size: 12px;
          font-weight: 600;
          color: #aaa;
          margin-top: 8px;
        }
      `}</style>

      <div className="page">

        <div className="topbar">
          ⚽ Svjetsko prvenstvo 2026 — Gledaj utakmice na VELIKOM ekranu!
        </div>

        {/* ── WORLD CUP BANNER ── */}
        <div className="wc-banner">
          <div className="wc-year">2026 ⚽</div>
          <div className="wc-title">FIFA Svjetsko Prvenstvo</div>
          <div className="wc-sub">
            SAD · Kanada · Meksiko<br />
            Ne gledaj utakmice na malom ekranu — donesi stadionski doživljaj kući
          </div>
          <div className="wc-flags">🇧🇦 🏆 🇺🇸</div>
        </div>

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-badge">⚽ Idealno za gledanje Mundijala 2026!</div>

          <h1>Mini projektor – do 150 inča slike</h1>
          <p className="hero-sub">
            Gledaj svaku utakmicu Svjetskog prvenstva 2026 na ogromnom ekranu — u dnevnoj sobi, dvorištu ili na terasi. Spoji telefon ili laptop i uživaj u fudbalu kao nikad prije.
          </p>

          <div className="hero-img">
            <span className="hero-img-badge">⚽ SP 2026</span>
            <span className="hero-img-price">47,90 KM</span>
            <img src="https://i.imgur.com/2wCiHNE.jpeg" alt="Mini projektor" />
          </div>

          <div className="price-row">
            <span className="price-new">47,90 KM</span>
            <span className="price-sub-tag">🎁 Dostava na adresu</span>
          </div>

          <button className="cta-btn" onClick={scrollToOrder}>
            🛒 NARUČI ODMAH
          </button>

          <div className="trust-row">
            <span className="trust-item">✅ Plaćanje pouzećem</span>
            <span className="trust-item">🚚 Dostava 2–4 dana</span>
            <span className="trust-item">📺 Do 150 inča slike</span>
          </div>
        </section>

        {/* ── SCREEN SIZE VISUAL ── */}
        <section className="section">
          <div className="section-title">📐 Kolika je slika?</div>
          <div className="screen-box">
            <div className="screen-inner">
              <div className="screen-pitch">🟩⚽🟩</div>
              <div className="screen-label">do 150 inča</div>
              <div className="screen-sub">To je oko 3,5 metra slike — na tvom zidu</div>
            </div>
          </div>
          <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { size: "60\"", label: "Prosječan TV", note: "Standard dnevne sobe" },
              { size: "100\"", label: "Projektor – blizu", note: "2 metra od zida" },
              { size: "150\"", label: "Projektor – daleko", note: "3–4 metra od zida" },
            ].map((r) => (
              <div key={r.size} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "10px" }}>
                <span style={{ fontSize: "18px", fontWeight: 900, color: "#16a34a", width: "48px", flexShrink: 0 }}>{r.size}</span>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: "#111" }}>{r.label}</div>
                  <div style={{ fontSize: "11px", color: "#888", fontWeight: 600 }}>{r.note}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SPEC GRID ── */}
        <section className="section">
          <div className="section-title">🔧 Specifikacije</div>
          <div className="spec-grid">
            {[
              { icon: "📺", val: "150\"", lbl: "Max. veličina slike" },
              { icon: "🔊", val: "Ugrađen", lbl: "Zvučnik" },
              { icon: "🔌", val: "HDMI + USB", lbl: "Priključci" },
              { icon: "📱", val: "iOS + Android", lbl: "Bežično spajanje" },
            ].map((s) => (
              <div className="spec-card" key={s.lbl}>
                <div className="spec-icon">{s.icon}</div>
                <div className="spec-val">{s.val}</div>
                <div className="spec-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── BENEFITI ── */}
        <section className="section">
          <div className="section-title">✅ Zašto ovaj projektor</div>
          <div className="benefit-list">
            {benefits.map((b) => (
              <div className="benefit-item" key={b.text}>
                <span className="benefit-icon">{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="section">
          <div className="section-title">💬 Šta kažu kupci</div>
          <div className="t-list">
            {testimonials.map((t, i) => (
              <div className="t-card" key={i}>
                <div className="t-stars">★★★★★</div>
                <p className="t-text">"{t.text}"</p>
                <div className="t-author">— {t.author}, {t.city}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="urgency">
          <div className="urgency-title">⏳ Mundijal počinje uskoro — naruči na vrijeme!</div>
          <div className="urgency-sub">Zalihe su ograničene. Ne propusti utakmice na malom ekranu.</div>
        </div>

        {/* ── FAQ ── */}
        <section className="section">
          <div className="section-title">❓ Često postavljana pitanja</div>
          {faqs.map((item, i) => (
            <div
              className={`faq-item${openFaq === i ? " open" : ""}`}
              key={i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="faq-q">
                <span className="faq-q-text">{item.q}</span>
                <div className="faq-icon">+</div>
              </div>
              <div className="faq-a">{item.a}</div>
            </div>
          ))}
        </section>

        {/* ── ORDER FORM ── */}
        <section ref={orderRef} className="form-section">
          {success ? (
            <div className="success-wrap">
              <div className="success-icon">✅</div>
              <div className="success-title">Narudžba primljena!</div>
              <p className="success-sub">
                Hvala! Naš tim će te uskoro nazvati radi potvrde.<br />
                Dostava za 2–4 radna dana. Plaćaš pouzećem.
              </p>
            </div>
          ) : (
            <>
              <div className="form-header">
                <div className="form-header-badge">🛒 ZAVRŠI NARUDŽBU</div>
                <div className="form-title">Naruči odmah</div>
                <div className="form-sub">Upiši podatke i mi ćemo te nazvati za potvrdu</div>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <input className="inp" name="ime"       autoComplete="off" placeholder="Ime i prezime" />
                <input className="inp" name="telefon"   autoComplete="off" placeholder="Broj telefona" />
                <input className="inp" name="adresa"    autoComplete="off" placeholder="Adresa i mjesto" />
                <input className="inp" name="postanski" autoComplete="off" placeholder="Poštanski broj" />

                <label className={`gift-label${giftPack ? " checked" : ""}`}>
                  <input type="checkbox" checked={giftPack} onChange={(e) => setGiftPack(e.target.checked)} />
                  <div>
                    <div className="gift-lbl-title">🎁 Poklon pakovanje</div>
                    <div className="gift-lbl-sub">+ 5,00 KM</div>
                  </div>
                </label>

                <div className="summary-box">
                  <div className="summary-row"><span>Mini projektor</span><span>47,90 KM</span></div>
                  <div className="summary-row"><span>Dostava</span><span>10,00 KM</span></div>
                  {giftPack && (
                    <div className="summary-row" style={{ color: "#16a34a", fontWeight: 700 }}>
                      <span>Poklon pakovanje</span><span>5,00 KM</span>
                    </div>
                  )}
                  <div className="summary-total">
                    <span className="summary-total-lbl">UKUPNO</span>
                    <span className="summary-total-val">{total.toFixed(2)} KM</span>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? "ŠALJE SE..." : "🛒 NARUČI ODMAH"}
                </button>
                <div className="form-note">
                  🔒 Plaćanje pouzećem · Platiš tek pri preuzimanju
                </div>
              </form>
            </>
          )}
        </section>

        <div className="footer">
          © 2025 · Sva prava zadržana · Plaćanje pouzećem
        </div>

      </div>
    </>
  );
}