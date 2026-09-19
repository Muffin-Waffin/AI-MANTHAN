import { Module } from '@nestjs/common'
import { SupportController } from './support.controller'
import { SupportService } from './support.service'
import { RoutingService } from './routing.service'

@Module({
  controllers: [SupportController],
  providers: [SupportService, RoutingService],
})
export class SupportModule {}
