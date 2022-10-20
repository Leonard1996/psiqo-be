import { Controller, ValidationPipe, UsePipes, Res, UseGuards, HttpStatus, Get, Post, Body, Param, ParseIntPipe, Patch, Req } from '@nestjs/common'
import { Response, Request } from 'express'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from '../../guards/roles.guard'
import { Roles } from '../../decorators/roles.decorator'
import { CONSTANTS } from '../../app-auth/common/constants'
import { ProductService } from './product.service'
import { CreateProductDto } from './dto/create.product-dto'
import { PriceDiscountDto } from './dto/price.discount-dto'

@Controller('products')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UsePipes(new ValidationPipe())
  @Roles(CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.SUBADMIN)
  async getProducts(@Res() response: Response) {
    try {
      const products = await this.productService.getProducts()
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        products,
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
  async getActuveProducts(@Res() response: Response) {
    try {
      const products = await this.productService.getActiveProducts()
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        products,
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
  async createProduct(@Res() response: Response, @Body() createProductDto: CreateProductDto) {
    try {
      const product = await this.productService.createProduct(createProductDto)
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

  @Patch('/:productId')
  @UsePipes(new ValidationPipe())
  @Roles(CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.SUBADMIN)
  async updateProduct(@Res() response: Response, @Param('productId', ParseIntPipe) id: number, @Body() updateProductDto: CreateProductDto) {
    try {
      const product = await this.productService.updateProduct(id, updateProductDto)
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

  @Post('/:productId/price')
  @UsePipes(new ValidationPipe())
  @Roles(CONSTANTS.ROLES.PATIENT)
  async getPrice(@Res() response: Response, @Param('productId', ParseIntPipe) id: number, @Body() priceDiscountDto: PriceDiscountDto) {
    try {
      const product = await this.productService.getPrice(id, priceDiscountDto)
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
}
