import { type NextRequest, NextResponse } from "next/server"
import { telegramBot } from "@/lib/telegram-bot"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Handle different types of updates
    if (body.message) {
      await handleMessage(body.message)
    } else if (body.callback_query) {
      await handleCallbackQuery(body.callback_query)
    } else if (body.inline_query) {
      await handleInlineQuery(body.inline_query)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function handleMessage(message: any) {
  const chatId = message.chat.id.toString()
  const text = message.text

  if (text === "/start") {
    await telegramBot.sendMessage(
      chatId,
      "🚀 Welcome to <b>TONnectA</b>!\n\n" +
        "🌐 Your decentralized social platform powered by TON blockchain\n\n" +
        "✨ Features:\n" +
        "• 🔐 Anonymous wallet login\n" +
        "• 💬 Encrypted messaging\n" +
        "• 🎨 NFT profiles\n" +
        "• 🏛️ DAO group chats\n" +
        "• ♿ Full accessibility support\n\n" +
        "Click the button below to open the app!",
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🚀 Open TONnectA",
                web_app: {
                  url: process.env.NEXT_PUBLIC_APP_URL || "https://your-app-domain.com",
                },
              },
            ],
          ],
        },
      },
    )

    // Set menu button for easy access
    await telegramBot.setMenuButton(chatId)
  } else if (text === "/help") {
    await telegramBot.sendMessage(
      chatId,
      "🆘 <b>TONnectA Help</b>\n\n" +
        "📱 <b>Commands:</b>\n" +
        "/start - Welcome message\n" +
        "/help - Show this help\n" +
        "/app - Open TONnectA\n\n" +
        "🔧 <b>Features:</b>\n" +
        "• Connect your TON wallet\n" +
        "• Post to decentralized feed\n" +
        "• Send encrypted messages\n" +
        "• Join DAO communities\n" +
        "• Mint NFT profiles\n\n" +
        "♿ <b>Accessibility:</b>\n" +
        "Full support for screen readers and voice commands",
    )
  } else if (text === "/app") {
    await telegramBot.sendMessage(chatId, "🚀 Click to open TONnectA:", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🌐 Open App",
              web_app: {
                url: process.env.NEXT_PUBLIC_APP_URL || "https://your-app-domain.com",
              },
            },
          ],
        ],
      },
    })
  }
}

async function handleCallbackQuery(callbackQuery: any) {
  const callbackQueryId = callbackQuery.id
  await telegramBot.answerCallbackQuery(callbackQueryId, "Opening TONnectA...")
}

async function handleInlineQuery(inlineQuery: any) {
  // Handle inline queries if needed
  console.log("Inline query received:", inlineQuery)
}
