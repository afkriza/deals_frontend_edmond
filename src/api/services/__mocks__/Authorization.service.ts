export const login = (email: string, password: string) =>
  new Promise((resolve, reject) => {
    if (email === 'test@test.com' && password === 'test') {
      resolve({
        user: {
          id: 1
        },
        token: 'ttookkeenn'
      });
    } else {
      reject({});
    }
  });

export const setPassword = () => Promise.resolve();

export const getCurrentUser = () =>
  Promise.resolve({
    id: 1,
    name: 'Dummy user'
  });
