// =============================================================================
// Navigation Controller
// =============================================================================

import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NavigationService } from './navigation.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { NavigationRequestDto } from './dto/navigation-request.dto';

@ApiTags('navigation')
@Controller({ path: 'navigation', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Post('route')
  @RequirePermissions('navigation:read')
  @ApiOperation({ summary: 'Calculate optimal path with accessibility preferences' })
  async getRoute(@Body() dto: NavigationRequestDto) {
    return this.navigationService.calculateRoute(dto);
  }
}
