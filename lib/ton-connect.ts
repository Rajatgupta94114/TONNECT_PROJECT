import { TonConnectUI } from "@tonconnect/ui-react"

/* ---------- singleton ----------- */
export const tonConnect = new TonConnectUI({
  manifestUrl:
    process.env.NEXT_PUBLIC_TON_CONNECT_MANIFEST_URL ||
    (typeof window !== "undefined" ? `${window.location.origin}/tonconnect-manifest.json` : undefined),
  actionsConfiguration: { modals: ["none"] },
})

/* ---------- helpers ------------- */

/** Quick url-pattern: starts with http/https/ton */
const isUrl = (str: string) => /^(https?:\/\/|ton:\/\/)/i.test(str)

/**
 * Ask the SDK for a universal-link.
 * Returns  ➜  string (real link)  |  null  (already connected / cancelled)
 */
export const connectWallet = async (): Promise<string | null> => {
  try {
    const res = await tonConnect.connector.connect({ universalLink: true })

    if (typeof res === "string" && isUrl(res)) {
      return res // valid link → caller will display QR / deep-link
    }
    // res is "true" or empty ⇒ nothing to do
    return null
  } catch (err: any) {
    if (typeof err?.message === "string" && err.message.includes("Wallet was not connected")) {
      return null // user closed selector
    }
    throw err
  }
}

export const disconnectWallet = () => tonConnect.disconnect()
export const onStatusChange = tonConnect.onStatusChange.bind(tonConnect)
export const isWalletConnected = () => Boolean(tonConnect.wallet)
export const getWalletInfo = () => tonConnect.wallet
