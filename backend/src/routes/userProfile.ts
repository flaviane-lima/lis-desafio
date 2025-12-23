import { Router } from "express";
import { AppDataSource } from "..";
import { UserProfile } from "../entities/UserProfile";

const router = Router();

//lista todos os perfis
router.get("/", async(__dirname, res) => {
    const profiles = await AppDataSource.getRepository(UserProfile).find();
    res.json(profiles);

});

//post/ cria um novo perfil.
router.post("/", async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Nome do perfil é obrigatório"})
    }

    const profileRepo = AppDataSource.getRepository(UserProfile);
    const profile = profileRepo.create({ name });
    const result =  await profileRepo.save(profile)

    res.status(201).json(result);

});

export default router;