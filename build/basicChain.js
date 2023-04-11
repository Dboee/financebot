"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const { OpenAI } = require('langchain/llms');
const { LLMChain } = require('langchain/chains');
const { PromptTemplate } = require('langchain/prompts');
/**
 * A basic chain sends an instruction (prompt) to a large language model
 * like OpenAI, which replies with a response
 *  */
const run = async () => {
    const model = new OpenAI({ temperature: 0.1 });
    const template = 'What is the capital city of {country}?';
    const prompt = new PromptTemplate({ template, inputVariables: ['country'] });
    // create a chain that takes the user input, format it and then sends to LLM
    const chain = new LLMChain({ llm: model, prompt });
    // run the chain by passing the input
    const res = await chain.call({ country: 'France' });
    console.log({ res });
    // output: {text: 'Paris'}
};
exports.run = run;
//# sourceMappingURL=basicChain.js.map