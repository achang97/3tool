import { renderHook } from '@testing-library/react';
import { mockTool } from '@tests/constants/data';
import { useToolAnalyticsTrack } from '../useToolAnalyticsTrack';

const mockAnalytics = { track: jest.fn() };

jest.mock('@app/hooks/useAnalytics', () => ({
  useAnalytics: jest.fn(() => mockAnalytics),
}));

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
    expect(mockAnalytics.track).toHaveBeenCalledWith(
      mockEvent,
      { ...mockProperties, toolId: mockTool._id, toolName: mockTool.name },
      mockOptions
    );
  });
});
