/**
 * Formats message content with proper HTML formatting
 * Handles paragraphs, lists, code blocks, and basic text styling
 * @param {string} text - Raw message text
 * @returns {string} HTML formatted message content
 */
const formatMessageContent = (text) => {
  if (!text) return '';

  // Handle code blocks with ```
  text = text.replace(/```([\s\S]*?)```/g, (match, code) => {
    return `<pre class="bg-opacity-20 bg-gray-500 p-3 rounded-lg my-2 overflow-x-auto"><code>${code.trim()}</code></pre>`;
  });

  // Handle inline code with `
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Handle bold text with ** or __
  text = text.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>');

  // Handle italic text with * or _
  text = text.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');

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
    
    // Handle heading levels (h3, h4)
    if (line.trim().startsWith('### ')) {
      return `<h3 class="text-lg font-semibold mb-2">${line.trim().substring(4)}</h3>`;
    }
    
    if (line.trim().startsWith('#### ')) {
      return `<h4 class="text-md font-semibold mb-1">${line.trim().substring(5)}</h4>`;
    }
    
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
