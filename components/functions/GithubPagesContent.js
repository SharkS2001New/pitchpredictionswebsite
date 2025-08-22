import { marked } from 'marked';

async function getGithubSiteContent(page_url) {
    try {
      const token = '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';
      const url = 'https://api.github.com/repos/SharkS2001New/Pitch-Predictions-SeoContent/contents/'+page_url;
      const headers = {
        'Authorization': `token ${token}`
      };
  
      const response = await fetch(url, { headers });
      const json = await response.json();
    
      const content = Buffer.from(json.content, 'base64').toString('utf-8');

      // Separate meta information and content if it exists
      let metas = [];
      let contentLines = content.trim();

      //Validate if the meta's exists in the .md file
      const metaLines = content.match(/---([\s\S]*?)---/);
      if (metaLines) {
        const metaContent = metaLines[1].trim();
        const metaLinesArray = metaContent.split('\n');
        let title, description, keywords, pagetitle, image_url, image_alt;
        for (const line of metaLinesArray) {
          const [key, value] = line.split(':').map(part => part.trim());
          if (key === 'title') {
            title = value;
          } else if (key === 'description') {
            description = value;
          } else if (key === 'keywords') {
            keywords = value;
          }else if(key === 'pagetitle'){
            pagetitle = value;             
          }else if(key === 'url'){
            image_url = value;
          }else if(key === 'alt'){
            image_alt = value;
          }
        }

        metas.push({ title, description, keywords, pagetitle, image_url, image_alt });

        // Update content lines by removing the meta lines
        contentLines = content.replace(metaLines[0], '').trim();
      }
    
      // Parse the markdown content
      const htmlContent = marked(contentLines);
    
      // Modify the <a> tag links with the desired class and styling
      const modifiedHtmlContent = htmlContent.replace(/<a\s/g, '<a class="md-link" ');
    
      // Find all the headings and their corresponding body text
      const page_content = [];
      modifiedHtmlContent.split('\n').forEach(line => {
        if (line.startsWith('<h')) {
          const title = line.replace(/<\/?h\d>/g, '').trim();
          const body = [];
          page_content.push({ title, body });
        } else if (page_content.length) {
          page_content[page_content.length - 1].body.push(line.trim());
        }
      });
    
      // Convert the headings and body text to JSON
      const json_content = page_content.map(({ title, body }) => ({ title, body: body.join(' ') }));
        
      return { metas, page_content: json_content };
      
    } catch (error) {
      console.error(error);
      // Handle error here, e.g. show a message to the user
    }
  }
  
  
export default getGithubSiteContent;
