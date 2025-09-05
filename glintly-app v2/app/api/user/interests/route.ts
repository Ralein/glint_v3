import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, interests } = body

    // In a real app, you would save to database here
    console.log("Saving user interests:", { userId, interests })

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    return NextResponse.json({
      success: true,
      message: "Interests saved successfully",
      data: { userId, interests },
    })
  } catch (error) {
    console.error("Save interests error:", error)
    return NextResponse.json({ success: false, message: "Failed to save interests" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    // In a real app, you would fetch from database here
    const mockInterests = ["tech", "learning", "wellness"]

    return NextResponse.json({
      success: true,
      data: { userId, interests: mockInterests },
    })
  } catch (error) {
    console.error("Get interests error:", error)
    return NextResponse.json({ success: false, message: "Failed to get interests" }, { status: 500 })
  }
}
