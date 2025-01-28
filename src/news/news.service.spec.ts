/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from "@nestjs/testing";
import { NewsService } from "./news.service";
import { PrismaService } from "../prisma/prisma.service";
import { BadRequestException } from "@nestjs/common";

describe("NewsService", () => {
  let service: NewsService;
  let prismaService: PrismaService;

  const mockNoticia = { id: 1, titulo: "Notícia 1", descricao: "Descrição" };

  const prismaMock = {
    noticia: {
      create: jest.fn().mockResolvedValue(mockNoticia),
      findMany: jest.fn().mockResolvedValue([mockNoticia]),
      findUnique: jest.fn().mockResolvedValue(mockNoticia),
      update: jest.fn().mockResolvedValue(mockNoticia),
      delete: jest.fn().mockResolvedValue(mockNoticia),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<NewsService>(NewsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a news", async () => {
    const payload = { titulo: "Notícia 1", descricao: "Descrição" };
    const result = await service.create(payload);
    expect(result).toEqual(mockNoticia);
    expect(prismaMock.noticia.create).toHaveBeenCalledWith({ data: payload });
  });

  it("should list all news", async () => {
    const result = await service.listAll();
    expect(result).toEqual([mockNoticia]);
    expect(prismaMock.noticia.findMany).toHaveBeenCalled();
  });

  it("should list a news by id", async () => {
    const result = await service.listById(1);
    expect(result).toEqual(mockNoticia);
    expect(prismaMock.noticia.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("should update a news", async () => {
    const payload = { titulo: "Notícia Atualizada", descricao: "Descrição Atualizada" };
    const result = await service.update(1, payload);
    expect(result).toEqual(mockNoticia);
    expect(prismaMock.noticia.update).toHaveBeenCalledWith({ where: { id: 1 }, data: payload });
  });

  it("should throw an error when updating a non-existing news", async () => {
    prismaMock.noticia.findUnique.mockResolvedValueOnce(null); // Simulando que não encontrou a notícia

    try {
      await service.update(1, { titulo: "Notícia Atualizada", descricao: "Descrição Atualizada" });
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe("Notícia não encontrada");
    }
  });

  it("should delete a news", async () => {
    const result = await service.delete(1);
    expect(result).toEqual(mockNoticia);
    expect(prismaMock.noticia.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("should throw an error when deleting a non-existing news", async () => {
    prismaMock.noticia.findUnique.mockResolvedValueOnce(null); // Simulando que não encontrou a notícia

    try {
      await service.delete(1);
    } catch (error: any) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe("Notícia não encontrada");
    }
  });
});
