import { Controller, ValidationPipe, UsePipes, Res, UseGuards, HttpStatus, Get, Post, Body, Param, ParseIntPipe, Delete } from '@nestjs/common'
import { Response } from 'express'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from '../../guards/roles.guard'
import { Roles } from '../../decorators/roles.decorator'
import { CONSTANTS } from '../../app-auth/common/constants'
import { GiftCardService } from './gift.card.service'
import CreateGiftCardDto from './dto/create.gift.card-dto'
import { MailService } from '../mail/services/mail.service'

@Controller('gift-cards')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class GiftCardController {
  constructor(private readonly giftCardService: GiftCardService) {}

  @Get()
  @UsePipes(new ValidationPipe())
  @Roles(CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.SUBADMIN)
  async getGiftCards(@Res() response: Response) {
    try {
      const giftCards = await this.giftCardService.getGiftCards()
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        giftCards,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Get('/active')
  @UsePipes(new ValidationPipe())
  @Roles(CONSTANTS.ROLES.PATIENT)
  async getActiveGiftCards(@Res() response: Response) {
    try {
      const giftCards = await this.giftCardService.getActiveGiftCards()
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        giftCards,
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
  async createGiftCard(@Res() response: Response, @Body() createGiftCardDto: CreateGiftCardDto) {
    try {
      const giftCard = await this.giftCardService.createGiftCard(createGiftCardDto)
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        giftCard,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Delete('/:giftCardId')
  @UsePipes(new ValidationPipe())
  @Roles(CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.SUBADMIN)
  async deleteProduct(@Res() response: Response, @Param('giftCardId', ParseIntPipe) id: number) {
    try {
      const giftCard = await this.giftCardService.delete(id)
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        giftCard,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Get('/download-csv')
  @UsePipes(new ValidationPipe())
  @Roles(CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.SUBADMIN)
  async getCsvPath(@Res() response: Response) {
    try {
      const giftCards = await this.giftCardService.getGiftCards()
      this.giftCardService.generateCsv(giftCards, response)
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }
}
