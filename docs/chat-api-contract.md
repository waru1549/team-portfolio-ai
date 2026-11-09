
# Chat API Contract

## 1. Endpoint

POST /api/chat

Local URL:
http://localhost:3000/api/chat

## 2. Request Headers

Content-Type: application/json

## 3. Request Body

First message:

{
  "message": "Who are the team members?"
}

Follow-up message:

{
  "message": "What are their technical skills?",
  "conversationId": "uuid-from-previous-response"
}

Fields:

| Field | Type | Required |
|---|---|---|
| message | string | Yes |
| conversationId | string | No |

## 4. Success Response

HTTP 200 OK

{
  "reply": "Our team consists of three members...",
  "conversationId": "uuid-generated-by-backend"
}

Fields:

| Field | Type | Description |
|---|---|---|
| reply | string | AI response |
| conversationId | string | Conversation identifier |

## 5. Error Response

HTTP 400 Bad Request

{
  "error": {
    "code": "INVALID_MESSAGE",
    "message": "Message is required."
  }
}

HTTP 500 Internal Server Error

{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred."
  }
}

## 6. Backend Responsibilities

1. Validate incoming messages.
2. Create or retrieve conversations.
3. Load relevant team portfolio context.
4. Send the user's question and context to the AI service.
5. Save user messages and AI responses in PostgreSQL.
6. Return reply and conversationId.
7. Handle errors without exposing secret API keys.

## 7. Frontend Responsibilities

1. Send requests using Fetch API.
2. Maintain conversationId between messages.
3. Display user and assistant messages.
4. Display loading and error states.
5. Handle network and server errors.
