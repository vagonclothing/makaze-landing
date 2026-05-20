"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export default function Page() {
  const [giftPack, setGiftPack]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [navSolid, setNavSolid]   = useState(false);
  const [openFaq, setOpenFaq]     = useState<number | null>(null);
  const orderRef = useRef<HTMLElement | null>(null);

  const scrollToOrder = () =>
    orderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const baseTotal = 189.9;
  const total = useMemo(() => (giftPack ? baseTotal + 5 : baseTotal), [giftPack]);

  /* ── sticky nav shadow ── */
  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── scroll reveal ── */
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("revealed")),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const tools = [
    { icon: "🔩", name: "Udarni odvijač", desc: "180 Nm okretnog momenta — vijci za sekundu, bez zamora ruke.", tag: "180 Nm" },
    { icon: "⚙️", name: "Kutna brusilica", desc: "Disk 115 mm — precizno reže i brusi metal, kamen i keramiku.", tag: "115 mm" },
    { icon: "🪨", name: "SDS bušilica", desc: "Udarna i rotacijska funkcija — beton, cigla i kamen bez otpora.", tag: "SDS+" },
    { icon: "🔧", name: "Aku bušilica", desc: "Regulacija brzine i obrtni smjer — drvo, metal i plastika.", tag: "2 brzine" },
  ];

  const steps = [
    { n: "01", title: "Naruči online", desc: "Popuni formu za manje od 60 sekundi. Bez registracije, bez kartice." },
    { n: "02", title: "Potvrda pozivom", desc: "Naš tim te nazove kako bi potvrdio narudžbu i adresu dostave." },
    { n: "03", title: "Dostava na adresu", desc: "Kofer stiže na tvoju adresu u roku od 2–4 radna dana." },
    { n: "04", title: "Plati pouzećem", desc: "Platiš kuriru tek kada preuzmeš paket — nikakav rizik." },
  ];

  const testimonials = [
    { text: "Koristim na gradilištu svaki dan. Baterije traju, kofer je čvrst. Solidna stvar.", author: "Nermin B.", city: "Sarajevo" },
    { text: "Radio kompletnu renovaciju stana ovim setom. Za tu cijenu odlično.", author: "Emir T.", city: "Tuzla" },
    { text: "SDS bušilica je odlična za beton. Ništa joj ne može. Zadovoljan sam.", author: "Zoran K.", city: "Banja Luka" },
    { text: "Dosta mi je kablova svuda. Ove baterije traju kako treba.", author: "Branko M.", city: "Mostar" },
    { text: "Garancija 3 godine je bila presudna. Pravi alat, ne igračka.", author: "Adis H.", city: "Zenica" },
    { text: "Poklonio ocu za rođendan. Veoma zadovoljan, svaki dan ga koristi.", author: "Damir Š.", city: "Bihać" },
  ];

  const included = [
    "Aku udarni odvijač (180 Nm)",
    "Aku kutna brusilica (115 mm)",
    "Aku SDS bušilica",
    "Aku bušilica (2 brzine)",
    "4× baterija 128V Li-Ion",
    "Brzi punjač",
    "Tvrdi kofer za transport",
    "3 godine garancije",
  ];

  const faqs = [
    { q: "Šta je sve u setu?", a: "Aku udarni odvijač, aku kutna brusilica, aku SDS bušilica, aku bušilica, 4 baterije 128V, brzi punjač i tvrdi kofer za transport." },
    { q: "Može li SDS bušilica bušiti beton?", a: "Da. SDS bušilica ima udarnu i rotacijsku funkciju i namijenjena je upravo za beton, ciglu i kamen." },
    { q: "Koliko traje baterija?", a: "Baterije 128V Li-Ion su dizajnirane za dugo korištenje. Sa brzim punjačem uvijek si spreman za rad." },
    { q: "Kakva je garancija?", a: "Na sve alate u setu dolazi 3 godine garancije — Makita standard kvalitete." },
    { q: "Kako se plaća?", a: "Plaćanje je pouzećem — platiš tek kada preuzmeš paket na svojoj adresi. Nema rizika." },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const fd   = new FormData(form);

    const order = {
      product_name:  "Makita aku set 4u1",
      full_name:     String(fd.get("ime") || ""),
      phone:         String(fd.get("telefon") || ""),
      address_place: String(fd.get("adresa") || ""),
      postal_code:   String(fd.get("postanski") || ""),
      gift_pack:     giftPack,
      shipping:      10,
      product_price: 179.9,
      total:         Number(total.toFixed(2)),
      status:        "novo",
      source:        "makita-4u1",
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
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800;900&family=DM+Sans:wght@400;500;600&display=swap');

        :root {
          --bg:        #0B0C0E;
          --bg2:       #111318;
          --bg3:       #16181E;
          --card:      #1A1C23;
          --border:    rgba(255,255,255,0.07);
          --accent:    #F5A800;
          --accent2:   #FF6B00;
          --text:      #F0EDE8;
          --text2:     rgba(240,237,232,0.55);
          --text3:     rgba(240,237,232,0.28);
          --radius:    18px;
          --font-h:    'Outfit', sans-serif;
          --font-b:    'DM Sans', sans-serif;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: var(--bg); }

        .wrap {
          font-family: var(--font-b);
          color: var(--text);
          background: var(--bg);
          min-height: 100vh;
          max-width: 480px;
          margin: 0 auto;
          overflow-x: hidden;
        }

        /* ── NAV ── */
        .nav {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          transition: background .3s, backdrop-filter .3s, box-shadow .3s;
        }
        .nav.solid {
          background: rgba(11,12,14,0.88);
          backdrop-filter: blur(16px);
          box-shadow: 0 1px 0 var(--border);
        }
        .nav-logo {
          font-family: var(--font-h);
          font-weight: 900;
          font-size: 18px;
          color: var(--accent);
          letter-spacing: -.3px;
        }
        .nav-cta {
          font-family: var(--font-h);
          font-weight: 800;
          font-size: 13px;
          letter-spacing: .04em;
          background: var(--accent);
          color: #1a0d00;
          border: none;
          cursor: pointer;
          padding: 10px 18px;
          border-radius: 50px;
          transition: background .15s, transform .15s;
        }
        .nav-cta:hover { background: #ffb829; transform: translateY(-1px); }

        /* ── HERO ── */
        .hero {
          position: relative;
          overflow: hidden;
          padding: 48px 24px 56px;
          background: var(--bg);
        }
        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(245,168,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,168,0,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }
        .hero-radial {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,168,0,0.13) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-radial2 {
          position: absolute;
          bottom: -60px;
          left: -80px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255,107,0,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        /* badge */
        @keyframes badgePulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(245,168,0,0.4); }
          60%      { box-shadow: 0 0 0 8px rgba(245,168,0,0); }
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-h);
          font-weight: 800;
          font-size: 12px;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: var(--accent);
          background: rgba(245,168,0,0.1);
          border: 1px solid rgba(245,168,0,0.3);
          border-radius: 50px;
          padding: 8px 16px;
          animation: badgePulse 2.5s infinite;
        }
        .badge-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--accent);
        }

        .hero-h1 {
          font-family: var(--font-h);
          font-weight: 900;
          font-size: clamp(40px, 12vw, 52px);
          line-height: 1.05;
          letter-spacing: -.03em;
          margin-top: 20px;
          color: var(--text);
        }
        .hero-h1 span { color: var(--accent); }

        .hero-sub {
          font-size: 15px;
          color: var(--text2);
          margin-top: 12px;
          line-height: 1.6;
        }

        /* stats */
        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 28px;
        }
        .stat {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 14px 10px;
          text-align: center;
        }
        .stat-num {
          font-family: var(--font-h);
          font-weight: 900;
          font-size: 22px;
          color: var(--accent);
        }
        .stat-lbl {
          font-size: 11px;
          color: var(--text3);
          margin-top: 3px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .06em;
        }

        /* product image */
        .product-frame {
          position: relative;
          margin-top: 28px;
          border-radius: 24px;
          overflow: hidden;
          border: 1.5px solid rgba(245,168,0,0.2);
          box-shadow: 0 0 60px rgba(245,168,0,0.08), 0 24px 48px rgba(0,0,0,0.5);
        }
        .product-frame img { width: 100%; display: block; }
        .product-frame::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 80px;
          background: linear-gradient(0deg, rgba(11,12,14,0.7) 0%, transparent 100%);
          pointer-events: none;
        }
        .product-tag {
          position: absolute;
          top: 14px; right: 14px;
          font-family: var(--font-h);
          font-weight: 800;
          font-size: 13px;
          background: var(--accent);
          color: #1a0d00;
          padding: 6px 14px;
          border-radius: 50px;
          z-index: 2;
        }

        /* price hero */
        .hero-prices {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 20px;
        }
        .price-old {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 16px;
          text-align: center;
        }
        .price-old-lbl { font-size: 11px; color: var(--text3); font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }
        .price-old-num {
          font-family: var(--font-h);
          font-weight: 800;
          font-size: 24px;
          color: var(--text3);
          text-decoration: line-through;
          margin-top: 4px;
        }
        .price-new {
          background: linear-gradient(135deg, rgba(245,168,0,0.15), rgba(255,107,0,0.08));
          border: 1.5px solid rgba(245,168,0,0.35);
          border-radius: var(--radius);
          padding: 16px;
          text-align: center;
        }
        .price-new-lbl { font-size: 11px; color: var(--accent); font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
        .price-new-num {
          font-family: var(--font-h);
          font-weight: 900;
          font-size: 26px;
          color: var(--accent);
          margin-top: 4px;
        }
        .price-new-sub { font-size: 11px; font-weight: 700; color: var(--accent); opacity: .7; margin-top: 2px; }

        .hero-cta {
          width: 100%;
          margin-top: 16px;
          padding: 18px;
          font-family: var(--font-h);
          font-weight: 900;
          font-size: 18px;
          letter-spacing: .05em;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          color: #1a0d00;
          border: none;
          border-radius: var(--radius);
          cursor: pointer;
          transition: opacity .15s, transform .15s;
          box-shadow: 0 8px 32px rgba(245,168,0,0.25);
        }
        .hero-cta:hover { opacity: .92; transform: translateY(-2px); }

        /* ── SECTIONS ── */
        .section { padding: 40px 20px; }
        .section-title {
          font-family: var(--font-h);
          font-weight: 900;
          font-size: 26px;
          letter-spacing: -.02em;
          color: var(--text);
          margin-bottom: 24px;
        }
        .section-title span { color: var(--accent); }
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(245,168,0,0.2), transparent);
        }

        /* ── TOOLS GRID ── */
        .tools-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .tool-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 18px 16px;
          transition: border-color .2s, transform .2s, box-shadow .2s;
          cursor: default;
        }
        .tool-card:hover {
          border-color: rgba(245,168,0,0.35);
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(245,168,0,0.07);
        }
        .tool-icon { font-size: 28px; }
        .tool-tag {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .06em;
          text-transform: uppercase;
          color: var(--accent);
          background: rgba(245,168,0,0.1);
          border: 1px solid rgba(245,168,0,0.2);
          border-radius: 50px;
          padding: 3px 10px;
          margin-top: 8px;
        }
        .tool-name {
          font-family: var(--font-h);
          font-weight: 800;
          font-size: 15px;
          margin-top: 8px;
          color: var(--text);
        }
        .tool-desc {
          font-size: 12px;
          color: var(--text2);
          margin-top: 5px;
          line-height: 1.5;
        }

        /* included extras */
        .extras {
          margin-top: 14px;
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 18px;
        }
        .extras-title {
          font-family: var(--font-h);
          font-weight: 800;
          font-size: 12px;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 12px;
        }
        .extra-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 7px 0;
        }
        .extra-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
        }
        .extra-text { font-size: 14px; font-weight: 600; color: var(--text); }

        /* ── WARRANTY ── */
        .warranty-section {
          position: relative;
          overflow: hidden;
          padding: 44px 24px;
          background: linear-gradient(135deg, #0f0d00, #16120000 80%), var(--bg2);
          text-align: center;
        }
        .warranty-bg-num {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          font-family: var(--font-h);
          font-weight: 900;
          font-size: 200px;
          color: var(--accent);
          opacity: .04;
          user-select: none;
          pointer-events: none;
          line-height: 1;
        }
        .warranty-num {
          font-family: var(--font-h);
          font-weight: 900;
          font-size: 64px;
          color: var(--accent);
          line-height: 1;
        }
        .warranty-label {
          font-family: var(--font-h);
          font-weight: 800;
          font-size: 20px;
          color: var(--text);
          margin-top: 6px;
        }
        .warranty-sub {
          font-size: 14px;
          color: var(--text2);
          margin-top: 10px;
          line-height: 1.6;
          max-width: 300px;
          margin-left: auto;
          margin-right: auto;
        }
        .warranty-badge {
          display: inline-block;
          margin-top: 16px;
          font-family: var(--font-h);
          font-weight: 800;
          font-size: 13px;
          background: rgba(245,168,0,0.12);
          border: 1px solid rgba(245,168,0,0.3);
          color: var(--accent);
          padding: 8px 20px;
          border-radius: 50px;
        }

        /* ── STEPS ── */
        .steps { display: flex; flex-direction: column; gap: 14px; }
        .step {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 18px;
          transition: border-color .2s;
        }
        .step:hover { border-color: rgba(245,168,0,0.3); }
        .step-num {
          font-family: var(--font-h);
          font-weight: 900;
          font-size: 28px;
          color: var(--accent);
          opacity: .6;
          line-height: 1;
          flex-shrink: 0;
          width: 36px;
        }
        .step-title {
          font-family: var(--font-h);
          font-weight: 800;
          font-size: 16px;
          color: var(--text);
        }
        .step-desc { font-size: 13px; color: var(--text2); margin-top: 4px; line-height: 1.5; }

        /* ── EXPERT ── */
        .expert-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-left: 3px solid var(--accent);
          border-radius: var(--radius);
          padding: 22px;
        }
        .expert-quote {
          font-size: 15px;
          color: var(--text2);
          line-height: 1.7;
          font-style: italic;
        }
        .expert-author {
          margin-top: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .expert-dot { width: 36px; height: 3px; background: var(--accent); border-radius: 2px; }
        .expert-name {
          font-family: var(--font-h);
          font-weight: 800;
          font-size: 13px;
          color: var(--accent);
        }

        /* ── TESTIMONIALS ── */
        .t-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .t-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 16px;
          transition: border-color .2s, transform .2s;
        }
        .t-card:hover { border-color: rgba(245,168,0,0.25); transform: translateY(-2px); }
        .t-text { font-size: 12px; color: var(--text2); line-height: 1.6; }
        .t-author {
          margin-top: 10px;
          font-family: var(--font-h);
          font-weight: 800;
          font-size: 11px;
          color: var(--accent);
        }

        /* ── PRICING ── */
        .pricing-card {
          background: linear-gradient(160deg, #1c1a00, var(--card));
          border: 2px solid rgba(245,168,0,0.3);
          border-radius: 24px;
          padding: 28px 22px;
          box-shadow: 0 0 60px rgba(245,168,0,0.06);
        }
        .pricing-header { text-align: center; margin-bottom: 22px; }
        .pricing-old-price {
          font-family: var(--font-h);
          font-weight: 800;
          font-size: 20px;
          color: var(--text3);
          text-decoration: line-through;
        }
        .pricing-price {
          font-family: var(--font-h);
          font-weight: 900;
          font-size: 52px;
          color: var(--accent);
          line-height: 1;
          letter-spacing: -.03em;
        }
        .pricing-price-sub { font-size: 13px; color: var(--text2); margin-top: 4px; }
        .pricing-divider { height: 1px; background: var(--border); margin: 18px 0; }
        .pricing-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 9px 0;
        }
        .pricing-check {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: rgba(245,168,0,0.15);
          border: 1px solid rgba(245,168,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 10px;
          color: var(--accent);
        }
        .pricing-item-text { font-size: 14px; font-weight: 600; color: var(--text); }

        /* summary rows */
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: var(--text2);
          padding: 5px 0;
        }
        .summary-total {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-top: 10px;
          padding-top: 12px;
          border-top: 1px solid var(--border);
        }
        .summary-total-lbl {
          font-family: var(--font-h);
          font-weight: 900;
          font-size: 20px;
          color: var(--text);
        }
        .summary-total-val {
          font-family: var(--font-h);
          font-weight: 900;
          font-size: 26px;
          color: var(--accent);
        }

        /* ── FAQ ── */
        .faq-item {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          transition: border-color .2s;
        }
        .faq-item.open { border-color: rgba(245,168,0,0.3); }
        .faq-q {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 18px;
          cursor: pointer;
          user-select: none;
        }
        .faq-q-text {
          font-family: var(--font-h);
          font-weight: 700;
          font-size: 15px;
          color: var(--text);
        }
        .faq-icon {
          width: 24px; height: 24px;
          border-radius: 50%;
          background: rgba(245,168,0,0.1);
          border: 1px solid rgba(245,168,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 14px;
          color: var(--accent);
          transition: transform .2s;
        }
        .faq-item.open .faq-icon { transform: rotate(45deg); }
        .faq-a {
          font-size: 13px;
          color: var(--text2);
          line-height: 1.7;
          max-height: 0;
          overflow: hidden;
          padding: 0 18px;
          transition: max-height .3s ease, padding .3s ease;
        }
        .faq-item.open .faq-a {
          max-height: 200px;
          padding: 0 18px 18px;
        }

        /* ── FORM ── */
        .form-section {
          padding: 44px 20px;
          background: linear-gradient(180deg, var(--bg) 0%, #0f0d00 100%);
        }
        .form-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-h);
          font-weight: 800;
          font-size: 12px;
          letter-spacing: .07em;
          text-transform: uppercase;
          color: var(--accent);
          background: rgba(245,168,0,0.08);
          border: 1px solid rgba(245,168,0,0.2);
          border-radius: 50px;
          padding: 8px 16px;
          margin-bottom: 16px;
        }
        .form-title {
          font-family: var(--font-h);
          font-weight: 900;
          font-size: 36px;
          letter-spacing: -.03em;
          color: var(--text);
          margin-bottom: 6px;
        }
        .form-sub { font-size: 14px; color: var(--text2); margin-bottom: 24px; }

        .inp {
          width: 100%;
          background: var(--card);
          border: 1.5px solid var(--border);
          border-radius: var(--radius);
          padding: 16px 18px;
          font-family: var(--font-b);
          font-size: 15px;
          color: var(--text);
          transition: border-color .2s;
          outline: none;
        }
        .inp::placeholder { color: var(--text3); }
        .inp:focus { border-color: var(--accent); }

        .gift-label {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          background: var(--card);
          border: 1.5px solid var(--border);
          border-radius: var(--radius);
          padding: 16px;
          cursor: pointer;
          transition: border-color .2s, background .2s;
        }
        .gift-label.checked {
          border-color: rgba(245,168,0,0.4);
          background: rgba(245,168,0,0.05);
        }
        .gift-label input { accent-color: var(--accent); width: 18px; height: 18px; margin-top: 2px; }
        .gift-lbl-title { font-weight: 700; font-size: 15px; color: var(--text); }
        .gift-lbl-sub { font-size: 12px; color: var(--text2); margin-top: 2px; }

        .submit-btn {
          width: 100%;
          padding: 18px;
          font-family: var(--font-h);
          font-weight: 900;
          font-size: 20px;
          letter-spacing: .05em;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          color: #1a0d00;
          border: none;
          border-radius: var(--radius);
          cursor: pointer;
          transition: opacity .15s, transform .15s, box-shadow .15s;
          box-shadow: 0 8px 32px rgba(245,168,0,0.2);
        }
        .submit-btn:hover:not(:disabled) {
          opacity: .93;
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(245,168,0,0.3);
        }
        .submit-btn:disabled { opacity: .6; cursor: not-allowed; }

        /* ── SUCCESS ── */
        @keyframes scaleIn {
          from { transform: scale(.7); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        .success-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 48px 24px;
          animation: scaleIn .4s ease both;
        }
        .success-icon {
          width: 80px; height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(245,168,0,0.15), rgba(255,107,0,0.1));
          border: 2px solid rgba(245,168,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
        }
        .success-title {
          font-family: var(--font-h);
          font-weight: 900;
          font-size: 28px;
          color: var(--text);
          margin-top: 20px;
        }
        .success-sub { font-size: 15px; color: var(--text2); margin-top: 8px; line-height: 1.6; }

        /* ── REVEAL ── */
        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity .55s ease, transform .55s ease;
        }
        .reveal.revealed { opacity: 1; transform: translateY(0); }

        /* ── URGENCY ── */
        .urgency {
          background: linear-gradient(90deg, #1a0400, #100000);
          border-top: 1px solid rgba(255,70,70,0.15);
          border-bottom: 1px solid rgba(255,70,70,0.15);
          padding: 18px 24px;
          text-align: center;
        }
        .urgency-title {
          font-family: var(--font-h);
          font-weight: 900;
          font-size: 18px;
          color: #FF5252;
        }
        .urgency-sub { font-size: 13px; color: var(--text2); margin-top: 4px; }
      `}</style>

      <div className="wrap">

        {/* ── STICKY NAV ── */}
        <nav className={`nav${navSolid ? " solid" : ""}`}>
          <span className="nav-logo">MAKITA 4U1</span>
          <button className="nav-cta" onClick={scrollToOrder}>NARUČI →</button>
        </nav>

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-grid" />
          <div className="hero-radial" />
          <div className="hero-radial2" />

          <div style={{ position: "relative", zIndex: 2 }}>
            <div className="badge">
              <span className="badge-dot" />
              🔧 Profesionalni aku set · 4 alata
            </div>

            <h1 className="hero-h1">
              Makita<br />
              <span>4u1</span><br />
              Set
            </h1>

            <p className="hero-sub">
              Udarni odvijač · Brusilica · SDS Bušilica · Bušilica —
              sve u jednom tvrdom koferu s 4 baterije i brzim punjačem.
            </p>

            <div className="stats">
              <div className="stat">
                <div className="stat-num">4</div>
                <div className="stat-lbl">Alata</div>
              </div>
              <div className="stat">
                <div className="stat-num">3</div>
                <div className="stat-lbl">God. gar.</div>
              </div>
              <div className="stat">
                <div className="stat-num">4×</div>
                <div className="stat-lbl">Baterija</div>
              </div>
            </div>

            <div className="product-frame">
              <span className="product-tag">179,90 KM</span>
              <img src="https://i.imgur.com/zq6UeUi.jpeg" alt="Makita aku set 4u1" />
            </div>

            <div className="hero-prices">
              <div className="price-old">
                <div className="price-old-lbl">Vrijednost</div>
                <div className="price-old-num">300,00 KM</div>
              </div>
              <div className="price-new">
                <div className="price-new-lbl">Vaša cijena</div>
                <div className="price-new-num">179,90 KM</div>
                <div className="price-new-sub">+ 3 god. garancija</div>
              </div>
            </div>

            <button className="hero-cta" onClick={scrollToOrder}>
              NARUČI SET ODMAH →
            </button>
            <p style={{ textAlign: "center", fontSize: "12px", color: "var(--text3)", marginTop: "10px" }}>
              Plaćanje pouzećem · Dostava 2–4 radna dana
            </p>
          </div>
        </section>

        <div className="divider" />

        {/* ── ŠTA JE U SETU ── */}
        <section className="section reveal" style={{ background: "var(--bg2)" }}>
          <h2 className="section-title">📦 Šta je <span>u setu</span></h2>
          <div className="tools-grid">
            {tools.map((t) => (
              <div className="tool-card" key={t.name}>
                <div className="tool-icon">{t.icon}</div>
                <div className="tool-tag">{t.tag}</div>
                <div className="tool-name">{t.name}</div>
                <div className="tool-desc">{t.desc}</div>
              </div>
            ))}
          </div>
          <div className="extras">
            <div className="extras-title">+ Uključeno u set</div>
            {["4× baterija 128V Li-Ion", "Brzi punjač", "Tvrdi kofer za transport"].map((item) => (
              <div className="extra-row" key={item}>
                <div className="extra-dot" />
                <span className="extra-text">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* ── GARANCIJA ── */}
        <section className="warranty-section reveal">
          <div className="warranty-bg-num">3</div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="warranty-num">3</div>
            <div className="warranty-label">GODINE GARANCIJE</div>
            <p className="warranty-sub">
              Na sve alate u setu. Makita standard kvalitete — kupuješ bez rizika.
            </p>
            <div className="warranty-badge">🛡️ Zaštita kupca</div>
          </div>
        </section>

        <div className="divider" />

        {/* ── KAKO RADI ── */}
        <section className="section reveal" style={{ background: "var(--bg)" }}>
          <h2 className="section-title">⚡ Kako <span>naručiti</span></h2>
          <div className="steps">
            {steps.map((s) => (
              <div className="step" key={s.n}>
                <div className="step-num">{s.n}</div>
                <div>
                  <div className="step-title">{s.title}</div>
                  <div className="step-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* ── EXPERT ── */}
        <section className="section reveal" style={{ background: "var(--bg2)" }}>
          <h2 className="section-title">👷 Mišljenje <span>majstora</span></h2>
          <div className="expert-card">
            <p className="expert-quote">
              "Aku alati su budućnost svake radionice. Makita baterije su pouzdane, a kada u jednom koferu dobiješ četiri alata — to je prava ušteda i sloboda rada. Preporučujem svakom ko ozbiljno radi."
            </p>
            <div className="expert-author">
              <div className="expert-dot" />
              <span className="expert-name">Haris Begić, majstor opće gradnje</span>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── TESTIMONIALS ── */}
        <section className="section reveal" style={{ background: "var(--bg)" }}>
          <h2 className="section-title">💬 Kupci <span>kažu</span></h2>
          <div className="t-grid">
            {testimonials.map((t, i) => (
              <div className="t-card" key={i}>
                <p className="t-text">"{t.text}"</p>
                <div className="t-author">{t.author} · {t.city}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* ── PRICING ── */}
        <section className="section reveal" style={{ background: "var(--bg2)" }}>
          <h2 className="section-title">💰 Cijena <span>seta</span></h2>
          <div className="pricing-card">
            <div className="pricing-header">
              <div className="pricing-old-price">300,00 KM</div>
              <div className="pricing-price">179,90</div>
              <div className="pricing-price-sub">KM · Plaćanje pouzećem</div>
            </div>
            <div className="pricing-divider" />
            {included.map((item) => (
              <div className="pricing-item" key={item}>
                <div className="pricing-check">✓</div>
                <span className="pricing-item-text">{item}</span>
              </div>
            ))}
            <div className="pricing-divider" />
            <div className="summary-row"><span>Cijena seta</span><span>179,90 KM</span></div>
            <div className="summary-row"><span>Dostava</span><span>10,00 KM</span></div>
            <div className="summary-total">
              <span className="summary-total-lbl">UKUPNO</span>
              <span className="summary-total-val">189,90 KM</span>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── URGENCY ── */}
        <div className="urgency reveal">
          <div className="urgency-title">⏳ Ograničene zalihe</div>
          <div className="urgency-sub">179,90 KM za kompletan set je trenutna akcijska cijena.</div>
        </div>

        <div className="divider" />

        {/* ── FAQ ── */}
        <section className="section reveal" style={{ background: "var(--bg)" }}>
          <h2 className="section-title">❓ Česta <span>pitanja</span></h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {faqs.map((item, i) => (
              <div className={`faq-item${openFaq === i ? " open" : ""}`} key={i}>
                <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="faq-q-text">{item.q}</span>
                  <div className="faq-icon">+</div>
                </div>
                <div className="faq-a">{item.a}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* ── ORDER FORM ── */}
        <section ref={orderRef} className="form-section">
          {success ? (
            <div className="success-wrap">
              <div className="success-icon">✅</div>
              <div className="success-title">Narudžba primljena!</div>
              <p className="success-sub">
                Hvala! Naš tim će te uskoro kontaktirati radi potvrde. Dostava 2–4 radna dana, plaćanje pouzećem.
              </p>
            </div>
          ) : (
            <>
              <div className="form-badge">🔧 Makita aku set 4u1</div>
              <h2 className="form-title">Naruči odmah</h2>
              <p className="form-sub">Plaćanje pouzećem · Bez registracije</p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <input className="inp" name="ime"       autoComplete="off" placeholder="Ime i prezime" />
                <input className="inp" name="telefon"   autoComplete="off" placeholder="Broj telefona" />
                <input className="inp" name="adresa"    autoComplete="off" placeholder="Adresa i mjesto" />
                <input className="inp" name="postanski" autoComplete="off" placeholder="Poštanski broj" />

                <label className={`gift-label${giftPack ? " checked" : ""}`}>
                  <input
                    type="checkbox"
                    checked={giftPack}
                    onChange={(e) => setGiftPack(e.target.checked)}
                  />
                  <div>
                    <div className="gift-lbl-title">Poklon pakovanje</div>
                    <div className="gift-lbl-sub">+ 5,00 KM</div>
                  </div>
                </label>

                <div style={{
                  background: "var(--card)",
                  border: "1.5px solid rgba(245,168,0,0.3)",
                  borderRadius: "var(--radius)",
                  padding: "18px",
                }}>
                  <div className="summary-row"><span>Makita aku set 4u1</span><span>179,90 KM</span></div>
                  <div className="summary-row"><span>Dostava</span><span>10,00 KM</span></div>
                  {giftPack && (
                    <div className="summary-row" style={{ color: "var(--accent)" }}>
                      <span>Poklon pakovanje</span><span>5,00 KM</span>
                    </div>
                  )}
                  <div className="summary-total">
                    <span className="summary-total-lbl">UKUPNO</span>
                    <span className="summary-total-val">{total.toFixed(2)} KM</span>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? "ŠALJE SE..." : "NARUČI ODMAH →"}
                </button>
                <p style={{ textAlign: "center", fontSize: "12px", color: "var(--text3)" }}>
                  Plaćanje tek pri preuzimanju paketa
                </p>
              </form>
            </>
          )}
        </section>

      </div>
    </>
  );
}