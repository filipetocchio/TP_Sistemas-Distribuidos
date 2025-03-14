import { prisma } from '../../utils/prisma';
import { Request, Response } from "express";
import { z } from "zod";

const getAllSchema = z.object({
  page: z.string().optional().default("1").transform(Number),
  limit: z.string().optional().default("10").transform(Number),
  showDeleted: z.enum(["true", "false", "only"]).optional().default("false"),
  search: z.string().optional(),
}).strict();

const getByIdSchema = z.object({
  id: z.string().transform(Number),
}).strict();

async function getAllTbUsuario(req: Request, res: Response) {
  try {
    const { page, limit, showDeleted, search } = getAllSchema.parse(req.query);

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        error: "Invalid pagination parameters",
        message: "Page and limit must be positive numbers"
      });
    }

    let whereClause: any = {};
    if (showDeleted === "false") {
      whereClause = { excludedAt: null };
    } else if (showDeleted === "only") {
      whereClause = { excludedAt: { not: null } };
    } else if (showDeleted === "true") {
      whereClause = {};
    }

    if (search) {
      const searchLower = search.toLowerCase();
      whereClause.AND = [
        {
          OR: [
            { username: { contains: searchLower } },
            { role: { contains: searchLower } },
            ...(Number.isNaN(Number(searchLower)) 
              ? [] 
              : [{ id: Number(searchLower) }]
            ),
          ],
        },
      ];
    }

    const total = await prisma.tbUsuario.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;

    const usuarios = await prisma.tbUsuario.findMany({
      where: whereClause,
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      data: usuarios,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrevious: page > 1
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors
      });
    }

    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

async function getByIdTbUsuario(req: Request, res: Response) {
  try {
    const { id } = getByIdSchema.parse(req.params);

    const usuario = await prisma.tbUsuario.findUnique({
      where: {
        id,
        excludedAt: null 
      },
    });

    if (!usuario) {
      return res.status(404).json({
        error: "Not found",
        message: `Usuário with id ${id} not found or has been deleted`
      });
    }

    return res.status(200).json(usuario);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors
      });
    }

    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

export { getAllTbUsuario, getByIdTbUsuario };