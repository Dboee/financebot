"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
//process.argv returns an array containing command line arguments
// exampleName is the file path of the example we want to `run`
const [exampleName, ...args] = process.argv.slice(2);
console.log(exampleName, ...args);
let runExample;
try {
    ({ run: runExample } = require(path_1.default.join(__dirname, exampleName)));
}
catch {
    throw new Error(`Could not load example ${exampleName}`);
}
runExample();
//# sourceMappingURL=index.js.map