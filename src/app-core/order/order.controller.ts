import { Controller, Res, UseGuards, HttpStatus, Post, Req, Get, Param, ParseIntPipe, Query } from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from '../../guards/roles.guard'
import { Roles } from '../../decorators/roles.decorator'
import { CONSTANTS } from '../../app-auth/common/constants'
import { OrderService } from './order.serive'
import { CreateOrderDto } from './dto/create.order-dto'

@Controller('orders')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post(':orderId')
  @Roles(CONSTANTS.ROLES.PATIENT)
  async create(
    @Req() request: Request,
    @Res() response: Response,
    @Param('orderId') orderId: string,
    @Query('productId', ParseIntPipe) productId: number,
    @Query('promoCode') promoCode: string,
    @Query('giftCard') giftCard: string,
    @Query('price', ParseIntPipe) price: number,
  ) {
    try {
      const createOrderDto: CreateOrderDto = {
        giftCard,
        promoCode,
        productId,
        price,
      }
      const order = await this.orderService.create(request['user']['id'], createOrderDto, orderId)
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Consent updated successfully',
        order,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Get('')
  @Roles(CONSTANTS.ROLES.PATIENT, CONSTANTS.ROLES.ADMIN)
  async getByUserId(@Req() request: Request, @Res() response: Response, @Query('id') id?: number) {
    try {
      const orders = await this.orderService.getByUserId(id ?? request['user']['id'])
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Consent updated successfully',
        orders,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Get('')
  @Roles(CONSTANTS.ROLES.ADMIN)
  async getOrders(@Req() request: Request, @Res() response: Response) {
    try {
      const orders = await this.orderService.getOrders()
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Consent updated successfully',
        orders,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }
}
