
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { sendChatMessage } from './chatApi'

// =========================================
// TEST DATA
// =========================================

const validRequest = {
  message: 'Who are the team members?',
}

const validResponse = {
  reply: 'Our team consists of three members.',
  conversationId: 'test-conversation-001',
}

// =========================================
// TEST HELPERS
// =========================================

function jsonResponse(
  body: unknown,
  status = 200,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

const getFetchMock = () => vi.mocked(globalThis.fetch)

// =========================================
// TEST SETUP
// =========================================

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn<typeof fetch>())
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

// =========================================
// CHAT API TESTS
// =========================================

describe('sendChatMessage', () => {

  // TEST 1: SUCCESS RESPONSE

  it('should send a message and return a valid response', async () => {
    getFetchMock().mockResolvedValue(
      jsonResponse(validResponse),
    )

    const result = await sendChatMessage(validRequest)

    expect(result).toEqual(validResponse)

    expect(getFetchMock()).toHaveBeenCalledWith(
      '/api/chat',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(validRequest),
      }),
    )
  })

  // TEST 2: EMPTY MESSAGE

  it('should reject an empty message', async () => {
    await expect(
      sendChatMessage({
        message: '   ',
      }),
    ).rejects.toMatchObject({
      name: 'ChatApiException',
      code: 'INVALID_MESSAGE',
    })

    expect(getFetchMock()).not.toHaveBeenCalled()
  })

  // TEST 3: MESSAGE TOO LONG

  it('should reject messages longer than 2000 characters', async () => {
    await expect(
      sendChatMessage({
        message: 'A'.repeat(2001),
      }),
    ).rejects.toMatchObject({
      code: 'MESSAGE_TOO_LONG',
    })

    expect(getFetchMock()).not.toHaveBeenCalled()
  })

  // TEST 4: INVALID CONVERSATION ID

  it('should reject an empty conversation ID', async () => {
    await expect(
      sendChatMessage({
        message: 'Hello',
        conversationId: '   ',
      }),
    ).rejects.toMatchObject({
      code: 'INVALID_CONVERSATION_ID',
    })

    expect(getFetchMock()).not.toHaveBeenCalled()
  })

  // TEST 5: HTTP ERROR

  it('should handle HTTP error responses', async () => {
    getFetchMock().mockResolvedValue(
      jsonResponse(
        {
          error: {
            code: 'INVALID_MESSAGE',
            message: 'Message is required.',
          },
        },
        400,
      ),
    )

    await expect(
      sendChatMessage(validRequest),
    ).rejects.toMatchObject({
      name: 'ChatApiException',
      status: 400,
      code: 'INVALID_MESSAGE',
      message: 'Message is required.',
    })
  })

  // TEST 6: INVALID JSON

  it('should reject an invalid JSON response', async () => {
    getFetchMock().mockResolvedValue(
      new Response('Not valid JSON', {
        status: 200,
      }),
    )

    await expect(
      sendChatMessage(validRequest),
    ).rejects.toMatchObject({
      code: 'INVALID_JSON',
      status: 200,
    })
  })

  // TEST 7: INVALID RESPONSE STRUCTURE

  it('should reject an incomplete successful response', async () => {
    getFetchMock().mockResolvedValue(
      jsonResponse({
        reply: 'Hello!',
      }),
    )

    await expect(
      sendChatMessage(validRequest),
    ).rejects.toMatchObject({
      code: 'INVALID_RESPONSE',
    })
  })

  // TEST 8: NETWORK ERROR

  it('should handle network connection failures', async () => {
    getFetchMock().mockRejectedValue(
      new TypeError('Failed to fetch'),
    )

    await expect(
      sendChatMessage(validRequest),
    ).rejects.toMatchObject({
      name: 'ChatApiException',
      status: 0,
      code: 'NETWORK_ERROR',
    })
  })


  // TEST 9: TIMEOUT

  it('should abort requests after 30 seconds', async () => {

    vi.useFakeTimers()

    getFetchMock().mockImplementation(
      (_input, init) =>
        new Promise<Response>((_resolve, reject) => {

          const signal = init?.signal

          if (!signal) {
            reject(new Error('AbortSignal was not provided.'))
            return
          }

          signal.addEventListener(
            'abort',
            () => reject(new Error('Request aborted.')),
            { once: true },
          )
        }),
    )

    // Start the request
    const request = sendChatMessage(validRequest)

    // Attach the rejection handler BEFORE advancing timers
    const rejectionAssertion = expect(request).rejects.toMatchObject({
      name: 'ChatApiException',
      status: 0,
      code: 'TIMEOUT_ERROR',
    })

    // Simulate 30 seconds passing
    await vi.advanceTimersByTimeAsync(30_000)

    // Verify timeout error
    await rejectionAssertion
  })

})
