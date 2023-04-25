import { renderHook } from '@testing-library/react';
import { analytics } from '@app/analytics';
import { mockTool } from '@tests/constants/data';
import { useToolAnalyticsTrack } from '../useToolAnalyticsTrack';

jest.mock('@app/analytics');

jest.mock('../useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: mockTool,
  })),
}));

describe('useToolAnalyticsTrack', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls track with toolId and toolName properties', () => {
    const mockEvent = 'event';
    const mockProperties = { property: 'value' };
    const mockOptions = { test: 1 };

    const { result } = renderHook(() => useToolAnalyticsTrack());
    expect(result.current(mockEvent, mockProperties, mockOptions));
    expect(analytics.track).toHaveBeenCalledWith(
      mockEvent,
      { ...mockProperties, toolId: mockTool._id, toolName: mockTool.name },
      mockOptions
    );
  });
});
