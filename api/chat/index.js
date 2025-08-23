const axios = require('axios');

module.exports = async function (context, req) {
    context.log('Processing chat request');
    context.log('Environment check - API Key exists:', !!process.env.AZURE_OPENAI_API_KEY);
    context.log('Environment check - Endpoint exists:', !!process.env.AZURE_OPENAI_ENDPOINT);

    try {
        // Get Azure OpenAI credentials from environment variables
        const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
        const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;

        // Validate API credentials
        if (!AZURE_OPENAI_API_KEY || !AZURE_OPENAI_ENDPOINT) {
            context.log.error('Azure OpenAI credentials are missing');
            context.res = {
                status: 500,
                body: { error: 'Server configuration error' }
            };
            return;
        }

        // Get request data
        const { messages, max_tokens, temperature } = req.body;

        // Make request to Azure OpenAI
        const response = await axios.post(
            AZURE_OPENAI_ENDPOINT,
            {
                messages,
                max_tokens: max_tokens || 800,
                temperature: temperature || 0.7,
                top_p: 0.95,
                frequency_penalty: 0,
                presence_penalty: 0,
                stop: null
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': AZURE_OPENAI_API_KEY
                }
            }
        );

        // Send response back to client
        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: {
                content: response.data.choices[0].message.content
            }
        };
    } catch (error) {
        context.log.error('Error calling Azure OpenAI:', error.message);
        
        // Send error response
        context.res = {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: {
                error: 'Failed to process your request',
                message: error.message
            }
        };
    }
};
