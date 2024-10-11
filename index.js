const fs = require("fs");
const path = require("path");
const remark = require("remark");
const remarkParse = require("remark-parse");
const remarkStringify = require("remark-stringify");

// Function to create a markdown file
function createMarkdownFile(filePath, content) {
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`File created at: ${filePath}`);
}

// Function to delete a file
function deleteFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`File deleted at: ${filePath}`);
  } else {
    console.log("File does not exist.");
  }
}

// Function to append to a JSON representation of a Markdown file
function appendToMarkdownJson(filePath, additionalContent) {
  const markdown = fs.readFileSync(filePath, "utf8");

  // Parse the Markdown to an AST
  const processor = remark().use(remarkParse);
  const ast = processor.parse(markdown);

  // Append new content (as a paragraph)
  const newContentNode = {
    type: "paragraph",
    children: [{ type: "text", value: additionalContent }],
  };

  ast.children.push(newContentNode);

  return ast;
}

// Function to save the AST (JSON) back as Markdown
function saveMarkdownFileFromJson(ast, savePath) {
  const processor = remark().use(remarkStringify);
  const markdown = processor.stringify(ast);

  // Save the updated Markdown content to a file
  fs.writeFileSync(savePath, markdown, "utf8");
  console.log(`File saved as markdown at: ${savePath}`);
}


/**========================================================================
 *                              FILE ^
 *========================================================================**/


// Example usage:
const markdownContent = `# Example Title\n\nThis is an example markdown file.`;
const filePath = path.join(__dirname, "example.md");

// 1. Create a markdown file
createMarkdownFile(filePath, markdownContent);


// 2. Append to the markdown file (via AST)
const additionalContent = "This is additional content.";
const ast = appendToMarkdownJson(filePath, additionalContent);

// 3. Resave the updated markdown file
const newFilePath = path.join(__dirname, "updated_example.md");
saveMarkdownFileFromJson(ast, newFilePath);

// 4. Delete the original file
deleteFile(filePath);
