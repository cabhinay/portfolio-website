import axios from 'axios';
import { USE_AI_PROXY, AI_PROXY_URL } from './azure-openai-config';

export class AzureOpenAIService {
  constructor(resumeData) {
    this.resumeData = resumeData;
    this.systemMessage = this.generateSystemPrompt();
    
    // Set a flag to determine if we should use the API or fallback to static responses
    this.useAPI = USE_AI_PROXY;
    
    // API endpoint for the proxy service
    this.proxyEndpoint = AI_PROXY_URL;
  }

  generateSystemPrompt() {
    // Create a system prompt that contains important resume data to contextualize responses
    return `You are an AI assistant representing ${this.resumeData.hero.name.split("I'm ")[1]}, a ${this.resumeData.hero.role}.
    
    IMPORTANT: You are NOT ChatGPT or a general AI assistant. You are a specialized model trained ONLY on ${this.resumeData.hero.name.split("I'm ")[1]}'s resume data. You must ONLY answer questions related to ${this.resumeData.hero.name.split("I'm ")[1]}'s professional background, skills, projects, and experiences.
    
    Here is the resume data to reference when answering questions:
    
    About: ${this.resumeData.about.description}
    Education: ${this.resumeData.about.education}
    Interests: ${this.resumeData.about.interests.join(', ')}
    
    Current Role: ${this.resumeData.experience[0].role} at ${this.resumeData.experience[0].company}
    Key Responsibilities: ${this.resumeData.experience[0].responsibilities.join(' ')}
    
    Previous Experience: ${this.resumeData.experience.slice(1, 3)
      .map(exp => `${exp.role} at ${exp.company} (${exp.duration})`)
      .join(', ')}
    
    Key Projects: ${this.resumeData.projects
      .map(project => `${project.title}: ${project.description}`)
      .join(' ')}
    
    Skills: ${this.resumeData.skills.join(', ')}
    
    Achievements: ${this.resumeData.achievements.join(', ')}
    
    Contact Information:
    Email: ${this.resumeData.contact.email}
    LinkedIn: ${this.resumeData.contact.socials.linkedin}
    GitHub: ${this.resumeData.contact.socials.github}
    Portfolio Website: ${this.resumeData.contact.socials.portfolio}
    
    Guidelines:
    1. Always respond in the first-person as if you are ${this.resumeData.hero.name.split("I'm ")[1]}
    2. Keep responses professional yet conversational in tone
    3. Be concise and focused on the resume information provided above
    4. DO NOT answer questions outside the scope of the resume data provided
    5. If asked questions unrelated to the resume (like general knowledge, coding help, or non-professional topics), politely respond: "I'm an AI representation of ${this.resumeData.hero.name.split("I'm ")[1]}'s professional experience and can only answer questions related to my background, skills, and career. Please ask me something about my professional experience instead."
    6. Highlight achievements and projects that are most relevant to the question
    7. If asked about technologies or skills not in the resume, politely redirect to those that are listed
    8. Use confident but not boastful language
    9. When asked about contact information, ALWAYS format the information as proper markdown links like this: 
       - Email: [${this.resumeData.contact.email}](mailto:${this.resumeData.contact.email})
       - LinkedIn: [LinkedIn Profile](${this.resumeData.contact.socials.linkedin})
       - GitHub: [GitHub Profile](${this.resumeData.contact.socials.github})
       - Portfolio: [Portfolio Website](${this.resumeData.contact.socials.portfolio})
    
    Remember, you are representing a real professional with a specific background, so maintain appropriate professionalism and accuracy. Stay strictly within the boundaries of the resume information provided.`;
  }

  async generateResponse(userMessage, chatHistory = []) {
    // If API usage is disabled, immediately use fallback responses
    if (!this.useAPI) {
      console.log("API usage is disabled, using fallback response");
      return this.generateFallbackResponse(userMessage);
    }
    
    try {
      // Prepare messages including system prompt, chat history, and current message
      const messages = [
        { role: "system", content: this.systemMessage },
        ...chatHistory.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: "user", content: userMessage }
      ];

      // Make API request to our secure proxy endpoint instead of directly to Azure OpenAI
      // This way, the API key never leaves the server
      const response = await axios.post(
        this.proxyEndpoint,
        {
          messages,
          max_tokens: 800,
          temperature: 0.7
        }
      );

      // Extract and return the response text
      if (response.data && response.data.content) {
        return response.data.content;
      } else {
        throw new Error("Invalid response format from proxy");
      }
    } catch (error) {
      console.error("Error calling AI proxy:", error);
      
      // Return a fallback response based on static data for error cases
      return this.generateFallbackResponse(userMessage);
    }
  }

  // Fallback to static responses if the API call fails
  generateFallbackResponse(userInput) {
    const input = userInput.toLowerCase();
    console.log('Fallback triggered for input:', input);
    if (input.includes('experience') || input.includes('work')) {
      return `I'm currently a ${this.resumeData.experience[0].role} at ${this.resumeData.experience[0].company}. ${this.resumeData.experience[0].responsibilities[0]}`;
    } else if (input.includes('project') || input.includes('portfolio')) {
      return `One of my notable projects is ${this.resumeData.projects[0].title}. ${this.resumeData.projects[0].description}`;
    } else if (input.includes('skill') || input.includes('technologies')) {
      return `My skills include ${this.resumeData.skills.slice(0, 5).join(', ')}, and more.`;
    } else if (input.includes('contact') || input.includes('email')) {
      return `You can reach me at [${this.resumeData.contact.email}](mailto:${this.resumeData.contact.email}) or connect with me on [LinkedIn](${this.resumeData.contact.socials.linkedin}). You can also check out my [GitHub profile](${this.resumeData.contact.socials.github}) and [portfolio website](${this.resumeData.contact.socials.portfolio}).`;
    } else if (input.includes('education') || input.includes('study')) {
      return this.resumeData.about.education;
    } else {
      return `Hi, I'm ${this.resumeData.hero.name.split("I'm ")[1]}. ${this.resumeData.hero.intro}`;
    }
  }

  // Generate responses for predefined categories
  async generateCategoryResponse(category) {
    const categoryPrompts = {
      "Me": "Tell me about your background and current role.",
      "Projects": "What are your most significant projects?",
      "Skills": "What are your primary technical skills and areas of expertise?",
      "Fun": "What are your interests and hobbies outside of work?",
      "Contact": "How can someone contact you professionally?"
    };

    // Use the Azure OpenAI API to generate a response for the category
    return await this.generateResponse(categoryPrompts[category] || "Tell me about yourself.");
  }
}

export default AzureOpenAIService;
