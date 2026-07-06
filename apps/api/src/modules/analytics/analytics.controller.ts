// =============================================================================
// Analytics Controller
// =============================================================================
import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@Controller({ path: 'analytics', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('stadiums/:stadiumId/operations')
  @RequirePermissions('analytics:read')
  @ApiOperation({ summary: 'Get comprehensive operational analytics report' })
  async getOpsReport(@Param('stadiumId', ParseUUIDPipe) stadiumId: string) {
    return this.analyticsService.getOperationsReport(stadiumId);
  }
}
