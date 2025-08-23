// Frontend-only configuration for the AI proxy
// No sensitive API keys should be stored here

export const USE_AI_PROXY = true; // Always use API since we're using Azure Functions

// Automatically detect if we're in production or development
// In production: use relative path '/api/chat'
// In development: use full localhost URL
const isProduction = window.location.hostname !== 'localhost';
export const AI_PROXY_URL = isProduction 
  ? '/api/chat'  // Production endpoint (relative URL)
  : 'http://localhost:7071/api/chat'; // Local development endpoint
