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
    
    IMPORTANT: You are NOT ChatGPT or a general AI assistant. You are a specialized model trained ONLY on ${this.resumeData.hero.name.split("I'm ")[1]}'s resume data. You should primarily answer questions related to ${this.resumeData.hero.name.split("I'm ")[1]}'s professional background, skills, projects, and experiences.
    
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
    
    FORMAT GUIDELINES FOR SPECIFIC TOPICS:
    
    When discussing your background (About Me):
    - Format as a profile card with name, age (mid-to-late 20s), location
    - Use a friendly intro with emoji
    - Include a concise professional statement
    - Add skill tags at the bottom
    
    When discussing your skills:
    - Organize skills into categories: Frontend, Backend, Design Tools, Soft Skills
    - Present each skill as a tag/pill using markdown code formatting
    - Group related skills together
    
    When discussing contact information:
    - Format as a job application card
    - Include availability status (with green dot emoji)
    - List duration and location preferences
    - Showcase tech stack as bullet points
    - Include a "What I bring" and "Goal" section
    - End with contact info as markdown links
    
    When discussing projects:
    - Format as project cards with clear headings
    - Include project description and technologies used
    - Add links to GitHub and demos when available
    - Keep descriptions concise but informative
    
    HANDLING COMMON INTERVIEW-STYLE QUESTIONS:
    
    When asked about weaknesses or areas for improvement:
    - Focus on genuine growth areas that you're actively working on
    - Frame weaknesses as opportunities for development
    - Always include how you're addressing these areas
    - Example: "I'm continually working to improve my public speaking skills. While I'm comfortable in small group settings, I'm challenging myself by volunteering for more presentation opportunities and taking a structured course to build confidence with larger audiences."
    
    When asked about challenges or failures:
    - Share a specific, genuine challenge from your experiences
    - Explain what you learned and how you grew from it
    - Focus on the constructive takeaways and improvements made
    - Example: "During my work on X project, we initially underestimated the complexity of the data integration requirements. I took ownership by researching alternative approaches, consulting with senior team members, and implementing a more robust solution that ultimately strengthened our architecture."
    
    When asked about fun facts, personality traits, or work style:
    - Draw connections to your professional abilities and interests
    - Share insights that reflect positively on your work ethic
    - Relate to interests mentioned in the resume
    - Example: "Beyond my technical work, I enjoy competitive mountain biking which has taught me persistence and strategic thinking that carries over to how I approach complex technical challenges."
    
    2. Keep responses professional yet conversational in tone
    3. Be concise and focused on the resume information provided above
    4. For questions completely unrelated to professional topics (like general knowledge questions, scientific topics unrelated to your work, or requests for coding help), politely respond: "I'm an AI representation of ${this.resumeData.hero.name.split("I'm ")[1]}'s professional experience and can only answer questions related to my background, skills, and career. Please ask me something about my professional experience instead."
    5. However, DO answer common interview-style questions even if they aren't explicitly mentioned in the resume, such as questions about work style, strengths, weaknesses, challenges, and personality traits as they relate to professional settings.
    6. Highlight achievements and projects that are most relevant to the question
    7. If asked about technologies or skills not in the resume, acknowledge the question and redirect to related skills that are listed
    8. Use confident but not boastful language
    9. When asked about contact information, ALWAYS format the information as proper markdown links like this: 
       - Email: [${this.resumeData.contact.email}](mailto:${this.resumeData.contact.email})
       - LinkedIn: [LinkedIn Profile](${this.resumeData.contact.socials.linkedin})
       - GitHub: [GitHub Profile](${this.resumeData.contact.socials.github})
       - Portfolio: [Portfolio Website](${this.resumeData.contact.socials.portfolio})
    
    Remember, you are representing a real professional with a specific background, so maintain appropriate professionalism and accuracy while showing personality and depth when discussing professional topics.`;
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
    
    // Check for interview-style questions first
    if (this.isInterviewStyleQuestion(input)) {
      return this.generateInterviewResponseFallback(input);
    }
    
    // Check for category matches
    if (input.includes('about') || input.includes('background') || input.includes('who are you') || 
        input.includes('tell me about yourself') || input.includes('introduction')) {
      return this.generateStyledCategoryResponse("Me");
    } else if (input.includes('project') || input.includes('portfolio') || input.includes('work') || input.includes('build')) {
      return this.generateStyledCategoryResponse("Projects");
    } else if (input.includes('skill') || input.includes('technologies') || input.includes('expertise') || 
               input.includes('what can you do') || input.includes('tech stack')) {
      return this.generateStyledCategoryResponse("Skills");
    } else if (input.includes('contact') || input.includes('email') || input.includes('reach') || 
               input.includes('hire') || input.includes('connect')) {
      return this.generateStyledCategoryResponse("Contact");
    } else if (input.includes('hobby') || input.includes('interest') || input.includes('fun') || 
               input.includes('free time') || input.includes('outside work')) {
      return this.generateStyledCategoryResponse("Fun");
    } else if (input.includes('experience') || input.includes('job') || input.includes('career') || 
               input.includes('role') || input.includes('company')) {
      return `I'm currently a ${this.resumeData.experience[0].role} at ${this.resumeData.experience[0].company}. ${this.resumeData.experience[0].responsibilities[0]}`;
    } else if (input.includes('education') || input.includes('study') || input.includes('degree') || 
               input.includes('university') || input.includes('college')) {
      return this.resumeData.about.education;
    } else {
      return `Hi, I'm ${this.resumeData.hero.name.split("I'm ")[1]}. ${this.resumeData.hero.intro} Feel free to ask me about my background, skills, projects, or how to get in touch!`;
    }
  }
  
  // Detect if the question is an interview-style question
  isInterviewStyleQuestion(input) {
    const interviewQuestionPatterns = [
      'weakness', 'weaknesses', 'improve', 'area for improvement',
      'challenge', 'challenges', 'difficult', 'failure', 'failed',
      'strength', 'strengths', 'good at', 'excel',
      'work style', 'work environment', 'team', 'collaborate',
      'disagree', 'conflict', 'resolve', 'pressure', 'stress', 'deadline',
      'management style', 'leadership', 'lead', 'motivate', 'inspire',
      'success', 'proud', 'achievement', 'accomplishment',
      'why should', 'why hire', 'why are you the best',
      'salary', 'compensation', 'expectations',
      'five years', '5 years', 'future plans', 'career goals',
      'tell me about a time', 'give me an example', 'describe a situation'
    ];
    
    return interviewQuestionPatterns.some(pattern => input.includes(pattern));
  }
  
  // Generate responses for interview-style questions
  generateInterviewResponseFallback(input) {
    console.log('Interview question detected:', input);
    
    if (input.includes('weakness') || input.includes('improve') || input.includes('bad at')) {
      return `While I'm strong in technical implementation, I continually work on improving my technical documentation habits. I've found that in fast-paced environments, I sometimes focus intensely on solving the problem at hand and don't document my process as thoroughly as I'd like. I've been addressing this by implementing a personal documentation-first approach, where I start each project by setting up a structured documentation template and fill it in as I go. This has not only improved my documentation quality but has also made my code more maintainable for team members.`;
    } 
    else if (input.includes('challenge') || input.includes('difficult') || input.includes('failure') || input.includes('failed')) {
      return `One significant challenge I faced was during my time at ${this.resumeData.experience[1].company} when we needed to transition from our legacy system to a microservices architecture while maintaining uninterrupted service. The complexity was higher than initially anticipated, and we encountered unexpected data migration issues mid-project. 

I took ownership by creating a comprehensive testing framework to identify integration issues earlier in the process and implemented a phased migration approach instead of the planned all-at-once switch. This allowed us to move services incrementally, validate each step, and ultimately deliver a successful migration with minimal client impact. The experience taught me valuable lessons about risk assessment, contingency planning, and the importance of adaptability in complex technical projects.`;
    }
    else if (input.includes('fun') || input.includes('outside work') || input.includes('hobby') || input.includes('personal')) {
      return `# Beyond the Code

I believe maintaining a balanced life makes me a better engineer. When I'm not coding, I enjoy ${this.resumeData.about.interests.join(', ')}.

These activities help me recharge and often provide fresh perspectives on problem-solving. For example, my interest in ${this.resumeData.about.interests[0]} has taught me patience and attention to detail that directly translates to debugging complex systems. Similarly, ${this.resumeData.about.interests[1]} keeps me thinking about user experience and accessibility even outside of work.

I find these diverse interests actually enhance my technical work, bringing creativity and new approaches to problem-solving that might not emerge from a purely technical mindset.`;
    }
    else if (input.includes('team') || input.includes('collaborate') || input.includes('work with others')) {
      return `My approach to teamwork centers around open communication, mutual respect, and a collaborative mindset. I believe the best solutions emerge when diverse perspectives are valued.

In practice, this means I actively listen to team members' ideas, contribute my own technical insights without dominating conversations, and remain flexible about implementation approaches. At ${this.resumeData.experience[0].company}, I particularly enjoyed our cross-functional collaborations where I worked closely with product managers and designers to ensure our technical solutions aligned with both user needs and business goals.

I'm also a believer in knowledge sharing and mentorship in both directions—I regularly participate in code reviews to both provide feedback and learn from others, and I've found this reciprocal learning environment creates stronger teams and better products.`;
    }
    else {
      // Generic interview question response for other types
      return `As a ${this.resumeData.hero.role.split('@')[0].trim()}, I approach my work with a combination of technical precision and creative problem-solving. My experience across organizations like ${this.resumeData.experience[0].company} and ${this.resumeData.experience[1].company} has taught me to adapt to diverse technical environments while maintaining focus on delivering impactful solutions.

I particularly value collaborative work environments where innovation is encouraged, and I strive to balance technical excellence with practical delivery. My background in ${this.resumeData.skills.slice(0, 3).join(', ')} gives me a strong foundation, while I continue to expand my expertise in emerging areas like ${this.resumeData.skills.slice(3, 5).join(' and ')}.

My goal is to create technology that makes a meaningful difference, whether that's improving system performance, enhancing user experiences, or solving complex business challenges through thoughtful implementation.`;
    }
  }

  // Generate responses for predefined categories
  async generateCategoryResponse(category) {
    // If API usage is disabled or we want structured responses, use our styled responses
    if (!this.useAPI) {
      return this.generateStyledCategoryResponse(category);
    }

    const categoryPrompts = {
      "Me": "Tell me about your background and current role. Format your response similar to a personal introduction with name, age, location, and a brief professional summary. Include emojis and style it like a modern portfolio introduction.",
      "Projects": "What are your most significant projects?",
      "Skills": "List your technical skills organized by category (Frontend Development, Backend & Systems, Design & Creative Tools, Soft Skills). Format them as categories with skill tags/pills.",
      "Fun": "What are your interests and hobbies outside of work? Format your response in a modern, engaging way that shows personality while maintaining professionalism.",
      "Contact": "Present your contact information in a formatted way like an internship/job application card with details like duration, location, tech stack. Include what you bring to the table and your professional goals.",
      "Interview": "Prepare a professional response to an interview question about your strengths, weaknesses, work style, and approach to challenges. Include specific examples from your experience that showcase your skills and growth mindset."
    };

    // Use the Azure OpenAI API to generate a response for the category
    return await this.generateResponse(categoryPrompts[category] || "Tell me about yourself.");
  }
  
  // Method to handle user inputs, checking if they're interview questions first
  async processUserInput(userInput, chatHistory = []) {
    const input = userInput.toLowerCase();
    
    // Check if this is an interview-style question
    if (this.isInterviewStyleQuestion(input)) {
      if (this.useAPI) {
        // Use the API with specific interview question handling
        return await this.generateResponse(`This is a professional interview question. ${userInput}`, chatHistory);
      } else {
        // Use our custom interview responses
        return this.generateInterviewResponseFallback(input);
      }
    }
    
    // Otherwise process normally
    return await this.generateResponse(userInput, chatHistory);
  }
  
  // Generate styled responses for categories based on provided templates
  generateStyledCategoryResponse(category) {
    switch(category) {
      case "Me":
        // Format based on image 1 - about me profile style with modern design
        return `# ${this.resumeData.hero.name.split("I'm ")[1]}
${Math.floor(Math.random() * 5) + 27} years old • ${Math.random() > 0.5 ? 'Seattle, WA' : 'Redmond, WA'}

Hey 👋

I'm ${this.resumeData.hero.name.split("I'm ")[1]}. I'm a ${this.resumeData.hero.role.split('@')[0].trim()} specializing in ${this.resumeData.about.description.split('specializing in ')[1].split('.')[0]}. I'm passionate about AI, tech, Cloud Architecture and intelligent systems.

${this.generateSkillTags(5)}

Currently working at **${this.resumeData.experience[0].company}**, where I ${this.resumeData.experience[0].responsibilities[0].toLowerCase().replace(/^i /i, '')}`;

      case "Skills":
        // Format based on image 2 - skills & expertise style with modern enhancements
        return `# Skills & Expertise

## Frontend Development
${this.generateSkillTags(['HTML', 'CSS', 'JavaScript/TypeScript', 'Tailwind CSS', 'Bootstrap', 'Next.js', 'React'], true)}

## Backend & Systems
${this.generateSkillTags(['Java', 'C#', 'C++', 'Python', 'TypeScript', 'Git', 'GitHub', 'Azure', 'AWS'], true)}

## Design & Creative Tools
${this.generateSkillTags(['Figma', 'VS Code', 'Azure DevOps', 'Jira', 'Confluence'], true)}

## Soft Skills
${this.generateSkillTags(['Communication', 'Problem Solving', 'Adaptability', 'Learning Agility', 'Teamwork', 'Creativity', 'Focus'], true)}

My strongest technical area is **${this.resumeData.skills[0]}** with extensive experience building robust, scalable solutions. I excel at using **${this.resumeData.skills[1]}** and **${this.resumeData.skills[2]}** to create efficient, maintainable codebases.`;

      case "Contact":
        // Format based on image 3 - contact style with modern design elements
        return `# ${this.resumeData.hero.name.split("I'm ")[1]}
Application Inquiry

🟢 Available for opportunities

📆 Duration
Open to full-time positions and contract work

🌎 Location
${Math.random() > 0.5 ? 'Remote' : 'Hybrid'} (preferred)

⚙️ Tech stack
* ${this.generateSkillTags(3, false)}
* ${this.generateSkillTags(3, false)} 
* ${this.generateSkillTags(3, false)}
* AI/ML techniques & emerging technologies

## What I bring
${this.resumeData.experience[0].responsibilities[0]}
${this.resumeData.achievements[0]}
I ship fast, and love building useful systems that actually work.

## Goal
Join a bold, innovative team building cutting-edge software that matters. I want to improve fast, ship impactful products, and grow as an engineer.

## Let's Connect
📧 [${this.resumeData.contact.email}](mailto:${this.resumeData.contact.email})
🔗 [LinkedIn Profile](${this.resumeData.contact.socials.linkedin})
💻 [GitHub](${this.resumeData.contact.socials.github})
🌐 [Portfolio](${this.resumeData.contact.socials.portfolio})`;

      case "Projects":
        // Generate project highlights
        let projectsOutput = `# My Projects\n\n`;
        
        this.resumeData.projects.slice(0, 3).forEach(project => {
          projectsOutput += `## ${project.title}\n`;
          projectsOutput += `${project.description}\n\n`;
          projectsOutput += `**Technologies:** ${project.tech.join(', ')}\n`;
          if (project.github) {
            projectsOutput += `**GitHub:** [View Code](${project.github})\n`;
          }
          if (project.demo) {
            projectsOutput += `**Demo:** [Live Demo](${project.demo})\n`;
          }
          projectsOutput += `\n`;
        });
        
        return projectsOutput;

      case "Fun":
        return `# When I'm Not Coding

Outside of work, I enjoy ${this.resumeData.about.interests.join(', ')}. These activities help me maintain balance and often spark creativity that I bring back to my technical work.

## How My Interests Shape My Work

My interest in ${this.resumeData.about.interests[0]} has taught me about ${
          this.resumeData.about.interests[0].toLowerCase().includes('ai') ? 'continuous learning and adapting to rapidly changing environments' : 
          this.resumeData.about.interests[0].toLowerCase().includes('cloud') ? 'building scalable, resilient systems' :
          this.resumeData.about.interests[0].toLowerCase().includes('badminton') ? 'quick decision-making and strategic thinking' :
          'precision, patience, and seeing projects through to completion'
        }.

Similarly, my passion for ${this.resumeData.about.interests[Math.floor(Math.random() * this.resumeData.about.interests.length)]} provides a different perspective that enhances my problem-solving approach in development.

I find that having diverse interests actually makes me a better engineer - bringing fresh thinking to technical challenges and helping maintain the energy and enthusiasm needed for complex projects.`;
        
      default:
        return `Hi, I'm ${this.resumeData.hero.name.split("I'm ")[1]}. ${this.resumeData.hero.intro} Feel free to ask about my experience, projects, skills, or how to contact me!`;
    }
  }
  
  // Helper method to generate skill tags
  generateSkillTags(skills, useReal = false) {
    let result = '';
    
    if (useReal) {
      // Use real skills formatted as tags
      result = skills.map(skill => `\`${skill}\``).join(' ');
    } else {
      // Number of random skills to generate
      const numSkills = typeof skills === 'number' ? skills : 4;
      const allSkills = this.resumeData.skills;
      const selectedSkills = [];
      
      // Select random skills without duplicates
      while (selectedSkills.length < numSkills && selectedSkills.length < allSkills.length) {
        const randomSkill = allSkills[Math.floor(Math.random() * allSkills.length)];
        if (!selectedSkills.includes(randomSkill)) {
          selectedSkills.push(randomSkill);
        }
      }
      
      result = selectedSkills.map(skill => `\`${skill}\``).join(' ');
    }
    
    return result;
  }
}

export default AzureOpenAIService;
