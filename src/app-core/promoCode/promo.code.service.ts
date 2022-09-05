import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PromoCode } from 'src/entities/promo.code.entity'
import { Connection, Repository } from 'typeorm'
import { CreatePromoCodeDto } from './dto/promo.code-dto'
import { UpdatePromoCodeDto } from './dto/update.promo.code-dto'

@Injectable()
export class PromoCodeService {
  constructor(private connection: Connection) {}

  @InjectRepository(PromoCode)
  private promoCodeRepository: Repository<PromoCode>

  getPromoCodes() {
    return this.promoCodeRepository.find()
  }

  createPromoCode(createPromoCodeDto: CreatePromoCodeDto) {
    const promoCode = this.promoCodeRepository.create(createPromoCodeDto as unknown as Partial<PromoCode>)
    return this.promoCodeRepository.save(promoCode)
  }

  async updatePromoCode(id: number, updatePromoCodeDto: UpdatePromoCodeDto) {
    let promoCode = await this.promoCodeRepository.findOne({ where: { id } })
    promoCode = this.promoCodeRepository.merge(promoCode, updatePromoCodeDto)
    return this.promoCodeRepository.save(promoCode)
  }

  delete(id: number) {
    return this.promoCodeRepository.delete(id)
  }
}
