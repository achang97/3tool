import { GLOBAL_LIBRARIES } from '@app/constants';
import { screen, render } from '@testing-library/react';
import { ToolInspector } from '../ToolInspector';

describe('ToolInspector', () => {
  it('renders app title', () => {
    render(<ToolInspector />);
    expect(screen.getByText('app')).toBeTruthy();
  });

  it('renders libraries section', () => {
    render(<ToolInspector />);
    expect(screen.getByText('Libraries')).toBeTruthy();

    GLOBAL_LIBRARIES.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeTruthy();
    });
  });
});
