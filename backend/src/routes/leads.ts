import { Router, Request, Response } from "express";
import { AppDataSource } from "../index";
import { Lead } from "../entities/Lead";
import { User } from "../entities/User";
import { requireAuth } from "../middleware/auth";

const router = Router();

// lista todos os leads (apenas autenticados)
router.get("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const leads = await AppDataSource.getRepository(Lead).find({
      relations: ["id_user_register", "id_user_approve", "id_user_delete"],
    });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar leads", error });
  }
});

// cria um novo lead (apenas autenticado)
router.post("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const { name_lead, registration_number, earnings, loan_value } = req.body;

    if (!name_lead || !registration_number || !earnings || !loan_value) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: (req as any).decodedToken.id });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const leadRepo = AppDataSource.getRepository(Lead);
    const lead = leadRepo.create({
      name_lead,
      registration_number,
      earnings,
      loan_value,
      id_user_register: user,
    });

    const result = await leadRepo.save(lead);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar lead", error });
  }
});

export default router;
