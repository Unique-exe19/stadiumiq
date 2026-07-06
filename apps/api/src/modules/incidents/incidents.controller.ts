// =============================================================================
// Incidents Controller
// =============================================================================

import { Controller, Get, Post, Put, Body, Param, Request, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IncidentsService } from './incidents.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CreateIncidentDto } from './dto/create-incident.dto';
import type { JwtPayload } from '@stadiumiq/shared-types';

interface RequestWithUser {
  user: JwtPayload;
}

@ApiTags('incidents')
@Controller({ path: 'incidents', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  @RequirePermissions('incidents:write')
  @ApiOperation({ summary: 'Report a new incident' })
  async create(@Body() dto: CreateIncidentDto, @Request() req: RequestWithUser) {
    return this.incidentsService.create(dto, req.user.sub);
  }

  @Get()
  @RequirePermissions('incidents:read')
  @ApiOperation({ summary: 'Get all active/resolved incidents' })
  async findAll() {
    return this.incidentsService.findAll();
  }

  @Get(':id')
  @RequirePermissions('incidents:read')
  @ApiOperation({ summary: 'Get details of a specific incident' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.incidentsService.findOne(id);
  }

  @Put(':id/status')
  @RequirePermissions('incidents:write')
  @ApiOperation({ summary: 'Update incident status (add note/progress update)' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: string,
    @Body('note') note: string,
    @Request() req: RequestWithUser,
  ) {
    return this.incidentsService.addUpdate(id, status, note, req.user.sub);
  }
}
