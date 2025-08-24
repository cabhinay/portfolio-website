/**
 * Formats message content with proper HTML formatting
 * Handles paragraphs, lists, code blocks, and basic text styling
 * @param {string} text - Raw message text
 * @returns {string} HTML formatted message content
 */
const formatMessageContent = (text) => {
  if (!text) return '';

  // Process special sections first to wrap them in styled containers
  // About Me section - wrap in profile card
  if (text.includes('# ') && text.toLowerCase().includes('years old') && text.includes('👋')) {
    text = text.replace(/(# .*?\n.*?\n\nHey 👋.*?)(\n\n|$)/s, '<div class="profile-section">$1</div>$2');
  }

  // Contact section - wrap in contact card
  if (text.includes('🟢 Available')) {
    text = text.replace(/(# .*?\nApplication Inquiry\n\n🟢 Available.*?)(\n\n|$)/s, '<div class="contact-card">$1</div>$2');
    text = text.replace(/🟢 Available for opportunities/, '<div class="availability">🟢 Available for opportunities</div>');
  }

  // Handle markdown headings (before other formatting)
  text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  text = text.replace(/^#### (.*$)/gm, '<h4>$1</h4>');

  // Handle code blocks with ```
  text = text.replace(/```([\s\S]*?)```/g, (match, code) => {
    return `<pre class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 rounded-xl my-3 overflow-x-auto shadow-sm"><code>${code.trim()}</code></pre>`;
  });

  // Handle inline code with ` (special styling for skill tags)
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Handle bold text with ** or __
  text = text.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>');

  // Handle italic text with * or _
  text = text.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');
  
  // Enhanced emoji handling
  text = text.replace(/🟢/g, '<span class="emoji emoji-green">🟢</span>');
  text = text.replace(/�/g, '<span class="emoji emoji-wave">�</span>');
  text = text.replace(/📆/g, '<span class="emoji emoji-calendar">📆</span>');
  text = text.replace(/🌎/g, '<span class="emoji emoji-globe">🌎</span>');
  text = text.replace(/⚙️/g, '<span class="emoji emoji-gear">⚙️</span>');

  // Handle links with [text](url)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    let className = 'underline hover:text-indigo-500 transition-colors duration-200';
    
    // Special styling for contact links
    if (url.startsWith('mailto:')) {
      className += ' text-blue-600 dark:text-blue-400 font-medium';
    } else if (url.includes('linkedin.com')) {
      className += ' text-blue-700 dark:text-blue-400 font-medium';
    } else if (url.includes('github.com')) {
      className += ' text-purple-700 dark:text-purple-400 font-medium';
    } else {
      className += ' text-indigo-600 dark:text-indigo-400';
    }
    
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="${className}">${text}</a>`;
  });
  
  // Handle lists
  let inList = false;
  let listType = '';
  const lines = text.split('\n');
  
  text = lines.map((line, index) => {
    // Unordered list items
    if (line.trim().match(/^[*-] /)) {
      const content = line.trim().replace(/^[*-] /, '');
      
      if (!inList || listType !== 'ul') {
        if (inList) {
          // Close previous list of different type
          const closingTag = listType === 'ol' ? '</ol>' : '</ul>';
          inList = true;
          listType = 'ul';
          return `${closingTag}\n<ul class="list-disc ml-5 my-2">\n<li>${content}</li>`;
        } else {
          inList = true;
          listType = 'ul';
          return `<ul class="list-disc ml-5 my-2">\n<li>${content}</li>`;
        }
      }
      
      return `<li>${content}</li>`;
    }
    
    // Ordered list items
    if (line.trim().match(/^\d+\. /)) {
      const content = line.trim().replace(/^\d+\. /, '');
      
      if (!inList || listType !== 'ol') {
        if (inList) {
          // Close previous list of different type
          const closingTag = listType === 'ol' ? '</ol>' : '</ul>';
          inList = true;
          listType = 'ol';
          return `${closingTag}\n<ol class="list-decimal ml-5 my-2">\n<li>${content}</li>`;
        } else {
          inList = true;
          listType = 'ol';
          return `<ol class="list-decimal ml-5 my-2">\n<li>${content}</li>`;
        }
      }
      
      return `<li>${content}</li>`;
    }
    
    // End list if we were in one
    if (inList && line.trim() !== '') {
      const closingTag = listType === 'ol' ? '</ol>' : '</ul>';
      inList = false;
      return `${closingTag}\n<p>${line}</p>`;
    }
    
    // Empty line should close list and create spacing
    if (inList && line.trim() === '') {
      const closingTag = listType === 'ol' ? '</ol>' : '</ul>';
      inList = false;
      return `${closingTag}\n`;
    }
    
    // We now handle headings with regex at the top of the function
    // This section is no longer needed as we use h1-h4 tags directly
    
    // Handle paragraphs with proper spacing
    if (line.trim() !== '') {
      return `<p class="mb-3">${line}</p>`;
    }
    
    // Empty lines create spacing
    return '';
  }).join('\n');
  
  // Close any open lists
  if (inList) {
    const closingTag = listType === 'ol' ? '</ol>' : '</ul>';
    text += `\n${closingTag}`;
  }
  
  return text;
};

export default formatMessageContent;
