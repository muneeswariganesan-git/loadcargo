export const environment = {
  production: false,
  msalConfig: {
    auth: {
      clientId: '7e6eb72e-fb03-47c2-86b8-88c7535403ca',
      authority: 'https://login.microsoftonline.com/011da57f-b251-41f7-bf22-e42fa42028a5/v2.0',
      redirectUri: 'https://loadcargo.dev.iagcargo.com/oauth/callback',
      postLogoutRedirectUri: 'https://loadcargo.dev.iagcargo.com/',
    },
  },

  apiConfig: {
    scopes: ['User.Read.All', 'Directory.Read.All'],
    uri: 'https://graph.microsoft.com',
  },

  loadCargoApi: {
    uri: 'https://loadcargo.dev.iagcargo.com/v1/',
    scopes: ['User.Read.All', 'User.Read', 'openid'],
  },
};
