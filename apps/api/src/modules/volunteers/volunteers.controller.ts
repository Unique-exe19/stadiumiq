// =============================================================================
// Volunteers Controller
// =============================================================================

import { Controller, Get, Param, Request, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VolunteersService } from './volunteers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import type { JwtPayload } from '@stadiumiq/shared-types';

interface RequestWithUser {
  user: JwtPayload;
}

@ApiTags('volunteers')
@Controller({ path: 'volunteers', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class VolunteersController {
  constructor(private readonly volunteersService: VolunteersService) {}

  @Get('profile')
  @RequirePermissions('volunteers:read')
  @ApiOperation({ summary: 'Get current authenticated volunteer profile' })
  async getMyProfile(@Request() req: RequestWithUser) {
    return this.volunteersService.getProfile(req.user.sub);
  }

  @Get('profile/:volunteerId/briefing')
  @RequirePermissions('volunteers:read')
  @ApiOperation({ summary: 'Get shift briefing package for a volunteer' })
  async getBriefing(@Param('volunteerId', ParseUUIDPipe) volunteerId: string) {
    return this.volunteersService.getBriefing(volunteerId);
  }

  @Get('profile/:volunteerId/tasks')
  @RequirePermissions('volunteers:read')
  @ApiOperation({ summary: 'Get assigned tasks list for a volunteer' })
  async getTasks(@Param('volunteerId', ParseUUIDPipe) volunteerId: string) {
    return this.volunteersService.getTasks(volunteerId);
  }
}
