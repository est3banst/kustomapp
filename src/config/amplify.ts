import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'sa-east-1_BJpfWnk1g',
      userPoolClientId: '4k0t0v481csbcd9babt48nuqm5',
    //   identityPoolId : 'sa-east-1:ff04772f-2b6e-4a5d-8979-c3029adabf1f',
      loginWith: {
        email: true,
        phone: false,
        username: false,
      },
      signUpVerificationMethod: 'code',
      userAttributes: {
        email: {
          required: true,
        },
      }
    }
  }, 

});