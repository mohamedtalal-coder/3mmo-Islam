fetch('https://3mmo-islam-cvl8.vercel.app/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Origin': 'https://3mmo-islam.vercel.app'
  },
  body: JSON.stringify({
    email: 'test456@test.com',
    password: 'password123',
    fullName: 'Test User',
    role: 'STUDENT'
  })
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
