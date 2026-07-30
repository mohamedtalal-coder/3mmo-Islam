fetch('https://3mmo-islam-cvl8.vercel.app/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Origin': 'https://3mmo-islam.vercel.app'
  },
  body: JSON.stringify({
    email: 'test456@test.com',
    password: 'password123'
  })
})
.then(async res => {
  console.log('Status:', res.status);
  console.log('Headers:', res.headers.get('set-cookie'));
  console.log('Body:', await res.json());
})
.catch(console.error);
