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

  const baseTotal = 49.9; // 39.90 + 10 dostava
  const total = useMemo(() => (giftPack ? baseTotal + 5 : baseTotal), [giftPack]);

  const benefits = [
    { icon: "🛢️", text: "Pumpica za podmazivanje – lanac se automatski podmazuje, duže traje i bolje reže" },
    { icon: "🔋", text: "2 baterije u kompletu – dok jedna radi, druga se puni, nema stajanja" },
    { icon: "🪵", text: "Mač 6 inča – idealan za grane, ogrjev, orezivanje voćnjaka i sitnije radove" },
    { icon: "🔌", text: "Bez kabla i benzina – nema smrada, nema buke, nema paljenja na hladno" },
    { icon: "💼", text: "Tvrdi kofer – pila, baterije, punjač i lanac uvijek na jednom mjestu" },
    { icon: "🪶", text: "Lagana i kompaktna – radi jednom rukom, ne umara ni kod dužeg rada" },
  ];

  const useCases = [
    { icon: "🌳", title: "Orezivanje voćnjaka", desc: "Grane i mladice bez napora" },
    { icon: "🔥", title: "Priprema ogrjeva", desc: "Sitnija drva za peć i kamin" },
    { icon: "🏡", title: "Dvorište i bašta", desc: "Održavanje živice i stabala" },
    { icon: "🏕️", title: "Vikendica i kamp", desc: "Ponesi je u koferu bilo gdje" },
  ];

  const testimonials = [
    { text: "Pumpica za ulje je prava stvar – lanac se sam podmazuje i reže kao nov nakon mjesec dana korištenja.", author: "Dragan P.", city: "Banja Luka" },
    { text: "Orezao sam cijeli voćnjak za jedno popodne. Lagana je, radim jednom rukom. Baterije izdržale sve.", author: "Emir H.", city: "Sarajevo" },
    { text: "Imao sam benzinsku, ali ovo je drugi svijet. Nema paljenja, nema smrada, samo pritisneš i radi.", author: "Nikola V.", city: "Tuzla" },
    { text: "Dvije baterije su ključne. Dok jednom radim, druga se puni. Za ovu cijenu – nema bolje.", author: "Zoran M.", city: "Mostar" },
    { text: "Kupio za vikendicu. Sitna drva za roštilj i kamin – gotova za par minuta. Kofer je odličan.", author: "Adis K.", city: "Zenica" },
    { text: "Poklonio sam ocu. Kaže da je najbolja stvar koju je dobio za dvorište. Svaki dan je koristi.", author: "Damir S.", city: "Bihać" },
  ];

  const faqs = [
    { q: "Šta je sve u setu?", a: "Aku pila sa mačem 6 inča, 2 baterije, punjač, rezervni lanac i tvrdi kofer za transport." },
    { q: "Šta znači pumpica za podmazivanje?", a: "Pila ima ugrađenu pumpicu koja automatski podmazuje lanac tokom rada. To produžava život lanca, smanjuje trenje i pila reže znatno bolje." },
    { q: "Za šta je idealna ova pila?", a: "Za orezivanje grana, pripremu ogrjeva, održavanje voćnjaka i dvorišta. Mač od 6 inča je savršen za sitnije i srednje radove." },
    { q: "Koliko traju baterije?", a: "Sa 2 baterije u kompletu uvijek imaš napunjenu rezervu. Dok jednom radiš, druga se puni." },
    { q: "Da li je teška za rukovanje?", a: "Ne. Pila je lagana i kompaktna – može se koristiti jednom rukom bez zamaranja." },
    { q: "Kako se plaća?", a: "Plaćanje je pouzećem – platiš kuriru tek kada preuzmeš paket. Nema rizika." },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const fd   = new FormData(form);

    const order = {
      product_name:  "Makita aku ručna pila 6 inča",
      full_name:     String(fd.get("ime") || ""),
      phone:         String(fd.get("telefon") || ""),
      address_place: String(fd.get("adresa") || ""),
      postal_code:   String(fd.get("postanski") || ""),
      gift_pack:     giftPack,
      shipping:      10,
      product_price: 39.9,
      total:         Number(total.toFixed(2)),
      status:        "novo",
      source:        "makita-pila",
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
        .page { font-family: 'Nunito', sans-serif; background: #f5f5f5; color: #1a1a1a; min-height: 100vh; max-width: 480px; margin: 0 auto; }
        .topbar { background: #15803d; color: #fff; text-align: center; padding: 10px 16px; font-size: 13px; font-weight: 800; }
        .hero { background: #fff; padding: 20px 16px 24px; border-bottom: 3px solid #f0f0f0; }
        .hero-badge { display: inline-block; background: #f0fdf4; color: #15803d; font-size: 12px; font-weight: 800; padding: 5px 12px; border-radius: 6px; border: 1px solid #bbf7d0; margin-bottom: 12px; }
        .hero h1 { font-size: 26px; font-weight: 900; line-height: 1.2; color: #111; margin-bottom: 8px; }
        .hero-sub { font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 16px; }
        .hero-img { width: 100%; border-radius: 14px; overflow: hidden; border: 2px solid #bbf7d0; position: relative; margin-bottom: 16px; background: #f0fdf4; }
        .hero-img img { width: 100%; display: block; }
        .hero-img-badge { position: absolute; top: 12px; left: 12px; background: #dc2626; color: #fff; font-size: 13px; font-weight: 900; padding: 5px 12px; border-radius: 8px; }
        .hero-img-price { position: absolute; top: 12px; right: 12px; background: #16a34a; color: #fff; font-size: 15px; font-weight: 900; padding: 5px 12px; border-radius: 8px; }
        .oil-banner { background: #fffbeb; border: 2px solid #fde68a; border-radius: 12px; padding: 12px 14px; display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .oil-icon { font-size: 28px; flex-shrink: 0; }
        .oil-title { font-size: 14px; font-weight: 900; color: #92400e; }
        .oil-sub { font-size: 12px; font-weight: 600; color: #78350f; margin-top: 2px; }
        .kit-box { background: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 14px; padding: 14px; margin-bottom: 16px; }
        .kit-title { font-size: 12px; font-weight: 900; color: #15803d; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 10px; }
        .kit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
        .kit-item { display: flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 700; color: #1a1a1a; }
        .kit-dot { width: 7px; height: 7px; border-radius: 50%; background: #16a34a; flex-shrink: 0; }
        .price-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
        .price-new { font-size: 36px; font-weight: 900; color: #16a34a; }
        .price-save { background: #fef2f2; color: #dc2626; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 6px; }
        .cta-btn { width: 100%; padding: 18px; background: #dc2626; color: #fff; font-family: 'Nunito', sans-serif; font-size: 18px; font-weight: 900; border: none; border-radius: 12px; cursor: pointer; transition: background .15s, transform .15s; box-shadow: 0 4px 14px rgba(220,38,38,0.3); }
        .cta-btn:hover { background: #b91c1c; transform: translateY(-1px); }
        .trust-row { display: flex; justify-content: center; gap: 16px; margin-top: 12px; flex-wrap: wrap; }
        .trust-item { font-size: 12px; font-weight: 700; color: #555; }
        .section { background: #fff; margin-top: 8px; padding: 22px 16px; }
        .section-title { font-size: 20px; font-weight: 900; color: #111; margin-bottom: 16px; }
        .use-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .use-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 14px; text-align: center; }
        .use-icon { font-size: 26px; }
        .use-title { font-size: 13px; font-weight: 900; color: #111; margin-top: 6px; }
        .use-desc { font-size: 11px; font-weight: 600; color: #888; margin-top: 3px; line-height: 1.4; }
        .benefit-list { display: flex; flex-direction: column; gap: 10px; }
        .benefit-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; font-size: 14px; font-weight: 700; color: #1a1a1a; }
        .benefit-icon { font-size: 20px; flex-shrink: 0; }
        .t-list { display: flex; flex-direction: column; gap: 10px; }
        .t-card { background: #f9fafb; border: 1px solid #e5e7eb; border-left: 3px solid #16a34a; border-radius: 10px; padding: 14px; }
        .t-stars { color: #f59e0b; font-size: 13px; margin-bottom: 6px; }
        .t-text { font-size: 13px; color: #333; line-height: 1.65; }
        .t-author { font-size: 12px; font-weight: 800; color: #15803d; margin-top: 8px; }
        .urgency { background: #fef2f2; border: 2px solid #fecaca; border-radius: 12px; padding: 14px 16px; text-align: center; margin-top: 8px; }
        .urgency-title { font-size: 16px; font-weight: 900; color: #dc2626; margin-bottom: 4px; }
        .urgency-sub { font-size: 13px; font-weight: 600; color: #555; }
        .faq-item { border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; margin-bottom: 8px; background: #fff; }
        .faq-q { display: flex; justify-content: space-between; align-items: center; padding: 15px 16px; cursor: pointer; user-select: none; gap: 10px; }
        .faq-q-text { font-size: 14px; font-weight: 800; color: #111; }
        .faq-icon { width: 24px; height: 24px; border-radius: 50%; background: #f0fdf4; border: 1px solid #bbf7d0; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; color: #16a34a; flex-shrink: 0; transition: transform .2s; }
        .faq-item.open .faq-icon { transform: rotate(45deg); }
        .faq-a { font-size: 13px; color: #555; line-height: 1.7; max-height: 0; overflow: hidden; padding: 0 16px; transition: max-height .3s ease, padding .3s ease; }
        .faq-item.open .faq-a { max-height: 200px; padding: 0 16px 15px; }
        .form-section { background: #fff; margin-top: 8px; padding: 24px 16px 32px; border-top: 4px solid #dc2626; }
        .form-header { text-align: center; margin-bottom: 20px; }
        .form-header-badge { display: inline-block; background: #dc2626; color: #fff; font-size: 12px; font-weight: 800; padding: 5px 14px; border-radius: 6px; margin-bottom: 10px; }
        .form-title { font-size: 24px; font-weight: 900; color: #111; margin-bottom: 4px; }
        .form-sub { font-size: 13px; color: #555; font-weight: 600; }
        .inp { width: 100%; background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 10px; padding: 14px 16px; font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 600; color: #111; transition: border-color .2s; outline: none; }
        .inp::placeholder { color: #aaa; font-weight: 600; }
        .inp:focus { border-color: #16a34a; background: #fff; }
        .gift-label { display: flex; align-items: flex-start; gap: 12px; background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 10px; padding: 14px; cursor: pointer; transition: border-color .2s, background .2s; }
        .gift-label.checked { border-color: #16a34a; background: #f0fdf4; }
        .gift-label input { accent-color: #16a34a; width: 18px; height: 18px; margin-top: 1px; flex-shrink: 0; }
        .gift-lbl-title { font-size: 14px; font-weight: 800; color: #111; }
        .gift-lbl-sub { font-size: 12px; font-weight: 600; color: #666; margin-top: 2px; }
        .summary-box { background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 12px; padding: 16px; }
        .summary-row { display: flex; justify-content: space-between; font-size: 14px; font-weight: 600; color: #555; padding: 4px 0; }
        .summary-total { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 12px; border-top: 2px solid #e5e7eb; }
        .summary-total-lbl { font-size: 18px; font-weight: 900; color: #111; }
        .summary-total-val { font-size: 26px; font-weight: 900; color: #16a34a; }
        .submit-btn { width: 100%; padding: 18px; background: #dc2626; color: #fff; font-family: 'Nunito', sans-serif; font-size: 20px; font-weight: 900; border: none; border-radius: 12px; cursor: pointer; transition: background .15s, transform .15s; box-shadow: 0 4px 16px rgba(220,38,38,0.3); }
        .submit-btn:hover:not(:disabled) { background: #b91c1c; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: .65; cursor: not-allowed; }
        .form-note { text-align: center; font-size: 12px; font-weight: 600; color: #888; margin-top: 10px; }
        @keyframes scaleIn { from { transform: scale(.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .success-wrap { text-align: center; padding: 40px 16px; animation: scaleIn .4s ease both; }
        .success-icon { font-size: 64px; margin-bottom: 16px; }
        .success-title { font-size: 26px; font-weight: 900; color: #16a34a; margin-bottom: 8px; }
        .success-sub { font-size: 15px; font-weight: 600; color: #555; line-height: 1.6; }
        .footer { background: #111; padding: 20px 16px; text-align: center; font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.3); margin-top: 8px; }
        .footer a { color: rgba(255,255,255,0.3); text-decoration: none; margin: 0 6px; }
        .footer a:hover { color: #fff; }
      `}</style>

      <div className="page">

        <div className="topbar">
          🪚 Makita aku pila 6" · 2 baterije · Pumpica za podmazivanje · Pouzeće
        </div>

        <section className="hero">
          <div className="hero-badge">🪚 Sa pumpicom za podmazivanje lanca</div>
          <h1>Makita aku ručna pila 6"</h1>
          <p className="hero-sub">
            Kompaktna aku pila za grane, ogrjev i voćnjak — s automatskim podmazivanjem lanca, dvije baterije i koferom. Bez benzina, bez kabla, bez muke.
          </p>

          <div className="hero-img">
            <span className="hero-img-badge">SA PUMPICOM</span>
            <span className="hero-img-price">39,90 KM</span>
            <img src="https://i.imgur.com/HPbIZg6.jpeg" alt="Makita aku ručna pila 6 inča" />
          </div>

          {/* Pumpica highlight */}
          <div className="oil-banner">
            <div className="oil-icon">🛢️</div>
            <div>
              <div className="oil-title">Pumpica za podmazivanje lanca</div>
              <div className="oil-sub">Lanac se automatski podmazuje — duže traje, bolje reže, manje se grije. Jeftini modeli ovo nemaju!</div>
            </div>
          </div>

          {/* Komplet */}
          <div className="kit-box">
            <div className="kit-title">✅ Kompletan set uključuje:</div>
            <div className="kit-grid">
              <div className="kit-item"><div className="kit-dot" />Aku pila (mač 6")</div>
              <div className="kit-item"><div className="kit-dot" />2× baterija</div>
              <div className="kit-item"><div className="kit-dot" />Punjač</div>
              <div className="kit-item"><div className="kit-dot" />Rezervni lanac</div>
              <div className="kit-item"><div className="kit-dot" />Tvrdi kofer</div>
              <div className="kit-item"><div className="kit-dot" />Pumpica za ulje</div>
            </div>
          </div>

          <div className="price-row">
            <span className="price-new">39,90 KM</span>
            <span className="price-save">+ 10,00 KM dostava</span>
          </div>

          <button className="cta-btn" onClick={scrollToOrder}>🛒 NARUČI ODMAH</button>

          <div className="trust-row">
            <span className="trust-item">✅ Plaćanje pouzećem</span>
            <span className="trust-item">🚚 Dostava 2–4 dana</span>
            <span className="trust-item">🔋 2 baterije</span>
          </div>
        </section>

        <section className="section">
          <div className="section-title">🌳 Za šta je idealna</div>
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

        <section className="section">
          <div className="section-title">✅ Zašto ova pila</div>
          <div className="benefit-list">
            {benefits.map((b) => (
              <div className="benefit-item" key={b.text}>
                <span className="benefit-icon">{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </section>

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
          <div className="urgency-sub">39,90 KM za kompletan set sa pumpicom. Naruči danas.</div>
        </div>

        <section className="section">
          <div className="section-title">❓ Često postavljana pitanja</div>
          {faqs.map((item, i) => (
            <div className={`faq-item${openFaq === i ? " open" : ""}`} key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div className="faq-q">
                <span className="faq-q-text">{item.q}</span>
                <div className="faq-icon">+</div>
              </div>
              <div className="faq-a">{item.a}</div>
            </div>
          ))}
        </section>

        <section ref={orderRef} className="form-section">
          {success ? (
            <div className="success-wrap">
              <div className="success-icon">✅</div>
              <div className="success-title">Narudžba primljena!</div>
              <p className="success-sub">Hvala! Naš tim će te uskoro nazvati radi potvrde.<br />Dostava za 2–4 radna dana. Plaćaš pouzećem.</p>
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
                    <div className="gift-lbl-title">🎁 Želim poklon paket</div>
                    <div className="gift-lbl-sub">+5,00 KM (vrijednost do 50,00 KM)</div>
                  </div>
                </label>
                <div className="summary-box">
                  <div className="summary-row"><span>Makita aku pila 6" (set)</span><span>39,90 KM</span></div>
                  <div className="summary-row"><span>Dostava</span><span>10,00 KM</span></div>
                  {giftPack && (
                    <div className="summary-row" style={{ color: "#16a34a", fontWeight: 700 }}>
                      <span>Poklon paket</span><span>5,00 KM</span>
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
                <div className="form-note">🔒 Plaćanje pouzećem · Platiš tek pri preuzimanju</div>
              </form>
            </>
          )}
        </section>

        <footer className="footer">
          © 2025 TV-SHOP ·
          <a href="/privatnost">Privatnost</a> ·
          <a href="/impressum">Impressum</a> ·
          <a href="/uslovi">Uslovi</a>
        </footer>

      </div>
    </>
  );
}