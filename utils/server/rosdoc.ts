import { PineconeClient } from "@pinecone-database/pinecone";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

export const initPineconeClient = async () => {
  const client = new PineconeClient();
  await client.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });
  const pineconeIndex = client.Index(process.env.PINECONE_INDEX);

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex }
  );
  return vectorStore;
};

export const chat = async ({
  vectorStore,
  query,
  prompt,
  topK
}: {
  vectorStore: PineconeStore;
  query: string;
  prompt?: string;
  topK?: number;
}) => {

  const model = new OpenAI({ modelName: 'gpt-3.5-turbo' });

  // Search the vector DB independently with meta filters
  /*

  const instruct = `You are an AI assistant providing helpful advice. Given the following extracted parts of a long document and a question. 
  If you don't know the answer, just say that you don't know. Don't try to make up an answer.`;

  // const finalPrompt = `As a customer support agent, channel the spirit of William Shakespeare, the renowned playwright and poet known for his eloquent and poetic language, use of iambic pentameter, and frequent use of metaphors and wordplay. Respond to the user's question or issue in the style of the Bard himself.
  // const finalPrompt = `As a customer support agent, channel the spirit of Arnold Schwarzenegger, the iconic actor and former governor known for his distinctive Austrian accent, catchphrases, and action-hero persona. Respond to the user's question or issue in the style of Arnold himself.
  // As a customer support agent, please provide a helpful and professional response to the user's question or issue.


  let results = await vectorStore.similaritySearch("pinecone", topK, {
    foo: "bar",
  });

  const context = results
    ?.map((each) => `Content: ${each.pageContent}\nSource: ${each.metadata.source}`)
    ?.join('\n\n');

  const finalPrompt = `${prompt || instruct}
  Create a final answer with references ("SOURCES")
  If you know the answer, ALWAYS return a "SOURCES" part in your answer otherwise don't.
  ALWAYS ANSWER IN THE SAME LANGUAGE AS THE QUESTION WITHOUT BREAKING THE ROLE MENTIONED ABOVE.
  
  QUESTION: ...
  =========
  Content: ...
  Source: 28-pl
  Content: ...
  Source: http://example.com
  =========
  FINAL ANSWER: ...
  SOURCES: 28-pl

  QUESTION: ...
  =========
  Content: ...
  Source: file.pdf
  Content: ...
  Source: hello.txt
  =========
  FINAL ANSWER: ...
  SOURCES:


  QUESTION: ${query}
  =========
  ${context}
  =========
  FINAL ANSWER:
  `;

  const response = await model.call(finalPrompt);

  const regex = /SOURCES:\s*(.+)/;
  const match = response?.trim()?.match(regex);
  const source = match?.[1]?.replace('N/A', '')?.replace('None', '')?.trim();

  let answer = response?.trim()?.replace(regex, '')?.trim();
  answer = sourcesText ? `${answer}\n\n${sourcesText}` : answer;

  */

  // Use Langchain Pinecone to search the vector DB
  const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
    k: topK || 3,
    returnSourceDocuments: true,
  });

  const response = await chain.call({ query: query });
  
  const sources = response.sourceDocuments.map((doc) => doc.metadata.source);
  const sourcesText = sources.join('\n\n');

  return sourcesText ? `${response.text}\n\n${sourcesText}` : response.text;

};