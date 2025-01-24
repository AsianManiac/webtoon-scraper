import fs from "fs";
import MarkdownIt from "markdown-it/index.js";
import PptxGenJs from "pptxgenjs";

/**
 * Converts Markdown content into a PowerPoint presentation.
 * @param markdownFilePath - Path to the Markdown file.
 * @param outputFilePath - Path to save the generated PPT file.
 */
export const markdownToPpt = (
  markdownFilePath: string,
  outputFilePath: string
): void => {
  const markdownContent = fs.readFileSync(markdownFilePath, "utf-8");
  const markdownIt = new MarkdownIt();
  const tokens = markdownIt.parse(markdownContent, {});

  const ppt = new PptxGenJs();

  tokens.forEach((token) => {
    if (token.type === "heading_open") {
      const level = parseInt(token.tag.replace("h", ""), 10);
      const text = tokens[tokens.indexOf(token) + 1].content;

      // Add slide for each heading
      const slide = ppt.addSlide();
      slide.addText(text, {
        x: 1,
        y: 1,
        fontSize: level === 1 ? 24 : 18,
        color: level === 1 ? "003366" : "006699",
      });
    }
  });

  ppt.writeFile({ fileName: outputFilePath });
  console.log(`PPT successfully generated at ${outputFilePath}`);
};
