import ResourcesPage from '@app/pages/resources';
import { render } from '@tests/utils/renderWithContext';

describe('Resources', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders page title', () => {
    const result = render(<ResourcesPage />);

    expect(result.getByText('Resources')).toBeDefined();
  });
});
