import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
    .setTitle('Search')
    .setDescription(
        'Simple search api documentation : nest.js skeleton project',
    )
    .setVersion('1.0')
    .build();
