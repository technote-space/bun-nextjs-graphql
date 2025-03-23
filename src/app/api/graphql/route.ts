import '^/server/config/registry';
import { ComplexityPlugin } from '$/complexityPlugin';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { addResolversToSchema } from '@graphql-tools/schema';
import { getContext } from './context';
import { resolvers } from './resolvers';

const schema = loadSchemaSync('src/graphql-schema/src/*.graphql', {
  loaders: [new GraphQLFileLoader()],
});

const server = new ApolloServer({
  schema: addResolversToSchema({ schema, resolvers }),
  plugins: [new ComplexityPlugin()],
});

const handler = startServerAndCreateNextHandler(server, {
  context: (req) => getContext(req),
});

export { handler as GET, handler as POST };
