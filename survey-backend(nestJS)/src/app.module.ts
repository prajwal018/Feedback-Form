import { Module } from '@nestjs/common';
import { createPool } from 'mysql2/promise';
import { SurveyController } from './survey-answers.controller';

@Module({
  imports: [],
  controllers: [SurveyController],
  providers: [
    {
      provide: 'POOL',
      useFactory: async () =>
        createPool({
          host: 'localhost',
          user: 'root',
          password: 'Starboylover@1',
          database: 'survey_results',
        }),
    },
  ],
})
export class AppModule {}
