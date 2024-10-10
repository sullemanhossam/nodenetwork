const csv2json = require("csv2json");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid"); // Add UUID generator

// Define file paths
const connectionsFile = "connections.csv";
const jsonFile = "data.json";

// Convert CSV to JSON and store the result in a JSON file
fs.createReadStream(connectionsFile)
  .pipe(
    csv2json({
      // CSV separator is ';'
      separator: ";",
    })
  )
  .pipe(fs.createWriteStream(jsonFile))
  .on("finish", () => {
    console.log("CSV file successfully converted to JSON");
    // After converting, initialize the network
    initializeNetwork(jsonFile);
  })
  .on("error", (err) => {
    console.error("Error during CSV to JSON conversion:", err);
  });

class Node {
  constructor(name, uuid = uuidv4(), url) {
    this.uuid = uuid; // Use provided uuid
    this.name = name; // Initialize with connection data
    this.url = url; // Store LinkedIn URL or other identifier
  }

  createDocument(name, content, location) {
    const filePath = `${location}/${name}.md`;
    try {
      fs.writeFileSync(filePath, `# ${name}\n\n${content}`);
      console.log(`Document created at: ${filePath}`);
    } catch (err) {
      console.error("Error creating document:", err);
    }
  }
}

class Network {
  constructor(nodes = {}) {
    this.pilot = nodes[Object.keys(nodes)[0]] ?? null; // Get the first node as the pilot if it exists
    this.nodes = nodes; // Initialize with an empty or provided dictionary of nodes
  }

  addNodes(nodes) {
    nodes.forEach((node) => {
      this.nodes[node.uuid] = node; // Add each node with uuid as the dynamic key
    });
  }

  displayNodes() {
    console.log("Network nodes:", this.nodes);
  }
}

// Class to handle loading and parsing connections from a file
class Connections {
  constructor(path) {
    this.path = path; // Path to the connections file
  }

  formatConnections(data) {
    const formattedData = [];

    data.forEach((item) => {
      const notes = item["Notes:"];

      // Skip empty or metadata rows
      if (!notes || notes.startsWith("First Name")) {
        return;
      }

      // Change delimiter from ',' to ';' if necessary
      const [firstName, lastName, url, email, company, position, connectedOn] =
        notes.split(",");

      if (url && url.includes("linkedin.com")) {
        formattedData.push({
          name: `${firstName.trim()} ${lastName.trim()}`,
          email: email ? email.trim() : null,
          company: company ? company.trim() : null,
          position: position ? position.trim() : null,
          connectedOn: connectedOn ? connectedOn.trim() : null,
          url,
        });
      }
    });

    return formattedData;
  }

  // Method to load and parse JSON data from file
  loadConnections() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.path, "utf8", (err, data) => {
        if (err) {
          console.error("Error reading file:", err);
          reject(err); // Handle errors if file reading fails
        } else {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (parseError) {
            console.error("Error parsing JSON data:", parseError);
            reject(parseError); // Handle JSON parsing errors
          }
        }
      });
    });
  }
}

// Function to initialize the network after connections are loaded
function initializeNetwork(jsonPath) {
  const connections = new Connections(jsonPath);

  // Load connections and initialize the network
  connections
    .loadConnections()
    .then((data) => {
      const formattedConnections = connections.formatConnections(data);
      console.log(formattedConnections);

      // Create nodes from formatted LinkedIn connections
      const linkedInNodes = formattedConnections.map((connection) => {
        // Use the URL as UUID if it is a LinkedIn connection
        const uuid = connection.url;
        return new Node(connection.name, uuid, connection.url); // Provide name, URL, and use URL as uuid
      });

      // Initialize the pilot node and the network
      const pilotNode = new Node("Hossam Sulleman");
      const nodeNetwork = new Network({ [pilotNode.uuid]: pilotNode }); // Create a new network with the pilot node

      console.log("Formatted LinkedIn Nodes:", linkedInNodes);
      nodeNetwork.addNodes(linkedInNodes); // Add LinkedIn nodes to the network
      nodeNetwork.displayNodes(); // Display the network nodes
    })
    .catch((err) => {
      console.error("Error loading connections:", err);
    });
}
