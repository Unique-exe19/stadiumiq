// =============================================================================
// Stadium Controller
// =============================================================================
import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { StadiumService } from './stadium.service';

@ApiTags('stadium')
@Controller({ path: 'stadiums', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StadiumController {
  constructor(private readonly stadiumService: StadiumService) {}

  @Get()
  @RequirePermissions('navigation:read')
  @ApiOperation({ summary: 'Get all active stadiums' })
  async findAll() {
    return this.stadiumService.findAll();
  }

  @Get(':id')
  @RequirePermissions('navigation:read')
  @ApiOperation({ summary: 'Get stadium details by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.stadiumService.findOne(id);
  }

  @Get(':id/zones')
  @RequirePermissions('navigation:read')
  @ApiOperation({ summary: 'Get all zones within a stadium' })
  async findZones(@Param('id', ParseUUIDPipe) id: string) {
    return this.stadiumService.findZones(id);
  }

  @Get(':id/gates')
  @RequirePermissions('navigation:read')
  @ApiOperation({ summary: 'Get all gates within a stadium' })
  async findGates(@Param('id', ParseUUIDPipe) id: string) {
    return this.stadiumService.findGates(id);
  }
}
