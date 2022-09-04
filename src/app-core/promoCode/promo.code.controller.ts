import { Controller, ValidationPipe, UsePipes, Res, UseGuards, HttpStatus, Get, Post, Body, Param, ParseIntPipe, Patch, Delete } from '@nestjs/common'
import { Response } from 'express'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'src/guards/roles.guard'
import { Roles } from 'src/decorators/roles.decorator'
import { CONSTANTS } from 'src/app-auth/common/constants'
import { PromoCodeService } from './promo.code.service'
import { CreatePromoCodeDto } from './dto/promo.code-dto'
import { MailService } from '../mail/services/mail.service'
import { UpdatePromoCodeDto } from './dto/update.promo.code-dto'

@Controller('promo-codes')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PromoCodeController {
  constructor(private readonly promoCodeService: PromoCodeService, private readonly mailService: MailService) {}

  @Get()
  @UsePipes(new ValidationPipe())
  @Roles(CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.SUBADMIN)
  async getPromoCodes(@Res() response: Response) {
    try {
      const promoCodes = await this.promoCodeService.getPromoCodes()
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        promoCodes,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @Roles(CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.SUBADMIN)
  async createProduct(@Res() response: Response, @Body() createPromoCodeDto: CreatePromoCodeDto) {
    try {
      const promoCode = await this.promoCodeService.createPromoCode(createPromoCodeDto)
      this.mailService.sendPromoCodeMail(promoCode)
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        promoCode,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Patch('/:promoCodeId')
  @UsePipes(new ValidationPipe())
  @Roles(CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.SUBADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, skipMissingProperties: true }))
  async updateProduct(@Res() response: Response, @Param('promoCodeId', ParseIntPipe) id: number, @Body() updatePromoCodeDto: UpdatePromoCodeDto) {
    try {
      const product = await this.promoCodeService.updatePromoCode(id, updatePromoCodeDto)
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        product,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Delete('/:promoCodeId')
  @UsePipes(new ValidationPipe())
  @Roles(CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.SUBADMIN)
  async deleteProduct(@Res() response: Response, @Param('promoCodeId', ParseIntPipe) id: number) {
    try {
      const promoCode = await this.promoCodeService.delete(id)
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        promoCode,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }
}
