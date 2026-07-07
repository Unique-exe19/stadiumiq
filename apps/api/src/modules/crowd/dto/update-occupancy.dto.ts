// =============================================================================
// Update Occupancy DTO
// =============================================================================
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateOccupancyDto {
  @ApiProperty({ description: 'Current occupancy count of the zone', example: 150 })
  @IsInt()
  @Min(0)
  currentOccupancy!: number;
}
