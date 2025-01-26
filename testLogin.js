const fetch = require("node-fetch");

async function testLogin() {
  const response = await fetch("https://jobly-backend-wf07.onrender.com/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "testuser",  // Use an actual username in Supabase
      password: "password"   // Use the correct password
    })
  });

  const data = await response.json();
  console.log("Login Response:", data);
}

testLogin().catch(console.error);
