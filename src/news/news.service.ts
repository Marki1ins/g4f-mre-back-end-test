import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrUpdateRoomDto } from "./news.dto";

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateOrUpdateRoomDto) {
    return await this.prisma.noticia.create({ data });
  }

  async listAll() {
    return await this.prisma.noticia.findMany();
  }

  async listById(id: number) {
    return await this.prisma.noticia.findUnique({ where: { id } });
  }

  async update(id: number, data: CreateOrUpdateRoomDto) {
    const noticia = await this.listById(id);

    if (!noticia) throw new BadRequestException("Notícia não encontrada");

    return await this.prisma.noticia.update({ where: { id }, data });
  }

  async delete(id: number) {
    const noticia = await this.listById(id);

    if (!noticia) throw new BadRequestException("Notícia não encontrada");

    return await this.prisma.noticia.delete({ where: { id } });
  }
}
