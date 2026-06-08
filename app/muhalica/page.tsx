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

  const baseTotal = 39.9; // 29.90 + 10 dostava
  const total = useMemo(() => (giftPack ? baseTotal + 5 : baseTotal), [giftPack]);

  const benefits = [
    { icon: "⚡", text: "Ubija komarce, muhe i insekte trenutno – jedan dodir i gotovo" },
    { icon: "🎁", text: "1+1 GRATIS – dva komada po cijeni jednog, jedan za sebe, jedan pokloni" },
    { icon: "🔋", text: "Punjiva baterija – nema kupovine baterija, punjenje USB kablom" },
    { icon: "🌿", text: "Bez hemikalija i sprejeva – bezbjedna za djecu i kućne ljubimce" },
    { icon: "🏠", text: "Radi u kući i napolju – terasa, bašta, dnevna soba, kuhinja" },
    { icon: "🪰", text: "Zaštitna mreža – ne možeš se slučajno dodirnuti dok ne pritisneš dugme" },
  ];

  const useCases = [
    { icon: "🍖", title: "Roštilj i terasa", desc: "Nema više muha oko hrane napolju" },
    { icon: "😴", title: "Spavaća soba", desc: "Bez zujanja komaraca noću" },
    { icon: "🍽️", title: "Kuhinja i trpezarija", desc: "Hrana zaštićena od insekata" },
    { icon: "🌳", title: "Bašta i dvorište", desc: "Uživaj napolju bez uznemiravanja" },
  ];

  const testimonials = [
    { text: "Konačno mir na terasi! Komarac priđe – i gotovo. Bolje od svih sprejeva koje sam koristila.", author: "Amra K.", city: "Sarajevo" },
    { text: "Uzeo jedan za sebe, jedan poklonio tati. Obojica prezadovoljni. Baterija traje dugo.", author: "Marko S.", city: "Banja Luka" },
    { text: "Djeca su je koristile kao igračku za lovljenje muha u dvorištu. I praktično i zabavno.", author: "Nihad B.", city: "Tuzla" },
    { text: "Imao sam problem sa muhama u kuhinji cijelo ljeto. Ovo je riješilo problem za jedan dan.", author: "Vesna P.", city: "Mostar" },
    { text: "Punjiva baterija je ono što me oduševilo. Nema više kupovine AA baterija svake sedmice.", author: "Alen Đ.", city: "Zenica" },
    { text: "Koristim je na kampovanju. Lagana, efikasna i stane u ranac. Odlična stvar.", author: "Ivana T.", city: "Bihać" },
  ];

  const faqs = [
    { q: "Koliko komada dolazi?", a: "U paketu dolaze 2 električne muhalice – 1+1 GRATIS. Plaćaš jedan, dobivaš dva." },
    { q: "Kako se puni baterija?", a: "Muhalica se puni putem USB kabla koji je uključen u paketu. Punjenje traje oko 1–2 sata." },
    { q: "Da li je sigurna za djecu?", a: "Da. Muhalica ima zaštitnu mrežu koja sprječava slučajni dodir. Električna mreža se aktivira samo kada se pritisne dugme." },
    { q: "Ubija li komarce i muhe?", a: "Da, radi na komarce, muhe, moljce i ostale leteće insekte. Jedan dodir uz aktiviranu mrežu je dovoljan." },
    { q: "Kako se plaća?", a: "Plaćanje je pouzećem – platiš kuriru tek kada preuzmeš paket. Nema rizika." },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const fd   = new FormData(form);

    const order = {
      product_name:  "Električna muhalica 1+1 GRATIS",
      full_name:     String(fd.get("ime") || ""),
      phone:         String(fd.get("telefon") || ""),
      address_place: String(fd.get("adresa") || ""),
      postal_code:   String(fd.get("postanski") || ""),
      gift_pack:     giftPack,
      shipping:      10,
      product_price: 29.9,
      total:         Number(total.toFixed(2)),
      status:        "novo",
      source:        "elektricna-muhalica",
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

        /* topbar narančasta – ljetna boja */
        .topbar {
          background: linear-gradient(90deg, #c2410c, #ea580c, #c2410c);
          color: #fff;
          text-align: center;
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: .02em;
        }

        /* 1+1 GRATIS hero banner */
        .gratis-banner {
          background: linear-gradient(135deg, #7c2d12, #c2410c);
          padding: 18px 16px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .gratis-banner::before {
          content: '🪰';
          position: absolute;
          font-size: 100px;
          opacity: .06;
          top: -10px;
          right: -10px;
        }
        .gratis-tag {
          display: inline-block;
          background: #fbbf24;
          color: #7c2d12;
          font-size: 28px;
          font-weight: 900;
          padding: 8px 24px;
          border-radius: 50px;
          letter-spacing: .02em;
        }
        .gratis-sub {
          color: rgba(255,255,255,0.85);
          font-size: 14px;
          font-weight: 700;
          margin-top: 8px;
        }

        /* hero */
        .hero {
          background: #fff;
          padding: 20px 16px 24px;
          border-bottom: 3px solid #f0f0f0;
        }
        .hero-badge {
          display: inline-block;
          background: #fff7ed;
          color: #c2410c;
          font-size: 12px;
          font-weight: 800;
          padding: 5px 12px;
          border-radius: 6px;
          border: 1px solid #fed7aa;
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
          border: 2px solid #fed7aa;
          position: relative;
          margin-bottom: 16px;
          background: #fff7ed;
        }
        .hero-img img { width: 100%; display: block; }
        .hero-img-badge {
          position: absolute;
          top: 12px; left: 12px;
          background: #c2410c;
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
        .price-gratis {
          background: #fbbf24;
          color: #7c2d12;
          font-size: 13px;
          font-weight: 900;
          padding: 5px 12px;
          border-radius: 6px;
        }

        .cta-btn {
          width: 100%;
          padding: 18px;
          background: #c2410c;
          color: #fff;
          font-family: 'Nunito', sans-serif;
          font-size: 18px;
          font-weight: 900;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: background .15s, transform .15s;
          box-shadow: 0 4px 14px rgba(194,65,12,0.35);
        }
        .cta-btn:hover { background: #9a3412; transform: translateY(-1px); }

        .trust-row {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 12px;
          flex-wrap: wrap;
        }
        .trust-item { font-size: 12px; font-weight: 700; color: #555; }

        /* komadi box */
        .pieces-box {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 16px;
        }
        .piece-card {
          background: #fff7ed;
          border: 2px solid #fed7aa;
          border-radius: 12px;
          padding: 14px;
          text-align: center;
        }
        .piece-icon { font-size: 32px; }
        .piece-label { font-size: 13px; font-weight: 900; color: #c2410c; margin-top: 6px; }
        .piece-sub { font-size: 11px; font-weight: 600; color: #888; margin-top: 2px; }

        /* use cases */
        .use-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .use-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 14px;
          text-align: center;
        }
        .use-icon { font-size: 26px; }
        .use-title { font-size: 13px; font-weight: 900; color: #111; margin-top: 6px; }
        .use-desc { font-size: 11px; font-weight: 600; color: #888; margin-top: 3px; line-height: 1.4; }

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

        .t-list { display: flex; flex-direction: column; gap: 10px; }
        .t-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-left: 3px solid #ea580c;
          border-radius: 10px;
          padding: 14px;
        }
        .t-stars { color: #f59e0b; font-size: 13px; margin-bottom: 6px; }
        .t-text { font-size: 13px; color: #333; line-height: 1.65; }
        .t-author { font-size: 12px; font-weight: 800; color: #ea580c; margin-top: 8px; }

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
          background: #fff7ed; border: 1px solid #fed7aa;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 700; color: #c2410c;
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
          border-top: 4px solid #c2410c;
        }
        .form-header { text-align: center; margin-bottom: 20px; }
        .form-header-badge {
          display: inline-block;
          background: #c2410c;
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
        .inp:focus { border-color: #ea580c; background: #fff; }

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
        .gift-label.checked { border-color: #ea580c; background: #fff7ed; }
        .gift-label input { accent-color: #ea580c; width: 18px; height: 18px; margin-top: 1px; flex-shrink: 0; }
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
          background: #c2410c;
          color: #fff;
          font-family: 'Nunito', sans-serif;
          font-size: 20px;
          font-weight: 900;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: background .15s, transform .15s;
          box-shadow: 0 4px 16px rgba(194,65,12,0.3);
        }
        .submit-btn:hover:not(:disabled) { background: #9a3412; transform: translateY(-1px); }
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
          ☀️ Ljetna akcija · Električna muhalica 1+1 GRATIS · Plaćanje pouzećem
        </div>

        {/* 1+1 GRATIS BANNER */}
        <div className="gratis-banner">
          <div className="gratis-tag">🪰 1+1 GRATIS</div>
          <div className="gratis-sub">Platiš jedan — dobijaš dva komada na kućnu adresu</div>
        </div>

        {/* HERO */}
        <section className="hero">
          <div className="hero-badge">⚡ Instant ubija komarce, muhe i insekte</div>

          <h1>Električna muhalica – kraj sa insektima ovog ljeta</h1>
          <p className="hero-sub">
            Bez sprejeva, bez hemikalija, bez čekanja. Jedan dodir i insekt je gotov — bezbjedna za cijelu porodicu.
          </p>

          <div className="hero-img">
            <span className="hero-img-badge">1+1 GRATIS</span>
            <span className="hero-img-price">29,90 KM</span>
            <img src="https://i.imgur.com/Zv2qWmd.png" alt="Električna muhalica" />
          </div>

          {/* 2 komada box */}
          <div className="pieces-box">
            <div className="piece-card">
              <div className="piece-icon">🪰⚡</div>
              <div className="piece-label">1. komad</div>
              <div className="piece-sub">Za tebe</div>
            </div>
            <div className="piece-card">
              <div className="piece-icon">🎁</div>
              <div className="piece-label">2. komad GRATIS</div>
              <div className="piece-sub">Za pokloniti ili drugi prostor</div>
            </div>
          </div>

          <div className="price-row">
            <span className="price-new">29,90 KM</span>
            <span className="price-gratis">🎁 2. GRATIS</span>
          </div>

          <button className="cta-btn" onClick={scrollToOrder}>
            🛒 NARUČI 1+1 ODMAH
          </button>

          <div className="trust-row">
            <span className="trust-item">✅ Plaćanje pouzećem</span>
            <span className="trust-item">🚚 Dostava 2–4 dana</span>
            <span className="trust-item">🎁 2 komada u paketu</span>
          </div>
        </section>

        {/* GDJE SE KORISTI */}
        <section className="section">
          <div className="section-title">🏠 Gdje je koristiš</div>
          <div className="use-grid">
            {useCases.map((u) => (
              <div className="use-card" key={u.title}>
                <div className="use-icon">{u.icon}</div>
                <div className="use-title">{u.title}</div>
                <div className="use-desc">{u.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* BENEFITI */}
        <section className="section">
          <div className="section-title">✅ Zašto je ovo bolje od spreja</div>
          <div className="benefit-list">
            {benefits.map((b) => (
              <div className="benefit-item" key={b.text}>
                <span className="benefit-icon">{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
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
          <div className="urgency-title">⏳ Ograničene zalihe – ljetna akcija!</div>
          <div className="urgency-sub">1+1 GRATIS za 29,90 KM vrijedi dok ima zaliha. Ne čekaj do ljeta.</div>
        </div>

        {/* FAQ */}
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

        {/* ORDER FORM */}
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
                  <div className="summary-row"><span>Električna muhalica 1+1</span><span>29,90 KM</span></div>
                  <div className="summary-row"><span>Dostava</span><span>10,00 KM</span></div>
                  {giftPack && (
                    <div className="summary-row" style={{ color: "#ea580c", fontWeight: 700 }}>
                      <span>Poklon pakovanje</span><span>5,00 KM</span>
                    </div>
                  )}
                  <div className="summary-total">
                    <span className="summary-total-lbl">UKUPNO</span>
                    <span className="summary-total-val">{total.toFixed(2)} KM</span>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? "ŠALJE SE..." : "🛒 NARUČI 1+1 ODMAH"}
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