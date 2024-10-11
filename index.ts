// import { Document } from "./composable/document";

// // Example usage:
// let doc = new Document();
// doc.create("MyDocument", "Initial content. ");
// doc.append("Additional content.");
// doc.read(); // Display document content

// // Save the document for the first time (Save As)
// doc.saveAs("./MyDocument.txt");

// // Append more content and save (Save uses the previously defined file path)
// doc.append("\nMore content.");
// doc.save(); // This will save to './MyDocument.txt'

// // Delete the document file from the system
// doc.delete(); // This deletes the file from './MyDocument.txt'

// // Import remark and plugins from a CDN
// import remark from "https://esm.sh/remark@14";
// import remarkParse from "https://esm.sh/remark-parse@11";
// import remarkStringify from "https://esm.sh/remark-stringify@11";

// // Function to greet
// function greet(name: string): string {
//   return `Hello, ${name}!`;
// }

// console.log(greet("world"));

// // Function to create a markdown file
// async function createMarkdownFile(filePath: string, content: string) {
//   await writeTextFile(filePath, content);
//   console.log(`File created at: ${filePath}`);
// }

// // Function to delete a file
// async function deleteFile(filePath: string) {
//   try {
//     await remove(filePath);
//     console.log(`File deleted at: ${filePath}`);
//   } catch (error) {
//     console.error("File does not exist.");
//   }
// }

// // Function to append to a JSON representation of a Markdown file
// async function appendToMarkdownJson(
//   filePath: string,
//   additionalContent: string
// ) {
//   const markdown = await readTextFile(filePath);

//   // Parse the Markdown to an AST
//   const processor = remark().use(remarkParse);
//   const ast = processor.parse(markdown);

//   // Append new content (as a paragraph)
//   const newContentNode = {
//     type: "paragraph",
//     children: [{ type: "text", value: additionalContent }],
//   };

//   ast.children.push(newContentNode);

//   return ast;
// }

// // Function to save the AST (JSON) back as Markdown
// async function saveMarkdownFileFromJson(ast: any, savePath: string) {
//   const processor = remark().use(remarkStringify);
//   const markdown = processor.stringify(ast);

//   // Save the updated Markdown content to a file
//   await writeTextFile(savePath, markdown);
//   console.log(`File saved as markdown at: ${savePath}`);
// }

// // Example usage
// const markdownContent = `# Example Title\n\nThis is an example markdown file.`;
// // Getting the current directory using import.meta.url
// const __dirname = new URL(".", import.meta.url).pathname;
// const filePath = join(__dirname, "example.md");

// (async () => {
//   // 1. Create a markdown file
//   await createMarkdownFile(filePath, markdownContent);

//   // 2. Append to the markdown file (via AST)
//   const additionalContent = "This is additional content.";
//   const ast = await appendToMarkdownJson(filePath, additionalContent);

//   // 3. Resave the updated markdown file
//   const newFilePath = join(__dirname, "updated_example.md");
//   await saveMarkdownFileFromJson(ast, newFilePath);

//   // 4. Delete the original file
//   await deleteFile(filePath);
// })();
