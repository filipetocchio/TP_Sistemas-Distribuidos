import { prisma, isPrismaError } from '../../utils/prisma';
import { Request, Response } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const usuarioSchema = z.object({
  username: z.string()
    .min(1, "Username é obrigatório")
    .max(20, "Username não pode exceder 20 caracteres"),
  password: z.string()
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.string()
    .min(1, "Role deve ter pelo menos 1 caractere")
    .optional(),
}).strict();

async function postTbUsuario(req: Request, res: Response) {
  try {
    const validatedData = usuarioSchema.parse(req.body);

    const duplicate = await prisma.tbUsuario.findFirst({
      where: { username: validatedData.username },
    });
    
    if (duplicate) {
      return res.status(409).json({
        success: false,
        error: "Este username já está em uso",
        message: "Este username já está em uso",
      });
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const accessToken = jwt.sign(
      { UserInfo: { username: validatedData.username, role: validatedData.role || "USER" } },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "30m" }
    );
    
    const refreshToken = jwt.sign(
      { username: validatedData.username },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "1d" }
    );

    const novoUsuario = await prisma.tbUsuario.create({
      data: {
        username: validatedData.username,
        password: hashedPassword,
        role: validatedData.role || "USER",
        refreshToken: refreshToken,
      },
    });

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 60 * 1000,
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        id: novoUsuario.id,
        username: novoUsuario.username,
        role: novoUsuario.role,
      },
      message: `Novo usuário ${validatedData.username} criado`,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Erro de validação",
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    if (isPrismaError(error)) {
      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          error: "Conflito de dados",
          message: "Username ou refreshToken já está em uso",
        });
      }
    }

    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      message: "Erro interno ao criar usuário",
    });
  }
}

export { postTbUsuario };