export class Document {
  constructor(name = "Untitled", content = "", filePath = null) {
    this.name = name;
    this.content = content;
    this.filePath = filePath; // Path to save the document, default is null (unsaved)
  }

  create(name, content = "") {
    // Create a new document with the specified name and optional content
    this.name = name;
    this.content = content;
    this.filePath = null; // New document doesn't have a saved path yet
    console.log(
      `Document '${this.name}' created with content: '${this.content}'`
    );
  }

  delete() {
    // Deletes the document from the file system if it has a valid file path
    if (this.filePath) {
      try {
        // Delete the file using Deno's removeSync
        Deno.removeSync(this.filePath);
        console.log(`File at '${this.filePath}' deleted successfully.`);
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    } else {
      console.log("No file to delete from the filesystem.");
    }

    // Reset the document's properties
    this.name = "Untitled";
    this.content = "";
    this.filePath = null;
    console.log("Document reset.");
  }

  append(newContent) {
    // Append new content to the document
    this.content += newContent;
    console.log(`Content appended to '${this.name}'.`);
  }

  save(filePath = null) {
    // Use the existing filePath if one is not provided (default save behavior)
    if (filePath) {
      this.filePath = filePath; // Update the file path if "Save As" is triggered
    } else if (!this.filePath) {
      console.error("No file path specified. Use 'Save As' to provide a path.");
      return;
    }

    // Simulate saving the document (since JavaScript can't natively write to the file system in browsers)
    console.log(
      `Saving document '${this.name}' to '${this.filePath}' with content:`
    );
    console.log(this.content);

    try {
      // Save document using Deno API
      const encoder = new TextEncoder();
      const data = encoder.encode(this.content);
      Deno.writeFileSync(this.filePath, data);
      console.log(`Document successfully written to ${this.filePath}`);
    } catch (error) {
      console.error("Error saving document:", error);
    }
  }

  saveAs(newFilePath) {
    // "Save As" function to save the document to a new location
    this.save(newFilePath);
  }

  read() {
    // Read and display document content
    console.log(`Document '${this.name}' contains:`);
    console.log(this.content);
  }
}
