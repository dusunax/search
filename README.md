# 검색 서비스

키워드를 활용한 검색을 제공하는 서비스입니다.

## API

키워드를 입력받아 검색된 횟수를 반환합니다.
동시에 검색이 진행되는 경우 두번째 검색요청은 실패됩니다.

---

### POST /search

| Endpoint  | Method | Description                                 | Request Body                      | Response (Success✅)                                     | Response (Failure❌)                                                       |
| --------- | ------ | ------------------------------------------- | --------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------- |
| `/search` | `POST` | 키워드를 입력받아 검색된 횟수를 반환합니다. | `{ "keyword": "search_keyword" }` | 200, `{ "keyword": "search_keyword", "searchCount": 5 }` | 409, `{ "message": "Concurrent search request. Please try again later." }` |

## Search

### Search Class

-   keyword와 searchCount 프로퍼티를 가진 Search 객체 생성
-   `static of(search: Search)`: 정적 메서드, `SearchResponseDto`의 인스턴스를 생성

### Search Service

-   [Class Search](https://github.com/dusunax/search/blob/main/src/search.dto.ts)
-   [`src/search.service.ts`: `save()`](https://github.com/dusunax/search/blob/main/src/search.service.ts#L14)
-   [`src/search.repository.ts`: `upsert()`](), [`increaseSearchCount()`]()

```tsx
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
```

```tsx
/**
 * 데이터베이스에 검색 키워드를 upsert 합니다
 */
upsert(keyword: string, tx?: PrismaTxType) {
    return (tx ?? this.prisma).searchKeyword // tx: optional Prisma transaction instance
        .upsert({
            where: { keyword },
            update: {},
            create: { id: v4(), keyword, searchCount: 1, version: 0 },
        } satisfies Prisma.SearchKeywordUpsertArgs)
        .then(({ id, version }) => ({
            id,
            version,
        }));
}
```
