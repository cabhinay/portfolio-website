const axios = require('axios');
// For Netlify, we still need to use REACT_APP_ prefix for environment variables
// since there's only one .env file in Netlify deployment

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body);
    const { messages, max_tokens, temperature } = body;

    // Get Azure OpenAI credentials from environment variables
    const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
    const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;

    // Validate API credentials
    if (!AZURE_OPENAI_API_KEY || !AZURE_OPENAI_ENDPOINT) {
      console.error('Azure OpenAI credentials are missing');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }

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

    // Return successful response
    return {
      statusCode: 200,
      body: JSON.stringify({
        content: response.data.choices[0].message.content
      })
    };
  } catch (error) {
    console.error('Error calling Azure OpenAI:', error);
    
    // Return error response
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to process your request',
        message: error.message
      })
    };
  }
};
