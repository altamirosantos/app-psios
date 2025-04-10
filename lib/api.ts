export async function saveUserToApi(userData: {
    uid: string;
    fullName: string;
    nickname: string;
    birthDate: string;
    email: string;
    gender: string;
  }) {
    await fetch('https://sua-api.com/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
  }