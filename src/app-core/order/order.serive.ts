import { Inject, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Order } from 'src/entities/order.entity'
import { CreateOrderDto } from './dto/create.order-dto'
import * as crypto from 'crypto'
import { ProductService } from '../product/product.service'
import { Exception } from 'handlebars'
import axios from 'axios'

@Injectable()
export class OrderService {
  @InjectRepository(Order)
  private orderRepository: Repository<Order>
  @Inject(ProductService)
  private productService: ProductService

  async create(id: number, createOrderDto: CreateOrderDto, orderId: string) {
    // console.log({ id, createOrderDto, orderId })
    const { productId, price, giftCard, promoCode } = createOrderDto
    const product = await this.productService.getPrice(productId, { giftCard, promoCode })

    if (product.price !== price) throw new Exception("Product price doesn't match")

    // console.log(await this.paypalCaptureOrder(orderId))
  }

  async paypalCaptureOrder(orderId: string) {
    const {
      data: { access_token: token },
    } = await this.paypalAuth()

    // console.log(await this.paypalAuth())
    return axios(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
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
}
