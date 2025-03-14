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
}).refine(data => Object.keys(data).length > 0, {
  message: "Pelo menos um campo deve ser fornecido para atualização",
});

async function putTbUsuario(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const parsedId = z.number().int().positive().parse(Number(id));
    
    const validatedData = updateUsuarioSchema.parse(req.body);

    const usuarioExistente = await prisma.tbUsuario.findUnique({
      where: { id: parsedId },
    });

    if (!usuarioExistente) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
        message: "Usuário não encontrado",
      });
    }

    if (usuarioExistente.excludedAt) {
      return res.status(410).json({
        success: false,
        error: "Usuário já foi excluído",
        message: "Este usuário foi excluído (soft delete)",
      });
    }

    const dataToUpdate: any = { ...validatedData };

    if (validatedData.password) {
      dataToUpdate.password = await bcrypt.hash(validatedData.password, 10);
    }

    if (validatedData.username && validatedData.username !== usuarioExistente.username) {
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
    }

    const usuarioAtualizado = await prisma.tbUsuario.update({
      where: { id: parsedId },
      data: dataToUpdate,
    });

    return res.status(200).json({
      success: true,
      data: {
        id: usuarioAtualizado.id,
        username: usuarioAtualizado.username,
        role: usuarioAtualizado.role,
        updatedAt: usuarioAtualizado.updatedAt,
      },
      message: "Usuário atualizado com sucesso",
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
          message: "Username já está em uso",
        });
      }
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          error: "Usuário não encontrado",
          message: "Usuário não encontrado",
        });
      }
    }

    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      message: "Erro interno ao atualizar usuário",
    });
  }
}

export { putTbUsuario };