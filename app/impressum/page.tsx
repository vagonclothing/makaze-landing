"use client";

export default function Impressum() {
  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 680, margin: "0 auto", padding: "40px 20px", color: "#1a1a1a", lineHeight: 1.7 }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Impressum</h1>
      <p style={{ color: "#888", fontSize: 14, marginBottom: 32 }}>Informacije o prodavnici</p>

      <h2 style={{ fontSize: 18, fontWeight: 800, marginTop: 28, marginBottom: 8 }}>O nama</h2>
      <p>TV-SHOP je online prodavnica specijalizovana za prodaju alata, kućanskih aparata i praktičnih proizvoda za dom i dvorište. Nudimo kvalitetne proizvode uz dostavu na kućnu adresu širom Bosne i Hercegovine.</p>

      <h2 style={{ fontSize: 18, fontWeight: 800, marginTop: 28, marginBottom: 8 }}>Kontakt informacije</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
        <tbody>
          {[
            ["Naziv", "TV-SHOP"],
            ["Web", "tvshopbh.com"],
            ["Email", "echo.drift89@gmail.com"],
            ["Telefon", "+387 61 000 000"],
            ["Radno vrijeme", "Pon–Pet: 09:00–21:00 | Sub: 10:00–18:00"],
          ].map(([label, value]) => (
            <tr key={label} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "12px 0", fontWeight: 700, width: 160, color: "#555" }}>{label}</td>
              <td style={{ padding: "12px 0" }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontSize: 18, fontWeight: 800, marginTop: 28, marginBottom: 8 }}>Dostava</h2>
      <p>Dostava se vrši pouzećem — plaćanje gotovinom pri preuzimanju paketa. Dostava traje 2–4 radna dana na cijelom području Bosne i Hercegovine.</p>

      <h2 style={{ fontSize: 18, fontWeight: 800, marginTop: 28, marginBottom: 8 }}>Reklamacije</h2>
      <p>U slučaju reklamacije ili povrata, kontaktirajte nas putem emaila ili telefona. Svaki zahtjev rješavamo u roku od 48 sati.</p>
    </div>
  );
}