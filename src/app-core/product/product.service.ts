import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Product } from 'src/entities/product.entity'
import { Connection, Repository } from 'typeorm'
import { CreateProductDto } from './dto/create.product-dto'

@Injectable()
export class ProductService {
  constructor(private connection: Connection) {}

  @InjectRepository(Product)
  private productRepository: Repository<Product>

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
}
