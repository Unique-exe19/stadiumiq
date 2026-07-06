// =============================================================================
// Navigation Controller
// =============================================================================
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { NavigationRequestDto } from './dto/navigation-request.dto';
import { NavigationService } from './navigation.service';

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
