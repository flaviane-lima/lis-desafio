import { Router } from "express";
import { AppDataSource } from "../index";
import { User } from "../entities/User";
import { UserProfile } from "../entities/UserProfile";

const router = Router();

router.get("/", async (_, res) => {
  const users = await AppDataSource.getRepository(User).find({
    relations: ["userProfile"],
  });
  res.json(users);
});

//cria um usuário vinculado a um perfil
router.post("/", async (req, res) => {
 const { name, email, pass, profileId } = req.body
  
  const profile = await AppDataSource.getRepository(UserProfile).findOneBy({ id_userprofile: profileId });
  if (!profile) {
    return res.status(400).json({ message: "Perfil inválido "});
  }

  const user = AppDataSource.getRepository(User).create({
    name,
    email,
    pass,
    userProfile: profile,
  });

  const result = await AppDataSource.getRepository(User).save(user);
  res.status(201).json(result);
});

export default router;