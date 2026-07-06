// =============================================================================
// Sustainability Controller
// =============================================================================

import { Controller, Get, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SustainabilityService } from './sustainability.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@ApiTags('sustainability')
@Controller({ path: 'sustainability', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SustainabilityController {
  constructor(private readonly sustainabilityService: SustainabilityService) {}

  @Get('stadiums/:stadiumId/metrics')
  @RequirePermissions('sustainability:read')
  @ApiOperation({ summary: 'Get sustainability metrics and energy insights' })
  async getMetrics(@Param('stadiumId', ParseUUIDPipe) stadiumId: string) {
    return this.sustainabilityService.getMetrics(stadiumId);
  }
}
