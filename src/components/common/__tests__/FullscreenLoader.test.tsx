import React from 'react';
import { render } from '@testing-library/react';
import { FullscreenLoader } from '../FullscreenLoader';

describe('FullscreenLoader', () => {
  const loaderId = 'fullscreen-loader';

  it('renders a loader', () => {
    const result = render(<FullscreenLoader />);
    expect(result.getByTestId(loaderId)).toBeDefined();
  });
});
