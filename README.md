## Website Guiding Agent (Monorepo)

This repository provides a sample end-to-end setup for a Website Guiding Agent, including a demo frontend, serverless backend, and a simple Python-based agent.

![Architecture](Website%20Guiding%20Agent%20Architecture.jpeg)

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

### Client-Side Tool Execution and Server Tool Bridge

- Client-side tool execution: The frontend can run safe, browser-scoped actions (e.g., UI guidance, DOM interactions, local storage reads) without backend access. These are triggered by agent messages delivered over WebSocket.
- Server-side tools: Data access, third-party APIs, or actions requiring secrets/permissions execute within backend Lambdas under the agent's control.
- WebSocket bridge: The agent streams tool prompts, intermediate statuses, and final results to the client over the WebSocket. The client renders guidance and may trigger additional client-side tools accordingly.
- Message flow (typical):
  1. User action → HTTPS request to Agent API.
  2. Agent plans tools; runs server tools and emits steps/results over WebSocket.
  3. Client receives events → performs client-side tool actions if requested → updates UI.
  4. Final guidance/result is shown to the user.

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
