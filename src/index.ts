import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from '@apollo/server/standalone';

import { typeDefs} from  './schema';
import { Query, Mutation} from './resolvers';


const resolvers = {
    Query,
    //Mutation
  };


  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  
  console.log(`🚀  Server ready at: ${url}`);
  