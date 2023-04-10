import { OpenAI } from 'langchain/llms';

export const run = async () => {
  // temerature controls how ransom/creative the response is. (range: 0-1)
  const model = new OpenAI({ temperature: 0.5 });

  const res = await model.call('What is the best way to get rich?');
  console.log(res);
};
