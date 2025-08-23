# Azure Functions for Portfolio Website

This directory contains Azure Functions that replace the previous Express.js server. These functions will be deployed automatically with your Azure Static Web App.

## Structure

- `/api` - Contains all Azure Functions
  - `/chat` - The chat API endpoint
    - `index.js` - Function code
    - `function.json` - Function configuration

## Local Development

To run the functions locally:

1. Install the Azure Functions Core Tools if you haven't already:
   ```
   npm install -g azure-functions-core-tools@4
   ```

2. Navigate to the API directory:
   ```
   cd api
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Add your Azure OpenAI credentials to `local.settings.json`:
   ```json
   {
     "IsEncrypted": false,
     "Values": {
       "FUNCTIONS_WORKER_RUNTIME": "node",
       "AzureWebJobsStorage": "",
       "AZURE_OPENAI_API_KEY": "your-api-key",
       "AZURE_OPENAI_ENDPOINT": "your-endpoint-url"
     }
   }
   ```

5. Start the function app:
   ```
   npm start
   ```

## Deployment

When you push to the main branch, the GitHub Actions workflow will automatically deploy your static website and the API functions to Azure Static Web Apps.

Make sure to add the following secrets to your GitHub repository:

- `AZURE_STATIC_WEB_APPS_API_TOKEN`: Your Azure Static Web Apps deployment token
- `AZURE_OPENAI_API_KEY`: Your Azure OpenAI API key
- `AZURE_OPENAI_ENDPOINT`: Your Azure OpenAI endpoint URL
