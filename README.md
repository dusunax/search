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

#### [Class Search](https://github.com/dusunax/search/blob/main/src/search.dto.ts)

-   keyword와 searchCount 프로퍼티를 가진 Search 객체,
-   `of(search: Search)`: 정적 메서드, `SearchResponseDto`의 인스턴스를 생성해 반환

#### [`src/search.service.ts`: `save()`](https://github.com/dusunax/search/blob/main/src/search/search.service.ts#L21)

-   저장된 검색어의 검색 횟수를 증가시키고 결과를 반환합니다.
-   동시에 검색이 진행되는 경우 두번째 검색요청은 실패됩니다.

#### [`src/search.repository.ts`](https://github.com/dusunax/search/blob/main/src/search/search.repository.ts):

-   [`upsert()`](https://github.com/dusunax/search/blob/main/src/search/search.repository.ts#L12)
-   [`increaseSearchCount()`](https://github.com/dusunax/search/blob/main/src/search/search.repository.ts#L29)

### 관련 문서: Prisma Docs

1. $transaction:
    - https://www.prisma.io/docs/orm/prisma-client/queries/transactions
    - Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.

2. The $transaction API
    - https://www.prisma.io/docs/orm/prisma-client/queries/transactions#the-transaction-api

3. searchKeyword

    <img src="https://github.com/dusunax/search/assets/94776135/adc27668-6ca6-4869-924f-4e4dff576829" width="400">
