import { Router } from "express";
import { AppDataSource } from "../index";
import { User } from "../entities/User";
import { UserProfile } from "../entities/UserProfile";
import bcrypt from "bcrypt"
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, async (_, res) => {
  const users = await AppDataSource.getRepository(User).find({
    relations: ["userProfile"],
  });
  res.json(users);
});

//cria um usuário vinculado a um perfil
router.post("/",requireAdmin, async (req, res) => {
 const { name, email, pass, profileId } = req.body
  
  const profile = await AppDataSource.getRepository(UserProfile).findOneBy({ id_userprofile: profileId });
  if (!profile) {
    return res.status(400).json({ message: "Perfil inválido "});
  }

  const hashedPass = await bcrypt.hash(pass, 10);

  const user = AppDataSource.getRepository(User).create({
    name,
    email,
    pass,
    userProfile: profile,
  });

  const result = await AppDataSource.getRepository(User).save(user);

  //remove senha do retorno
  const { pass: _, ... safeUser } = result
  res.status(201).json(safeUser);
});

export default router;