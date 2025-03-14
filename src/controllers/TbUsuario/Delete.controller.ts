import { prisma, isPrismaError } from '../../utils/prisma';
import { Request, Response } from "express";
import { z } from "zod";

const deleteByIdSchema = z.object({
  id: z.string().transform((val) => {
    const num = Number(val);
    if (isNaN(num) || num <= 0) {
      throw new Error("ID deve ser um número positivo");
    }
    return num;
  })
});

async function deleteAllTbUsuario(req: Request, res: Response) {
  try {
    const deletedUsuarios = await prisma.tbUsuario.updateMany({
      where: {
        excludedAt: null
      },
      data: {
        excludedAt: new Date(),
        updatedAt: new Date()
      }
    });

    if (deletedUsuarios.count === 0) {
      return res.status(204).send();
    }

    return res.status(200).json({
      message: "Todos os usuários foram marcados como excluídos com sucesso",
      count: deletedUsuarios.count
    });
  } catch (error) {
    if (isPrismaError(error)) {
      switch (error.code) {
        case 'P2002':
          return res.status(409).json({
            error: "Conflito ao tentar atualizar registros",
            code: error.code
          });
        case 'P2025':
          return res.status(404).json({
            error: "Nenhum registro encontrado para exclusão",
            code: error.code
          });
      }
    }
    
    return res.status(500).json({
      error: "Erro interno ao excluir usuários",
      message: (error as Error).message
    });
  }
}

async function deleteByIdTbUsuario(req: Request, res: Response) {
  try {
    const { id } = deleteByIdSchema.parse(req.params);

    const deletedUsuario = await prisma.tbUsuario.update({
      where: {
        id,
        excludedAt: null
      },
      data: {
        excludedAt: new Date(),
        updatedAt: new Date()
      }
    });

    return res.status(200).json({
      message: `Usuário com ID ${id} foi marcado como excluído com sucesso`,
      data: deletedUsuario
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validação inválida",
        issues: error.issues
      });
    }

    if (isPrismaError(error)) {
      switch (error.code) {
        case 'P2025':
          return res.status(404).json({
            error: `Usuário com ID ${req.params.id} não encontrado ou já excluído`,
            code: error.code
          });
        case 'P2003':
          return res.status(409).json({
            error: "Violação de constraint de chave estrangeira",
            code: error.code
          });
      }
    }

    return res.status(500).json({
      error: "Erro interno ao excluir usuário",
      message: (error as Error).message
    });
  }
}

export { deleteAllTbUsuario, deleteByIdTbUsuario };