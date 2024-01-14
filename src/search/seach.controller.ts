import { Controller, Post, Body } from '@nestjs/common';

import { SearchService } from './search.service';
import { SearchRequestDto } from './search.dto';
import { SearchApiOperation } from '@/swagger/swagger.decorator';

@Controller('search')
export class SearchController {
    constructor(private readonly appService: SearchService) {}

    @Post()
    @SearchApiOperation()
    search(@Body() { keyword }: SearchRequestDto) {
        return this.appService.save(keyword);
    }
}
