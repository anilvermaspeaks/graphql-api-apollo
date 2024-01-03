import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from '@apollo/server/standalone';

import { PrismaClient, Prisma } from "@prisma/client";

import { typeDefs} from  './schema';
import { Query, Mutation} from './resolvers';

import { getUserFromToken} from './util/getUserFromToken'

const prisma = new PrismaClient({
    errorFormat: 'pretty',
  })

export interface Context {
    prisma: PrismaClient<Prisma.PrismaClientOptions, never>,
    userInfo: { userId: number; };
}

const resolvers = {
    Query,
    Mutation
  };


  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, 
    {
      context: async ({ req, res }) => ({
        userInfo: req.headers.authorization? await getUserFromToken(req.headers.authorization): null,
        prisma
      }),
    listen: { port: 4000 },
  });
  
  console.log(`🚀  Server ready at: ${url}`);
  