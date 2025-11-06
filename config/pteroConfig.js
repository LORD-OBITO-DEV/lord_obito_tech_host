import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const ptero = axios.create({
  baseURL: `${process.env.PTERO_API_URL}/api/application`,
  headers: {
    Authorization: `Bearer ${process.env.PTERO_API_KEY}`,
    "Content-Type": "application/json",
    Accept: "Application/vnd.pterodactyl.v1+json",
  },
});
