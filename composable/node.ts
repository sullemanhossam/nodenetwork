import { valutLocation } from "../main";
import { Document } from "./document";
import { v5 } from "https://deno.land/std/uuid/v5.ts";

export class Node {
  //   private jsonAst: any; // Define the type according to your needs
  //   nodes: any[]; // Specify the type for nodes, if possible
  document;
  id;

  constructor(name, id = v5()) {
    this.id = id;
    // this.nodes = nodes;
    this.document = new Document(name, "", valutLocation);
  }
  // // Parse markdown string to AST (JSON)
  // async fromMarkdown(mdString: string): Promise<void> {
  //   const processor = remark().use(remarkParse);
  //   this.jsonAst = processor.parse(mdString);
  //   this.markdownContent = mdString;
  // }

  // // Convert AST (JSON) back to markdown string
  // async toMarkdown(): Promise<string> {
  //   if (!this.jsonAst) {
  //     throw new Error("AST is not initialized. Load or parse markdown first.");
  //   }
  //   const processor = remark().use(remarkStringify);
  //   this.markdownContent = processor.stringify(this.jsonAst);
  //   return this.markdownContent;
  // }

  // Append content to the Markdown (updates AST)
  attatch(location): void {
    if (!this.jsonAst) {
      throw new Error("AST is not initialized. Load or parse markdown first.");
    }
    console.log(location);
    // Add your logic to append or modify content in the AST here
  }

  // Append content to the Markdown (updates AST)
  plant(location): void {
    if (!this.jsonAst) {
      throw new Error("AST is not initialized. Load or parse markdown first.");
    }
    console.log(location);
    // Add your logic to append or modify content in the AST here
  }

  // Append content to the Markdown (updates AST)
  initialize(): void {
    if (!this.jsonAst) {
      throw new Error("AST is not initialized. Load or parse markdown first.");
    }
    // Add your logic to append or modify content in the AST here
  }
}
