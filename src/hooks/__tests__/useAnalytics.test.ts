import { renderHook } from '@testing-library/react';
import { analytics } from '@app/analytics';
import { mockUser } from '@tests/constants/data';
import { useAnalytics } from '../useAnalytics';

jest.mock('@app/analytics');

jest.mock('../useSignedInUser', () => ({
  useSignedInUser: jest.fn(() => mockUser),
}));

describe('useAnalytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls track with companyId in properties', () => {
    const mockEvent = 'event';
    const mockProperties = { property: 'value' };
    const mockOptions = { test: 1 };

    const { result } = renderHook(() => useAnalytics());
    expect(result.current.track(mockEvent, mockProperties, mockOptions));
    expect(analytics.track).toHaveBeenCalledWith(
      mockEvent,
      { ...mockProperties, companyId: mockUser.companyId },
      mockOptions
    );
  });

  it('calls page with companyId in properties', () => {
    const mockCategory = 'category';
    const mockName = 'name';
    const mockProperties = { property: 'value' };
    const mockOptions = { test: 1 };

    const { result } = renderHook(() => useAnalytics());
    expect(result.current.page(mockCategory, mockName, mockProperties, mockOptions));
    expect(analytics.page).toHaveBeenCalledWith(
      mockCategory,
      mockName,
      { ...mockProperties, companyId: mockUser.companyId },
      mockOptions
    );
  });
});
