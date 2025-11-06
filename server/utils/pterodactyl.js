import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const PT_URL = process.env.PTERO_URL;         // ex: https://panel.lordobito.tech
const PT_KEY = process.env.PTERO_API_KEY;     // ton API Admin (Bearer)

export async function createServer({ username, email, ram, cpu, disk, type }) {
  try {
    const egg = await getEggId(type); // Selon le langage
    const body = {
      name: `${username}-${Date.now()}`,
      user: await getUserId(email),
      egg,
      docker_image: "ghcr.io/parkervcp/yolks:nodejs_18", // exemple Node.js
      startup: "npm start",
      environment: {},
      limits: {
        memory: ram * 1024, // MB
        swap: 0,
        disk: disk * 1024,
        io: 500,
        cpu
      },
      feature_limits: { databases: 1, backups: 1, allocations: 1 },
      deploy: {
        locations: [Number(process.env.PTERO_LOCATION_ID || 1)],
        dedicated_ip: false,
        port_range: []
      },
      start_on_completion: true
    };

    const res = await fetch(`${PT_URL}/api/application/servers`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PT_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Pterodactyl API error:", errorText);
      throw new Error("Erreur création serveur");
    }

    const json = await res.json();
    return json;
  } catch (e) {
    console.error("Erreur création panel:", e);
    throw e;
  }
}

async function getUserId(email) {
  const res = await fetch(`${PT_URL}/api/application/users?filter[email]=${email}`, {
    headers: { "Authorization": `Bearer ${PT_KEY}`, "Accept": "application/json" }
  });
  const data = await res.json();
  if (data.data && data.data.length > 0) return data.data[0].attributes.id;

  // sinon créer un utilisateur
  const body = {
    email,
    username: email.split("@")[0],
    first_name: email.split("@")[0],
    last_name: "Client",
    password: Math.random().toString(36).slice(-10)
  };
  const create = await fetch(`${PT_URL}/api/application/users`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${PT_KEY}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(body)
  });
  const user = await create.json();
  return user.attributes.id;
}

async function getEggId(type) {
  switch (type.toLowerCase()) {
    case "node.js": return Number(process.env.PTERO_NODE_EGG);
    case "python": return Number(process.env.PTERO_PYTHON_EGG);
    case "minecraft": return Number(process.env.PTERO_MC_EGG);
    default: return Number(process.env.PTERO_NODE_EGG);
  }
      }
