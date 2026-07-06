// =============================================================================
// Transport Controller
// =============================================================================
import { Controller, Get, Param, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TransportService } from './transport.service';

@ApiTags('transport')
@Controller({ path: 'transport', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Get('stadiums/:stadiumId/departures')
  @RequirePermissions('transport:read')
  @ApiOperation({ summary: 'Get live departures for a stadium transit hubs' })
  async getDepartures(@Param('stadiumId', ParseUUIDPipe) stadiumId: string) {
    return this.transportService.getDepartures(stadiumId);
  }

  @Get('stadiums/:stadiumId/recommendations')
  @RequirePermissions('transport:read')
  @ApiQuery({ name: 'destination', required: true })
  @ApiQuery({ name: 'accessibleOnly', required: false, type: Boolean })
  @ApiOperation({ summary: 'Get smart transport recommendations' })
  async getRecommendations(
    @Param('stadiumId', ParseUUIDPipe) stadiumId: string,
    @Query('destination') destination: string,
    @Query('accessibleOnly') accessibleOnly = 'false',
  ) {
    const isAccessible = accessibleOnly === 'true';
    return this.transportService.getRecommendations(stadiumId, destination, isAccessible);
  }
}
