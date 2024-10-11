const csv2json = require("csv2json");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Define file paths
const connectionsFile = "connections.csv";
const jsonFile = "data.json";
const vault = "/Users/sullemanhossam/MEGA/PULP";

// Convert CSV to JSON and store the result in a JSON file
const convertCsvToJson = () => {
  fs.createReadStream(connectionsFile)
    .pipe(csv2json({ separator: ";" }))
    .pipe(fs.createWriteStream(jsonFile))
    .on("finish", () => {
      console.log("CSV file successfully converted to JSON");
      initializeNetwork(jsonFile);
    })
    .on("error", (err) => console.error("Error during conversion:", err));
};

class Node {
  constructor(name, url) {
    this.uuid = uuidv4();
    this.name = name;
    this.url = url;
    this.relations = [];
  }

  createDocument(location = vault) {
    const filePath = `${location}/${this.name.replace(/ /g, "_")}.md`;
    const relationsList = this.relations.length
      ? `\n\n## Related Nodes:\n- ${this.relations.join("\n- ")}`
      : "";

    // Check if the file already exists
    if (fs.existsSync(filePath)) {
      // Append relations if they exist
      this.appendToDocument(filePath, relationsList);
    } else {
      // Create a new document with the initial content
      const content = `<iframe src="${this.url}" width="600" height="400" frameborder="0"></iframe>${relationsList}`;
      this.writeToFile(filePath, content);
    }
  }

  // Method to write initial content to the file
  writeToFile(filePath, content) {
    try {
      fs.writeFileSync(filePath, content);
      console.log(`Document created at: ${filePath}`);
    } catch (err) {
      console.error("Error creating document:", err);
    }
  }

  // Method to append new relations to the existing document
  appendToDocument(filePath, relationsList) {
    if (!relationsList.trim()) return; // If there's nothing to append, return

    // Read existing content
    try {
      const existingContent = fs.readFileSync(filePath, "utf8");
      const relationsSection = existingContent.includes("## Related Nodes:")
        ? existingContent.split("## Related Nodes:")[0] + "## Related Nodes:"
        : existingContent + "\n\n## Related Nodes:";

      const newContent = `${relationsSection}${relationsList}\n`;
      fs.writeFileSync(filePath, newContent);
      console.log(`Document updated at: ${filePath}`);
    } catch (err) {
      console.error("Error updating document:", err);
    }
  }

  updateRelations(newRelations) {
    this.relations = newRelations;
    this.createDocument();
  }

  deleteDocument(location = vault) {
    const filePath = `${location}/${this.name.replace(/ /g, "_")}.md`;
    try {
      fs.unlinkSync(filePath);
      console.log(`Document deleted at: ${filePath}`);
    } catch (err) {
      console.error("Error deleting document:", err);
    }
  }
}

class Network {
  constructor() {
    this.nodes = {};
  }

  addNode(node) {
    this.nodes[node.uuid] = node;
    node.createDocument();
  }

  removeNode(uuid) {
    if (this.nodes[uuid]) {
      this.nodes[uuid].deleteDocument();
      delete this.nodes[uuid];
      console.log(`Node ${uuid} removed from the network.`);
    } else {
      console.error(`Node ${uuid} not found.`);
    }
  }

  displayNodes() {
    console.log("Network nodes:", this.nodes);
  }

  getNode(uuid) {
    return this.nodes[uuid];
  }

  establishRelation(uuid1, uuid2) {
    const node1 = this.getNode(uuid1);
    const node2 = this.getNode(uuid2);

    if (node1 && node2) {
      node1.relations.push(node2.name);
      node2.relations.push(node1.name);
      node1.createDocument();
      node2.createDocument();
      console.log(
        `Relation established between ${node1.name} and ${node2.name}`
      );
    } else {
      console.error("One or both nodes not found.");
    }
  }
}

class Connections {
  constructor(path) {
    this.path = path;
  }

  async loadConnections() {
    try {
      const data = await fs.promises.readFile(this.path, "utf8");
      return JSON.parse(data);
    } catch (err) {
      console.error("Error reading or parsing file:", err);
      throw err;
    }
  }

  formatConnections(data) {
    return data
      .filter(
        (item) => item["Notes:"] && !item["Notes:"].startsWith("First Name")
      )
      .map(({ "Notes:": notes }) => {
        const [
          firstName,
          lastName,
          url,
          email,
          company,
          position,
          connectedOn,
        ] = notes.split(",");
        return url && url.includes("linkedin.com")
          ? {
              name: `${firstName.trim()} ${lastName.trim()}`,
              email: email?.trim() || null,
              company: company?.trim() || null,
              position: position?.trim() || null,
              connectedOn: connectedOn?.trim() || null,
              url,
            }
          : null;
      })
      .filter(Boolean); // Remove null entries
  }
}

// Initialize the network after connections are loaded
const initializeNetwork = async (jsonPath) => {
  const connections = new Connections(jsonPath);
  try {
    const data = await connections.loadConnections();
    const formattedConnections = connections.formatConnections(data);
    console.log(formattedConnections);

    const nodeNetwork = new Network();

    formattedConnections.forEach((connection) => {
      const newNode = new Node(connection.name, connection.url);
      nodeNetwork.addNode(newNode);
    });

    nodeNetwork.displayNodes();

    // Establish a relation between the first two connections if available
    if (formattedConnections.length > 1) {
      nodeNetwork.establishRelation(
        formattedConnections[0].url,
        formattedConnections[1].url
      );
    }
  } catch (err) {
    console.error("Error loading connections:", err);
  }
};

// Start the conversion process
convertCsvToJson();
