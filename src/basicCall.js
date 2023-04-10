"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { OpenAI } = require('langchain');
require('dotenv').config();
const basicCall = async () => {
    // temerature controls how ransom/creative the response is. (range: 0-1)
    const model = new OpenAI({ temperature: 0.5 });
    const res = await model.call('What is the best way to get rich?');
    console.log(res);
};
exports.default = basicCall;
