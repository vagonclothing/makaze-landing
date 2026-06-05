"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

  const baseTotal = 25.0; // 15 + 10 dostava
  const total = useMemo(() => (giftPack ? baseTotal + 5 : baseTotal), [giftPack]);

  const benefits = [
    { icon: "☀️", text: "UV-otporna plastika – ne puca i ne savija se na suncu" },
    { icon: "🔧", text: "Montaža bez alata – ručno za manje od minute" },
    { icon: "♻️", text: "Višekratna upotreba – skini, složi, koristi ponovo" },
    { icon: "💰", text: "10× jeftinije od tende – isto rješenje, manje para" },
    { icon: "🏠", text: "Balkon, terasa, dvorište, gradilište – svugdje radi" },
    { icon: "📦", text: "100 komada u paketu – dovoljno za veliku površinu" },
  ];

  const testimonials = [
    { text: "Kupili smo zakačke za mrežu na balkonu i riješili problem suncem bez majstora. Postavili smo sve sami za manje od pola sata!", author: "Elma H.", city: "Sarajevo" },
    { text: "Imam malu radionicu u dvorištu i mreža sa zakačkama mi pravi sjenu dok radim. Drže odlično, nisu popustile ni pri jakoj kiši.", author: "Nikola V.", city: "Banja Luka" },
    { text: "Dugo smo tražili jeftino rješenje za hladovinu. Ove zakačke su bile savršeno – jednostavne, izdržljive i povoljne.", author: "Amila K.", city: "Tuzla" },
    { text: "Postavio sam mrežu iznad auta i sad više nemam problem sa užarenim vozilom. Lako se montira i još lakše skida.", author: "Ivan D.", city: "Mostar" },
    { text: "Živim na spratu i željela sam više privatnosti na balkonu. Mreža i zakačke – brzo rješenje koje izgleda uredno.", author: "Lejla M.", city: "Zenica" },
    { text: "Koristim ih za sjenku u vrtu. Prvo sam bila skeptična, ali sad sam oduševljena. Nisu se pomjerile ni na vjetru.", author: "Adnan T.", city: "Brčko" },
    { text: "Postavio sam zaštitnu mrežu na terasi kafića. Nema bušenja, nema majstora, a izgleda profesionalno.", author: "Milica R.", city: "Trebinje" },
    { text: "Zakačke su čvrste, ne pucaju na suncu i ne klize. Napravili smo privremenu nadstrešnicu iznad dječijeg igrališta.", author: "Tarik S.", city: "Doboj" },
  ];

  const faqs = [
    { q: "Kako se zakačke montiraju?", a: "Jednostavno ih ručno pričvrstite na mrežu i ogradu, stub ili sajlu. Nisu potrebni alati ni bušenje." },
    { q: "Da li su otporne na kišu i sunce?", a: "Da, izrađene su od UV-otporne plastike i otporne su na kišu, sunce i vjetar – za dugotrajnu vanjsku upotrebu." },
    { q: "Koliko puta se mogu koristiti?", a: "Višekratne su – skinite ih, složite i koristite ponovo bez oštećenja." },
    { q: "Koliko komada dolazi u pakovanju?", a: "100 komada – dovoljno za veću površinu ili više mjesta odjednom." },
    { q: "Kako se plaća?", a: "Plaćanje je pouzećem – platiš kuriru tek kada preuzmeš paket. Nema rizika." },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const fd   = new FormData(form);

    const order = {
      product_name:  "Zakačke za zaštitnu mrežu od sunca – 100 komada",
      full_name:     String(fd.get("ime") || ""),
      phone:         String(fd.get("telefon") || ""),
      address_place: String(fd.get("adresa") || ""),
      postal_code:   String(fd.get("postanski") || ""),
      gift_pack:     giftPack,
      shipping:      10,
      product_price: 15.0,
      total:         Number(total.toFixed(2)),
      status:        "novo",
      source:        "zakacke-mreza",
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
          background: #16a34a;
          color: #fff;
          text-align: center;
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: .02em;
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
          border: 2px solid #e5e7eb;
          position: relative;
          margin-bottom: 16px;
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
        .price-old { font-size: 18px; font-weight: 700; color: #aaa; text-decoration: line-through; }
        .price-save {
          background: #fef2f2;
          color: #dc2626;
          font-size: 12px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 6px;
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
          gap: 20px;
          margin-top: 12px;
          flex-wrap: wrap;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 700;
          color: #555;
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

        .ba-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .ba-card { border-radius: 12px; overflow: hidden; position: relative; border: 2px solid #e5e7eb; }
        .ba-card img { width: 100%; display: block; }
        .ba-lbl {
          position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%);
          font-size: 11px; font-weight: 900; padding: 4px 12px; border-radius: 20px;
          white-space: nowrap;
        }
        .ba-lbl.before { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
        .ba-lbl.after  { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }

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

        .expert-card { border: 2px solid #e5e7eb; border-radius: 14px; overflow: hidden; }
        .expert-card img { width: 100%; display: block; max-height: 220px; object-fit: cover; object-position: top; }
        .expert-body { padding: 16px; background: #f9fafb; border-top: 3px solid #16a34a; }
        .expert-quote { font-size: 14px; color: #333; line-height: 1.7; font-style: italic; margin-bottom: 10px; }
        .expert-name { font-size: 13px; font-weight: 800; color: #16a34a; }

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
          🚚 Besplatna dostava na narudžbe iznad 50 KM · Plaćanje pouzećem
        </div>

        <section className="hero">
          <div className="hero-badge">⏳ AKCIJA – Uštedi 24,90 KM!</div>

          <h1>Zakačke za zaštitnu mrežu od sunca</h1>
          <p className="hero-sub">
            Postavi vlastitu zaštitu od sunca bez majstora i skupih tendi — brzo, jednostavno, za manje od pola sata.
          </p>

          <div className="hero-img">
            <span className="hero-img-badge">-62% POPUST</span>
            <span className="hero-img-price">15,00 KM</span>
            <img
              src="https://klikomkupi.com/cdn/shop/files/dd37d215-1e3a-4812-b5a2-5222b0b2f0d7.jpg?v=1737664208"
              alt="Zakačke za zaštitnu mrežu"
            />
          </div>

          <div className="price-row">
            <span className="price-new">15,00 KM</span>
            <span className="price-old">39,90 KM</span>
            <span className="price-save">Uštedi 24,90 KM</span>
          </div>

          <button className="cta-btn" onClick={scrollToOrder}>
            🛒 NARUČI ODMAH
          </button>

          <div className="trust-row">
            <span className="trust-item">✅ Plaćanje pouzećem</span>
            <span className="trust-item">🚚 Dostava 2–4 dana</span>
            <span className="trust-item">🔄 Povrat moguć</span>
          </div>
        </section>

        <section className="section">
          <div className="section-title">📸 Kako izgleda u praksi</div>
          <div className="ba-wrap">
            <div className="ba-card">
              <img src="https://i.imgur.com/4KVzA61.jpeg" alt="Prije" />
              <span className="ba-lbl before">❌ Bez mreže</span>
            </div>
            <div className="ba-card">
              <img src="https://i.imgur.com/LcszNfN.png" alt="Poslije" />
              <span className="ba-lbl after">✅ Sa mrežom</span>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-title">✅ Zašto su ove zakačke odlične</div>
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
          <div className="section-title">☕ Vlasnik kafića preporučuje</div>
          <div className="expert-card">
            <img src="https://i.imgur.com/hbJoZ1K.jpeg" alt="Adis K., vlasnik kafića" />
            <div className="expert-body">
              <p className="expert-quote">
                "Umjesto skupe tende, sam sam postavio mrežu sa ovim zakačkama – brzo, jeftino i funkcionalno. Gosti su odmah primijetili razliku."
              </p>
              <div className="expert-name">— Adis K., vlasnik kafića, Sarajevo</div>
            </div>
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
          <div className="urgency-sub">Akcijska cijena 15,00 KM vrijedi dok ima zaliha. Naruči danas.</div>
        </div>

        <section className="section">
          <div className="section-title">❓ Često postavljana pitanja</div>
          {faqs.map((item, i) => (
            <div className={`faq-item${openFaq === i ? " open" : ""}`} key={i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}>
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
                  <div className="summary-row"><span>Zakačke 100 komada</span><span>15,00 KM</span></div>
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