"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
// import { useTonConnect } from "./use-ton-connect" // No longer needed for demo connect
// import { connectWallet as tonConnectWallet } from "@/lib/ton-connect" // No longer needed for demo connect

export function useWallet() {
  const router = useRouter()
  const pathname = usePathname()
  // const { connector } = useTonConnect() // No longer needed for demo connect

  const [wallet, setWallet] = useState({
    isConnected: false,
    isConnecting: false,
    address: null as string | null,
    balance: 0,
    isViewOnly: false,
  })

  /* ---- Demo SDK status listener (simplified) ---- */
  useEffect(() => {
    // In a real app, this would listen to TonConnectUI's onStatusChange
    // For demo, we just check if a demo wallet is "connected"
    if (wallet.isConnected && !wallet.isViewOnly && pathname === "/connect-wallet") {
      router.push("/")
    }
  }, [wallet.isConnected, wallet.isViewOnly, router, pathname])

  /* ---- connect via Demo Wallet ---- */
  const connect = useCallback(async () => {
    setWallet((w) => ({ ...w, isConnecting: true }))

    // Simulate a connection delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate a successful connection with a dummy address
    const demoAddress = "EQD_DEMO_WALLET_ADDRESS_1234567890ABCDEF"
    setWallet({
      isConnected: true,
      isConnecting: false,
      address: demoAddress,
      balance: 100, // Demo balance
      isViewOnly: false,
    })

    // Immediately redirect to the main app page
    router.push("/") // This line performs the redirect
  }, [router])

  /* ---- disconnect ---- */
  const disconnect = useCallback(async () => {
    // In a real app, this would call connector.disconnect()
    setWallet({
      isConnected: false,
      isConnecting: false,
      address: null,
      balance: 0,
      isViewOnly: false,
    })
  }, []) // No dependency on connector as it's not used for demo

  /* ---- view-only helper ---- */
  const connectViewOnly = (addr: string) => {
    setWallet({
      isConnected: true,
      isConnecting: false,
      address: addr,
      balance: 0,
      isViewOnly: true,
    })
    router.push("/")
  }

  return { wallet, connect, disconnect, connectViewOnly }
}
