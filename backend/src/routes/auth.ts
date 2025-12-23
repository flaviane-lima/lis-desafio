import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppDataSource } from "../index";
import { User } from "../entities/User";

const router = Router();

//rota de login
router.post("/login", async (req, res) => {
    const { email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatorios"});
    }

    try {
        // busca usuário pelo email
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({
            where: { email },
            relations: ["userProfile"], // traz o perfil junto
        });

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        // validar a senha
        const validPassword = await bcrypt.compare(password, user.pass);
        if (!validPassword) {
            return res.status(401).json({ message: "Senha incorreta" })
        }

        //gera token JWT
        const secret = process.env.JWT_SECRET!;
        const token = jwt.sign(
            {
                id: user.id,
                role: user.userProfile.name
            },
            secret,
            { expiresIn: "1h"}
        );

        return res.status(200).json({
            message: "Login realizado com sucesso",
            accessToken: token,
            user: {
                id: user.id,
                email: user.email,
                role: user.userProfile.name,

            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno no servidor" });
        
    }

});

export default router;