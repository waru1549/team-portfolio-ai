
import type {
  ChatApiRequest,
  ChatApiResponse,
} from '../types/chat'

/**
 * API Configuration
 */

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL?.trim() ?? ''
).replace(/\/+$/, '')

const CHAT_ENDPOINT = `${API_BASE_URL}/api/chat`

/**
 * Maximum request duration: 30 seconds
 */

const REQUEST_TIMEOUT_MS = 30_000

/**
 * Custom API Error
 */

export class ChatApiException extends Error {
  readonly status: number
  readonly code: string

  constructor(
    message: string,
    status: number,
    code: string,
  ) {
    super(message)

    this.name = 'ChatApiException'
    this.status = status
    this.code = code
  }
}

/**
 * Safely identify a JSON object.
 */

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

/**
 * Validate outgoing chat requests.
 */

function validateRequest(payload: ChatApiRequest): void {
  if (
    typeof payload.message !== 'string' ||
    !payload.message.trim()
  ) {
    throw new ChatApiException(
      'Message is required.',
      0,
      'INVALID_MESSAGE',
    )
  }

  if (payload.message.length > 2000) {
    throw new ChatApiException(
      'Message cannot exceed 2000 characters.',
      0,
      'MESSAGE_TOO_LONG',
    )
  }

  if (
    payload.conversationId !== undefined &&
    (
      typeof payload.conversationId !== 'string' ||
      !payload.conversationId.trim()
    )
  ) {
    throw new ChatApiException(
      'Invalid conversation ID.',
      0,
      'INVALID_CONVERSATION_ID',
    )
  }
}

/**
 * Convert Backend Error Response.
 */

function createApiError(
  payload: unknown,
  status: number,
): ChatApiException {
  const apiError =
    isRecord(payload) && isRecord(payload.error)
      ? payload.error
      : null

  const code =
    apiError && typeof apiError.code === 'string'
      ? apiError.code
      : `HTTP_${status}`

  const message =
    apiError && typeof apiError.message === 'string'
      ? apiError.message
      : `Request failed with status ${status}.`

  return new ChatApiException(
    message,
    status,
    code,
  )
}

/**
 * Send chat request to Express Backend.
 */

export async function sendChatMessage(
  payload: ChatApiRequest,
): Promise<ChatApiResponse> {

  // Step 1: Validate Request

  validateRequest(payload)

  // Step 2: Create Timeout Controller

  const controller = new AbortController()

  const timeoutId = setTimeout(() => {
    controller.abort()
  }, REQUEST_TIMEOUT_MS)

  try {

    // Step 3: Send HTTP Request

    let response: Response

    try {
      response = await fetch(CHAT_ENDPOINT, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },

        body: JSON.stringify(payload),

        signal: controller.signal,
      })

    } catch {
      if (controller.signal.aborted) {
        throw new ChatApiException(
          'The request timed out. Please try again.',
          0,
          'TIMEOUT_ERROR',
        )
      }

      throw new ChatApiException(
        'Unable to connect to the chat server. Please check that the backend is running.',
        0,
        'NETWORK_ERROR',
      )
    }

    // Step 4: Parse JSON Response

    let responseBody: unknown = null

    try {
      responseBody = await response.json()

    } catch {
      if (controller.signal.aborted) {
        throw new ChatApiException(
          'The request timed out. Please try again.',
          0,
          'TIMEOUT_ERROR',
        )
      }

      if (response.ok) {
        throw new ChatApiException(
          'The server returned an invalid JSON response.',
          response.status,
          'INVALID_JSON',
        )
      }
    }

    // Step 5: Handle HTTP Errors

    if (!response.ok) {
      throw createApiError(
        responseBody,
        response.status,
      )
    }

    // Step 6: Validate Response Structure

    if (
      !isRecord(responseBody) ||
      typeof responseBody.reply !== 'string' ||
      !responseBody.reply.trim() ||
      typeof responseBody.conversationId !== 'string' ||
      !responseBody.conversationId.trim()
    ) {
      throw new ChatApiException(
        'The server returned an invalid chat response.',
        response.status,
        'INVALID_RESPONSE',
      )
    }

    // Step 7: Return Typed Response

    return {
      reply: responseBody.reply,
      conversationId: responseBody.conversationId,
    }

  } finally {

    // Always clear the timeout

    clearTimeout(timeoutId)

  }
}
