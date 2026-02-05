// Quick API test
const testRegister = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'testuser@test.com',
        password: 'test123',
        role: 'buyer'
      })
    });
    
    const data = await response.json();
    console.log('Registration Response:', response.status, data);
  } catch (error) {
    console.error('Registration Error:', error.message);
  }
};

const testLogin = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'demo1@gmail.com',
        password: 'demo11'
      })
    });
    
    const data = await response.json();
    console.log('Login Response:', response.status, data);
  } catch (error) {
    console.error('Login Error:', error.message);
  }
};

console.log('Testing Registration...');
await testRegister();

console.log('\nTesting Login...');
await testLogin();
