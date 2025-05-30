import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { writeFileSync } from 'fs';

export function SwaggerConfigInit(app: INestApplication): void {
  const document = new DocumentBuilder()
    .setTitle('Bluetree API')
    .setDescription('API for managing Bluetree resources')
    .setVersion('0.0.1')
    .addBearerAuth(swaggerAuthConfig(), 'Authorization')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup(`/swagger`, app, swaggerDocument);
  SwaggerModule.setup('api', app, swaggerDocument);

  // Write swagger.json to project root
  writeFileSync('./swagger.json', JSON.stringify(swaggerDocument, null, 2));
}

function swaggerAuthConfig(): SecuritySchemeObject {
  return {
    type: 'http',
    bearerFormat: 'JWT',
    in: 'header',
    scheme: 'bearer',
  };
}