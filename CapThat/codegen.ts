import 'dotenv/config';
import { CodegenConfig } from '@graphql-codegen/cli';

if (process.env.HASURA_ADMIN_SECRET === undefined) {
  throw new Error('HASURA_ADMIN_SECRET not found in environment variables');
}

const config: CodegenConfig = {
  schema: [
    {
      'https://aptos-social.hasura.app/v1/graphql': {
        headers: {
          ['X-Hasura-Admin-Secret']: process.env.HASURA_ADMIN_SECRET,
        },
      },
    },
  ],
  documents: [
    './components/**/*.tsx',
    './components/*.ts',
    './gql/**/*.tsx',
    './gql/*.ts',
    './hooks/**/*.tsx',
    './hooks/*.ts',
    './screens/**/*.tsx',
    './screens/*.ts',
  ],
  generates: {
    './__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
