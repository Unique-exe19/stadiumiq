// =============================================================================
// Crowd Intelligence Module
// =============================================================================

import { Module } from '@nestjs/common';
import { CrowdController } from './crowd.controller';
import { CrowdService } from './crowd.service';
import { CrowdAnalyticsService } from './crowd-analytics.service';

@Module({
  controllers: [CrowdController],
  providers: [CrowdService, CrowdAnalyticsService],
  exports: [CrowdService],
})
export class CrowdModule {}
