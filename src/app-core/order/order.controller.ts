import {
  Controller,
  Res,
  UseGuards,
  HttpStatus,
  Post,
  UseInterceptors,
  UploadedFile,
  Req,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Body,
  Query,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'src/guards/roles.guard'
import { Roles } from 'src/decorators/roles.decorator'
import { FileInterceptor } from '@nestjs/platform-express'
import { CONSTANTS } from 'src/app-auth/common/constants'

import global from 'src/global/file-config'
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
      console.log({ error })
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }
}
