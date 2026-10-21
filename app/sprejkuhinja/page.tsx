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
    { br: "1", icon: "💨", naslov: "Poprskaj", tekst: "Napršti pjenu direktno na masnoću — aspirator, ploču, pločice, rernu." },
    { br: "2", icon: "⏱️", naslov: "Sačekaj 1–2 min", tekst: "Pjena se zalijepi za površinu i razgrađuje čak i staru, zapečenu masnoću." },
    { br: "3", icon: "🧽", naslov: "Obriši krpom", tekst: "Pređi krpom — masnoća silazi bez ribanja, struganja i trošenja snage." },
  ];

  const povrsine = [
    { icon: "🌬️", naziv: "Aspirator", opis: "Filteri i kućište" },
    { icon: "🔥", naziv: "Šporet i ploča", opis: "Rešetke i gorionici" },
    { icon: "🧱", naziv: "Pločice i zid", opis: "Iza šporeta" },
    { icon: "🍳", naziv: "Rerna", opis: "Zapečena masnoća" },
    { icon: "🚪", naziv: "Kuhinjski elementi", opis: "Vrata i ručke" },
    { icon: "🍽️", naziv: "Sudoper i radna ploča", opis: "Nerđajući čelik" },
  ];

  const benefits = [
    { icon: "💪", text: "Razgrađuje i staru zapečenu masnoću koju deterdžent ne može skinuti" },
    { icon: "🧴", text: "Pjena se lijepi za vertikalne površine — ne curi niz pločice i zid" },
    { icon: "⚡", text: "Bez ribanja i struganja — poprskaš, sačekaš i obrišeš" },
    { icon: "🍋", text: "Svjež miris limuna umjesto teškog hemijskog zadaha" },
    { icon: "🧯", text: "500 ml po limenci — dovoljno za više temeljnih čišćenja" },
    { icon: "🎁", text: "Dobijaš DVIJE limenke po cijeni jedne — 1+1 GRATIS" },
  ];

  const testimonials = [
    { text: "Aspirator nisam temeljno čistila godinu dana, bojala sam se ni dirati. Poprskala, sačekala i masnoća je sama sišla. Nisam vjerovala.", author: "Amela K.", city: "Sarajevo" },
    { text: "Pločice iza šporeta su bile žute od masnoće. Jedno prskanje i krpa — kao nove. Žena nije mogla vjerovati da sam ja to očistio.", author: "Dragan M.", city: "Banja Luka" },
    { text: "Probala sam sve iz marketa, ništa nije skidalo zapečeno na rešetkama. Ovo je prvo što stvarno radi.", author: "Melisa H.", city: "Tuzla" },
    { text: "Dvije limenke za ovu cijenu — jednu držim u kuhinji, drugu sam dala majci. Obje oduševljene.", author: "Sanela P.", city: "Mostar" },
    { text: "Rerna je izgledala beznadežno. Poprskao, otišao popiti kafu, vratio se i obrisao. Gotovo za 5 minuta.", author: "Ivan B.", city: "Zenica" },
    { text: "Miris limuna je odličan, nema onog hemijskog smrada od kojeg se guši cijela kuća.", author: "Lejla S.", city: "Bihać" },
  ];

  const faqs = [
    { q: "Stvarno dobijam dvije limenke?", a: "Da. Za 19,90 KM dobijate 2× Kitchen Cleaner od 500 ml — druga limenca je potpuno GRATIS." },
    { q: "Skida li zaista staru masnoću?", a: "Da. Formula je napravljena za teške kuhinjske masnoće — pjena se zalijepi, razgradi naslage i masnoća silazi krpom, bez ribanja." },
    { q: "Na kojim površinama mogu koristiti?", a: "Aspirator, šporet, ploča, rešetke, rerna, pločice, kuhinjski elementi, sudoper i nerđajući čelik." },
    { q: "Koliko dugo treba da djeluje?", a: "Obično 1–2 minute. Kod jako zapečene masnoće ostavite malo duže pa prebrišite." },
    { q: "Koliko traje jedna limenca?", a: "500 ml je dovoljno za više temeljnih čišćenja kuhinje — a vi dobijate dvije." },
    { q: "Kako se plaća?", a: "Plaćanje je pouzećem — platite kuriru tek kada preuzmete paket. Nema rizika." },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const fd   = new FormData(form);

    const order = {
      product_name:  "Kitchen Cleaner sprej za masnoću 1+1 GRATIS",
      full_name:     String(fd.get("ime") || ""),
      phone:         String(fd.get("telefon") || ""),
      address_place: String(fd.get("adresa") || ""),
      postal_code:   String(fd.get("postanski") || ""),
      gift_pack:     giftPack,
      shipping:      10,
      product_price: 19.9,
      total:         Number(total.toFixed(2)),
      status:        "novo",
      source:        "kitchen-cleaner",
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
          background: #ea580c; color: #fff; text-align: center;
          padding: 10px 16px; font-size: 13px; font-weight: 800;
        }

        /* 1+1 BANNER */
        .promo-banner {
          background: #111; padding: 16px;
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
        }
        .promo-title { font-size: 22px; font-weight: 900; color: #fb923c; line-height: 1; letter-spacing: .02em; }
        .promo-sub { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.45); margin-top: 4px; }
        .promo-badge {
          background: #ea580c; color: #fff; font-size: 13px; font-weight: 900;
          padding: 9px 15px; border-radius: 10px; white-space: nowrap;
          text-align: center; line-height: 1.3;
        }

        .hero { background: #fff; padding: 20px 16px 24px; border-bottom: 3px solid #f0f0f0; }
        .hero-badge {
          display: inline-block; background: #fff7ed; color: #c2410c;
          font-size: 12px; font-weight: 800; padding: 5px 12px;
          border-radius: 6px; border: 1px solid #fed7aa; margin-bottom: 12px;
        }
        .hero h1 {
          font-size: 27px; font-weight: 900; line-height: 1.18;
          color: #111; margin-bottom: 9px; letter-spacing: -.01em;
        }
        .hero h1 span { color: #ea580c; }
        .hero-sub { font-size: 14.5px; color: #555; line-height: 1.6; margin-bottom: 16px; }

        .hero-img {
          width: 100%; border-radius: 14px; overflow: hidden;
          border: 3px solid #ea580c; position: relative; margin-bottom: 16px;
          background: #fff7ed;
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

        /* 1+1 VIZUAL */
        .duo-box {
          background: #fff7ed; border: 2px dashed #ea580c; border-radius: 14px;
          padding: 16px; margin-bottom: 16px; text-align: center;
        }
        .duo-row {
          display: flex; align-items: center; justify-content: center;
          gap: 12px; margin-bottom: 10px;
        }
        .duo-can { font-size: 36px; }
        .duo-plus { font-size: 22px; font-weight: 900; color: #ea580c; }
        .duo-title { font-size: 17px; font-weight: 900; color: #c2410c; }
        .duo-sub { font-size: 12.5px; font-weight: 700; color: #9a3412; margin-top: 3px; }

        .price-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
        .price-new { font-size: 38px; font-weight: 900; color: #16a34a; letter-spacing: -.02em; }
        .price-tag {
          background: #fff7ed; color: #c2410c; font-size: 12px; font-weight: 800;
          padding: 4px 10px; border-radius: 6px; border: 1px solid #fed7aa;
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
        .problem-banner { background: #111; margin-top: 8px; padding: 22px 16px; text-align: center; }
        .problem-title { font-size: 17px; font-weight: 900; color: #fff; margin-bottom: 7px; line-height: 1.3; }
        .problem-sub { font-size: 13.5px; color: rgba(255,255,255,0.55); line-height: 1.62; }

        .section { background: #fff; margin-top: 8px; padding: 24px 16px; }
        .section-title { font-size: 21px; font-weight: 900; color: #111; margin-bottom: 16px; line-height: 1.25; }

        /* KORACI */
        .korak-list { display: flex; flex-direction: column; gap: 10px; }
        .korak-card {
          background: #fff7ed; border: 1px solid #fed7aa; border-radius: 14px;
          padding: 16px; display: flex; gap: 14px; align-items: flex-start;
        }
        .korak-br {
          width: 36px; height: 36px; border-radius: 10px; background: #ea580c;
          color: #fff; display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 900; flex-shrink: 0;
        }
        .korak-naslov { font-size: 15px; font-weight: 900; color: #111; }
        .korak-tekst { font-size: 13px; color: #78716c; line-height: 1.55; margin-top: 4px; }

        /* POVRSINE */
        .pov-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .pov-card {
          background: #fff7ed; border: 1px solid #fed7aa; border-radius: 12px;
          padding: 14px; text-align: center;
        }
        .pov-icon { font-size: 26px; }
        .pov-naziv { font-size: 13px; font-weight: 900; color: #111; margin-top: 6px; }
        .pov-opis { font-size: 11px; font-weight: 600; color: #a8a29e; margin-top: 2px; }

        /* BENEFITI */
        .benefit-list { display: flex; flex-direction: column; gap: 10px; }
        .benefit-item {
          display: flex; align-items: center; gap: 12px; padding: 12px 14px;
          background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px;
          font-size: 14px; font-weight: 700; color: #1a1a1a; line-height: 1.45;
        }
        .benefit-icon { font-size: 20px; flex-shrink: 0; }

        /* TESTIMONIALS */
        .t-list { display: flex; flex-direction: column; gap: 10px; }
        .t-card {
          background: #f9fafb; border: 1px solid #e5e7eb; border-left: 3px solid #ea580c;
          border-radius: 10px; padding: 14px;
        }
        .t-stars { color: #f59e0b; font-size: 13px; margin-bottom: 6px; }
        .t-text { font-size: 13px; color: #333; line-height: 1.65; }
        .t-author { font-size: 12px; font-weight: 800; color: #c2410c; margin-top: 8px; }

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
          background: #fff7ed; border: 1px solid #fed7aa;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 700; color: #ea580c;
          flex-shrink: 0; transition: transform .2s;
        }
        .faq-item.open .faq-icon { transform: rotate(45deg); }
        .faq-a {
          font-size: 13px; color: #555; line-height: 1.7;
          max-height: 0; overflow: hidden; padding: 0 16px;
          transition: max-height .3s ease, padding .3s ease;
        }
        .faq-item.open .faq-a { max-height: 220px; padding: 0 16px 15px; }

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
        .inp:focus { border-color: #ea580c; background: #fff; }

        .gift-label {
          display: flex; align-items: flex-start; gap: 12px;
          background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 10px;
          padding: 14px; cursor: pointer; transition: border-color .2s, background .2s;
        }
        .gift-label.checked { border-color: #ea580c; background: #fff7ed; }
        .gift-label input { accent-color: #ea580c; width: 18px; height: 18px; margin-top: 1px; flex-shrink: 0; }
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
        .sticky-price-lbl { font-size: 10.5px; font-weight: 800; color: #ea580c; margin-top: 2px; }
        .sticky-btn {
          flex: 1; padding: 15px; background: #dc2626; color: #fff;
          font-family: 'Nunito', sans-serif; font-size: 15.5px; font-weight: 900;
          border: none; border-radius: 12px; cursor: pointer;
        }

        .footer {
          background: #111; padding: 20px 16px; text-align: center;
          font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.3);
        }
        .footer a { color: rgba(255,255,255,0.3); text-decoration: none; margin: 0 6px; }
        .footer a:hover { color: #fff; }
      `}</style>

      <div className="page">

        <div className="topbar">
          🧴 1+1 GRATIS · Skida i staru masnoću · Plaćanje pouzećem
        </div>

        {/* 1+1 BANNER */}
        <div className="promo-banner">
          <div>
            <div className="promo-title">1+1 GRATIS 🎁</div>
            <div className="promo-sub">Dvije limenke po cijeni jedne</div>
          </div>
          <div className="promo-badge">2× 500ml<br />19,90 KM</div>
        </div>

        {/* HERO */}
        <section className="hero">
          <div className="hero-badge">🧴 Kitchen Cleaner · 500 ml · Miris limuna</div>

          <h1>Masnoća silazi sama — <span>bez ribanja.</span></h1>
          <p className="hero-sub">
            Poprskaš, sačekaš dva minuta i prebrišeš krpom. Aspirator, šporet, rerna i pločice izgledaju kao novi — bez struganja, bez trošenja ruku.
          </p>

          <div className="hero-img">
            <span className="hero-img-badge">1+1 GRATIS</span>
            <span className="hero-img-price">19,90 KM</span>
            <img src="https://i.imgur.com/WvHdUaC.jpeg" alt="Kitchen Cleaner sprej za masnoću — prije i poslije" />
          </div>

          {/* 1+1 vizual */}
          <div className="duo-box">
            <div className="duo-row">
              <span className="duo-can">🧴</span>
              <span className="duo-plus">+</span>
              <span className="duo-can">🧴</span>
            </div>
            <div className="duo-title">Dobijaš 2 limenke od 500 ml</div>
            <div className="duo-sub">Druga limenca je potpuno GRATIS — plaćaš samo jednu</div>
          </div>

          <div className="price-row">
            <span className="price-new">19,90 KM</span>
            <span className="price-tag">🎁 Za obje limenke</span>
          </div>

          <button className="cta-btn" onClick={scrollToOrder}>🛒 NARUČI 1+1 GRATIS</button>

          <div className="trust-row">
            <span className="trust-item">✅ Plaćanje pouzećem</span>
            <span className="trust-item">🚚 Dostava 2–4 dana</span>
            <span className="trust-item">🧴 2× 500 ml</span>
          </div>
        </section>

        {/* PROBLEM */}
        <div className="problem-banner">
          <div className="problem-title">😤 Ribaš aspirator po pola sata, a masnoća i dalje tu?</div>
          <div className="problem-sub">
            Obični deterdženti samo razmažu staru masnoću. Zapečene naslage na rešetkama, žuti sloj na pločicama iza šporeta, ljepljiv aspirator — to traži jaču formulu, ne jaču ruku.
          </div>
        </div>

        {/* KAKO SE KORISTI */}
        <section className="section">
          <div className="section-title">⚡ Tri koraka i gotovo</div>
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

        {/* POVRSINE */}
        <section className="section">
          <div className="section-title">🏠 Gdje sve radi</div>
          <div className="pov-grid">
            {povrsine.map((p) => (
              <div className="pov-card" key={p.naziv}>
                <div className="pov-icon">{p.icon}</div>
                <div className="pov-naziv">{p.naziv}</div>
                <div className="pov-opis">{p.opis}</div>
              </div>
            ))}
          </div>
        </section>

        {/* BENEFITI */}
        <section className="section">
          <div className="section-title">✅ Zašto baš ovaj sprej</div>
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
          <div className="urgency-title">⏳ 1+1 GRATIS dok traju zalihe!</div>
          <div className="urgency-sub">19,90 KM za dvije limenke. Kad akcija prođe, cijena važi za jednu.</div>
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
                <div className="form-header-badge">🎁 1+1 GRATIS</div>
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
                  <div className="summary-row"><span>Kitchen Cleaner 1+1 (2× 500 ml)</span><span>19,90 KM</span></div>
                  <div className="summary-row"><span>Dostava</span><span>10,00 KM</span></div>
                  {giftPack && (
                    <div className="summary-row" style={{ color: "#ea580c", fontWeight: 700 }}>
                      <span>Poklon paket</span><span>5,00 KM</span>
                    </div>
                  )}
                  <div className="summary-total">
                    <span className="summary-total-lbl">UKUPNO</span>
                    <span className="summary-total-val">{total.toFixed(2)} KM</span>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? "ŠALJE SE..." : "🛒 NARUČI 1+1 GRATIS"}
                </button>
                <div className="form-note">🔒 Plaćanje pouzećem · Platite tek pri preuzimanju</div>
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

      {/* STICKY CTA */}
      {!success && (
        <div className="sticky-cta">
          <div>
            <div className="sticky-price-val">19,90 KM</div>
            <div className="sticky-price-lbl">1+1 GRATIS</div>
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