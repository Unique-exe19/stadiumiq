// =============================================================================
// Navigation Service
// =============================================================================
import { Injectable } from '@nestjs/common';

import type { NavigationRequest, Route, Waypoint } from '@stadiumiq/shared-types';

@Injectable()
export class NavigationService {
  constructor() {}

  async calculateRoute(req: NavigationRequest): Promise<Route> {
    const fromId = req.fromWaypointId ?? 'gate-b-uuid';
    const toId = 'section-204-uuid';

    // Fetch waypoints from DB or use standard ones
    const fromWaypoint: Waypoint = {
      id: fromId,
      stadiumId: req.stadiumId,
      name: 'Gate B Entrance',
      type: 'gate',
      location: { lat: 40.8135, lng: -74.0745 },
      floor: 1,
      isAccessible: true,
      amenities: ['ticket_scanner', 'bag_check'],
    };

    const toWaypoint: Waypoint = {
      id: toId,
      stadiumId: req.stadiumId,
      name: req.destinationSeatId ? `Seat ${req.destinationSeatId}` : 'Section 204 Seating Area',
      type: 'seat',
      location: { lat: 40.8142, lng: -74.0738 },
      floor: 2,
      isAccessible: req.accessibilityMode !== 'mobility-impaired',
      amenities: [],
    };

    const polyline = [
      fromWaypoint.location,
      { lat: 40.8138, lng: -74.0742 },
      { lat: 40.814, lng: -74.074 },
      toWaypoint.location,
    ];

    const instructions = [
      {
        stepNumber: 1,
        instruction: 'Enter through Gate B scanners and walk straight for 20 meters.',
        distanceMeters: 20,
        landmark: 'Gate B Security',
        floor: 1,
        audioDescription: 'Walk straight past security scanners.',
      },
      {
        stepNumber: 2,
        instruction:
          req.accessibilityMode === 'mobility-impaired'
            ? 'Turn left and take Elevator 3 to Level 2.'
            : 'Turn left and take Escalator 2 to Level 2.',
        distanceMeters: 30,
        landmark: 'Elevator/Escalator Bank East',
        floor: 1,
        accessibilityNote:
          req.accessibilityMode === 'mobility-impaired'
            ? 'Elevator equipped with Braille and audio announcements.'
            : undefined,
        audioDescription:
          req.accessibilityMode === 'mobility-impaired'
            ? 'Take Elevator 3 on your left up one level.'
            : 'Take Escalator 2 on your left up one level.',
      },
      {
        stepNumber: 3,
        instruction: 'Walk 40 meters along the Level 2 Concourse to Section 204.',
        distanceMeters: 40,
        landmark: 'Food Stand: World Cup Eats',
        floor: 2,
        audioDescription:
          'Walk down the corridor. Section 204 is on the right, past World Cup Eats.',
      },
    ];

    return {
      id: crypto.randomUUID(),
      type: req.preferredRouteType,
      fromWaypointId: fromWaypoint.id,
      toWaypointId: toWaypoint.id,
      waypoints: [fromWaypoint, toWaypoint],
      distanceMeters: 90,
      estimatedMinutes: req.accessibilityMode === 'mobility-impaired' ? 5 : 3,
      accessibilityScore: req.accessibilityMode === 'mobility-impaired' ? 100 : 75,
      crowdScore: 92,
      polyline,
      instructions,
      generatedAt: new Date().toISOString(),
    };
  }
}
