import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from '@apollo/server/standalone';

import { PrismaClient, Prisma } from "@prisma/client";

import { typeDefs} from  './schema';
import { Query, Mutation} from './resolvers';

const prisma = new PrismaClient()

export interface Context {
    prisma: PrismaClient<Prisma.PrismaClientOptions, never>
}

const resolvers = {
    Query,
    Mutation
  };


  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    context: async ({ req, res }) => ({
        prisma,
      }),
    listen: { port: 4000 },
  });
  
  console.log(`🚀  Server ready at: ${url}`);
  