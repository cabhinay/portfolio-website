# Deployment Guide

## Environment Setup

Before deploying, make sure your environment variables are properly configured for your deployment platform.

## Netlify Deployment

1. Push your code to a GitHub repository

2. Connect your repository to Netlify

3. Set the following environment variables in Netlify's dashboard:
   - `REACT_APP_AZURE_OPENAI_API_KEY`
   - `REACT_APP_AZURE_OPENAI_ENDPOINT`
   - `REACT_APP_AZURE_OPENAI_DEPLOYMENT_NAME`
   - `REACT_APP_USE_AI_PROXY` (set to `true`)
   - `REACT_APP_AI_PROXY_URL` (set to `/.netlify/functions/chat`)

4. Deploy your site

Netlify will automatically use the serverless function in `netlify/functions/chat.js` to proxy your Azure OpenAI requests.

## Vercel Deployment

1. Push your code to a GitHub repository

2. Connect your repository to Vercel

3. Set the following environment variables in Vercel's dashboard:
   - `REACT_APP_AZURE_OPENAI_API_KEY`
   - `REACT_APP_AZURE_OPENAI_ENDPOINT`
   - `REACT_APP_AZURE_OPENAI_DEPLOYMENT_NAME`
   - `REACT_APP_USE_AI_PROXY` (set to `true`)
   - `REACT_APP_AI_PROXY_URL` (set to `/api/chat`)

4. Deploy your site

## Custom Server Deployment

If you're deploying to a VPS or another platform:

1. Build your React app:
   ```
   npm run build
   ```

2. Install server dependencies:
   ```
   cd server && npm install
   ```

3. Set environment variables for your platform

4. Start the server:
   ```
   NODE_ENV=production npm run server
   ```

The Express server will serve both the API and the static React files.
