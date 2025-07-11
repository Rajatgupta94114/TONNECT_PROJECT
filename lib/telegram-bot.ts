interface TelegramBotConfig {
  botToken: string
  webhookUrl: string
}

export class TelegramBot {
  private botToken: string
  private apiUrl: string

  constructor(config: TelegramBotConfig) {
    this.botToken = config.botToken
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}`
  }

  async setWebhook(webhookUrl: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/setWebhook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ["message", "callback_query", "inline_query"],
        }),
      })

      const result = await response.json()
      return result.ok
    } catch (error) {
      console.error("Failed to set webhook:", error)
      return false
    }
  }

  async sendMessage(chatId: string, text: string, options?: any): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          ...options,
        }),
      })

      const result = await response.json()
      return result.ok
    } catch (error) {
      console.error("Failed to send message:", error)
      return false
    }
  }

  async setMenuButton(chatId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/setChatMenuButton`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          menu_button: {
            type: "web_app",
            text: "Open TONnectA",
            web_app: {
              url: process.env.NEXT_PUBLIC_APP_URL || "https://your-app-domain.com",
            },
          },
        }),
      })

      const result = await response.json()
      return result.ok
    } catch (error) {
      console.error("Failed to set menu button:", error)
      return false
    }
  }

  async answerCallbackQuery(callbackQueryId: string, text?: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/answerCallbackQuery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          callback_query_id: callbackQueryId,
          text,
          show_alert: false,
        }),
      })

      const result = await response.json()
      return result.ok
    } catch (error) {
      console.error("Failed to answer callback query:", error)
      return false
    }
  }
}

// Initialize bot instance
export const telegramBot = new TelegramBot({
  botToken: process.env.TELEGRAM_BOT_TOKEN || "",
  webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/telegram/webhook`,
})
