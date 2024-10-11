export class Network {
  nodes: any[]; // Specify the type for nodes, if possible

  constructor(nodes: any[] = []) {
    this.nodes = nodes;
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
  init(pilot): void {
    if (!pilot.jsonAst) {
      throw new Error("AST is not initialized. Load or parse markdown first.");
    }
    // Add your logic to append or modify content in the AST here
  }
}
