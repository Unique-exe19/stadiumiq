// =============================================================================
// Volunteers Service
// =============================================================================
import { Injectable, NotFoundException } from '@nestjs/common';
import type { VolunteerTask as DBVolunteerTask } from '@prisma/client';

import type { VolunteerBriefing, VolunteerProfile, VolunteerTask } from '@stadiumiq/shared-types';

import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class VolunteersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string): Promise<VolunteerProfile> {
    const p = await this.prisma.volunteerProfile.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!p) throw new NotFoundException('Volunteer profile not found');

    return {
      id: p.id,
      userId: p.userId,
      stadiumId: p.stadiumId,
      displayName: p.user.displayName,
      badgeNumber: p.badgeNumber,
      currentStatus: p.currentStatus as VolunteerProfile['currentStatus'],
      currentLocation:
        p.currentLat && p.currentLng ? { lat: p.currentLat, lng: p.currentLng } : undefined,
      assignedZone: p.assignedZone ?? undefined,
      languages: p.languages,
      skills: p.skills,
      shiftStart: p.shiftStart.toISOString(),
      shiftEnd: p.shiftEnd.toISOString(),
      tasksCompleted: p.tasksCompleted,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
  }

  async getTasks(volunteerId: string): Promise<VolunteerTask[]> {
    const tasks = await this.prisma.volunteerTask.findMany({
      where: { volunteerId },
      orderBy: { createdAt: 'desc' },
    });

    return tasks.map((t: DBVolunteerTask) => ({
      id: t.id,
      volunteerId: t.volunteerId,
      stadiumId: t.stadiumId,
      title: t.title,
      description: t.description,
      priority: t.priority as VolunteerTask['priority'],
      status: t.status as VolunteerTask['status'],
      location: { lat: t.locationLat, lng: t.locationLng },
      zoneId: t.zoneId ?? undefined,
      estimatedDurationMinutes: t.estimatedDurationMinutes,
      dueBy: t.dueBy?.toISOString(),
      aiInstructions: t.aiInstructions ?? undefined,
      completedAt: t.completedAt?.toISOString(),
      createdAt: t.createdAt.toISOString(),
    }));
  }

  async getBriefing(volunteerId: string): Promise<VolunteerBriefing> {
    const profile = await this.prisma.volunteerProfile.findUnique({
      where: { id: volunteerId },
      include: { user: true },
    });
    if (!profile) throw new NotFoundException('Volunteer profile not found');

    return {
      volunteerId,
      generatedAt: new Date().toISOString(),
      shiftSummary: `Welcome to shift, ${profile.user.displayName}! You are assigned to the East Stand today.`,
      keyTasks: [
        'Assist fans entering through Gate E2.',
        'Monitor ticket scanning queues at 18:30.',
        'Direct accessibility users to Elevator 3.',
      ],
      zoneConditions: 'High density expected in east wing concourse between 18:45 and 19:15.',
      safetyReminders: [
        'Report any suspicious packages directly in the app.',
        'Ensure emergency exits in the east wing remain completely unobstructed.',
      ],
      contactInfo: {
        'Supervisor Phone': '+1-555-0192',
        'Security Operations': '+1-555-9000',
      },
      language: profile.user.preferredLanguage,
    };
  }
}
