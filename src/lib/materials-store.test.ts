import { describe, expect, it } from 'vitest';
import { loadMaterialRequests, loadMaterials, saveMaterialRequests, saveMaterials } from './materials-store';

describe('materials store', () => {
  it('round-trips materials and requests through storage helpers', () => {
    saveMaterials([
      {
        id: 'mat-1',
        title: 'React Notes',
        format: 'pdf',
        description: 'Responsive UI guide',
        assignedUserIds: ['admin-1'],
      },
    ]);
    saveMaterialRequests([
      {
        id: 'req-1',
        requesterId: 'admin-1',
        title: 'Need CSS handbook',
        message: 'Please share a compact reference.',
        status: 'pending',
        createdAt: '2026-03-16T12:00:00.000Z',
      },
    ]);

    expect(loadMaterials()[0].title).toBe('React Notes');
    expect(loadMaterialRequests()[0].requesterId).toBe('admin-1');
  });
});
