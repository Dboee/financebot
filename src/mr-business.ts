const { OpenAI } = require('langchain');
const { initializeAgentExecutor } = require('langchain/agents');
const { loadQAStuffChain, loadQAMapReduceChain } = require('langchain/chains');
const { SerpAPI, Calculator, ConversationChain } = require('langchain/tools');
const { Document } = require('langchain/document');

require('dotenv').config();

const Querytext = 'What school did Ford go to?';

const run = async (Querytext: string) => {
  console.log('run started');
  // instantiate the languagemodel
  const languagemodel = await new OpenAI({ temperature: 0.2, cache: true });

  // initialize the chain
  const chainA = loadQAStuffChain(languagemodel);

  // initialize the reference documents
  const docs = [
    new Document({ pageContent: 'Harrison went to Harvard.' }),
    new Document({ pageContent: 'Ford went to Yale.' }),
  ];

  const responseA = await chainA.call({
    input_documents: docs,
    question: Querytext,
  });

  console.log(responseA);

  console.log('run ended');
};

run(Querytext);
