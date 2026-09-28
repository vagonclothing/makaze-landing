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

  const baseTotal = 34.9; // dostava GRATIS
  const total = useMemo(() => (giftPack ? baseTotal + 5 : baseTotal), [giftPack]);

  const heroBenefits = [
    "Plan za svih 28 dana",
    "Svaki dan unaprijed isplaniran",
    "80+ jednostavnih obroka",
    "Namirnice iz lokalnih prodavnica",
    "Sedmične liste za kupovinu",
    "Tabela za praćenje GRATIS",
    "PDF verzija za telefon GRATIS",
    "Dostava na kućnu adresu",
  ];

  const problemi = [
    "Svaki dan razmišljam šta danas jesti.",
    "Počnem paziti na ishranu, ali brzo odustanem.",
    "Kupim namirnice, a onda pola njih ostane neiskorišteno.",
    "Preskočim obrok, pa navečer pojedem previše.",
    "Planovi koje nađem na internetu su previše komplikovani.",
  ];

  const dan1 = [
    { tag: "DORUČAK", icon: "🥣", jelo: "Zobena kaša sa voćem i orašastim plodovima", prip: "Zobene pahuljice prelijte toplim mlijekom ili vodom, dodajte sjeckano voće i šaku orašastih plodova." },
    { tag: "RUČAK",   icon: "🍗", jelo: "Piletina sa povrćem i integralnom rižom", prip: "Pileća prsa začinite i ispecite, uz njih poslužite dinstano sezonsko povrće i kuhanu integralnu rižu." },
    { tag: "UŽINA",   icon: "🥛", jelo: "Jogurt sa voćem", prip: "Čaša jogurta uz sjeckano svježe voće po izboru." },
    { tag: "VEČERA",  icon: "🥗", jelo: "Velika salata sa tunjevinom i kuhanim jajetom", prip: "Zelena salata, paradajz i krastavac, tunjevina iz konzerve i kuhano jaje, prelijte maslinovim uljem." },
  ];

  const paket = [
    { br: "1", naslov: "FIZIČKI PRIRUČNIK", tekst: "28 dana unaprijed organizovane ishrane sa jednostavnim receptima i jasnim uputama.", gratis: false },
    { br: "2", naslov: "SEDMIČNE LISTE ZA KUPOVINU", tekst: "Prije odlaska u prodavnicu već znate šta vam treba za naredne dane.", gratis: false },
    { br: "3", naslov: "„MOJIH 28 DANA“ TABELA", tekst: "Praćenje tjelesne težine, vode, obroka, aktivnosti i napretka kroz svih 28 dana.", gratis: true },
    { br: "4", naslov: "PDF VERZIJA ZA TELEFON", tekst: "Na kraju priručnika je QR kod — skenirate ga i plan uvijek imate uz sebe.", gratis: true },
  ];

  const sedmice = [
    { br: "1", naslov: "Upoznavanje ritma", tekst: "Upoznajete novi ritam i organizujete obroke." },
    { br: "2", naslov: "Postaje lakše", tekst: "Planiranje hrane postaje jednostavnije." },
    { br: "3", naslov: "Manje razmišljanja", tekst: "Sve manje razmišljate „šta danas jesti?“." },
    { br: "4", naslov: "Vaš sistem", tekst: "Imate sistem koji možete nastaviti koristiti i nakon programa." },
  ];

  const faqs = [
    { q: "Da li dobijam fizičku knjigu?", a: "Da. Na vašu adresu stiže štampani priručnik. PDF verzija je dodatak, ne zamjena." },
    { q: "Da li svaki dan jedem isto?", a: "Ne. Plan sadrži različite obroke raspoređene kroz svih 28 dana — preko 80 jednostavnih jela." },
    { q: "Jesu li potrebne posebne namirnice?", a: "Ne. Plan je baziran na namirnicama dostupnim u uobičajenim prodavnicama u BiH." },
    { q: "Moram li znati kuhati?", a: "Recepti su napravljeni da budu jednostavni i razumljivi i osobama bez mnogo iskustva u kuhinji." },
    { q: "Kako dobijam PDF verziju?", a: "U fizičkom priručniku se nalazi QR kod putem kojeg pristupate digitalnoj verziji — potpuno besplatno." },
    { q: "Kako plaćam?", a: "Plaćate pouzećem, tek kada paket stigne na vašu adresu. Dostava je besplatna." },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const fd   = new FormData(form);

    const order = {
      product_name:  "28 DANA – Plan ishrane (priručnik)",
      full_name:     String(fd.get("ime") || ""),
      phone:         String(fd.get("telefon") || ""),
      address_place: String(fd.get("adresa") || ""),
      postal_code:   String(fd.get("postanski") || ""),
      gift_pack:     giftPack,
      shipping:      0,
      product_price: 34.9,
      total:         Number(total.toFixed(2)),
      status:        "novo",
      source:        "plan-ishrane",
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
        body { background: #f7f4ee; }

        .page {
          font-family: 'Nunito', sans-serif;
          background: #f7f4ee;
          color: #1f2421;
          min-height: 100vh;
          max-width: 480px;
          margin: 0 auto;
          padding-bottom: 88px;
        }

        .topbar {
          background: #2d6a4f;
          color: #fff;
          text-align: center;
          padding: 10px 16px;
          font-size: 12.5px;
          font-weight: 800;
          letter-spacing: .01em;
        }

        /* HERO */
        .hero { background: #fff; padding: 26px 18px 28px; }
        .hero-badge {
          display: inline-block; background: #f0f7f2; color: #2d6a4f;
          font-size: 11.5px; font-weight: 800; padding: 6px 13px;
          border-radius: 50px; border: 1px solid #cfe5d8; margin-bottom: 16px;
          letter-spacing: .03em;
        }
        .hero h1 {
          font-size: 32px; font-weight: 900; line-height: 1.12;
          color: #1f2421; margin-bottom: 14px; letter-spacing: -.02em;
        }
        .hero h1 span { color: #2d6a4f; }
        .hero-sub { font-size: 15px; color: #56605a; line-height: 1.62; margin-bottom: 22px; }

        .hero-img {
          width: 100%; border-radius: 20px; overflow: hidden;
          border: 1px solid #e8e2d8; margin-bottom: 22px;
          background: #faf8f4; box-shadow: 0 8px 30px rgba(45,106,79,0.10);
          position: relative;
        }
        .hero-img img { width: 100%; display: block; }
        .hero-img-price {
          position: absolute; top: 14px; right: 14px;
          background: #2d6a4f; color: #fff; font-size: 16px; font-weight: 900;
          padding: 7px 14px; border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.18);
        }

        .ben-list { display: flex; flex-direction: column; gap: 9px; margin-bottom: 22px; }
        .ben-row {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 14.5px; font-weight: 700; color: #2c332e;
        }
        .ben-check {
          width: 21px; height: 21px; border-radius: 50%;
          background: #e8f3ec; color: #2d6a4f;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 900; flex-shrink: 0; margin-top: 1px;
        }

        .pouzece-badge {
          background: #fdf6e3; border: 1.5px solid #e8d5a3;
          border-radius: 14px; padding: 13px 16px; text-align: center;
          margin-bottom: 20px;
        }
        .pouzece-title { font-size: 14px; font-weight: 900; color: #8a6d1f; letter-spacing: .04em; }
        .pouzece-sub { font-size: 12.5px; font-weight: 700; color: #a08a4d; margin-top: 3px; }

        .price-block { display: flex; align-items: baseline; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
        .price-new { font-size: 40px; font-weight: 900; color: #2d6a4f; letter-spacing: -.02em; }
        .price-ship {
          background: #e8f3ec; color: #2d6a4f; font-size: 12px; font-weight: 800;
          padding: 5px 11px; border-radius: 50px;
        }

        .cta-btn {
          width: 100%; padding: 19px; background: #2d6a4f; color: #fff;
          font-family: 'Nunito', sans-serif; font-size: 17.5px; font-weight: 900;
          border: none; border-radius: 14px; cursor: pointer;
          transition: background .15s, transform .15s;
          box-shadow: 0 6px 18px rgba(45,106,79,0.30); letter-spacing: .01em;
        }
        .cta-btn:hover { background: #245740; transform: translateY(-1px); }
        .cta-note { text-align: center; font-size: 13px; font-weight: 700; color: #7b857f; margin-top: 11px; }

        /* SECTIONS */
        .section { background: #fff; margin-top: 12px; padding: 30px 18px; }
        .section.cream { background: #f2ede3; }
        .section-label {
          font-size: 11.5px; font-weight: 900; color: #2d6a4f;
          text-transform: uppercase; letter-spacing: .1em; margin-bottom: 9px;
        }
        .section-title {
          font-size: 25px; font-weight: 900; color: #1f2421;
          line-height: 1.2; margin-bottom: 20px; letter-spacing: -.015em;
        }
        .section-text { font-size: 15px; color: #56605a; line-height: 1.68; }

        /* PROBLEMI */
        .prob-list { display: flex; flex-direction: column; gap: 10px; }
        .prob-card {
          background: #fff; border: 1px solid #e8e2d8; border-left: 3px solid #d4a574;
          border-radius: 13px; padding: 15px 16px;
          font-size: 14.5px; font-weight: 700; color: #3c443e; line-height: 1.5;
          font-style: italic;
        }
        .prob-solution {
          margin-top: 22px; background: #2d6a4f; border-radius: 18px;
          padding: 24px 20px; color: #fff;
        }
        .prob-solution h3 { font-size: 21px; font-weight: 900; line-height: 1.25; margin-bottom: 10px; }
        .prob-solution p { font-size: 14.5px; line-height: 1.65; color: rgba(255,255,255,0.82); }

        /* DAN 1 */
        .dan-header {
          background: #2d6a4f; border-radius: 16px 16px 0 0;
          padding: 16px 18px; text-align: center;
        }
        .dan-label { font-size: 11px; font-weight: 800; color: rgba(255,255,255,0.6); letter-spacing: .12em; }
        .dan-num { font-size: 27px; font-weight: 900; color: #fff; line-height: 1.1; margin-top: 2px; }
        .dan-body {
          background: #fff; border: 1px solid #e8e2d8; border-top: none;
          border-radius: 0 0 16px 16px; padding: 6px 16px 16px;
        }
        .meal { padding: 16px 0; border-bottom: 1px dashed #e8e2d8; }
        .meal:last-child { border-bottom: none; }
        .meal-top { display: flex; align-items: center; gap: 10px; margin-bottom: 7px; }
        .meal-icon { font-size: 25px; }
        .meal-tag {
          font-size: 10.5px; font-weight: 900; color: #2d6a4f;
          letter-spacing: .1em; background: #e8f3ec;
          padding: 4px 10px; border-radius: 50px;
        }
        .meal-jelo { font-size: 15.5px; font-weight: 800; color: #1f2421; line-height: 1.35; margin-bottom: 5px; }
        .meal-prip { font-size: 13px; color: #6b746e; line-height: 1.58; }
        .dan-footer {
          text-align: center; margin-top: 18px;
          font-size: 17px; font-weight: 900; color: #2d6a4f;
        }

        /* PAKET */
        .paket-list { display: flex; flex-direction: column; gap: 12px; }
        .paket-card {
          background: #fff; border: 1px solid #e8e2d8; border-radius: 16px;
          padding: 18px; display: flex; gap: 14px; align-items: flex-start;
          position: relative;
        }
        .paket-card.gratis { border-color: #cfe5d8; background: #f8fcf9; }
        .paket-br {
          width: 34px; height: 34px; border-radius: 10px;
          background: #2d6a4f; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; font-weight: 900; flex-shrink: 0;
        }
        .paket-naslov { font-size: 14.5px; font-weight: 900; color: #1f2421; letter-spacing: .01em; }
        .paket-tekst { font-size: 13.5px; color: #6b746e; line-height: 1.58; margin-top: 5px; }
        .gratis-tag {
          display: inline-block; background: #d4a574; color: #fff;
          font-size: 10px; font-weight: 900; padding: 3px 9px;
          border-radius: 50px; letter-spacing: .08em; margin-left: 7px;
          vertical-align: middle;
        }

        /* SEDMICE */
        .sed-list { display: flex; flex-direction: column; gap: 11px; }
        .sed-card {
          background: #fff; border: 1px solid #e8e2d8; border-radius: 14px;
          padding: 16px; display: flex; gap: 14px; align-items: flex-start;
        }
        .sed-br {
          font-size: 30px; font-weight: 900; color: #cfe5d8;
          line-height: 1; flex-shrink: 0; width: 34px;
        }
        .sed-naslov { font-size: 14.5px; font-weight: 900; color: #1f2421; }
        .sed-tekst { font-size: 13.5px; color: #6b746e; line-height: 1.55; margin-top: 3px; }

        /* PDF BLOK */
        .pdf-box {
          background: #1f2421; border-radius: 18px; padding: 26px 20px; text-align: center;
        }
        .pdf-icons { font-size: 38px; letter-spacing: 6px; margin-bottom: 14px; }
        .pdf-title { font-size: 20px; font-weight: 900; color: #fff; line-height: 1.3; margin-bottom: 10px; }
        .pdf-text { font-size: 14px; color: rgba(255,255,255,0.62); line-height: 1.62; }
        .pdf-tag {
          display: inline-block; margin-top: 14px; background: #d4a574; color: #fff;
          font-size: 11.5px; font-weight: 900; padding: 6px 14px;
          border-radius: 50px; letter-spacing: .06em;
        }

        /* FAQ */
        .faq-item {
          border: 1px solid #e8e2d8; border-radius: 14px; overflow: hidden;
          margin-bottom: 9px; background: #fff;
        }
        .faq-q {
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 17px; cursor: pointer; user-select: none; gap: 11px;
        }
        .faq-q-text { font-size: 14.5px; font-weight: 800; color: #1f2421; line-height: 1.35; }
        .faq-icon {
          width: 25px; height: 25px; border-radius: 50%;
          background: #e8f3ec; display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 700; color: #2d6a4f;
          flex-shrink: 0; transition: transform .2s;
        }
        .faq-item.open .faq-icon { transform: rotate(45deg); }
        .faq-a {
          font-size: 13.5px; color: #6b746e; line-height: 1.7;
          max-height: 0; overflow: hidden; padding: 0 17px;
          transition: max-height .3s ease, padding .3s ease;
        }
        .faq-item.open .faq-a { max-height: 240px; padding: 0 17px 16px; }

        /* FINALNI PAKET */
        .final-box {
          background: #fff; border: 2px solid #2d6a4f; border-radius: 20px;
          padding: 24px 20px; text-align: center; margin-bottom: 22px;
        }
        .final-title { font-size: 22px; font-weight: 900; color: #1f2421; line-height: 1.2; margin-bottom: 16px; }
        .final-items { display: flex; flex-direction: column; gap: 8px; text-align: left; margin-bottom: 18px; }
        .final-item {
          display: flex; align-items: center; gap: 9px;
          font-size: 14px; font-weight: 700; color: #3c443e;
        }
        .final-dot { width: 7px; height: 7px; border-radius: 50%; background: #2d6a4f; flex-shrink: 0; }
        .final-price {
          font-size: 38px; font-weight: 900; color: #2d6a4f;
          line-height: 1; margin-bottom: 4px;
        }
        .final-ship { font-size: 13px; font-weight: 800; color: #2d6a4f; }

        /* FORM */
        .form-section {
          background: #fff; margin-top: 12px; padding: 30px 18px 34px;
          border-top: 4px solid #2d6a4f;
        }
        .form-header { text-align: center; margin-bottom: 22px; }
        .form-title { font-size: 25px; font-weight: 900; color: #1f2421; margin-bottom: 6px; letter-spacing: -.015em; }
        .form-sub { font-size: 13.5px; color: #6b746e; font-weight: 600; }

        .inp {
          width: 100%; background: #faf8f4; border: 2px solid #e8e2d8;
          border-radius: 12px; padding: 15px 16px;
          font-family: 'Nunito', sans-serif; font-size: 15.5px; font-weight: 600;
          color: #1f2421; transition: border-color .2s, background .2s; outline: none;
        }
        .inp::placeholder { color: #a8afa9; font-weight: 600; }
        .inp:focus { border-color: #2d6a4f; background: #fff; }

        .gift-label {
          display: flex; align-items: flex-start; gap: 12px;
          background: #faf8f4; border: 2px solid #e8e2d8; border-radius: 12px;
          padding: 15px; cursor: pointer; transition: border-color .2s, background .2s;
        }
        .gift-label.checked { border-color: #2d6a4f; background: #f0f7f2; }
        .gift-label input { accent-color: #2d6a4f; width: 18px; height: 18px; margin-top: 1px; flex-shrink: 0; }
        .gift-lbl-title { font-size: 14px; font-weight: 800; color: #1f2421; }
        .gift-lbl-sub { font-size: 12.5px; font-weight: 600; color: #7b857f; margin-top: 2px; }

        .summary-box {
          background: #faf8f4; border: 2px solid #e8e2d8;
          border-radius: 14px; padding: 17px;
        }
        .summary-row {
          display: flex; justify-content: space-between;
          font-size: 14px; font-weight: 600; color: #56605a; padding: 5px 0;
        }
        .summary-total {
          display: flex; justify-content: space-between; align-items: center;
          margin-top: 11px; padding-top: 13px; border-top: 2px solid #e8e2d8;
        }
        .summary-total-lbl { font-size: 18px; font-weight: 900; color: #1f2421; }
        .summary-total-val { font-size: 27px; font-weight: 900; color: #2d6a4f; }

        .submit-btn {
          width: 100%; padding: 19px; background: #2d6a4f; color: #fff;
          font-family: 'Nunito', sans-serif; font-size: 18px; font-weight: 900;
          border: none; border-radius: 14px; cursor: pointer;
          transition: background .15s, transform .15s;
          box-shadow: 0 6px 20px rgba(45,106,79,0.30);
        }
        .submit-btn:hover:not(:disabled) { background: #245740; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: .65; cursor: not-allowed; }

        .trust-final {
          display: flex; justify-content: center; gap: 14px;
          margin-top: 14px; flex-wrap: wrap;
        }
        .trust-final span { font-size: 12.5px; font-weight: 700; color: #7b857f; }

        @keyframes scaleIn { from { transform: scale(.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .success-wrap { text-align: center; padding: 44px 16px; animation: scaleIn .4s ease both; }
        .success-icon { font-size: 64px; margin-bottom: 16px; }
        .success-title { font-size: 26px; font-weight: 900; color: #2d6a4f; margin-bottom: 9px; }
        .success-sub { font-size: 15px; font-weight: 600; color: #56605a; line-height: 1.62; }

        /* STICKY CTA */
        .sticky-cta {
          position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 100%; max-width: 480px; z-index: 90;
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(8px);
          border-top: 1px solid #e8e2d8;
          padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
          display: flex; align-items: center; gap: 12px;
        }
        .sticky-price { flex-shrink: 0; }
        .sticky-price-val { font-size: 20px; font-weight: 900; color: #2d6a4f; line-height: 1; }
        .sticky-price-lbl { font-size: 10.5px; font-weight: 700; color: #9aa39d; margin-top: 2px; }
        .sticky-btn {
          flex: 1; padding: 15px; background: #2d6a4f; color: #fff;
          font-family: 'Nunito', sans-serif; font-size: 15.5px; font-weight: 900;
          border: none; border-radius: 12px; cursor: pointer;
        }

        /* DISCLAIMER */
        .disclaimer {
          background: #f2ede3; padding: 22px 18px 26px;
          font-size: 11.5px; color: #8b938d; line-height: 1.7;
        }
        .footer {
          background: #1f2421; padding: 20px 16px; text-align: center;
          font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.3);
        }
        .footer a { color: rgba(255,255,255,0.3); text-decoration: none; margin: 0 6px; }
        .footer a:hover { color: #fff; }
      `}</style>

      <div className="page">

        <div className="topbar">
          📦 Dostava GRATIS · Plaćanje pouzećem · Dostava na kućnu adresu
        </div>

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-badge">📘 FIZIČKI PRIRUČNIK + PDF GRATIS</div>

          <h1>28 DANA.<br /><span>Svaki obrok isplaniran.</span></h1>

          <p className="hero-sub">
            Praktičan plan ishrane koji vam pomaže da uredite obroke, kontrolišete porcije i postepeno radite na smanjenju tjelesne težine — bez svakodnevnog razmišljanja šta ćete jesti.
          </p>

          <div className="hero-img">
            <span className="hero-img-price">34,90 KM</span>
            <img src="https://i.imgur.com/k66rYsh.jpeg" alt="28 dana plan ishrane — priručnik" />
          </div>

          <div className="ben-list">
            {heroBenefits.map((b) => (
              <div className="ben-row" key={b}>
                <span className="ben-check">✓</span>
                <span>{b}</span>
              </div>
            ))}
          </div>

          <div className="pouzece-badge">
            <div className="pouzece-title">💵 PLAĆANJE POUZEĆEM</div>
            <div className="pouzece-sub">Plaćate tek kada paket stigne na vašu adresu</div>
          </div>

          <div className="price-block">
            <span className="price-new">34,90 KM</span>
            <span className="price-ship">🚚 Dostava GRATIS</span>
          </div>

          <button className="cta-btn" onClick={scrollToOrder}>
            NARUČI SVOJ PRIMJERAK
          </button>
          <div className="cta-note">Plaćate tek kada paket stigne na vašu adresu.</div>
        </section>

        {/* ── PROBLEM ── */}
        <section className="section cream">
          <div className="section-label">Poznato?</div>
          <div className="section-title">Zvuči li vam ovo poznato?</div>

          <div className="prob-list">
            {problemi.map((p) => (
              <div className="prob-card" key={p}>„{p}“</div>
            ))}
          </div>

          <div className="prob-solution">
            <h3>Zato smo planiranje već uradili za vas.</h3>
            <p>
              Ne morate svaki dan tražiti recepte, računati šta ćete kuhati niti praviti novi plan. Otvorite odgovarajući dan i pratite unaprijed pripremljen jelovnik.
            </p>
          </div>
        </section>

        {/* ── DAN 1 ── */}
        <section className="section">
          <div className="section-label">Kako izgleda jedan dan</div>
          <div className="section-title">Otvorite dan i samo pratite.</div>

          <div className="dan-header">
            <div className="dan-label">PRIMJER JELOVNIKA</div>
            <div className="dan-num">DAN 1</div>
          </div>
          <div className="dan-body">
            {dan1.map((m) => (
              <div className="meal" key={m.tag}>
                <div className="meal-top">
                  <span className="meal-icon">{m.icon}</span>
                  <span className="meal-tag">{m.tag}</span>
                </div>
                <div className="meal-jelo">{m.jelo}</div>
                <div className="meal-prip">{m.prip}</div>
              </div>
            ))}
          </div>
          <div className="dan-footer">I tako svih 28 dana.</div>
        </section>

        {/* ── ŠTA DOBIJATE ── */}
        <section className="section cream">
          <div className="section-label">Kompletan paket</div>
          <div className="section-title">Sve što vam treba za narednih 28 dana — na jednom mjestu.</div>

          <div className="paket-list">
            {paket.map((p) => (
              <div className={`paket-card${p.gratis ? " gratis" : ""}`} key={p.br}>
                <div className="paket-br">{p.br}</div>
                <div>
                  <div className="paket-naslov">
                    {p.naslov}
                    {p.gratis && <span className="gratis-tag">GRATIS</span>}
                  </div>
                  <div className="paket-tekst">{p.tekst}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── NIJE DIJETA ── */}
        <section className="section">
          <div className="section-label">Važno je znati</div>
          <div className="section-title">Bez izgladnjivanja. Bez čudotvornih obećanja.</div>
          <p className="section-text">
            Ovaj priručnik nije napravljen oko ekstremnih dijeta ili obećanja da ćete izgubiti određeni broj kilograma za nekoliko dana.
            <br /><br />
            Ideja je mnogo jednostavnija: <strong style={{ color: "#2d6a4f" }}>bolja organizacija, razumne porcije, kvalitetniji izbor hrane i dosljednost.</strong>
            <br /><br />
            Cilj je pomoći vam da napravite održiviji način ishrane koji možete uklopiti u svakodnevni život. Individualni rezultati mogu se razlikovati.
          </p>
        </section>

        {/* ── ZAŠTO 28 DANA ── */}
        <section className="section cream">
          <div className="section-label">Sedmicu po sedmicu</div>
          <div className="section-title">Zašto baš 28 dana?</div>

          <div className="sed-list">
            {sedmice.map((s) => (
              <div className="sed-card" key={s.br}>
                <div className="sed-br">{s.br}</div>
                <div>
                  <div className="sed-naslov">{s.naslov}</div>
                  <div className="sed-tekst">{s.tekst}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PDF GRATIS ── */}
        <section className="section">
          <div className="pdf-box">
            <div className="pdf-icons">📘 📱</div>
            <div className="pdf-title">Knjiga kod kuće.<br />Plan uvijek u telefonu.</div>
            <div className="pdf-text">
              Uz fizički priručnik dobijate pristup PDF verziji. Na posljednjoj stranici nalazi se QR kod koji vas vodi na stranicu za preuzimanje — recept ili listu za kupovinu možete otvoriti i dok ste u prodavnici.
            </div>
            <div className="pdf-tag">POTPUNO GRATIS</div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="section cream">
          <div className="section-label">Pitanja</div>
          <div className="section-title">Često postavljana pitanja</div>
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

        {/* ── FORMA ── */}
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
              <div className="final-box">
                <div className="final-title">28-DNEVNI PLAN ISHRANE</div>
                <div className="final-items">
                  <div className="final-item"><span className="final-dot" />Fizički priručnik na vašu adresu</div>
                  <div className="final-item"><span className="final-dot" />28 dana isplaniranog jelovnika</div>
                  <div className="final-item"><span className="final-dot" />Sedmične liste za kupovinu</div>
                  <div className="final-item"><span className="final-dot" />Tabela „Mojih 28 dana“ GRATIS</div>
                  <div className="final-item"><span className="final-dot" />PDF verzija za telefon GRATIS</div>
                </div>
                <div className="final-price">34,90 KM</div>
                <div className="final-ship">🚚 Dostava GRATIS · 💵 Plaćanje pouzećem</div>
              </div>

              <div className="form-header">
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
                  <div className="summary-row"><span>28 DANA – Plan ishrane</span><span>34,90 KM</span></div>
                  <div className="summary-row" style={{ color: "#2d6a4f", fontWeight: 800 }}>
                    <span>Dostava</span><span>GRATIS</span>
                  </div>
                  {giftPack && (
                    <div className="summary-row" style={{ color: "#2d6a4f", fontWeight: 700 }}>
                      <span>Poklon paket</span><span>5,00 KM</span>
                    </div>
                  )}
                  <div className="summary-total">
                    <span className="summary-total-lbl">UKUPNO</span>
                    <span className="summary-total-val">{total.toFixed(2)} KM</span>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? "ŠALJE SE..." : "NARUČI – PLAĆAM KADA STIGNE"}
                </button>

                <div className="trust-final">
                  <span>🔒 Sigurna narudžba</span>
                  <span>📦 Dostava na adresu</span>
                  <span>💵 Plaćanje pouzećem</span>
                </div>
              </form>
            </>
          )}
        </section>

        {/* ── DISCLAIMER ── */}
        <div className="disclaimer">
          Priručnik je opće informativne prirode i nije zamjena za individualni medicinski ili nutricionistički savjet. Rezultati zavise od pojedinca. Osobe sa zdravstvenim stanjima, trudnice, dojilje i osobe koje koriste terapiju trebaju se prije značajnijih promjena ishrane posavjetovati sa odgovarajućim zdravstvenim stručnjakom.
        </div>

        <footer className="footer">
          © 2025 TV-SHOP ·
          <a href="/privatnost">Privatnost</a> ·
          <a href="/impressum">Impressum</a> ·
          <a href="/uslovi">Uslovi</a>
        </footer>

      </div>

      {/* ── STICKY CTA ── */}
      {!success && (
        <div className="sticky-cta">
          <div className="sticky-price">
            <div className="sticky-price-val">34,90 KM</div>
            <div className="sticky-price-lbl">Dostava gratis</div>
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