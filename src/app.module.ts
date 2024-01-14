import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';
import { SearchController } from '@/search/seach.controller';
import { SearchService } from '@/search/search.service';
import { SearchRepository } from '@/search/search.repository';

@Module({
    imports: [PrismaModule],
    controllers: [SearchController],
    providers: [SearchService, SearchRepository],
})
export class AppModule {}
