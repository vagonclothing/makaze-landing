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
    { icon: "❄️", text: "Snažno rashlađivanje prostora – troši višestruko manje od klime" },
    { icon: "🎮", text: "Daljinski upravljač – mijenjaj brzinu i mod bez ustajanja s kauča" },
    { icon: "📏", text: "Visina 80 cm – idealan za dnevnu sobu, spavaću ili kancelariju" },
    { icon: "🚚", text: "Prenosiv – lako ga premjestiš iz sobe u sobu, nema montaže" },
    { icon: "🌀", text: "Više brzina rada – od laganog povjetarca do jakog strujanja" },
    { icon: "🌙", text: "Tihi rad – možeš spavati dok radi, ne smeta ni djeci" },
  ];

  const useCases = [
    { icon: "🛋️", title: "Dnevna soba", desc: "Rashladi prostor bez skupe klime" },
    { icon: "🛏️", title: "Spavaća soba", desc: "Tihi noćni rad za miran san" },
    { icon: "💻", title: "Kancelarija", desc: "Postavi pored stola, upravljaj daljinskim" },
    { icon: "🏠", title: "Stan pod kirijom", desc: "Nema bušenja zida ni instalacije" },
  ];

  const testimonials = [
    { text: "Stan mi je pod kirijom i ne smijem ugrađivati klimu. Ovo je savršena zamjena, hladi odlično.", author: "Amila K.", city: "Sarajevo" },
    { text: "Daljinski je prava stvar. Ležim na kauču i mijenjam brzine bez ustajanja. Preporučujem.", author: "Dragan M.", city: "Banja Luka" },
    { text: "Puše jako i osvježi cijelu sobu za par minuta. Djeca ga obožavaju u ovim vrućinama.", author: "Emir H.", city: "Tuzla" },
    { text: "Račun za struju je duplo manji nego kad sam koristio klimu. A hladi sasvim dovoljno.", author: "Nikola P.", city: "Mostar" },
    { text: "Tih je, ne budi me noću. Premjestim ga iz dnevne u spavaću za 10 sekundi.", author: "Lejla S.", city: "Zenica" },
    { text: "Kupio za kancelariju. Kolege stalno pitaju gdje sam ga našao. Odličan uređaj za te pare.", author: "Ivan B.", city: "Bihać" },
  ];

  const faqs = [
    { q: "Kolika je visina uređaja?", a: "Uređaj je visok 80 cm — idealna visina za hlađenje prostora dok sjediš ili ležiš." },
    { q: "Da li stvarno osvježava prostoriju?", a: "Da. Snažan uspravni ventilator stvara strujanje zraka koje osvježava cijelu prostoriju — puno efikasnije od malih stonih ventilatora." },
    { q: "Koliko troši struje?", a: "Višestruko manje od klasične klime. Ekonomičan je za svakodnevno korištenje, čak i cijelu noć." },
    { q: "Šta sve mogu daljinskim?", a: "Daljinskim mijenjaš brzine ventilatora, modove rada i tajmer — bez ustajanja." },
    { q: "Treba li montaža?", a: "Ne. Uređaj je prenosiv — raspakuješ, uključiš u struju i radi. Lako ga premjestiš iz sobe u sobu." },
    { q: "Kako se plaća?", a: "Plaćanje je pouzećem – platiš kuriru tek kada preuzmeš paket. Nema rizika." },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const fd   = new FormData(form);

    const order = {
      product_name:  "Klima ventilator sa daljinskim 80cm",
      full_name:     String(fd.get("ime") || ""),
      phone:         String(fd.get("telefon") || ""),
      address_place: String(fd.get("adresa") || ""),
      postal_code:   String(fd.get("postanski") || ""),
      gift_pack:     giftPack,
      shipping:      10,
      product_price: 39.9,
      total:         Number(total.toFixed(2)),
      status:        "novo",
      source:        "klima-ventilator",
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
        .topbar { background: #0284c7; color: #fff; text-align: center; padding: 10px 16px; font-size: 13px; font-weight: 800; }
        .hero { background: #fff; padding: 20px 16px 24px; border-bottom: 3px solid #f0f0f0; }
        .hero-badge { display: inline-block; background: #eff6ff; color: #1d4ed8; font-size: 12px; font-weight: 800; padding: 5px 12px; border-radius: 6px; border: 1px solid #bfdbfe; margin-bottom: 12px; }
        .hero h1 { font-size: 26px; font-weight: 900; line-height: 1.2; color: #111; margin-bottom: 8px; }
        .hero-sub { font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 16px; }
        .hero-img { width: 100%; border-radius: 14px; overflow: hidden; border: 2px solid #bfdbfe; position: relative; margin-bottom: 16px; background: #eff6ff; }
        .hero-img img { width: 100%; display: block; }
        .hero-img-badge { position: absolute; top: 12px; left: 12px; background: #dc2626; color: #fff; font-size: 13px; font-weight: 900; padding: 5px 12px; border-radius: 8px; }
        .hero-img-price { position: absolute; top: 12px; right: 12px; background: #16a34a; color: #fff; font-size: 15px; font-weight: 900; padding: 5px 12px; border-radius: 8px; }
        .spec-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 16px; }
        .spec-item { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 10px 6px; text-align: center; }
        .spec-icon { font-size: 20px; }
        .spec-val { font-size: 12px; font-weight: 900; color: #111; margin-top: 4px; }
        .spec-lbl { font-size: 10px; font-weight: 700; color: #888; text-transform: uppercase; }
        .price-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
        .price-new { font-size: 36px; font-weight: 900; color: #16a34a; }
        .price-save { background: #fef2f2; color: #dc2626; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 6px; }
        .cta-btn { width: 100%; padding: 18px; background: #dc2626; color: #fff; font-family: 'Nunito', sans-serif; font-size: 18px; font-weight: 900; border: none; border-radius: 12px; cursor: pointer; transition: background .15s, transform .15s; box-shadow: 0 4px 14px rgba(220,38,38,0.3); }
        .cta-btn:hover { background: #b91c1c; transform: translateY(-1px); }
        .trust-row { display: flex; justify-content: center; gap: 16px; margin-top: 12px; flex-wrap: wrap; }
        .trust-item { font-size: 12px; font-weight: 700; color: #555; }
        .problem-banner { background: #111; margin-top: 8px; padding: 20px 16px; text-align: center; }
        .problem-title { font-size: 16px; font-weight: 900; color: #fff; margin-bottom: 6px; }
        .problem-sub { font-size: 13px; color: rgba(255,255,255,0.55); line-height: 1.6; }
        .section { background: #fff; margin-top: 8px; padding: 22px 16px; }
        .section-title { font-size: 20px; font-weight: 900; color: #111; margin-bottom: 16px; }
        .use-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .use-card { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 14px; text-align: center; }
        .use-icon { font-size: 26px; }
        .use-title { font-size: 13px; font-weight: 900; color: #111; margin-top: 6px; }
        .use-desc { font-size: 11px; font-weight: 600; color: #888; margin-top: 3px; line-height: 1.4; }
        .benefit-list { display: flex; flex-direction: column; gap: 10px; }
        .benefit-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; font-size: 14px; font-weight: 700; color: #1a1a1a; }
        .benefit-icon { font-size: 20px; flex-shrink: 0; }
        .t-list { display: flex; flex-direction: column; gap: 10px; }
        .t-card { background: #f9fafb; border: 1px solid #e5e7eb; border-left: 3px solid #0284c7; border-radius: 10px; padding: 14px; }
        .t-stars { color: #f59e0b; font-size: 13px; margin-bottom: 6px; }
        .t-text { font-size: 13px; color: #333; line-height: 1.65; }
        .t-author { font-size: 12px; font-weight: 800; color: #0284c7; margin-top: 8px; }
        .urgency { background: #fef2f2; border: 2px solid #fecaca; border-radius: 12px; padding: 14px 16px; text-align: center; margin-top: 8px; }
        .urgency-title { font-size: 16px; font-weight: 900; color: #dc2626; margin-bottom: 4px; }
        .urgency-sub { font-size: 13px; font-weight: 600; color: #555; }
        .faq-item { border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; margin-bottom: 8px; background: #fff; }
        .faq-q { display: flex; justify-content: space-between; align-items: center; padding: 15px 16px; cursor: pointer; user-select: none; gap: 10px; }
        .faq-q-text { font-size: 14px; font-weight: 800; color: #111; }
        .faq-icon { width: 24px; height: 24px; border-radius: 50%; background: #eff6ff; border: 1px solid #bfdbfe; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; color: #0284c7; flex-shrink: 0; transition: transform .2s; }
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
        .inp:focus { border-color: #0284c7; background: #fff; }
        .gift-label { display: flex; align-items: flex-start; gap: 12px; background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 10px; padding: 14px; cursor: pointer; transition: border-color .2s, background .2s; }
        .gift-label.checked { border-color: #0284c7; background: #eff6ff; }
        .gift-label input { accent-color: #0284c7; width: 18px; height: 18px; margin-top: 1px; flex-shrink: 0; }
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
          ❄️ Ljetna akcija · Klima ventilator s daljinskim · Plaćanje pouzećem
        </div>

        <section className="hero">
          <div className="hero-badge">❄️ Hladi kao klima, troši kao ventilator</div>
          <h1>Klima ventilator sa daljinskim</h1>
          <p className="hero-sub">
            Prenosivi uspravni ventilator visine 80 cm — snažno strujanje zraka, upravljaš daljinskim, premjestiš ga gdje god trebaš. Bez montaže, bez bušenja, bez velikih računa.
          </p>

          <div className="hero-img">
            <span className="hero-img-badge">LJETNA AKCIJA</span>
            <span className="hero-img-price">39,90 KM</span>
            <img src="https://i.imgur.com/87yT47V.png" alt="Klima ventilator sa daljinskim" />
          </div>

          <div className="spec-strip">
            <div className="spec-item">
              <div className="spec-icon">📏</div>
              <div className="spec-val">80 cm</div>
              <div className="spec-lbl">Visina</div>
            </div>
            <div className="spec-item">
              <div className="spec-icon">🎮</div>
              <div className="spec-val">Daljinski</div>
              <div className="spec-lbl">Upravljanje</div>
            </div>
            <div className="spec-item">
              <div className="spec-icon">🌀</div>
              <div className="spec-val">Više brzina</div>
              <div className="spec-lbl">Rada</div>
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
            <span className="trust-item">🔌 Bez montaže</span>
          </div>
        </section>

        <div className="problem-banner">
          <div className="problem-title">🥵 Vrućina nepodnošljiva, a klima preskupa?</div>
          <div className="problem-sub">Ugradnja klime košta 800+ KM, plus veliki računi za struju. Klima ventilator rashlađuje prostoriju za djelić te cijene — uključiš u utičnicu i gotovo.</div>
        </div>

        <section className="section">
          <div className="section-title">🏠 Gdje ga koristiš</div>
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
          <div className="section-title">✅ Zašto ovaj klima ventilator</div>
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
          <div className="urgency-title">⏳ Ljetna akcija – ograničene zalihe!</div>
          <div className="urgency-sub">39,90 KM dok traje akcija. Vrućine tek dolaze — naruči na vrijeme.</div>
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
                    <div className="gift-lbl-title">🎁 Poklon pakovanje</div>
                    <div className="gift-lbl-sub">(U vrijednosti od 5 do 50 KM) + 5,00 KM</div>
                  </div>
                </label>
                <div className="summary-box">
                  <div className="summary-row"><span>Klima ventilator 80cm</span><span>39,90 KM</span></div>
                  <div className="summary-row"><span>Dostava</span><span>10,00 KM</span></div>
                  {giftPack && (
                    <div className="summary-row" style={{ color: "#0284c7", fontWeight: 700 }}>
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