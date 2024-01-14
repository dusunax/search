import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { SearchRepository } from './search.repository';
import { SearchResponseDto } from './search.dto';

@Injectable()
export class SearchService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly searchRepository: SearchRepository,
    ) {}

    /**
     * 저장된 검색어의 검색 횟수를 증가시키고 결과를 반환합니다.
     * 동시에 검색이 진행되는 경우 두번째 검색요청은 실패됩니다.
     *
     * @param keyword 검색 키워드
     * @returns 검색 결과를 담은 SearchResponseDto 인스턴스
     */
    save(keyword: string) {
        return this.prisma.$transaction(async tx => {
            // keyword를 DB에 저장하거나 업데이트하고 해당 검색 객체를 가져온다
            const searchResult = await this.searchRepository.upsert(
                keyword,
                tx,
            );

            // searchCount를 증가시키고 새 SearchResponseDto 인스턴스를 생성하여 반환한다
            return this.searchRepository
                .increaseSearchCount(searchResult, tx)
                .then(SearchResponseDto.of);
        });
    }
}
