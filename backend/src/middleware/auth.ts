import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../index";
import { User } from "../entities/User";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const [type, token] = authorization.split(" ");

  if (!type || type.toLowerCase() !== "bearer" || !token) {
    return res.status(401).json({ message: "Formato de token inválido" });
  }

  const secret = process.env.JWT_SECRET!;
  jwt.verify(token, secret, async (err, decodedToken: any) => {
    if (err || !decodedToken?.id) {
      return res.status(403).json({ message: "Token inválido ou expirado" });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: decodedToken.id },
      relations: ["userProfile"],
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // adiciona propriedades extras ao req
    (req as any).decodedToken = decodedToken;
    (req as any).role = user.userProfile.name;

    next();
  });
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!(req as any).decodedToken) {
    return res.status(401).json({ message: "Não autorizado" });
  }
  next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!(req as any).decodedToken) {
    return res.status(401).json({ message: "Não autorizado" });
  }
  if ((req as any).role !== "Admin") {
    return res.status(403).json({ message: "Acesso negado" });
  }
  next();
};
