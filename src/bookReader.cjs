const {
  PDFLoader,
  TextLoader,
  UnstructuredLoader,
} = require('langchain/document_loaders');
const { Document } = require('langchain/document');
const {
  RecursiveCharacterTextSplitter,
  TextSplitter,
} = require('langchain/text_splitter');
const { OpenAIEmbeddings, embedDocuments } = require('langchain/embeddings');
const { PineconeClient } = require('@pinecone-database/pinecone');
const { PineconeStore } = require('langchain/vectorstores');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();

const FILENAME = './businessBooks/A_Beginners_Guide_To_The_World_Economy.pdf';

class CustomPineconeStore extends PineconeStore {
  // ... rest of the class definition ...

  static async fromDocuments(docs, embeddings, options) {
    const store = new this({
      embeddings,
      pineconeIndex: options.pineconeIndex,
      namespace: options.namespace,
    });

    if (docs.length !== embeddings.length) {
      throw new Error('Documents and embeddings lengths do not match.');
    }

    // Convert the embeddings to lists of float values
    const serializedEmbeddings = embeddings.map((embedding) =>
      Array.from(embedding)
    );

    const ids = Array.from({ length: docs.length }, () => uuidv4());
    await store.addVectors(serializedEmbeddings, docs, ids);

    return store;
  }
}

const pineconeClient = new PineconeClient();

const loadBook = async (FILENAME) => {
  console.log('Loading book...');
  const loader = new PDFLoader(FILENAME, {
    splitPages: true,
    pdfjs: () =>
      import('pdfjs-dist/legacy/build/pdf.js').then((m) => m.default),
  });

  const data = await loader.load();
  // console.log('data: ', data);
  console.log('documents: ', data.length);
  console.log('characters in document: ', data[0].pageContent.length);
  console.log('Book loaded.');
  return data.slice(1);
};

const createEmbeddingsFunc = async (docs) => {
  // Creating Embeddings
  console.log('Creating Embeddings...');
  const embedded = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    stripNewLines: false,
    batchSize: 1,
  });
  const embeddedWithDocs = await embedded.embedDocuments(
    docs.map((d) => d.pageContent)
  );
  console.log('Embeddings created.');
  return embeddedWithDocs;
};

const saveBook = async (FILENAME) => {
  console.log('Initializing Pinecone Client...');
  await pineconeClient.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
    // projectName: 'financebot',
  });
  const pineconeIndex = pineconeClient.Index('financebot');
  console.log('pineconeClient initialized.');

  // load the book from file
  const rawDocs = await loadBook(FILENAME);

  // split the book into documents
  console.log('Splitting book into documents...');
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 20,
  });

  const docs = await splitter.splitDocuments(rawDocs);
  console.log('docs: ', docs.length);
  console.log('Splitting completed.');

  const embeddedDocs = await createEmbeddingsFunc(docs);

  // save the embeddings to Pinecone
  console.log('Saving book to Pinecone...');
  console.log('First document:', docs[0]);
  console.log('First document vector:', embeddedDocs[0]);

  await CustomPineconeStore.fromDocuments(docs, embeddedDocs, {
    pineconeIndex,
    namespace: pineconeIndex.namespace,
  });
  console.log('Completed saving book to Pinecone');
};

(async () => {
  await saveBook(FILENAME);
  console.log('Done.');
})();
