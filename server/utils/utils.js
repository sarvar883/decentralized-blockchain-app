const UTILS = {
  NODE_NUMBER: 1,
  PORT: 5001,
  // each block has 3 transactions
  TRANSACTIONS_IN_BLOCK: 3,

  CURRENT_USER: {
    id: '618a1e514e21c9002fa089eb',
    name: 'Alice',
    publicKey: `-----BEGIN PUBLIC KEY-----
MFswDQYJKoZIhvcNAQEBBQADSgAwRwJAcco+CMUdnoX/he1MxuaaWZaH3rC3V3N0
76hO9KcjbZ5auahspuqMRvKvHwegstfMSz/2H/M8cd7HxWSYgcnklQIDAQAB
-----END PUBLIC KEY-----`,
    privateKey: `-----BEGIN RSA PRIVATE KEY-----
MIIBOQIBAAJAcco+CMUdnoX/he1MxuaaWZaH3rC3V3N076hO9KcjbZ5auahspuqM
RvKvHwegstfMSz/2H/M8cd7HxWSYgcnklQIDAQABAkAggouerdJ8jAQpG1coLJJE
rkE7WnnHPnFWV1vXgjkZBBc3my+YI1Grg8bA7u/X2ErhPVSGfgB0tSEW0FGxsmax
AiEAum0f4F5G5UGpHzGf595LgiMdxEAgUqCtxUloB2wkshcCIQCcQZANJAMrcGdW
OHhkPiaj03jMX6cRKAQj2HJcOi0mMwIgdeK/f3/eUOZebY1R0qutD9Po5MqwJc/Z
UqICmH74DW0CIGiXijEBlg2Ro9oW2p9e6sZmW0mSDWZyfrLvwzzwxB/5AiEAktnm
6j0lT/g6cG1CR9Dj2Mms6ikCH+krEakGJk0bMws=
-----END RSA PRIVATE KEY-----`,
  },

  ALL_USERS: [
    // NODE_2
    {
      id: '618516ac4e21c9002fa06f42',
      name: 'Bob',
      publicKey: `-----BEGIN PUBLIC KEY-----
MFswDQYJKoZIhvcNAQEBBQADSgAwRwJAbU7blkFBY3hNJfWpZrBouwHSDNTdhI9e
iYNvor005UlqHHxx+gCG2Sle2yJtZxcNOEwJPOUtvfHhzqsfLGP+zwIDAQAB
-----END PUBLIC KEY-----`,
      url: 'http://localhost:5002',
    },


    // NODE_3
    {
      id: '610990e6a3f7360034911fe8',
      name: 'Tom',
      publicKey: `-----BEGIN PUBLIC KEY-----
MFswDQYJKoZIhvcNAQEBBQADSgAwRwJAdy1KWrPZ7uUYpWEhbEBoBBxlcrnsvjki
VWPm/X6egmAFa4ZCniLAAHD88XpUwuA3quoTap4nox7IEQ1iOIlEjQIDAQAB
-----END PUBLIC KEY-----`,
      url: 'http://localhost:5003',
    },


    // NODE_4
    {
      id: '60c882d33b8b680037f3d972',
      name: 'John',
      publicKey: `-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMPmv95wlzMKBaadl76QaFWkvbVUKsmb
hRjuscrMVGxUvT0kHy4CH2nqIhS8nT4Eiihd75fnyQBUljl1ruVmOr8CAwEAAQ==
-----END PUBLIC KEY-----`,
      url: 'http://localhost:5004',
    },
  ],
};

module.exports = UTILS;