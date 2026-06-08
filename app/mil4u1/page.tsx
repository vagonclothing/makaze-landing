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

  const baseTotal = 209.9; // 199.90 + 10 dostava
  const total = useMemo(() => (giftPack ? baseTotal + 5 : baseTotal), [giftPack]);

  const tools = [
    { icon: "🔧", name: "Aku bušilica", desc: "Drvo, metal i plastika – 2 brzine, obrtni smjer" },
    { icon: "🔩", name: "Aku udarni odvijač", desc: "Vijci bez napora – veliki okretni moment" },
    { icon: "🪨", name: "Aku SDS bušilica", desc: "Beton, cigla i kamen – udarna funkcija" },
    { icon: "⚙️", name: "Aku brusilica", desc: "Reže i brusi metal, kamen i keramiku" },
  ];

  const benefits = [
    { icon: "🔋", text: "4 baterije u kompletu – uvijek imaš napunjenu rezervu, bez pauza" },
    { icon: "🔌", text: "Bez kabla – sloboda kretanja na gradilištu, u radionici i na terenu" },
    { icon: "⚡", text: "Brzi punjač – baterija puna za kratko vrijeme, nema čekanja" },
    { icon: "💼", text: "Tvrdi kofer – sve na jednom mjestu, zaštićeno i spremno za rad" },
    { icon: "🛡️", text: "3 godine garancije – Milwaukee standard profesionalnog kvaliteta" },
    { icon: "💰", text: "4 profesionalna alata po cijeni jednog – prava ušteda" },
  ];

  const testimonials = [
    { text: "Koristim Milwaukee svaki dan na gradilištu. 4 baterije su ključ – nikad ne stajem na čekanje punjenja.", author: "Nermin B.", city: "Sarajevo" },
    { text: "Radio kompletnu rekonstrukciju kuće ovim setom. SDS bušilica i brusilica su pogotovo odradile posao.", author: "Zoran M.", city: "Banja Luka" },
    { text: "Milwaukee drži čak i kad radiš po cijeli dan. Kofer je pravi – čvrst i praktičan za nositi.", author: "Emir T.", city: "Tuzla" },
    { text: "Profesionalni alat za profesionalnu cijenu. 3 godine garancije su mi dale sigurnost pri kupovini.", author: "Branko S.", city: "Mostar" },
    { text: "Renovirao sam stan bez ijednog majstora. Ovaj set mi je dao sve što sam trebao.", author: "Adis K.", city: "Zenica" },
    { text: "Poklonio sam ocu za rođendan. Stari ne može prestati koristiti – svaki dan nešto radi u radionici.", author: "Damir H.", city: "Bihać" },
  ];

  const faqs = [
    { q: "Šta je sve u kompletu?", a: "Aku bušilica, aku udarni odvijač, aku SDS bušilica, aku brusilica, 4 baterije, brzi punjač i tvrdi kofer." },
    { q: "Može li SDS bušilica bušiti beton?", a: "Da. SDS bušilica ima udarnu i rotacijsku funkciju – namijenjena je za beton, ciglu i kamen." },
    { q: "Koliko traju baterije?", a: "Sa 4 baterije u kompletu uvijek imaš napunjenu rezervu. Brzi punjač vraća kapacitet brzo." },
    { q: "Kakva je garancija?", a: "Na sve alate u setu dolazi 3 godine garancije – Milwaukee profesionalni standard." },
    { q: "Kako se plaća?", a: "Plaćanje je pouzećem – platiš kuriru tek kada preuzmeš paket. Nema rizika." },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const fd   = new FormData(form);

    const order = {
      product_name:  "Milwaukee aku set 4u1 – bušilica, odvijač, SDS, brusilica + 4 baterije",
      full_name:     String(fd.get("ime") || ""),
      phone:         String(fd.get("telefon") || ""),
      address_place: String(fd.get("adresa") || ""),
      postal_code:   String(fd.get("postanski") || ""),
      gift_pack:     giftPack,
      shipping:      10,
      product_price: 199.9,
      total:         Number(total.toFixed(2)),
      status:        "novo",
      source:        "milwaukee-4u1",
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

        /* Milwaukee crvena tema */
        .topbar {
          background: linear-gradient(90deg, #7f1d1d, #dc2626, #7f1d1d);
          color: #fff;
          text-align: center;
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: .02em;
        }

        /* brand banner */
        .brand-banner {
          background: #111;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .brand-left { }
        .brand-name {
          font-size: 22px;
          font-weight: 900;
          color: #dc2626;
          letter-spacing: .04em;
          text-transform: uppercase;
        }
        .brand-sub {
          font-size: 12px;
          font-weight: 700;
          color: rgba(255,255,255,0.55);
          margin-top: 2px;
        }
        .brand-badge {
          background: #dc2626;
          color: #fff;
          font-size: 12px;
          font-weight: 900;
          padding: 6px 14px;
          border-radius: 8px;
          white-space: nowrap;
        }

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
          border: 2px solid #fecaca;
          position: relative;
          margin-bottom: 16px;
          background: #fff;
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

        /* tools grid */
        .tools-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 16px;
        }
        .tool-card {
          background: #f9fafb;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          padding: 14px 12px;
          transition: border-color .2s;
        }
        .tool-card:hover { border-color: #dc2626; }
        .tool-icon { font-size: 26px; }
        .tool-name { font-size: 13px; font-weight: 900; color: #111; margin-top: 7px; }
        .tool-desc { font-size: 11px; font-weight: 600; color: #888; margin-top: 3px; line-height: 1.4; }

        /* included strip */
        .included-strip {
          background: #fef2f2;
          border: 2px solid #fecaca;
          border-radius: 12px;
          padding: 12px 14px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }
        .inc-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 800;
          color: #7f1d1d;
        }
        .inc-dot { width: 6px; height: 6px; border-radius: 50%; background: #dc2626; flex-shrink: 0; }

        .price-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .price-new { font-size: 36px; font-weight: 900; color: #16a34a; }
        .price-warranty {
          background: #fef2f2;
          color: #dc2626;
          font-size: 12px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid #fecaca;
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
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 8px 16px 0;
        }
        .warranty-num {
          font-size: 42px;
          font-weight: 900;
          color: #dc2626;
          line-height: 1;
          flex-shrink: 0;
        }
        .warranty-title { font-size: 16px; font-weight: 900; color: #fff; }
        .warranty-sub { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.5); margin-top: 3px; }

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
          border-left: 4px solid #dc2626;
          border-radius: 12px;
          padding: 18px;
          background: #f9fafb;
        }
        .expert-quote { font-size: 14px; color: #333; line-height: 1.7; font-style: italic; margin-bottom: 12px; }
        .expert-name { font-size: 13px; font-weight: 800; color: #dc2626; }

        .t-list { display: flex; flex-direction: column; gap: 10px; }
        .t-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-left: 3px solid #dc2626;
          border-radius: 10px;
          padding: 14px;
        }
        .t-stars { color: #f59e0b; font-size: 13px; margin-bottom: 6px; }
        .t-text { font-size: 13px; color: #333; line-height: 1.65; }
        .t-author { font-size: 12px; font-weight: 800; color: #dc2626; margin-top: 8px; }

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
          background: #fef2f2; border: 1px solid #fecaca;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 700; color: #dc2626;
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
        .inp:focus { border-color: #dc2626; background: #fff; }

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
        .gift-label.checked { border-color: #dc2626; background: #fef2f2; }
        .gift-label input { accent-color: #dc2626; width: 18px; height: 18px; margin-top: 1px; flex-shrink: 0; }
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
          🔴 Milwaukee Professional · 4 alata · 4 baterije · 3 god. garancija
        </div>

        {/* BRAND BANNER */}
        <div className="brand-banner">
          <div className="brand-left">
            <div className="brand-name">⚡ Milwaukee</div>
            <div className="brand-sub">Profesionalni aku alati</div>
          </div>
          <div className="brand-badge">🛡️ 3 god. garancija</div>
        </div>

        {/* HERO */}
        <section className="hero">
          <div className="hero-badge">🔴 4 alata + 4 baterije + kofer u jednom setu</div>

          <h1>Milwaukee aku set 4u1</h1>
          <p className="hero-sub">
            Bušilica, udarni odvijač, SDS bušilica i brusilica — sve što ti treba za gradilište ili renovaciju, bez kabla i bez kompromisa.
          </p>

          <div className="hero-img">
            <span className="hero-img-badge">MILWAUKEE 4U1</span>
            <span className="hero-img-price">199,90 KM</span>
            <img src="https://i.imgur.com/nLNcYqP.jpeg" alt="Milwaukee aku set 4u1" />
          </div>

          {/* 4 alata grid */}
          <div className="tools-grid">
            {tools.map((t) => (
              <div className="tool-card" key={t.name}>
                <div className="tool-icon">{t.icon}</div>
                <div className="tool-name">{t.name}</div>
                <div className="tool-desc">{t.desc}</div>
              </div>
            ))}
          </div>

          {/* included strip */}
          <div className="included-strip">
            {["4× baterija", "Brzi punjač", "Tvrdi kofer", "3 god. garancija"].map((item) => (
              <div className="inc-item" key={item}>
                <div className="inc-dot" />
                {item}
              </div>
            ))}
          </div>

          <div className="price-row">
            <span className="price-new">199,90 KM</span>
            <span className="price-warranty">🛡️ 3 god. garancija</span>
          </div>

          <button className="cta-btn" onClick={scrollToOrder}>
            🛒 NARUČI SET ODMAH
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
            <div className="warranty-sub">Na sve alate u setu — Milwaukee profesionalni standard</div>
          </div>
        </div>

        {/* BENEFITI */}
        <section className="section">
          <div className="section-title">✅ Zašto Milwaukee 4u1</div>
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
              "Milwaukee je brand koji koriste profesionalci sa razlogom. Baterije traju, alati su robusni i podnose tešku upotrebu. Kada u jednom koferu dobiješ četiri alata i četiri baterije — to je ono što treba svakom ko ozbiljno radi."
            </p>
            <div className="expert-name">— Haris B., majstor s 15 godina iskustva</div>
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
          <div className="urgency-sub">199,90 KM za kompletan set vrijedi dok ima zaliha. Naruči danas.</div>
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
                  <div className="summary-row"><span>Milwaukee aku set 4u1</span><span>199,90 KM</span></div>
                  <div className="summary-row"><span>Dostava</span><span>10,00 KM</span></div>
                  {giftPack && (
                    <div className="summary-row" style={{ color: "#dc2626", fontWeight: 700 }}>
                      <span>Poklon pakovanje</span><span>5,00 KM</span>
                    </div>
                  )}
                  <div className="summary-total">
                    <span className="summary-total-lbl">UKUPNO</span>
                    <span className="summary-total-val">{total.toFixed(2)} KM</span>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? "ŠALJE SE..." : "🛒 NARUČI SET ODMAH"}
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