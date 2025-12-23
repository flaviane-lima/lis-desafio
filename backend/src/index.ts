import "reflect-metadata";
import express = require("express");
import cors = require("cors");
import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());

// importa as rotas
import userRoutes from "./routes/user";
import userProfileRoutes from "./routes/userProfile";

app.use(cors({
  origin: "http://localhost:4200", // endereço do frontend Angular
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.json());

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE! as any, // postgres, mysql, sqlite
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  username: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  synchronize: true,
  logging: true,
  entities: [__dirname + "/entities/*.ts"],
});

AppDataSource.initialize().then(() => {
  console.log("Banco conectado!");

  //registar as rotas
  app.use("/users", userRoutes);
  app.use("/profiles", userProfileRoutes);
  
  app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
});