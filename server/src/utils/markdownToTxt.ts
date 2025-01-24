import fs from "fs";

/**
 * Converts Markdown content into a TXT file.
 * @param markdownFilePath - Path to the Markdown file.
 * @param outputFilePath - Path to save the generated TXT file.
 */
export const markdownToTxt = (
  markdownFilePath: string,
  outputFilePath: string
): void => {
  const markdownContent = fs.readFileSync(markdownFilePath, "utf-8");
  fs.writeFileSync(outputFilePath, markdownContent);
  console.log(`TXT successfully generated at ${outputFilePath}`);
};
