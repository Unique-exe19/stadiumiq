// =============================================================================
// Security Module
// =============================================================================

import { Module } from '@nestjs/common';
// Import security components
import { SecurityController } from './security.controller';
import { SecurityService } from './security.service';

@Module({
  controllers: [SecurityController],
  providers: [SecurityService],
  exports: [SecurityService],
})
export class SecurityModule {}