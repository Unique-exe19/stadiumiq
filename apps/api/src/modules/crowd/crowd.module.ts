// =============================================================================
// Crowd Intelligence Module
// =============================================================================
import { Module } from '@nestjs/common';

import { CrowdAnalyticsService } from './crowd-analytics.service';
import { CrowdController } from './crowd.controller';
import { CrowdService } from './crowd.service';

@Module({
  controllers: [CrowdController],
  providers: [CrowdService, CrowdAnalyticsService],
  exports: [CrowdService],
})
export class CrowdModule {}
