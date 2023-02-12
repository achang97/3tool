import { render } from '@testing-library/react';
import { FullscreenLoader } from '../FullscreenLoader';

describe('FullscreenLoader', () => {
  it('renders a loader', () => {
    const result = render(<FullscreenLoader />);
    expect(result.getByTestId('fullscreen-loader')).toBeTruthy();
  });
});
