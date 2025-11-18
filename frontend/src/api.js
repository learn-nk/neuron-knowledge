const BASE_URL = "http://localhost:3000"; // Local backend

// When you're ready to use Railway:
// const BASE_URL = "https://neuron-knowledge-production.up.railway.app";

export const askAI = async(question)=>{
  const res = await fetch(`${BASE_URL}/api/ai/ask`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({question})
  });
  return res.json();
};
