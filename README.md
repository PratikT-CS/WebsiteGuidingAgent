## Website Guiding Agent 

This repository provides a sample end-to-end setup for a Website Guiding Agent, including a demo frontend, serverless backend, and a simple Python-based agent.

![Architecture](Website%20Guiding%20Agent%20Architecture.jpeg)

### Demo Video

🎥 **[Watch the Demo Video](https://youtu.be/r3QbNNmpWmY)** - See the Website Guiding Agent in action with real-time user interactions and tool execution.

### Repository Structure

- `sample_frontend/`: React + Vite sample site demonstrating integration with the agent via HTTP and WebSocket.
- `serverless-backend/`: AWS serverless components.
  - `lambda_for_agent_invocation_api/`: Handles HTTPS requests to invoke the agent.
  - `lambda_for_websocket_api/`: Manages WebSocket connect/disconnect lifecycle.
- `WebsiteGuidingAgent/`: Python agent entry point and dependencies.
- `Website Guiding Agent Architecture.jpeg`: High-level system diagram.

Refer to subproject READMEs for details:

- Frontend: `sample_frontend/README.md`
- Backend: `serverless-backend/README.md`
- Agent: `WebsiteGuidingAgent/README.md`

### How It Works

- Frontend sends user intents via HTTPS to the Agent API and opens a WebSocket to receive streaming guidance.
- Serverless backend (API Gateway + Lambda) forwards HTTP requests to the agent and manages WebSocket connections.
- Agent processes inputs and streams responses/events over the WebSocket channel.
- Client-side tools (safe, browser-only actions) are executed in the frontend, while privileged server-side tools run in the backend. The WebSocket bridges agent decisions and tool outputs back to the client in real time.

### Client-Side Tools vs Server-Side Tools

The Website Guiding Agent architecture distinguishes between two types of tools based on their execution environment and security requirements:

#### Client-Side Tools

**Definition**: Tools that execute directly in the user's browser without requiring server access or sensitive permissions.

**Characteristics**:

- Run in the frontend (React application)
- Safe, browser-scoped actions only
- No access to server resources or secrets
- Examples: UI guidance, DOM interactions, local storage reads, form validation, navigation assistance

**Execution Flow**:

1. Agent sends tool request over WebSocket
2. Frontend receives and executes the tool
3. Results are sent back to agent via WebSocket
4. Agent processes results and continues workflow

#### Server-Side Tools

**Definition**: Tools that require server access, API keys, database connections, or other privileged operations that cannot be safely executed in the browser.

**Characteristics**:

- Execute within backend Lambda functions
- Access to server resources and secrets
- Can perform data operations, API calls, file processing
- Examples: Database queries, third-party API calls, file uploads, email sending, payment processing

**Execution Flow**:

1. Agent identifies need for server-side tool
2. Tool request sent to backend Lambda
3. Lambda executes tool with appropriate permissions
4. Results streamed back to agent
5. Agent processes results and sends guidance to client

#### WebSocket Bridge

The WebSocket connection serves as the communication bridge between client and server tools:

- Agent streams tool prompts, intermediate statuses, and final results to the client
- Client receives events and performs client-side tool actions when requested
- Real-time coordination between client and server tool execution

#### Typical Message Flow

1. User action → HTTPS request to Agent API
2. Agent plans tools; runs server-side tools and emits steps/results over WebSocket
3. Client receives events → performs client-side tool actions if requested → updates UI
4. Final guidance/result is shown to the user

### Environment Variables

Two key endpoints are required across environments:

- `AGENT_API_URL`: HTTPS base URL for invoking the agent.
- `WS_URL`: WebSocket URL (`wss://...`) for real-time events.

Frontend (Vite) must use `VITE_` prefixed variables to expose them at build time. Example `.env` inside `sample_frontend/`:

```env
AGENT_API_URL=https://your-agent-api.example.com/prod
WS_URL=wss://your-websocket.example.com/production

VITE_AGENT_API_URL=${AGENT_API_URL}
VITE_WS_URL=${WS_URL}
```

Access in React via `import.meta.env.VITE_AGENT_API_URL` and `import.meta.env.VITE_WS_URL`.

Backend environment variables and IAM requirements are covered in `serverless-backend/README.md`.

### Quickstart

#### Frontend

1. `cd sample_frontend`
2. `npm install`
3. Create `.env` as above.
4. `npm run dev` (local), `npm run build` (prod build), `npm run preview` (serve build).

For S3/CloudFront deployment, see `sample_frontend/README.md`.

#### Backend

- Provision API Gateway (HTTP) → integrate with `lambda_for_agent_invocation_api`.
- Provision API Gateway (WebSocket) → integrate with `lambda_for_websocket_api` for connect/disconnect and messaging.
- Grant Lambdas permission to post to connected WebSocket clients (API Gateway Management API).
- Feed resulting URLs to the frontend via `.env`.

See `serverless-backend/README.md` for IAM, deployment, and configuration steps.

#### Agent (Python)

```bash
cd WebsiteGuidingAgent
python -m venv .venv
# Windows PowerShell
. .venv\Scripts\Activate.ps1
pip install -r requirements.txt
python WebsiteGuidingAgent.py
```

Customize the agent logic and integrate tools/data sources as needed.

### Deployment Overview

- Frontend: Upload `sample_frontend/dist/` to S3 and serve via CloudFront. Configure SPA fallback to `index.html` and invalidate cache after deploys.
- Backend: Deploy Lambdas and API Gateway (HTTP + WebSocket). Ensure correct IAM for WebSocket message posting.
- Agent: Package dependencies for Lambda or host separately depending on architecture.

### Notes

- This is a sample for demos/learning; hardening and security reviews are recommended for production.
- Keep environment variables consistent across environments; Vite variables are resolved at build time.
