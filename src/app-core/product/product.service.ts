import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { GiftCard } from 'src/entities/gift.card.entity'
import { Product } from 'src/entities/product.entity'
import { PromoCode } from 'src/entities/promo.code.entity'
import { Connection, Repository } from 'typeorm'
import { CreateProductDto } from './dto/create.product-dto'
import { PriceDiscountDto } from './dto/price.discount-dto'

@Injectable()
export class ProductService {
  constructor(private connection: Connection) {}

  @InjectRepository(Product)
  private productRepository: Repository<Product>
  @InjectRepository(PromoCode)
  private promoCodeRepository: Repository<PromoCode>
  @InjectRepository(GiftCard)
  private giftCardRepository: Repository<GiftCard>

  getProducts() {
    return this.productRepository.find()
  }

  getActiveProducts() {
    const today = new Date()
    const startOfDay = today.setUTCHours(0, 0, 0, 0)
    const endOfDay = today.setUTCHours(23, 59, 59, 999)

    return this.productRepository
      .createQueryBuilder('p')
      .where('p.status = :status', { status: true })
      .andWhere('p.from < :startOfDay', { startOfDay: new Date(startOfDay) })
      .andWhere('p.until > :endOfDay', { endOfDay: new Date(endOfDay) })
      .getMany()
  }

  createProduct(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto as unknown as Partial<Product>)
    return this.productRepository.save(product)
  }

  async updateProduct(id: number, updateProduct: CreateProductDto) {
    let product = await this.productRepository.findOne({ where: { id } })
    product = this.productRepository.merge(product, updateProduct)
    return this.productRepository.save(product)
  }

  async getPrice(id: number, priceDiscountDto: PriceDiscountDto) {
    const today = new Date()
    const startOfDay = today.setUTCHours(0, 0, 0, 0)
    const endOfDay = today.setUTCHours(23, 59, 59, 999)

    const product = await this.productRepository
      .createQueryBuilder('p')
      .where('p.status = :status', { status: true })
      .andWhere('p.from < :startOfDay', { startOfDay: new Date(startOfDay) })
      .andWhere('p.until > :endOfDay', { endOfDay: new Date(endOfDay) })
      .andWhere('p.id = :id', { id })
      .getOne()

    if (!product) return product

    if (priceDiscountDto.promoCode) {
      const promoCode = await this.promoCodeRepository
        .createQueryBuilder('p')
        .where('p.status = :status', { status: true })
        .andWhere('p.from < :startOfDay', { startOfDay: new Date(startOfDay) })
        .andWhere('p.until > :endOfDay', { endOfDay: new Date(endOfDay) })
        .andWhere('p.code = :code', { code: priceDiscountDto.promoCode })
        .getOne()
      if (promoCode?.percentageDiscount) product.price = product.price - (product.price * promoCode.percentageDiscount) / 100
      if (promoCode?.flatDiscount) product.price = product.price - promoCode.flatDiscount
    }

    if (priceDiscountDto.giftCard) {
      const giftCard = await this.giftCardRepository
        .createQueryBuilder('gc')
        .andWhere('gc.from < :startOfDay', { startOfDay: new Date(startOfDay) })
        .andWhere('gc.until > :endOfDay', { endOfDay: new Date(endOfDay) })
        .andWhere('gc.redemptionDate is NULL')
        .andWhere('gc.code = :code', { code: priceDiscountDto.giftCard })
        .getOne()
      if (giftCard) {
        product.price = product.price - giftCard.price
      }
    }

    product.price = product.price < 0 ? 0 : product.price

    return product
  }
}
