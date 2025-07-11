"use client"

import { useCallback } from "react"
import {
  tonConnect,
  connectWallet as sdkConnectWallet, // This now triggers the new page opening
  disconnectWallet as sdkDisconnectWallet,
} from "@/lib/ton-connect"

/**
 * Simple React hook that exposes the singleton Ton Connect UI instance
 * plus convenient `connect` / `disconnect` wrappers suitable for client
 * components.
 */
export function useTonConnect() {
  /**
   * Opens the Ton Connect wallet-selector modal.
   * Returns the connected wallet info or `null` if the user closes
   * the modal without selecting a wallet.
   */
  const connect = useCallback(async () => {
    try {
      // This call will now open a new page/tab for wallet connection
      await sdkConnectWallet()
      // We don't return the wallet info here, as the connection happens
      // asynchronously in the new tab and is picked up by onStatusChange.
      return null
    } catch (err) {
      // Bubble up all errors except user-cancel.
      throw err
    }
  }, [])

  /** Disconnect the currently connected wallet. */
  const disconnect = useCallback(async () => {
    await sdkDisconnectWallet()
  }, [])

  return {
    connector: tonConnect, // expose full TonConnectUI instance
    connect,
    disconnect,
  }
}
