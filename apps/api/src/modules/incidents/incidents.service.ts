// =============================================================================
// Incidents Service
// =============================================================================
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Incident as DBIncident,
  IncidentUpdate as DBIncidentUpdate,
  IncidentStatus,
} from '@prisma/client';

import type { CreateIncidentRequest, Incident, IncidentUpdate } from '@stadiumiq/shared-types';

import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class IncidentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(req: CreateIncidentRequest, reporterId: string): Promise<Incident> {
    const record = await this.prisma.incident.create({
      data: {
        stadiumId: req.stadiumId,
        zoneId: req.zoneId,
        type: req.type,
        priority: req.priority,
        title: req.title,
        description: req.description,
        locationLat: req.location.lat,
        locationLng: req.location.lng,
        floor: req.floor,
        status: 'reported',
        reportedById: reporterId,
        createdBy: reporterId,
        aiSummary: `AI Summary: ${req.type.toUpperCase()} incident reported in ${req.title}. Recommendations triggered.`,
        aiRecommendations: [
          'Dispatch medical staff to location.',
          'Inform nearest zone supervisor.',
        ],
      },
    });

    return this.mapToIncident(record);
  }

  async findAll(): Promise<Incident[]> {
    const list = await this.prisma.incident.findMany({
      orderBy: { createdAt: 'desc' },
      include: { updates: true },
    });
    return list.map((item: DBIncident) => this.mapToIncident(item));
  }

  async findOne(id: string): Promise<Incident> {
    const item = await this.prisma.incident.findUnique({
      where: { id },
      include: { updates: true },
    });
    if (!item) throw new NotFoundException('Incident not found');
    return this.mapToIncident(item);
  }

  async addUpdate(
    incidentId: string,
    status: string,
    note: string,
    userId: string,
  ): Promise<IncidentUpdate> {
    const update = await this.prisma.incidentUpdate.create({
      data: {
        incidentId,
        status: status as IncidentStatus,
        note,
        updatedBy: userId,
      },
    });

    await this.prisma.incident.update({
      where: { id: incidentId },
      data: {
        status: status as IncidentStatus,
        resolvedAt: status === 'resolved' ? new Date() : undefined,
      },
    });

    return {
      id: update.id,
      incidentId: update.incidentId,
      updatedBy: update.updatedBy,
      status: update.status as IncidentUpdate['status'],
      note: update.note,
      timestamp: update.timestamp.toISOString(),
    };
  }

  private mapToIncident(record: DBIncident & { updates?: DBIncidentUpdate[] }): Incident {
    return {
      id: record.id,
      stadiumId: record.stadiumId,
      zoneId: record.zoneId ?? undefined,
      type: record.type as Incident['type'],
      status: record.status as Incident['status'],
      priority: record.priority as Incident['priority'],
      title: record.title,
      description: record.description,
      location: { lat: record.locationLat, lng: record.locationLng },
      floor: record.floor ?? undefined,
      reportedBy: record.reportedById,
      assignedTo: record.assignedTo,
      aiSummary: record.aiSummary ?? undefined,
      aiRecommendations: record.aiRecommendations,
      updates: record.updates
        ? record.updates.map((u: DBIncidentUpdate) => ({
            id: u.id,
            incidentId: u.incidentId,
            updatedBy: u.updatedBy,
            status: u.status,
            note: u.note,
            timestamp: u.timestamp.toISOString(),
          }))
        : [],
      resolvedAt: record.resolvedAt?.toISOString(),
      closedAt: record.closedAt?.toISOString(),
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
      createdBy: record.createdBy,
      updatedBy: record.updatedBy ?? undefined,
    };
  }
}
