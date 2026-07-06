// =============================================================================
// Incidents Controller
// =============================================================================
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { JwtPayload } from '@stadiumiq/shared-types';

import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { IncidentsService } from './incidents.service';

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
