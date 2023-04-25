import { NextApiRequest, NextApiResponse } from 'next';

import { initPineconeClient, chat } from '@/utils/server/rosdoc';

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {

  switch (req.method) {
    case 'GET':
      // Handle GET request
      res.status(200).json({ message: 'ROS GPT endpoint is running' });
      break;
    case 'POST':
      // Handle POST request
      const datastore = await initPineconeClient();

      const { messages } = req.body;

      const userMessage = messages[messages.length - 1];
      const query = userMessage.content.trim();

      const answer = await chat({vectorStore: datastore, query: query});

      res.status(200).json({ answer });
      break;
    default:
      // Handle other request methods
      res.status(405).end(); // Method Not Allowed
      break;
  }
}

export default handler;