import { Inject, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Order } from '../../entities/order.entity'
import { CreateOrderDto } from './dto/create.order-dto'
import * as crypto from 'crypto'
import { ProductService } from '../product/product.service'
import { Exception } from 'handlebars'
import axios from 'axios'
import { PromoCode } from '../../entities/promo.code.entity'
import { GiftCard } from '../../entities/gift.card.entity'
import { User } from '../../entities/user.entity'

@Injectable()
export class OrderService {
  @InjectRepository(Order)
  private orderRepository: Repository<Order>
  @Inject(ProductService)
  private productService: ProductService
  @InjectRepository(PromoCode)
  private promoCodeRepository: Repository<PromoCode>
  @InjectRepository(GiftCard)
  private giftCardRepository: Repository<GiftCard>
  @InjectRepository(User)
  private userRepository: Repository<User>

  async create(id: number, createOrderDto: CreateOrderDto, orderId: string) {
    const { productId, price, giftCard, promoCode } = createOrderDto
    const product = await this.productService.getPrice(productId, { giftCard, promoCode })

    if (product?.price !== price) throw new Exception("Product price doesn't match")

    if (promoCode) {
      let unUsedPromoCode = await this.promoCodeRepository.findOne({ where: { code: promoCode, userId: id } })
      const existingOrder = await this.orderRepository.findOne({ where: { promoCode, userId: id } })

      if (unUsedPromoCode && existingOrder) throw new Exception('Code already used')
      if (!unUsedPromoCode && existingOrder) throw new Exception('Code already used')
    }

    if (giftCard) {
      await this.giftCardRepository.update({ code: giftCard }, { redemptionDate: new Date().toISOString().slice(0, 19).replace('T', ' ') })
    }

    const result = await this.paypalCaptureOrder(orderId)

    if (+result.data.purchase_units[0].payments.captures[0].seller_receivable_breakdown.gross_amount.value !== price) {
      throw new Exception('Amount paied does not match product price')
    }

    const order = this.orderRepository.create({
      productId,
      userId: id,
      details: result.data,
      ...(giftCard && { giftCard }),
      ...(promoCode && { promoCode }),
      paid: +result.data.purchase_units[0].payments.captures[0].seller_receivable_breakdown.gross_amount.value,
      fee: +result.data.purchase_units[0].payments.captures[0].seller_receivable_breakdown.paypal_fee.value,
    })

    await this.userRepository
      .createQueryBuilder('users')
      .update(User)
      .set({ credit: () => `users.credit + ${product.numberOfSessions}` })
      .where('id = :id', { id })
      .execute()

    return this.orderRepository.save(order)
  }

  async paypalCaptureOrder(orderId: string) {
    const {
      data: { access_token: token },
    } = await this.paypalAuth()

    return axios(process.env.PAYPAL_BASE_API + `/v2/checkout/orders/${orderId}/capture`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
        'PayPal-Request-Id': crypto.randomUUID(),
      },
    })
  }

  async paypalAuth() {
    const body = new URLSearchParams()
    body.append('grant_type', process.env.PAYPAL_GRANT_TYPE)

    return axios(process.env.PAYPAL_AUTH_URL, {
      method: 'post',
      data: body,
      auth: {
        username: process.env.PAYPAL_USERNAME,
        password: process.env.PAYPAL_PASSWORD,
      },
    })
  }

  getByUserId(userId: number) {
    return this.orderRepository.find({ where: { userId } })
  }

  getOrders() {
    return this.orderRepository.find()
  }
}
