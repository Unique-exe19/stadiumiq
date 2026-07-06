// =============================================================================
// Navigation Request DTO
// =============================================================================
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

import type { AccessibilityMode, RouteType, WaypointType } from '@stadiumiq/shared-types';

export class NavigationRequestDto {
  @ApiProperty({ description: 'Stadium ID' })
  @IsUUID()
  stadiumId!: string;

  @ApiPropertyOptional({ description: 'Optional starting waypoint ID' })
  @IsOptional()
  @IsUUID()
  fromWaypointId?: string;

  @ApiPropertyOptional({ description: 'Optional target seat ID' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  destinationSeatId?: string;

  @ApiPropertyOptional({ description: 'Optional target zone name' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  destinationZone?: string;

  @ApiPropertyOptional({
    enum: ['gate', 'elevator', 'escalator', 'ramp', 'restroom', 'food', 'medical', 'info', 'seat'],
  })
  @IsOptional()
  @IsEnum(['gate', 'elevator', 'escalator', 'ramp', 'restroom', 'food', 'medical', 'info', 'seat'])
  destinationType?: WaypointType;

  @ApiProperty({ enum: ['standard', 'accessible', 'fastest', 'least_crowded', 'scenic'] })
  @IsEnum(['standard', 'accessible', 'fastest', 'least_crowded', 'scenic'])
  preferredRouteType!: RouteType;

  @ApiProperty({ enum: ['standard', 'mobility-impaired', 'visual-impaired', 'hearing-impaired'] })
  @IsEnum(['standard', 'mobility-impaired', 'visual-impaired', 'hearing-impaired'])
  accessibilityMode!: AccessibilityMode;

  @ApiProperty({ example: 'en' })
  @IsString()
  @MaxLength(10)
  language!: string;
}
