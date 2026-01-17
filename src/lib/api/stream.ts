// ===========================================
// Streaming API Client
// ===========================================

interface StreamResponse {
  url: string
  isPreview: boolean
  previewDuration?: number
  expiresAt: number
}

/**
 * Get signed streaming URL for a song
 * - Premium users get full access
 * - Free users get 30-second preview
 */
export async function getStreamUrl(
  songId: string,
  userId?: string | null
): Promise<StreamResponse> {
  const response = await fetch("/api/songs/stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ songId, userId }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to get stream URL")
  }

  return response.json()
}

/**
 * Check if user has premium access
 */
export function isPremiumUser(subscriptionStatus?: string | null): boolean {
  return subscriptionStatus === "active" || subscriptionStatus === "trialing"
}
