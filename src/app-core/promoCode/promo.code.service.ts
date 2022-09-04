import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Product } from 'src/entities/product.entity'
import { PromoCode } from 'src/entities/promo.code.entity'
import { Connection, Repository } from 'typeorm'
import { CreatePromoCodeDto } from './dto/promo.code-dto'
import { UpdatePromoCodeDto } from './dto/update.promo.code-dto'
// import { CreateProductDto } from './dto/create.product-dto'

@Injectable()
export class PromoCodeService {
  constructor(private connection: Connection) {}

  @InjectRepository(PromoCode)
  private promoCodeRepository: Repository<PromoCode>

  getPromoCodes() {
    console.log('here')
    return this.promoCodeRepository.find()
  }

  //   getActiveProducts() {
  //     const today = new Date()
  //     const startOfDay = today.setUTCHours(0, 0, 0, 0)
  //     const endOfDay = today.setUTCHours(23, 59, 59, 999)

  //     return this.productRepository
  //       .createQueryBuilder('p')
  //       .where('p.status = :status', { status: true })
  //       .andWhere('p.from < :startOfDay', { startOfDay: new Date(startOfDay) })
  //       .andWhere('p.until > :endOfDay', { endOfDay: new Date(endOfDay) })
  //       .getMany()
  //   }

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
