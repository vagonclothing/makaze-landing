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

  const baseTotal = 139.9; // 129.90 + 10 dostava
  const total = useMemo(() => (giftPack ? baseTotal + 5 : baseTotal), [giftPack]);

  const tools = [
    { icon: "🔧", name: "Aku bušilica", desc: "Drvo, metal, plastika – 2 brzine, obrtni smjer" },
    { icon: "⚙️", name: "Aku brusilica", desc: "Reže i brusi metal, kamen i keramiku" },
    { icon: "🔩", name: "Aku udarni odvijač", desc: "Vijci bez napora – snažan okretni moment" },
  ];

  const benefits = [
    { icon: "🔋", text: "2 baterije u kompletu – uvijek imaš napunjenu rezervu, bez pauza" },
    { icon: "🔌", text: "Bez kabla – sloboda kretanja na gradilištu, u radionici i na terenu" },
    { icon: "⚡", text: "Brzi punjač – baterija puna za kratko vrijeme, nema čekanja" },
    { icon: "💼", text: "Tvrdi kofer – sve na jednom mjestu, zaštićeno i uvijek spremno" },
    { icon: "🛡️", text: "3 godine garancije – DeWalt standard profesionalnog kvaliteta" },
    { icon: "💰", text: "3 alata po cijeni jednog – prava ušteda za majstore i hobiste" },
  ];

  const testimonials = [
    { text: "DeWalt nikad nije izneverio. Dvije baterije su ključ – dok jedna radi, druga se puni. Savršeno na gradilištu.", author: "Nermin B.", city: "Sarajevo" },
    { text: "Renovirao sam cijeli stan ovim setom. Bušilica i brusilica su odradile sve. Kofer je solidan.", author: "Zoran M.", city: "Banja Luka" },
    { text: "Kupio sam za vikendicu. Sam radio sve – beton, metal, drvo. Nema što ovaj set ne može.", author: "Emir T.", city: "Tuzla" },
    { text: "Profesionalan alat koji drži na duge staze. 3 godine garancije i to mi je dalo sigurnost.", author: "Branko S.", city: "Mostar" },
    { text: "Udarni odvijač je posebno impresivan. Vijci idu kao kroz maslac. Nisam razočaran.", author: "Adis K.", city: "Zenica" },
    { text: "Poklonio bratu za slavu. Rekao je da je to bio jedan od boljih poklona koje je dobio.", author: "Damir H.", city: "Bihać" },
  ];

  const faqs = [
    { q: "Šta je sve u kompletu?", a: "Aku bušilica, aku brusilica, aku udarni odvijač, 2 baterije, brzi punjač i tvrdi kofer." },
    { q: "Koliko traju baterije?", a: "Sa 2 baterije u kompletu uvijek imaš napunjenu rezervu. Brzi punjač vraća kapacitet za kratko vrijeme." },
    { q: "Za šta mogu koristiti set?", a: "Bušilica za drvo, metal i plastiku. Brusilica za rezanje i brušenje. Udarni odvijač za vijke i matice – sve na jednoj bateriji." },
    { q: "Kakva je garancija?", a: "Na sve alate u setu dolazi 3 godine garancije – DeWalt profesionalni standard." },
    { q: "Kako se plaća?", a: "Plaćanje je pouzećem – platiš kuriru tek kada preuzmeš paket. Nema rizika." },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const fd   = new FormData(form);

    const order = {
      product_name:  "DeWalt aku set 3u1 – bušilica, brusilica, udarni odvijač + 2 baterije",
      full_name:     String(fd.get("ime") || ""),
      phone:         String(fd.get("telefon") || ""),
      address_place: String(fd.get("adresa") || ""),
      postal_code:   String(fd.get("postanski") || ""),
      gift_pack:     giftPack,
      shipping:      10,
      product_price: 129.9,
      total:         Number(total.toFixed(2)),
      status:        "novo",
      source:        "dewalt-3u1",
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

        /* DeWalt žuto-crna topbar */
        .topbar {
          background: #111;
          color: #FFC40C;
          text-align: center;
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: .02em;
        }

        /* brand banner */
        .brand-banner {
          background: #FFC40C;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .brand-name {
          font-size: 24px;
          font-weight: 900;
          color: #111;
          letter-spacing: .06em;
          text-transform: uppercase;
        }
        .brand-sub {
          font-size: 12px;
          font-weight: 700;
          color: rgba(0,0,0,0.5);
          margin-top: 2px;
        }
        .brand-badge {
          background: #111;
          color: #FFC40C;
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
          background: #fffbeb;
          color: #92400e;
          font-size: 12px;
          font-weight: 800;
          padding: 5px 12px;
          border-radius: 6px;
          border: 1px solid #fde68a;
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
          border: 3px solid #FFC40C;
          position: relative;
          margin-bottom: 16px;
          background: #fffbeb;
        }
        .hero-img img { width: 100%; display: block; }
        .hero-img-badge {
          position: absolute;
          top: 12px; left: 12px;
          background: #111;
          color: #FFC40C;
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

        /* tools – 3 kartice u redu */
        .tools-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 14px;
        }
        .tool-card {
          background: #fffbeb;
          border: 2px solid #fde68a;
          border-radius: 12px;
          padding: 12px 8px;
          text-align: center;
          transition: border-color .2s;
        }
        .tool-card:hover { border-color: #FFC40C; }
        .tool-icon { font-size: 24px; }
        .tool-name { font-size: 11px; font-weight: 900; color: #111; margin-top: 6px; line-height: 1.3; }
        .tool-desc { font-size: 10px; font-weight: 600; color: #888; margin-top: 3px; line-height: 1.3; }

        /* included strip */
        .included-strip {
          background: #111;
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
          color: #FFC40C;
        }
        .inc-dot { width: 6px; height: 6px; border-radius: 50%; background: #FFC40C; flex-shrink: 0; }

        .price-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .price-new { font-size: 36px; font-weight: 900; color: #16a34a; }
        .price-tag {
          background: #fffbeb;
          color: #92400e;
          font-size: 12px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid #fde68a;
        }

        .cta-btn {
          width: 100%;
          padding: 18px;
          background: #FFC40C;
          color: #111;
          font-family: 'Nunito', sans-serif;
          font-size: 18px;
          font-weight: 900;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: background .15s, transform .15s;
          box-shadow: 0 4px 14px rgba(255,196,12,0.4);
        }
        .cta-btn:hover { background: #e6b000; transform: translateY(-1px); }

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
          border-top: 4px solid #FFC40C;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 8px;
        }
        .warranty-num {
          font-size: 48px;
          font-weight: 900;
          color: #FFC40C;
          line-height: 1;
          flex-shrink: 0;
        }
        .warranty-title { font-size: 17px; font-weight: 900; color: #fff; }
        .warranty-sub { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.45); margin-top: 4px; }

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
          border-left: 4px solid #FFC40C;
          border-radius: 12px;
          padding: 18px;
          background: #fffbeb;
        }
        .expert-quote { font-size: 14px; color: #444; line-height: 1.7; font-style: italic; margin-bottom: 12px; }
        .expert-name { font-size: 13px; font-weight: 800; color: #92400e; }

        .t-list { display: flex; flex-direction: column; gap: 10px; }
        .t-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-left: 3px solid #FFC40C;
          border-radius: 10px;
          padding: 14px;
        }
        .t-stars { color: #f59e0b; font-size: 13px; margin-bottom: 6px; }
        .t-text { font-size: 13px; color: #333; line-height: 1.65; }
        .t-author { font-size: 12px; font-weight: 800; color: #92400e; margin-top: 8px; }

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
          background: #fffbeb; border: 1px solid #fde68a;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 700; color: #92400e;
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
          border-top: 4px solid #FFC40C;
        }
        .form-header { text-align: center; margin-bottom: 20px; }
        .form-header-badge {
          display: inline-block;
          background: #111;
          color: #FFC40C;
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
        .inp:focus { border-color: #FFC40C; background: #fff; }

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
        .gift-label.checked { border-color: #FFC40C; background: #fffbeb; }
        .gift-label input { accent-color: #FFC40C; width: 18px; height: 18px; margin-top: 1px; flex-shrink: 0; }
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
          background: #FFC40C;
          color: #111;
          font-family: 'Nunito', sans-serif;
          font-size: 20px;
          font-weight: 900;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: background .15s, transform .15s;
          box-shadow: 0 4px 16px rgba(255,196,12,0.35);
        }
        .submit-btn:hover:not(:disabled) { background: #e6b000; transform: translateY(-1px); }
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
          ⚡ DeWalt Professional · 3 alata · 2 baterije · 3 god. garancija
        </div>

        {/* BRAND BANNER */}
        <div className="brand-banner">
          <div>
            <div className="brand-name">⚡ DeWalt</div>
            <div className="brand-sub">Profesionalni aku alati</div>
          </div>
          <div className="brand-badge">🛡️ 3 god. garancija</div>
        </div>

        {/* HERO */}
        <section className="hero">
          <div className="hero-badge">⚡ 3 alata + 2 baterije + punjač + kofer</div>

          <h1>DeWalt aku set 3u1</h1>
          <p className="hero-sub">
            Bušilica, brusilica i udarni odvijač — sve što trebaš za renovaciju i gradilište, bez kabla i bez kompromisa.
          </p>

          <div className="hero-img">
            <span className="hero-img-badge">DEWALT 3U1</span>
            <span className="hero-img-price">129,90 KM</span>
            <img src="https://i.imgur.com/y7u1FHV.png" alt="DeWalt aku set 3u1" />
          </div>

          {/* 3 alata */}
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
            {["2× baterija", "Brzi punjač", "Tvrdi kofer", "3 god. garancija"].map((item) => (
              <div className="inc-item" key={item}>
                <div className="inc-dot" />
                {item}
              </div>
            ))}
          </div>

          <div className="price-row">
            <span className="price-new">129,90 KM</span>
            <span className="price-tag">🛡️ 3 god. garancija</span>
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
            <div className="warranty-sub">Na sve alate u setu — DeWalt profesionalni standard</div>
          </div>
        </div>

        {/* BENEFITI */}
        <section className="section">
          <div className="section-title">✅ Zašto DeWalt 3u1</div>
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
              "DeWalt je brand koji nikad ne iznevjeri. Dvije baterije su minimum za ozbiljan rad — dok jedna radi, drugu punite. Set od tri alata u jednom koferu je ono što svaki majstor treba imati u kombiju."
            </p>
            <div className="expert-name">— Miroslav K., majstor s 20 godina iskustva</div>
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
          <div className="urgency-sub">129,90 KM za kompletan set vrijedi dok ima zaliha. Naruči danas.</div>
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
                  <div className="summary-row"><span>DeWalt aku set 3u1</span><span>129,90 KM</span></div>
                  <div className="summary-row"><span>Dostava</span><span>10,00 KM</span></div>
                  {giftPack && (
                    <div className="summary-row" style={{ color: "#92400e", fontWeight: 700 }}>
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