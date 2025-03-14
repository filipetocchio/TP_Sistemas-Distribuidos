import { prisma, isPrismaError } from '../../utils/prisma';
import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";

const updateUsuarioSchema = z.object({
  username: z.string()
    .min(1, "Username é obrigatório")
    .max(20, "Username não pode exceder 20 caracteres")
    .optional(),
  password: z.string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .optional(),
  role: z.string()
    .min(1, "Role deve ter pelo menos 1 caractere")
    .optional(),
}).strict();

async function patchTbUsuario(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const parsedId = z.number().positive().parse(Number(id));
    
    const updateData = updateUsuarioSchema.parse(req.body);

    const existingUsuario = await prisma.tbUsuario.findFirst({
      where: { 
        id: parsedId,
        excludedAt: null 
      }
    });

    if (!existingUsuario) {
      return res.status(404).json({
        success: false,
        error: "NOT_FOUND",
        message: "Usuário não encontrado ou já foi excluído"
      });
    }

    const dataToUpdate: any = {
      updatedAt: new Date(),
    };

    if (updateData.username && updateData.username !== existingUsuario.username) {
      const duplicate = await prisma.tbUsuario.findFirst({
        where: { 
          username: updateData.username,
          id: { not: parsedId }
        },
      });
      if (duplicate) {
        return res.status(409).json({
          success: false,
          error: "CONFLICT",
          message: "Este username já está em uso"
        });
      }
      dataToUpdate.username = updateData.username;
    }

    if (updateData.password) {
      dataToUpdate.password = await bcrypt.hash(updateData.password, 10);
    }

    if (updateData.role) {
      dataToUpdate.role = updateData.role;
    }

    const updatedUsuario = await prisma.tbUsuario.update({
      where: { id: parsedId },
      data: dataToUpdate,
    });

    return res.status(200).json({
      success: true,
      data: {
        id: updatedUsuario.id,
        username: updatedUsuario.username,
        role: updatedUsuario.role,
        updatedAt: updatedUsuario.updatedAt,
      },
      message: "Usuário atualizado com sucesso",
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "VALIDATION_ERROR",
        message: "Erro de validação",
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    if (isPrismaError(error)) {
      if (error.code === "P2002") {
        return res.status(409).json({
          success: false,
          error: "CONFLICT",
          message: "Username já está em uso",
        });
      }
      if (error.code === "P2025") {
        return res.status(404).json({
          success: false,
          error: "NOT_FOUND",
          message: "Usuário não encontrado",
        });
      }
    }

    console.error("Erro ao atualizar usuário:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "INTERNAL_SERVER_ERROR",
      message: "Erro interno ao atualizar usuário",
    });
  }
}

export { patchTbUsuario };