// =============================================================================
// Create Incident DTO
// =============================================================================

import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { IncidentType, IncidentPriority } from '@stadiumiq/shared-types';

class GeoPointDto {
  @ApiProperty({ example: 40.8135 })
  @IsNumber()
  lat!: number;

  @ApiProperty({ example: -74.0745 })
  @IsNumber()
  lng!: number;
}

export class CreateIncidentDto {
  @ApiProperty()
  @IsUUID()
  stadiumId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  zoneId?: string;

  @ApiProperty({ enum: ['medical', 'security_threat', 'crowd_surge', 'fire', 'structural', 'lost_person', 'suspicious_package', 'vandalism', 'technical_failure', 'weather', 'other'] })
  @IsEnum(['medical', 'security_threat', 'crowd_surge', 'fire', 'structural', 'lost_person', 'suspicious_package', 'vandalism', 'technical_failure', 'weather', 'other'])
  type!: IncidentType;

  @ApiProperty({ enum: ['low', 'medium', 'high', 'critical'] })
  @IsEnum(['low', 'medium', 'high', 'critical'])
  priority!: IncidentPriority;

  @ApiProperty({ example: 'Medical Emergency near Section 204' })
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  title!: string;

  @ApiProperty({ example: 'Fan reported feeling chest pain near seating row G.' })
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  description!: string;

  @ApiProperty({ type: GeoPointDto })
  @ValidateNested()
  @Type(() => GeoPointDto)
  location!: GeoPointDto;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  floor?: number;
}
