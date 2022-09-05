import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Response } from 'express'
import { GiftCard } from 'src/entities/gift.card.entity'
import { Repository } from 'typeorm'
import CreateGiftCardDto from './dto/create.gift.card-dto'
const { writeToPath } = require('@fast-csv/format')
const fs = require('fs')

@Injectable()
export class GiftCardService {
  constructor() {}

  @InjectRepository(GiftCard)
  private giftCardRepository: Repository<GiftCard>

  getGiftCards() {
    return this.giftCardRepository.find()
  }

  getActiveGiftCards() {
    const today = new Date()
    const startOfDay = today.setUTCHours(0, 0, 0, 0)
    const endOfDay = today.setUTCHours(23, 59, 59, 999)

    return this.giftCardRepository
      .createQueryBuilder('gc')
      .andWhere('gc.from < :startOfDay', { startOfDay: new Date(startOfDay) })
      .andWhere('gc.until > :endOfDay', { endOfDay: new Date(endOfDay) })
      .andWhere('gc.redemptionDate is NULL')
      .getMany()
  }

  createGiftCard(createGiftCardDto: CreateGiftCardDto) {
    const giftCard = this.giftCardRepository.create(createGiftCardDto)
    return this.giftCardRepository.save(giftCard)
  }

  delete(id: number) {
    return this.giftCardRepository.delete(id)
  }

  generateCsv(giftCards: GiftCard[], response: Response) {
    const path = `${__dirname}/${new Date().toISOString()}.csv`
    const options = { headers: true, quoteColumns: false }

    writeToPath(path, giftCards, options)
      .on('error', (error) => console.error(error))
      .on('finish', () =>
        response.download(path, function (error) {
          if (error) {
            console.log(error)
          }
          fs.unlinkSync(path)
        }),
      )
  }
}
