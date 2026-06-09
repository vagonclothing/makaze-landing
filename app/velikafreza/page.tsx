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

  const baseTotal = 127.0; // 117 + 10 dostava
  const total = useMemo(() => (giftPack ? baseTotal + 5 : baseTotal), [giftPack]);

  const benefits = [
    { icon: "🔄", text: "4 rotora – duplo jači rez od jeftinih modela s 2 rotora, ravnomjerna košnja" },
    { icon: "📏", text: "Produžena ručka – kosiš uspravno, bez savijanja leđa i umora" },
    { icon: "🔋", text: "2 baterije u kompletu – kosiš veće površine bez prekida" },
    { icon: "⚡", text: "Brzi punjač – baterija puna za kratko vrijeme, uvijek spreman" },
    { icon: "🔌", text: "Bez kabla i benzina – nema ispušnih gasova, nema vikanja motora" },
    { icon: "🌿", text: "Trava, korov i šiblje – siječe sve što naraste uz ogradu i zid" },
    { icon: "🛡️", text: "3 godine garancije – profesionalni standard kvaliteta" },
    { icon: "🏠", text: "Idealno za dvorište, baštu, vikendicu i parcelu" },
  ];

  const testimonials = [
    { text: "Kosio sam uz ogradu i oko stabala bez problema. 4 rotora sijeku mnogo bolje nego što sam očekivao. Leđa me ne bole više od savijanja.", author: "Emir K.", city: "Sarajevo" },
    { text: "Imao sam staru benzinsku freza – buka, smrad, muka. Ova aku freza je drugi svijet. Tiha, lagana i radi odlično.", author: "Dragan P.", city: "Banja Luka" },
    { text: "Dvije baterije su odlična stvar. Imam veći vrt i nikad ne zastanem. Dok jedna radi, drugu punjem.", author: "Nikola V.", city: "Tuzla" },
    { text: "Koristim na vikendici. Šiblje i korov uz zid – nestaje za minut. Produžena ručka je udobna za rad.", author: "Amila S.", city: "Mostar" },
    { text: "Za ovu cijenu nisam očekivao ovako solidan alat. 3 godine garancije su mi dale sigurnost pri kupovini.", author: "Branko T.", city: "Zenica" },
    { text: "Dao sam tati za poklon. Kaže da je to najkorisniji alat koji ima u dvorištu. Svaki dan ga hvali.", author: "Ivan H.", city: "Bihać" },
  ];

  const faqs = [
    { q: "Zašto 4 rotora a ne 2?", a: "4 rotora znači duplo više reznih linija – trava se kosi ravnomjernije, brže i urednije. Jeftini modeli s 2 rotora ostavljaju pruge i traže više prolaza." },
    { q: "Šta je sve u kompletu?", a: "Aku trimer/freza sa produženom ručkom, 2 baterije Li-Ion, brzi punjač i 3 godine garancije." },
    { q: "Može li sijeci šiblje i korov?", a: "Da. Freza s 4 rotora lako siječe tanko šiblje, korov i gustu travu uz ograde, zidove i stabla." },
    { q: "Da li je teška za rukovanje?", a: "Ne. Produžena ručka omogućava uspravan rad bez savijanja. Baterija je lagana pa ruka ne umara brzo." },
    { q: "Koliko traju baterije?", a: "Sa 2 baterije uvijek imaš napunjenu rezervu. Brzi punjač vraća kapacitet za kratko vrijeme." },
    { q: "Kakva je garancija?", a: "3 godine garancije na cijeli alat – profesionalni standard kvaliteta." },
    { q: "Kako se plaća?", a: "Plaćanje je pouzećem – platiš kuriru tek kada preuzmeš paket. Nema rizika." },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const fd   = new FormData(form);

    const order = {
      product_name:  "Aku trimer freza produžena 4 rotora – 2 baterije, punjač, 3 god. garancija",
      full_name:     String(fd.get("ime") || ""),
      phone:         String(fd.get("telefon") || ""),
      address_place: String(fd.get("adresa") || ""),
      postal_code:   String(fd.get("postanski") || ""),
      gift_pack:     giftPack,
      shipping:      10,
      product_price: 117.0,
      total:         Number(total.toFixed(2)),
      status:        "novo",
      source:        "aku-trimer",
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

        .topbar {
          background: #15803d;
          color: #fff;
          text-align: center;
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: .02em;
        }

        /* 4 rotora highlight banner */
        .rotors-banner {
          background: #111;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .rotors-left { }
        .rotors-title {
          font-size: 15px;
          font-weight: 900;
          color: #4ade80;
          letter-spacing: .02em;
        }
        .rotors-sub {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.45);
          margin-top: 3px;
        }
        .rotors-badge {
          background: #16a34a;
          color: #fff;
          font-size: 13px;
          font-weight: 900;
          padding: 8px 16px;
          border-radius: 10px;
          white-space: nowrap;
          text-align: center;
          line-height: 1.3;
        }

        .hero {
          background: #fff;
          padding: 20px 16px 24px;
          border-bottom: 3px solid #f0f0f0;
        }
        .hero-badge {
          display: inline-block;
          background: #f0fdf4;
          color: #15803d;
          font-size: 12px;
          font-weight: 800;
          padding: 5px 12px;
          border-radius: 6px;
          border: 1px solid #bbf7d0;
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
          border: 2px solid #bbf7d0;
          position: relative;
          margin-bottom: 16px;
          background: #f0fdf4;
        }
        .hero-img img { width: 100%; display: block; }
        .hero-img-badge {
          position: absolute;
          top: 12px; left: 12px;
          background: #15803d;
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

        /* komplet box */
        .kit-box {
          background: #f0fdf4;
          border: 2px solid #bbf7d0;
          border-radius: 14px;
          padding: 14px;
          margin-bottom: 16px;
        }
        .kit-title {
          font-size: 12px;
          font-weight: 900;
          color: #15803d;
          text-transform: uppercase;
          letter-spacing: .05em;
          margin-bottom: 10px;
        }
        .kit-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
        }
        .kit-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          font-weight: 700;
          color: #1a1a1a;
        }
        .kit-dot { width: 7px; height: 7px; border-radius: 50%; background: #16a34a; flex-shrink: 0; }

        /* 4 vs 2 rotora comparison */
        .compare-box {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 16px;
        }
        .compare-bad {
          background: #fef2f2;
          border: 2px solid #fecaca;
          border-radius: 12px;
          padding: 14px;
          text-align: center;
        }
        .compare-good {
          background: #f0fdf4;
          border: 2px solid #16a34a;
          border-radius: 12px;
          padding: 14px;
          text-align: center;
        }
        .compare-icon { font-size: 28px; }
        .compare-title { font-size: 13px; font-weight: 900; margin-top: 6px; }
        .compare-bad .compare-title { color: #dc2626; }
        .compare-good .compare-title { color: #15803d; }
        .compare-items { margin-top: 8px; font-size: 11px; font-weight: 600; line-height: 1.8; }
        .compare-bad .compare-items { color: #888; }
        .compare-good .compare-items { color: #166534; }

        .price-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .price-new { font-size: 36px; font-weight: 900; color: #16a34a; }
        .price-tag {
          background: #f0fdf4;
          color: #15803d;
          font-size: 12px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid #bbf7d0;
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

        /* warranty banner */
        .warranty-banner {
          background: #111;
          border-top: 4px solid #16a34a;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 8px;
        }
        .warranty-num { font-size: 44px; font-weight: 900; color: #4ade80; line-height: 1; flex-shrink: 0; }
        .warranty-title { font-size: 16px; font-weight: 900; color: #fff; }
        .warranty-sub { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.45); margin-top: 3px; }

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

        .expert-card {
          border: 2px solid #e5e7eb;
          border-left: 4px solid #16a34a;
          border-radius: 12px;
          padding: 18px;
          background: #f9fafb;
        }
        .expert-quote { font-size: 14px; color: #333; line-height: 1.7; font-style: italic; margin-bottom: 12px; }
        .expert-name { font-size: 13px; font-weight: 800; color: #15803d; }

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
        .t-author { font-size: 12px; font-weight: 800; color: #15803d; margin-top: 8px; }

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
          background: #111;
          padding: 20px 16px;
          text-align: center;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.3);
          margin-top: 8px;
        }
      `}</style>

      <div className="page">

        <div className="topbar">
          🌿 Aku trimer · 4 rotora · 2 baterije · 3 god. garancija · Plaćanje pouzećem
        </div>

        {/* 4 ROTORA BANNER */}
        <div className="rotors-banner">
          <div className="rotors-left">
            <div className="rotors-title">🔄 4 ROTORA – NE 2</div>
            <div className="rotors-sub">Duplo jači rez, ravnomjerna košnja bez pruga</div>
          </div>
          <div className="rotors-badge">🛡️ 3 god.<br/>garancija</div>
        </div>

        {/* HERO */}
        <section className="hero">
          <div className="hero-badge">🌿 Produžena ručka · 4 rotora · 2 baterije</div>

          <h1>Aku trimer – košnja bez kabla i savijanja leđa</h1>
          <p className="hero-sub">
            Pravi aku trimer s produženom ručkom i 4 rotora — kosi travu, korov i šiblje uz ograde i zidove, uspravno i bez napora.
          </p>

          <div className="hero-img">
            <span className="hero-img-badge">4 ROTORA</span>
            <span className="hero-img-price">117,00 KM</span>
            <img src="https://i.imgur.com/YTfFjJp.jpeg" alt="Aku trimer produžena ručka 4 rotora" />
          </div>

          {/* komplet box */}
          <div className="kit-box">
            <div className="kit-title">✅ Kompletan set uključuje:</div>
            <div className="kit-grid">
              <div className="kit-item"><div className="kit-dot" />Aku trimer (4 rotora)</div>
              <div className="kit-item"><div className="kit-dot" />2× baterija Li-Ion</div>
              <div className="kit-item"><div className="kit-dot" />Produžena ručka</div>
              <div className="kit-item"><div className="kit-dot" />Brzi punjač</div>
              <div className="kit-item"><div className="kit-dot" />3 god. garancija</div>
            </div>
          </div>

          {/* 4 vs 2 rotora */}
          <div className="compare-box">
            <div className="compare-bad">
              <div className="compare-icon">❌</div>
              <div className="compare-title">2 rotora</div>
              <div className="compare-items">
                Slabiji rez<br/>
                Ostavlja pruge<br/>
                Više prolaza<br/>
                Jeftiniji modeli
              </div>
            </div>
            <div className="compare-good">
              <div className="compare-icon">✅</div>
              <div className="compare-title">4 rotora</div>
              <div className="compare-items">
                Duplo jači rez<br/>
                Ravnomjerna košnja<br/>
                Jedan prolaz<br/>
                Profesionalni rez
              </div>
            </div>
          </div>

          <div className="price-row">
            <span className="price-new">117,00 KM</span>
            <span className="price-tag">🛡️ 3 god. garancija</span>
          </div>

          <button className="cta-btn" onClick={scrollToOrder}>
            🛒 NARUČI ODMAH
          </button>

          <div className="trust-row">
            <span className="trust-item">✅ Plaćanje pouzećem</span>
            <span className="trust-item">🚚 Dostava 2–4 dana</span>
            <span className="trust-item">🛡️ 3 god. garancija</span>
          </div>
        </section>

        {/* WARRANTY BANNER */}
        <div className="warranty-banner">
          <div className="warranty-num">3</div>
          <div>
            <div className="warranty-title">Godine garancije</div>
            <div className="warranty-sub">Na cijeli alat — profesionalni standard kvaliteta</div>
          </div>
        </div>

        {/* BENEFITI */}
        <section className="section">
          <div className="section-title">✅ Zašto ovaj trimer</div>
          <div className="benefit-list">
            {benefits.map((b) => (
              <div className="benefit-item" key={b.text}>
                <span className="benefit-icon">{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* EXPERT */}
        <section className="section">
          <div className="section-title">👷 Mišljenje majstora</div>
          <div className="expert-card">
            <p className="expert-quote">
              "Aku trimer s 4 rotora je ono što svako dvorište treba. Bez kabla imaš slobodu kretanja, a produžena ručka znači da leđa ne pate. Četiri rotora sijeku ravnomjerno – jedan prolaz i gotovo. Benzinski više ne diram."
            </p>
            <div className="expert-name">— Miroslav K., majstor hortikulture</div>
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
          <div className="urgency-title">⏳ Ograničene zalihe!</div>
          <div className="urgency-sub">117,00 KM za kompletan set vrijedi dok ima zaliha. Naruči danas.</div>
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
                  <div className="summary-row"><span>Aku trimer 4 rotora (komplet)</span><span>117,00 KM</span></div>
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