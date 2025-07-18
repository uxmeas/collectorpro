const fetch = require('node-fetch');

async function createTestAccount() {
  try {
    const response = await fetch('http://localhost:3000/api/debug/simple-register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Account created successfully!');
      console.log('Email: test@example.com');
      console.log('Password: password123');
      console.log('You can now log in at: http://localhost:3000/login');
    } else {
      console.log('❌ Error:', data.error);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

createTestAccount(); 