import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    // Remove subscription from your database
    console.log("Removing push subscription for user:", userId)

    // In a real app, you would:
    // 1. Validate the userId
    // 2. Remove the subscription from your database

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unsubscription error:", error)
    return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 })
  }
}
