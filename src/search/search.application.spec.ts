import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { PrismaModule } from '@/prisma/prisma.module';
import { PrismaService } from '@/prisma/prisma.service';
import { SearchRepository } from './search.repository';
import { SearchService } from './search.service';
import { SearchResponseDto } from './search.dto';

describe('SearchService Test', () => {
    let searchService: SearchService;
    let searchRepository: SearchRepository;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule],
            providers: [SearchService, SearchRepository],
        }).compile();

        searchService = module.get<SearchService>(SearchService);
        searchRepository = module.get<SearchRepository>(SearchRepository);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('create search when keyword is not exists', async () => {
        const existingKeyword = '4dbbb95d';
        await prismaService.searchKeyword.deleteMany(); // Clear the database state for the test

        const actual = await searchService.save(existingKeyword);

        expect(actual).toStrictEqual(
            SearchResponseDto.of({
                keyword: existingKeyword,
                searchCount: 2,
            }),
        );
    });

    it('increase seachCount when keyword is exists', async () => {
        await prismaService.searchKeyword.deleteMany();
        await searchService.save('fbc63d43');
        const actual = await searchService.save('fbc63d43');

        expect(actual).toStrictEqual(
            SearchResponseDto.of({ keyword: 'fbc63d43', searchCount: 3 }),
        );
    });

    it('rejects second service call when concurrent call ', async () => {
        await searchService.save('3a514d7d');

        //before two call cause Prisma Bug
        await Promise.allSettled([
            searchService.save('3a514d7d'),
            searchService.save('3a514d7d'),
        ]);

        const allSettled = await Promise.allSettled([
            searchService.save('3a514d7d'),
            searchService.save('3a514d7d'),
        ]);

        allSettled.forEach(result => {
            switch (result.status) {
                case 'fulfilled':
                    {
                        expect(result.value).toStrictEqual(
                            SearchResponseDto.of({
                                keyword: '3a514d7d',
                                searchCount: 5,
                            }),
                        );
                    }
                    break;

                case 'rejected':
                    {
                        expect(result.reason).toBeInstanceOf(
                            PrismaClientKnownRequestError,
                        );
                    }
                    break;
            }
        });
    });
});
