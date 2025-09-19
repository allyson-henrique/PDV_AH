import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';

// Configuração do AWS Amplify/AppSync
const amplifyConfig = {
  aws_project_region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  aws_appsync_graphqlEndpoint: import.meta.env.VITE_APPSYNC_ENDPOINT,
  aws_appsync_region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  aws_appsync_authenticationType: 'API_KEY',
  aws_appsync_apiKey: import.meta.env.VITE_APPSYNC_API_KEY,
  // Configuração offline
  aws_appsync_localstoreConflictResolver: 'AUTOMERGE',
  aws_appsync_maxDeltaSyncIntervalInSeconds: 300, // 5 minutos
};

// Inicializar Amplify apenas se as variáveis estiverem configuradas
if (import.meta.env.VITE_APPSYNC_ENDPOINT && import.meta.env.VITE_APPSYNC_API_KEY) {
  Amplify.configure(amplifyConfig);
}

export const client = generateClient();

// Verificar se AppSync está configurado
export const isAppSyncConfigured = () => {
  return !!(import.meta.env.VITE_APPSYNC_ENDPOINT && import.meta.env.VITE_APPSYNC_API_KEY);
};