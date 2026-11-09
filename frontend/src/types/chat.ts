
/**
 * Chat UI message types
 */

export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  readonly id: string
  readonly role: ChatRole
  readonly content: string
  readonly createdAt: string
}

/**
 * Request sent from React to Express
 */

export interface ChatApiRequest {
  readonly message: string
  readonly conversationId?: string
}

/**
 * Successful response returned by Express
 */

export interface ChatApiResponse {
  readonly reply: string
  readonly conversationId: string
}

/**
 * Error response returned by Express
 */

export interface ChatApiError {
  readonly error: {
    readonly code: string
    readonly message: string
  }
}
