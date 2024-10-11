import { Network } from "./composable/network";
import { Node } from "./composable/node";
 
export const valutLocation = "/Users/sullemanhossam/MEGA/PULP";
export const connectionsFileLocation = "./connections.csv";

let superNodeNetwork = new Network();
let pilotNode = new Node("Hossam Sulleman");
superNodeNetwork.init(pilotNode);
