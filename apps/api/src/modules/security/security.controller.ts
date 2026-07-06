// =============================================================================
// Security Controller
// =============================================================================
import { Controller, Get, Param, ParseUUIDPipe, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { JwtPayload } from '@stadiumiq/shared-types';

import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { SecurityService } from './security.service';

interface RequestWithUser {
  user: JwtPayload;
}

@ApiTags('security')
@Controller({ path: 'security', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get('stadiums/:stadiumId/alerts')
  @RequirePermissions('security:read')
  @ApiOperation({ summary: 'Get active security alerts' })
  async getAlerts(@Param('stadiumId', ParseUUIDPipe) stadiumId: string) {
    return this.securityService.getAlerts(stadiumId);
  }

  @Get('stadiums/:stadiumId/threat-intelligence')
  @RequirePermissions('security:read')
  @ApiOperation({ summary: 'Get threat intelligence report' })
  async getThreatIntel(@Param('stadiumId', ParseUUIDPipe) stadiumId: string) {
    return this.securityService.getThreatIntelligence(stadiumId);
  }

  @Post('alerts/:id/acknowledge')
  @RequirePermissions('security:write')
  @ApiOperation({ summary: 'Acknowledge an active security alert' })
  async acknowledgeAlert(@Param('id', ParseUUIDPipe) id: string, @Request() req: RequestWithUser) {
    await this.securityService.acknowledgeAlert(id, req.user.sub);
    return { acknowledged: true };
  }
}
