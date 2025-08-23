# Portfolio Website with Azure AI Integration

This portfolio website includes an AI chat feature powered by Azure OpenAI, allowing visitors to interact with an AI assistant that responds with information from your resume data.

## Azure OpenAI Setup

To enable the Azure OpenAI integration securely:

1. Create an Azure OpenAI resource in the Azure portal
2. Deploy a model in your Azure OpenAI resource (recommended: gpt-35-turbo or gpt-4)
3. Set up your environment variables as described below

## Azure Functions Setup

This project now uses Azure Functions instead of a traditional Express server for improved security and serverless architecture.

### Local Development with Azure Functions

1. Install the Azure Functions Core Tools:
   ```
   npm install -g azure-functions-core-tools@4
   ```

2. Set up local environment:
   - Copy `api/local.settings.example.json` to `api/local.settings.json`
   - Add your Azure OpenAI credentials to `local.settings.json`:
     ```json
     {
       "IsEncrypted": false,
       "Values": {
         "FUNCTIONS_WORKER_RUNTIME": "node",
         "AzureWebJobsStorage": "",
         "AZURE_OPENAI_API_KEY": "your-api-key-here",
         "AZURE_OPENAI_ENDPOINT": "your-endpoint-url-here"
       },
       "Host": {
         "CORS": "*"
       }
     }
     ```

3. Run the functions locally:
   ```
   cd api && func start
   ```

4. In another terminal, start the React app:
   ```
   npm start
   ```

## Production Deployment to Azure Static Web Apps

## Production Deployment to Azure Static Web Apps

### Setting up Azure Static Web Apps

1. Create an Azure Static Web App in the Azure Portal
2. Link your GitHub repository
3. Configure the following build settings:
   - App location: `/`
   - API location: `api`
   - Output location: `build`

### Securing Credentials in Production

**IMPORTANT: Never commit sensitive credentials to your repository!**

1. Add Application Settings in Azure Portal:
   - Go to your Static Web App resource
   - Select "Configuration" under Settings
   - Add the following Application Settings:
     - `AZURE_OPENAI_API_KEY`: Your Azure OpenAI API key
     - `AZURE_OPENAI_ENDPOINT`: Your Azure OpenAI endpoint URL

2. Add the same secrets to your GitHub repository:
   - Go to repository Settings > Secrets and variables > Actions
   - Add the secrets with the same names

### Automatic Deployment

When you push changes to your main branch, GitHub Actions will automatically build and deploy your application to Azure Static Web Apps.

### Security Considerations

- All API calls are processed through Azure Functions, so your API keys are never exposed to the client
- Environment variables are securely stored in Azure and GitHub, not in your code
- The frontend automatically detects if it's running in production or development and uses the appropriate API endpoint

## Features

- AI Chat mode that uses Azure OpenAI to generate dynamic responses based on your resume data
- Conversation history and context-aware responses
- Fallback to static responses if API calls fail
- Category-based questions for quick navigation
- Light/Dark mode support
- Responsive design with animations using Framer Motion

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
