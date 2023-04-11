const { PromptTemplate } = require('langchain');

require('dotenv').config();

const run = async () => {
  const template = 'What language do they spreak in {country}?';
  const prompt = new PromptTemplate({
    inputVariables: ['country'],
    template,
  });
  const res = await prompt.format({ country: 'France' });

  console.log(res);
};

run();
