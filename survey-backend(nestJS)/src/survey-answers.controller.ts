/* eslint-disable prettier/prettier */
// import { Body, Controller, Post } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { SurveyAnswer } from './survey-answer.entity';

// @Controller('/survey')
// export class SurveyAnswersController {
//   constructor(
//     @InjectRepository(SurveyAnswer)
//     private surveyAnswerRepository: Repository<SurveyAnswer>,
//   ) {}
//   @Post()
//   async create(@Body() answers: Record<string, string>): Promise<void> {
//     try {
//       const surveyAnswer = new SurveyAnswer(JSON.stringify(answers));
//       await this.surveyAnswerRepository.save(surveyAnswer);
//       console.error('Succefully saved survey answers');
//     } catch (error) {
//       console.error('Error saving survey answers:', error);
//     }
//   }
// }

import { Body, Controller, Inject, Post } from '@nestjs/common';
import { Pool } from 'mysql2/promise';
import { v4 as uuid } from 'uuid';

@Controller('survey')
export class SurveyController {
  constructor(@Inject('POOL') private readonly pool: Pool) {}

  @Post()
  async submitSurvey(@Body() surveyResponse: any) {
    const connection = await this.pool.getConnection();
    try {
      surveyResponse.id = uuid();
      const values = [surveyResponse.id, JSON.stringify(surveyResponse)];
      const sql = 'INSERT INTO survey_responses (id, response) VALUES (?, ?)';
      await connection.execute(sql, values);
      console.log('Survey response saved successfully!');
      return { message: 'Survey response saved successfully!' };
    } catch (error) {
      console.error('Error saving survey response to database', error);
      throw new Error('Error saving survey response to database');
    } finally {
      connection.release();
    }
  }
}
