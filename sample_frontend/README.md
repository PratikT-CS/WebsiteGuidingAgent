# Sample Frontend (React + Vite)

This is a sample website used to demonstrate the Website Guiding Agent functionality. It is built with React and Vite and intended as a lightweight showcase that you can run locally or deploy to static hosting (Amazon S3 + CloudFront).

## Features

- Minimal React app scaffolded with Vite
- Pages and a simple navigation to showcase agent-driven guidance
- Ready to connect to an Agent API and WebSocket backend via environment variables

## Prerequisites

- Node.js 18+ and npm

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables (see Environment Variables below).

3. Run the app locally with hot reload:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

5. Preview the production build locally:

```bash
npm run preview
```

The production build output is written to the `dist/` directory.

## Environment Variables

This sample expects two values for connecting to your backend:

- `AGENT_API_URL`: Base URL of the Agent HTTPS API (e.g., API Gateway endpoint)
- `WS_URL`: WebSocket URL for realtime updates (e.g., wss://... from API Gateway)

Because this project uses Vite, variables must be prefixed with `VITE_` to be exposed to the client code at build time. Define them like this in a `.env` file at the project root:

```env
# Requested variable names
AGENT_API_URL=https://your-agent-api.example.com/prod
WS_URL=wss://your-websocket.example.com/production

# Vite-exposed variables (what the app will actually read)
VITE_AGENT_API_URL=${AGENT_API_URL}
VITE_WS_URL=${WS_URL}
```

In code, read them via `import.meta.env.VITE_AGENT_API_URL` and `import.meta.env.VITE_WS_URL`.

## Basic Deployment to Amazon S3 and CloudFront

Below is a simple reference workflow. Adjust to your environment and security requirements.

1. Build the site:

```bash
npm run build
```

2. Create or choose an S3 bucket for static website hosting (enable static website hosting or use standard object hosting behind CloudFront). Ensure the bucket is private if serving via CloudFront with an Origin Access Control (OAC) or Origin Access Identity (OAI).

3. Upload the build artifacts from `dist/` to S3:

```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

4. (Recommended) Create a CloudFront distribution with the S3 bucket as the origin.

   - Set default root object to `index.html`.
   - Configure error responses to route 403/404 to `/index.html` for client-side routing (SPA).
   - If using OAC/OAI, attach appropriate bucket policy.

5. After redeploys, invalidate CloudFront cache to pick up the new assets:

```bash
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

6. Access your site via the CloudFront domain (or your custom domain with DNS mapped to the distribution).

## Notes

- This repository contains a sample only, intended to showcase how a website can integrate with a guiding agent. It is not production-hardened.
- Ensure you set `VITE_AGENT_API_URL` and `VITE_WS_URL` appropriately for each environment (development, staging, production) before running `npm run build`.
