import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prima: PrismaService) {}
  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    const bookmark = await this.prima.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });
    return bookmark;
  }

  getBookmarks(userId: number) {
    return this.prima.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  getBookmarkById(userId: number, bookmarkId: number) {
    return this.prima.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }

  async editBookmark(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
    const bookmark = await this.prima.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    // check if bookmark is owned by user
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resource denied.');

    return this.prima.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBookmark(userId: number, bookmarkId: number) {
    const bookmark = await this.prima.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    // check if bookmark is owned by user
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resource denied.');

    await this.prima.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
