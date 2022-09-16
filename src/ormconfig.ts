require('dotenv').config()
import { DataSource } from 'typeorm'
import { User } from './entities/user.entity'
import { Therapist } from './entities/therapist.entity'
import { PatientDoctor } from './entities/patient.doctor.entity'
import { Session } from './entities/session.entity'
import { Patient } from './entities/patient.entity'
import { Product } from './entities/product.entity'
import { PromoCode } from './entities/promo.code.entity'
import { GiftCard } from './entities/gift.card.entity'
import { Order } from './entities/order.entity'

const getConnectionType = (type: any) => {
  switch (type) {
    case 'mysql':
    case 'mssql':
    case 'postgres':
    case 'mariadb':
    case 'mongodb':
      return type
    default:
      return 'mysql'
  }
}

const ormconfiguration = {
  type: getConnectionType(process.env.TYPEORM_CONNECTION),
  host: process.env.TYPEORM_HOST,
  logging: process.env.TYPEORM_LOGGING === 'true',
  port: Number(process.env.TYPEORM_PORT),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: [User, Therapist, Session, PatientDoctor, Patient, Product, PromoCode, GiftCard, Order],
  migrations: [process.env.TYPEORM_MIGRATIONS],
}

const ormconfig = new DataSource(ormconfiguration)

export { ormconfiguration }
export default ormconfig
