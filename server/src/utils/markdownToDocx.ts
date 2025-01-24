import fs from "fs";
import htmlDocx from "html-docx-js";
import MarkdownIt from "markdown-it/index.js";
import path from "path";
import Prism from "prismjs";

// Load additional Prism.js languages (if needed)
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-twilight.min.css";

/**
 * Converts Markdown content into a DOCX file using HTML as an intermediate step.
 * @param markdownFilePath - Path to the Markdown file.
 * @param outputFilePath - Path to save the generated DOCX file.
 */
export const markdownToDocx = async (
  markdownFilePath: string,
  outputFilePath: string
): Promise<void> => {
  try {
    // Read Markdown content
    const markdownContent = fs.readFileSync(markdownFilePath, "utf-8");

    // Initialize markdown-it with Prism.js syntax highlighting
    // @ts-ignore
    const markdownIt = new MarkdownIt({
      // @ts-ignore
      highlight: (str, lang) => {
        if (lang && Prism.languages[lang]) {
          return `<pre class="language-${lang}"><code class="language-${lang}">${Prism.highlight(
            str,
            Prism.languages[lang],
            lang
          )}</code></pre>`;
        }
        return `<pre class="language-none"><code>${markdownIt.utils.escapeHtml(
          str
        )}</code></pre>`;
      },
    });

    // Convert Markdown to HTML
    const htmlContent = `
      <html>
        <head>
          <style>
            /* General Styles */
            body { font-family: 'Arial', sans-serif; line-height: 1.6; margin: 40px; color: #333; }
            h1, h2, h3, h4, h5, h6 { margin: 20px 0; }
            p { margin: 10px 0; }
            pre { padding: 10px; border-radius: 5px; overflow-x: auto; }

            /* Header Styles */
            h1 { font-size: 28px; color: #2c3e50; font-family: 'Georgia', serif; }
            h2 { font-size: 24px; color: #8e44ad; font-family: 'Trebuchet MS', sans-serif; }
            h3 { font-size: 20px; color: #27ae60; font-style: italic; }
            h4 { font-size: 18px; color: #2980b9; }
            h5 { font-size: 16px; color: #f39c12; }
            h6 { font-size: 14px; color: #c0392b; }

            /* Table Styles */
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            table, th, td { border: 1px solid #ddd; }
            th, td { padding: 10px; text-align: left; }
            th { background-color: #f4f4f4; color: #333; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }

            /* Prism.js Syntax Highlighting */
            code[class*=language-],pre[class*=language-]{color:#657b83;font-family:Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace;font-size:1em;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}code[class*=language-] ::-moz-selection,code[class*=language-]::-moz-selection,pre[class*=language-] ::-moz-selection,pre[class*=language-]::-moz-selection{background:#073642}code[class*=language-] ::selection,code[class*=language-]::selection,pre[class*=language-] ::selection,pre[class*=language-]::selection{background:#073642}pre[class*=language-]{padding:1em;margin:.5em 0;overflow:auto;border-radius:.3em}:not(pre)>code[class*=language-],pre[class*=language-]{background-color:#fdf6e3}:not(pre)>code[class*=language-]{padding:.1em;border-radius:.3em}.token.cdata,.token.comment,.token.doctype,.token.prolog{color:#93a1a1}.token.punctuation{color:#586e75}.token.namespace{opacity:.7}.token.boolean,.token.constant,.token.deleted,.token.number,.token.property,.token.symbol,.token.tag{color:#268bd2}.token.attr-name,.token.builtin,.token.char,.token.inserted,.token.selector,.token.string,.token.url{color:#2aa198}.token.entity{color:#657b83;background:#eee8d5}.token.atrule,.token.attr-value,.token.keyword{color:#859900}.token.class-name,.token.function{color:#b58900}.token.important,.token.regex,.token.variable{color:#cb4b16}.token.bold,.token.important{font-weight:700}.token.italic{font-style:italic}.token.entity{cursor:help}
          </style>
        </head>
        <body>
          ${markdownIt.render(markdownContent)}
        </body>
      </html>
    `;

    // Save the HTML file (optional, for debugging)
    const tempHtmlPath = path.join(__dirname, "temp.html");
    fs.writeFileSync(tempHtmlPath, htmlContent);

    // Convert HTML to DOCX using html-docx-js
    const docxContent = htmlDocx.asBlob(htmlContent);

    // Write the DOCX content to the output file
    fs.writeFileSync(outputFilePath, htmlContent);

    console.log(htmlContent);

    console.log(`DOCX successfully generated at ${outputFilePath}`);
  } catch (error: any) {
    console.error("Error generating DOCX:", error.message);
  }
};
