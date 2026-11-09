"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useSearchParams } from "next/navigation";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

function PageContent() {
  const searchParams = useSearchParams();
  const utmSource   = searchParams.get("utm_source") || null;
  const utmCampaign = searchParams.get("utm_campaign") || null;
  const utmContent  = searchParams.get("utm_content") || null;
  const adId        = searchParams.get("ad_id") || null;

  const [giftPack, setGiftPack] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [openFaq, setOpenFaq]   = useState<number | null>(null);
  const orderRef = useRef<HTMLElement | null>(null);

  const scrollToOrder = () =>
    orderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const baseTotal = 29.9; // 19.90 + 10 dostava
  const total = useMemo(() => (giftPack ? baseTotal + 5 : baseTotal), [giftPack]);

  const koraci = [
    { br: "1", icon: "🧂", naslov: "Sipaj prah u odvod", tekst: "Istresi sadržaj kesice direktno u otvor odvoda — bez rastavljanja sifona i bez alata." },
    { br: "2", icon: "💧", naslov: "Zalij vodom", tekst: "Dodaj vodu i prah odmah počinje pjeniti. Pjena ulazi duboko u cijev gdje ruka ne dopire." },
    { br: "3", icon: "🌀", naslov: "Ostavi i isperi", tekst: "Pusti da djeluje, pa isperi vrućom vodom. Naslage masti i sapuna odlaze niz cijev." },
  ];

  const mjesta = [
    { icon: "🍽️", naziv: "Sudoper", opis: "Mast od suđa" },
    { icon: "🚿", naziv: "Tuš kabina", opis: "Kosa i sapun" },
    { icon: "🛁", naziv: "Kada", opis: "Spor odvod" },
    { icon: "🚽", naziv: "WC šolja", opis: "Slabo povlačenje" },
    { icon: "🧺", naziv: "Odvod u podu", opis: "Praonica i garaža" },
    { icon: "🏢", naziv: "Glavna cijev", opis: "Redovno održavanje" },
  ];

  const benefits = [
    { icon: "📦", text: "4 komada u setu — četiri tretmana, dovoljno za cijelu godinu održavanja" },
    { icon: "🔧", text: "Bez rastavljanja sifona — ne odvrćeš ništa, ne prljaš ruke, nema prosipanja" },
    { icon: "🌀", text: "Pjena ulazi duboko u cijev, tamo gdje sajla i gumena pumpa ne dopiru" },
    { icon: "🧽", text: "Razgrađuje mast, sapun, ostatke hrane i organske naslage" },
    { icon: "🏠", text: "Jedan proizvod za cijelu kuću — kuhinja, kupatilo, tuš, WC, podni odvod" },
    { icon: "💰", text: "Jeftinije od jednog izlaska vodoinstalatera — a imaš četiri tretmana" },
  ];

  const faqs = [
    { q: "Koliko komada dobijam?", a: "Dobijate 4 komada u setu za 19,90 KM. Jedan komad je jedan tretman, što znači četiri odvoda ili četiri korištenja tokom godine." },
    { q: "Kako se koristi?", a: "Sipate prah u odvod, zalijete vodom i pustite da djeluje prema uputi na pakovanju, pa isperete vrućom vodom. Bez alata i bez rastavljanja." },
    { q: "Na kojim odvodima mogu koristiti?", a: "Sudoper, kada, tuš kabina, WC šolja, podni odvod u praonici ili garaži — proizvođač navodi da je pogodan za sve kućne odvode." },
    { q: "Da li oštećuje cijevi?", a: "Proizvođač navodi da je sredstvo sigurno za cijevi, odvode i septičke sisteme. Pridržavajte se upute i količine navedene na pakovanju." },
    { q: "Može li se koristiti preventivno?", a: "Da, i tu najbolje radi. Jedan tretman svakih par mjeseci sprječava nakupljanje masti i sapuna, pa do zapušenja uopšte ne dolazi." },
    { q: "Kako se plaća?", a: "Plaćanje je pouzećem — platite kuriru tek kada preuzmete paket na svojoj adresi. Nema rizika." },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const fd   = new FormData(form);

    const order = {
      product_name:  "Wild Tornado sredstvo za odvod — set 4 komada",
      full_name:     String(fd.get("ime") || ""),
      phone:         String(fd.get("telefon") || ""),
      address_place: String(fd.get("adresa") || ""),
      postal_code:   String(fd.get("postanski") || ""),
      gift_pack:     giftPack,
      shipping:      10,
      product_price: 19.9,
      total:         Number(total.toFixed(2)),
      status:        "novo",
      source:        "wild-tornado",
      utm_source:    utmSource,
      utm_campaign:  utmCampaign,
      utm_content:   utmContent,
      ad_id:         adId,
    };

    if (!order.full_name || !order.phone || !order.address_place || !order.postal_code) {
      alert("Molimo popunite sva polja.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("orders").insert(order);
    if (error) { alert("Greška pri slanju. Pokušajte ponovo."); setLoading(false); return; }

    fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_name: order.product_name,
        full_name: order.full_name,
        phone: order.phone,
        address_place: order.address_place,
        total: order.total,
      }),
    }).catch(() => {});

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
          background: #f5f5f5; color: #1a1a1a;
          min-height: 100vh; max-width: 480px; margin: 0 auto;
          padding-bottom: 84px;
        }

        .topbar {
          background: #0369a1; color: #fff; text-align: center;
          padding: 10px 16px; font-size: 13px; font-weight: 800;
        }

        /* SET BANNER */
        .set-banner {
          background: #0c1a2b; padding: 16px;
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
        }
        .set-title { font-size: 23px; font-weight: 900; color: #38bdf8; line-height: 1; letter-spacing: .02em; }
        .set-sub { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.45); margin-top: 4px; }
        .set-badge {
          background: #0369a1; color: #fff; font-size: 13px; font-weight: 900;
          padding: 9px 15px; border-radius: 10px; white-space: nowrap;
          text-align: center; line-height: 1.3;
        }

        .hero { background: #fff; padding: 20px 16px 24px; border-bottom: 3px solid #f0f0f0; }
        .hero-badge {
          display: inline-block; background: #eff6ff; color: #075985;
          font-size: 12px; font-weight: 800; padding: 5px 12px;
          border-radius: 6px; border: 1px solid #bae6fd; margin-bottom: 12px;
        }
        .hero h1 {
          font-size: 27px; font-weight: 900; line-height: 1.18;
          color: #111; margin-bottom: 9px; letter-spacing: -.01em;
        }
        .hero h1 span { color: #0369a1; }
        .hero-sub { font-size: 14.5px; color: #555; line-height: 1.6; margin-bottom: 16px; }

        .hero-img {
          width: 100%; border-radius: 14px; overflow: hidden;
          border: 3px solid #0369a1; position: relative; margin-bottom: 16px;
          background: #eff6ff;
        }
        .hero-img img { width: 100%; display: block; }
        .hero-img-badge {
          position: absolute; top: 12px; left: 12px;
          background: #dc2626; color: #fff; font-size: 13px; font-weight: 900;
          padding: 5px 12px; border-radius: 8px;
        }
        .hero-img-price {
          position: absolute; top: 12px; right: 12px;
          background: #16a34a; color: #fff; font-size: 15px; font-weight: 900;
          padding: 5px 12px; border-radius: 8px;
        }

        /* 4 KOMADA VIZUAL */
        .quad-box {
          background: #eff6ff; border: 2px dashed #0369a1; border-radius: 14px;
          padding: 16px; margin-bottom: 16px; text-align: center;
        }
        .quad-row {
          display: flex; align-items: center; justify-content: center;
          gap: 8px; margin-bottom: 10px;
        }
        .quad-item { font-size: 30px; }
        .quad-title { font-size: 17px; font-weight: 900; color: #075985; }
        .quad-sub { font-size: 12.5px; font-weight: 700; color: #0369a1; margin-top: 3px; }

        .price-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
        .price-new { font-size: 38px; font-weight: 900; color: #16a34a; letter-spacing: -.02em; }
        .price-tag {
          background: #eff6ff; color: #075985; font-size: 12px; font-weight: 800;
          padding: 4px 10px; border-radius: 6px; border: 1px solid #bae6fd;
        }

        .cta-btn {
          width: 100%; padding: 18px; background: #dc2626; color: #fff;
          font-family: 'Nunito', sans-serif; font-size: 18px; font-weight: 900;
          border: none; border-radius: 12px; cursor: pointer;
          transition: background .15s, transform .15s;
          box-shadow: 0 4px 16px rgba(220,38,38,0.32);
        }
        .cta-btn:hover { background: #b91c1c; transform: translateY(-1px); }

        .trust-row { display: flex; justify-content: center; gap: 15px; margin-top: 12px; flex-wrap: wrap; }
        .trust-item { font-size: 12px; font-weight: 700; color: #555; }

        /* PROBLEM */
        .problem-banner { background: #0c1a2b; margin-top: 8px; padding: 22px 16px; text-align: center; }
        .problem-title { font-size: 17px; font-weight: 900; color: #fff; margin-bottom: 7px; line-height: 1.3; }
        .problem-sub { font-size: 13.5px; color: rgba(255,255,255,0.55); line-height: 1.62; }

        .section { background: #fff; margin-top: 8px; padding: 24px 16px; }
        .section-title { font-size: 21px; font-weight: 900; color: #111; margin-bottom: 16px; line-height: 1.25; }

        /* KORACI */
        .korak-list { display: flex; flex-direction: column; gap: 10px; }
        .korak-card {
          background: #eff6ff; border: 1px solid #bae6fd; border-radius: 14px;
          padding: 16px; display: flex; gap: 14px; align-items: flex-start;
        }
        .korak-br {
          width: 36px; height: 36px; border-radius: 10px; background: #0369a1;
          color: #fff; display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 900; flex-shrink: 0;
        }
        .korak-naslov { font-size: 15px; font-weight: 900; color: #111; }
        .korak-tekst { font-size: 13px; color: #64748b; line-height: 1.55; margin-top: 4px; }

        /* MJESTA */
        .mj-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .mj-card {
          background: #eff6ff; border: 1px solid #bae6fd; border-radius: 12px;
          padding: 14px; text-align: center;
        }
        .mj-icon { font-size: 26px; }
        .mj-naziv { font-size: 13px; font-weight: 900; color: #111; margin-top: 6px; }
        .mj-opis { font-size: 11px; font-weight: 600; color: #94a3b8; margin-top: 2px; }

        /* BENEFITI */
        .benefit-list { display: flex; flex-direction: column; gap: 10px; }
        .benefit-item {
          display: flex; align-items: center; gap: 12px; padding: 12px 14px;
          background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px;
          font-size: 14px; font-weight: 700; color: #1a1a1a; line-height: 1.45;
        }
        .benefit-icon { font-size: 20px; flex-shrink: 0; }

        /* RACUNICA */
        .racun-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .racun-card { border-radius: 14px; padding: 16px; text-align: center; }
        .racun-bad { background: #fef2f2; border: 2px solid #fecaca; }
        .racun-good { background: #f0fdf4; border: 2px solid #16a34a; }
        .racun-icon { font-size: 28px; }
        .racun-lbl { font-size: 12px; font-weight: 900; margin-top: 6px; text-transform: uppercase; letter-spacing: .04em; }
        .racun-bad .racun-lbl { color: #dc2626; }
        .racun-good .racun-lbl { color: #15803d; }
        .racun-cijena { font-size: 24px; font-weight: 900; margin-top: 6px; line-height: 1; }
        .racun-bad .racun-cijena { color: #dc2626; }
        .racun-good .racun-cijena { color: #16a34a; }
        .racun-note { font-size: 11px; font-weight: 700; margin-top: 6px; line-height: 1.45; }
        .racun-bad .racun-note { color: #991b1b; }
        .racun-good .racun-note { color: #166534; }
        .racun-zakljucak {
          margin-top: 12px; background: #0c1a2b; border-radius: 12px;
          padding: 15px 16px; text-align: center;
        }
        .racun-zakljucak-t { font-size: 15px; font-weight: 900; color: #38bdf8; }
        .racun-zakljucak-s { font-size: 12.5px; font-weight: 600; color: rgba(255,255,255,0.5); margin-top: 4px; line-height: 1.5; }

        /* PREVENTIVA */
        .prev-box {
          background: #0369a1; border-radius: 16px; padding: 22px 18px; text-align: center;
        }
        .prev-icon { font-size: 36px; margin-bottom: 10px; }
        .prev-title { font-size: 19px; font-weight: 900; color: #fff; line-height: 1.3; margin-bottom: 9px; }
        .prev-text { font-size: 13.5px; color: rgba(255,255,255,0.78); line-height: 1.62; }

        .urgency {
          background: #fef2f2; border: 2px solid #fecaca; border-radius: 12px;
          padding: 15px 16px; text-align: center; margin-top: 8px;
        }
        .urgency-title { font-size: 16px; font-weight: 900; color: #dc2626; margin-bottom: 4px; }
        .urgency-sub { font-size: 13px; font-weight: 600; color: #555; }

        /* FAQ */
        .faq-item {
          border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;
          margin-bottom: 8px; background: #fff;
        }
        .faq-q {
          display: flex; justify-content: space-between; align-items: center;
          padding: 15px 16px; cursor: pointer; user-select: none; gap: 10px;
        }
        .faq-q-text { font-size: 14px; font-weight: 800; color: #111; line-height: 1.35; }
        .faq-icon {
          width: 24px; height: 24px; border-radius: 50%;
          background: #eff6ff; border: 1px solid #bae6fd;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 700; color: #0369a1;
          flex-shrink: 0; transition: transform .2s;
        }
        .faq-item.open .faq-icon { transform: rotate(45deg); }
        .faq-a {
          font-size: 13px; color: #555; line-height: 1.7;
          max-height: 0; overflow: hidden; padding: 0 16px;
          transition: max-height .3s ease, padding .3s ease;
        }
        .faq-item.open .faq-a { max-height: 240px; padding: 0 16px 15px; }

        /* FORM */
        .form-section {
          background: #fff; margin-top: 8px; padding: 24px 16px 32px;
          border-top: 4px solid #dc2626;
        }
        .form-header { text-align: center; margin-bottom: 20px; }
        .form-header-badge {
          display: inline-block; background: #dc2626; color: #fff;
          font-size: 12px; font-weight: 800; padding: 5px 14px;
          border-radius: 6px; margin-bottom: 10px;
        }
        .form-title { font-size: 24px; font-weight: 900; color: #111; margin-bottom: 4px; }
        .form-sub { font-size: 13px; color: #555; font-weight: 600; }

        .inp {
          width: 100%; background: #f9fafb; border: 2px solid #e5e7eb;
          border-radius: 10px; padding: 14px 16px;
          font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 600;
          color: #111; transition: border-color .2s; outline: none;
        }
        .inp::placeholder { color: #aaa; font-weight: 600; }
        .inp:focus { border-color: #0369a1; background: #fff; }

        .gift-label {
          display: flex; align-items: flex-start; gap: 12px;
          background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 10px;
          padding: 14px; cursor: pointer; transition: border-color .2s, background .2s;
        }
        .gift-label.checked { border-color: #0369a1; background: #eff6ff; }
        .gift-label input { accent-color: #0369a1; width: 18px; height: 18px; margin-top: 1px; flex-shrink: 0; }
        .gift-lbl-title { font-size: 14px; font-weight: 800; color: #111; }
        .gift-lbl-sub { font-size: 12px; font-weight: 600; color: #666; margin-top: 2px; }

        .summary-box {
          background: #f9fafb; border: 2px solid #e5e7eb;
          border-radius: 12px; padding: 16px;
        }
        .summary-row {
          display: flex; justify-content: space-between;
          font-size: 14px; font-weight: 600; color: #555; padding: 4px 0;
        }
        .summary-total {
          display: flex; justify-content: space-between; align-items: center;
          margin-top: 10px; padding-top: 12px; border-top: 2px solid #e5e7eb;
        }
        .summary-total-lbl { font-size: 18px; font-weight: 900; color: #111; }
        .summary-total-val { font-size: 26px; font-weight: 900; color: #16a34a; }

        .submit-btn {
          width: 100%; padding: 18px; background: #dc2626; color: #fff;
          font-family: 'Nunito', sans-serif; font-size: 19px; font-weight: 900;
          border: none; border-radius: 12px; cursor: pointer;
          transition: background .15s, transform .15s;
          box-shadow: 0 4px 16px rgba(220,38,38,0.3);
        }
        .submit-btn:hover:not(:disabled) { background: #b91c1c; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: .65; cursor: not-allowed; }
        .form-note { text-align: center; font-size: 12px; font-weight: 600; color: #888; margin-top: 10px; }

        @keyframes scaleIn { from { transform: scale(.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .success-wrap { text-align: center; padding: 42px 16px; animation: scaleIn .4s ease both; }
        .success-icon { font-size: 64px; margin-bottom: 16px; }
        .success-title { font-size: 26px; font-weight: 900; color: #16a34a; margin-bottom: 8px; }
        .success-sub { font-size: 15px; font-weight: 600; color: #555; line-height: 1.6; }

        /* STICKY */
        .sticky-cta {
          position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 100%; max-width: 480px; z-index: 90;
          background: rgba(255,255,255,0.97); backdrop-filter: blur(8px);
          border-top: 1px solid #e5e7eb;
          padding: 11px 16px calc(11px + env(safe-area-inset-bottom, 0px));
          display: flex; align-items: center; gap: 12px;
        }
        .sticky-price-val { font-size: 20px; font-weight: 900; color: #16a34a; line-height: 1; }
        .sticky-price-lbl { font-size: 10.5px; font-weight: 800; color: #0369a1; margin-top: 2px; }
        .sticky-btn {
          flex: 1; padding: 15px; background: #dc2626; color: #fff;
          font-family: 'Nunito', sans-serif; font-size: 15.5px; font-weight: 900;
          border: none; border-radius: 12px; cursor: pointer;
        }

        .napomena {
          background: #f1f5f9; padding: 18px 16px;
          font-size: 11.5px; color: #94a3b8; line-height: 1.65;
        }

        .footer {
          background: #0c1a2b; padding: 20px 16px; text-align: center;
          font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.3);
        }
        .footer a { color: rgba(255,255,255,0.3); text-decoration: none; margin: 0 6px; }
        .footer a:hover { color: #fff; }
      `}</style>

      <div className="page">

        <div className="topbar">
          🌀 SET OD 4 KOMADA · Bez vodoinstalatera · Plaćanje pouzećem
        </div>

        {/* SET BANNER */}
        <div className="set-banner">
          <div>
            <div className="set-title">4 KOMADA 📦</div>
            <div className="set-sub">Četiri tretmana u jednom paketu</div>
          </div>
          <div className="set-badge">SET<br />19,90 KM</div>
        </div>

        {/* HERO */}
        <section className="hero">
          <div className="hero-badge">🌀 Wild Tornado · Za sve kućne odvode</div>

          <h1>Odvod otiče sporo? <span>Riješi ga sam.</span></h1>
          <p className="hero-sub">
            Sipaš prah u odvod, zaliješ vodom i pjena uradi posao — razgrađuje mast, sapun i naslage duboko u cijevi. Bez vodoinstalatera, bez rastavljanja sifona, bez alata.
          </p>

          <div className="hero-img">
            <span className="hero-img-badge">SET 4 KOM</span>
            <span className="hero-img-price">19,90 KM</span>
            <img src="https://i.imgur.com/UO57cLF.jpeg" alt="Wild Tornado sredstvo za čišćenje odvoda — set 4 komada" />
          </div>

          {/* 4 komada vizual */}
          <div className="quad-box">
            <div className="quad-row">
              <span className="quad-item">🧂</span>
              <span className="quad-item">🧂</span>
              <span className="quad-item">🧂</span>
              <span className="quad-item">🧂</span>
            </div>
            <div className="quad-title">U paketu dobijaš 4 komada</div>
            <div className="quad-sub">Četiri odvoda ili četiri tretmana — svega 4,98 KM po komadu</div>
          </div>

          <div className="price-row">
            <span className="price-new">19,90 KM</span>
            <span className="price-tag">📦 Za sva 4 komada</span>
          </div>

          <button className="cta-btn" onClick={scrollToOrder}>🛒 NARUČI SET OD 4</button>

          <div className="trust-row">
            <span className="trust-item">✅ Plaćanje pouzećem</span>
            <span className="trust-item">🚚 Dostava 2–4 dana</span>
            <span className="trust-item">🔧 Bez alata</span>
          </div>
        </section>

        {/* PROBLEM */}
        <div className="problem-banner">
          <div className="problem-title">😤 Voda u sudoperu stoji, a majstor traži 60 KM da dođe?</div>
          <div className="problem-sub">
            Mast od suđa, sapun i ostaci hrane se godinama lijepe za zid cijevi. Gumena pumpa ih samo gurne dublje, a sajla ne dopire tamo gdje su naslage. Prah ide tamo gdje voda ide — i razgrađuje ih.
          </div>
        </div>

        {/* KAKO SE KORISTI */}
        <section className="section">
          <div className="section-title">🌀 Tri koraka i odvod otiče</div>
          <div className="korak-list">
            {koraci.map((k) => (
              <div className="korak-card" key={k.br}>
                <div className="korak-br">{k.br}</div>
                <div>
                  <div className="korak-naslov">{k.icon} {k.naslov}</div>
                  <div className="korak-tekst">{k.tekst}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RACUNICA */}
        <section className="section">
          <div className="section-title">💰 Uporedi sam</div>
          <div className="racun-wrap">
            <div className="racun-card racun-bad">
              <div className="racun-icon">🔧</div>
              <div className="racun-lbl">Vodoinstalater</div>
              <div className="racun-cijena">40–80 KM</div>
              <div className="racun-note">Po jednom izlasku · Čekaš termin · Dolazi kad stigne</div>
            </div>
            <div className="racun-card racun-good">
              <div className="racun-icon">🌀</div>
              <div className="racun-lbl">Wild Tornado</div>
              <div className="racun-cijena">19,90 KM</div>
              <div className="racun-note">Za 4 tretmana · Imaš ga kod kuće · Koristiš kad trebaš</div>
            </div>
          </div>
          <div className="racun-zakljucak">
            <div className="racun-zakljucak-t">🧮 Ispada 4,98 KM po tretmanu</div>
            <div className="racun-zakljucak-s">
              Jedan izlazak majstora košta koliko cijeli set — a set ti ostane u ormaru za sljedeći put.
            </div>
          </div>
        </section>

        {/* GDJE RADI */}
        <section className="section">
          <div className="section-title">🏠 Za sve odvode u kući</div>
          <div className="mj-grid">
            {mjesta.map((m) => (
              <div className="mj-card" key={m.naziv}>
                <div className="mj-icon">{m.icon}</div>
                <div className="mj-naziv">{m.naziv}</div>
                <div className="mj-opis">{m.opis}</div>
              </div>
            ))}
          </div>
        </section>

        {/* BENEFITI */}
        <section className="section">
          <div className="section-title">✅ Zašto ovaj set</div>
          <div className="benefit-list">
            {benefits.map((b) => (
              <div className="benefit-item" key={b.text}>
                <span className="benefit-icon">{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* PREVENTIVA */}
        <section className="section">
          <div className="prev-box">
            <div className="prev-icon">🛡️</div>
            <div className="prev-title">Najbolje radi prije nego što zapuši</div>
            <div className="prev-text">
              Ne čekaj da voda stane. Jedan tretman svakih par mjeseci spere naslage prije nego se stvrdnu — i odvod nikad ne dođe do zapušenja. Zato set od 4 komada pokriva cijelu godinu mirnog održavanja.
            </div>
          </div>
        </section>

        <div className="urgency">
          <div className="urgency-title">⏳ Ograničene zalihe!</div>
          <div className="urgency-sub">19,90 KM za set od 4 komada vrijedi dok ima zaliha. Naruči danas.</div>
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

        {/* FORMA */}
        <section ref={orderRef} className="form-section">
          {success ? (
            <div className="success-wrap">
              <div className="success-icon">✅</div>
              <div className="success-title">Narudžba primljena!</div>
              <p className="success-sub">
                Hvala! Naš tim će vas uskoro nazvati radi potvrde.<br />
                Dostava za 2–4 radna dana. Plaćate pouzećem.
              </p>
            </div>
          ) : (
            <>
              <div className="form-header">
                <div className="form-header-badge">📦 SET OD 4 KOMADA</div>
                <div className="form-title">Naruči odmah</div>
                <div className="form-sub">Upišite podatke i nazvat ćemo vas radi potvrde</div>
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
                  <div className="summary-row"><span>Wild Tornado — set 4 komada</span><span>19,90 KM</span></div>
                  <div className="summary-row"><span>Dostava</span><span>10,00 KM</span></div>
                  {giftPack && (
                    <div className="summary-row" style={{ color: "#0369a1", fontWeight: 700 }}>
                      <span>Poklon paket</span><span>5,00 KM</span>
                    </div>
                  )}
                  <div className="summary-total">
                    <span className="summary-total-lbl">UKUPNO</span>
                    <span className="summary-total-val">{total.toFixed(2)} KM</span>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? "ŠALJE SE..." : "🛒 NARUČI SET OD 4"}
                </button>
                <div className="form-note">🔒 Plaćanje pouzećem · Platite tek pri preuzimanju</div>
              </form>
            </>
          )}
        </section>

        {/* NAPOMENA */}
        <div className="napomena">
          Koristite proizvod prema uputi na pakovanju. Držati van domašaja djece. Ne miješati s drugim sredstvima za čišćenje. Pri korištenju provjetriti prostoriju. Kod potpuno blokiranog odvoda ili mehaničke prepreke u cijevi može biti potrebna intervencija vodoinstalatera.
        </div>

        <footer className="footer">
          © 2025 TV-SHOP ·
          <a href="/privatnost">Privatnost</a> ·
          <a href="/impressum">Impressum</a> ·
          <a href="/uslovi">Uslovi</a>
        </footer>

      </div>

      {/* STICKY CTA */}
      {!success && (
        <div className="sticky-cta">
          <div>
            <div className="sticky-price-val">19,90 KM</div>
            <div className="sticky-price-lbl">SET 4 KOM</div>
          </div>
          <button className="sticky-btn" onClick={scrollToOrder}>NARUČI ODMAH</button>
        </div>
      )}
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PageContent />
    </Suspense>
  );
}