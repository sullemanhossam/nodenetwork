import remark from "https://esm.sh/remark@14";
import remarkParse from "https://esm.sh/remark-parse@11";
import remarkStringify from "https://esm.sh/remark-stringify@11";

export class Markdown {
  private markdownContent: string = "";
  // private jsonAst: any = null;

  constructor(content: string = "") {
    this.markdownContent = content;
  }

  // Parse markdown string to AST (JSON)
  fromMarkdown(mdString: string): Promise<void> {
    const processor = remark().use(remarkParse);
    this.jsonAst = processor.parse(mdString);
    this.markdownContent = mdString;
  }

  // Convert AST (JSON) back to markdown string
  toMarkdown(): Promise<string> {
    const processor = remark().use(remarkStringify);
    this.markdownContent = processor.stringify(this.jsonAst);
    return this.markdownContent;
  }

  // Append content to the Markdown (updates AST)
  appendToMarkdown(newContent: string): void {
    if (!this.jsonAst) {
      throw new Error("AST is not initialized. Load or parse markdown first.");
    }

    const newContentNode = {
      type: "paragraph",
      children: [{ type: "text", value: newContent }],
    };

    this.jsonAst.children.push(newContentNode);
  }

  // Insert content at a specific index in the JSON AST structure
  insertAt(index: number, newContent: string): void {
    if (!this.jsonAst || index < 0 || index > this.jsonAst.children.length) {
      throw new Error("Invalid index or AST not initialized.");
    }

    const newContentNode = {
      type: "paragraph",
      children: [{ type: "text", value: newContent }],
    };

    this.jsonAst.children.splice(index, 0, newContentNode);
  }

  // Print the current JSON AST
  printAst(): void {
    console.log(JSON.stringify(this.jsonAst, null, 2));
  }

  // Get current markdown content as string
  getMarkdown(): string {
    return this.markdownContent;
  }
}

// // Example usage
// ( () => {
//   const md = new Markdown();

//   // 1. Load a markdown file
//   await md.load("./example.md");

//   // 2. Append content to the markdown
//   md.appendToMarkdown("This is additional content.");

//   // 3. Insert content at the beginning of the markdown
//   md.insertAt(0, "This content is inserted at the start.");

//   // 4. Print the JSON AST to see the structure
//   md.printAst();

//   // 5. Convert AST back to markdown string
//   await md.toMarkdown();
//   console.log(md.getMarkdown());

//   // 6. Save the updated markdown content
//   await md.save("./updated_example.md");

//   // 7. Delete the file after saving
//   await md.delete("./example.md");
// })();
