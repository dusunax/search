import { ApiOperation, ApiProperty } from '@nestjs/swagger';

export const SearchApiOperation = () =>
    ApiOperation({
        summary: 'Search by keyword 🕵️‍♀️',
        description: 'Search operation 🔍',
    });

export const KeywordApiProperty = () =>
    ApiProperty({
        name: 'keyword',
        description: 'Search keyword 📝 ',
        example: { keyword: 'example-value' },
    });
