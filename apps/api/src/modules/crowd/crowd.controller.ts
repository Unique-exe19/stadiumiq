// =============================================================================
// Crowd Controller
// =============================================================================
import { Body, Controller, Get, Param, ParseUUIDPipe, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CrowdService } from './crowd.service';
import { UpdateOccupancyDto } from './dto/update-occupancy.dto';

@ApiTags('crowd')
@Controller({ path: 'crowd', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CrowdController {
  constructor(private readonly crowdService: CrowdService) {}

  @Get('stadiums/:stadiumId/occupancy')
  @RequirePermissions('crowd:read')
  @Throttle({ staff: { limit: 300, ttl: 60000 } })
  @ApiOperation({ summary: 'Get real-time stadium occupancy' })
  async getOccupancy(@Param('stadiumId', ParseUUIDPipe) stadiumId: string) {
    return this.crowdService.getStadiumOccupancy(stadiumId);
  }

  @Get('stadiums/:stadiumId/heatmap')
  @RequirePermissions('crowd:read')
  @ApiOperation({ summary: 'Get crowd density heatmap data' })
  async getHeatmap(@Param('stadiumId', ParseUUIDPipe) stadiumId: string) {
    return this.crowdService.getHeatmapData(stadiumId);
  }

  @Get('stadiums/:stadiumId/alerts')
  @RequirePermissions('crowd:read')
  @ApiOperation({ summary: 'Get active crowd alerts' })
  async getAlerts(@Param('stadiumId', ParseUUIDPipe) stadiumId: string) {
    return this.crowdService.getActiveAlerts(stadiumId);
  }

  @Put('zones/:zoneId/occupancy')
  @RequirePermissions('crowd:write')
  @ApiOperation({ summary: 'Update zone occupancy reading (sensor data ingestion)' })
  async updateOccupancy(
    @Param('zoneId', ParseUUIDPipe) zoneId: string,
    @Body() dto: UpdateOccupancyDto,
  ) {
    await this.crowdService.updateZoneOccupancy(zoneId, dto.currentOccupancy);
    return { updated: true };
  }
}
