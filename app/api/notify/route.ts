import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { product_name, full_name, phone, address_place, total } = await req.json();

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json({ error: "Telegram nije konfigurisan." }, { status: 500 });
    }

    const text =
      `🛒 NOVA NARUDŽBA!\n\n` +
      `📦 Proizvod: ${product_name}\n` +
      `👤 Ime: ${full_name}\n` +
      `📞 Telefon: ${phone}\n` +
      `📍 Adresa: ${address_place}\n` +
      `💰 Ukupno: ${total} KM`;

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json({ error: "Greška pri slanju Telegram notifikacije.", details: errorData }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Greška pri obradi zahtjeva." }, { status: 500 });
  }
}
