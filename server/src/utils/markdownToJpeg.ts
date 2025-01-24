import fs from "fs";
import MarkdownIt from "markdown-it/index.js";
import puppeteer from "puppeteer";

/**
 * Converts Markdown content into a JPEG image.
 * @param markdownFilePath - Path to the Markdown file.
 * @param outputFilePath - Path to save the generated JPEG file.
 */
export const markdownToJpeg = async (
  markdownFilePath: string,
  outputFilePath: string
): Promise<void> => {
  const markdownContent = fs.readFileSync(markdownFilePath, "utf-8");
  const markdownIt = new MarkdownIt();
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 20px;">
        ${markdownIt.render(markdownContent)}
      </body>
    </html>
  `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "load" });
  const buffer = await page.screenshot({ type: "jpeg", quality: 80 });
  fs.writeFileSync(outputFilePath, buffer);
  await browser.close();
  console.log(`JPEG successfully generated at ${outputFilePath}`);
};
