import { render, screen } from '@testing-library/react';
import { mockApiError } from '@tests/constants/api';
import userEvent from '@testing-library/user-event';
import { AuthContainer } from '../AuthContainer';

const mockTitle = 'title';
const mockHandleSubmit = jest.fn();
const mockSubmitButtonProps = {
  children: 'Submit',
};
const mockChildren = 'children';

describe('AuthContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title', () => {
    render(
      <AuthContainer
        title={mockTitle}
        onSubmit={mockHandleSubmit}
        SubmitButtonProps={mockSubmitButtonProps}
      >
        {mockChildren}
      </AuthContainer>
    );
    expect(screen.getByText(mockTitle)).toBeTruthy();
  });

  it('renders subtitle', () => {
    const mockSubtitle = 'subtitle';
    render(
      <AuthContainer
        title={mockTitle}
        subtitle={mockSubtitle}
        onSubmit={mockHandleSubmit}
        SubmitButtonProps={mockSubmitButtonProps}
      >
        {mockChildren}
      </AuthContainer>
    );
    expect(screen.getByText(mockSubtitle)).toBeTruthy();
  });

  it('renders children', () => {
    render(
      <AuthContainer
        title={mockTitle}
        onSubmit={mockHandleSubmit}
        SubmitButtonProps={mockSubmitButtonProps}
      >
        {mockChildren}
      </AuthContainer>
    );
    expect(screen.getByText(mockChildren)).toBeTruthy();
  });

  it('renders error', () => {
    render(
      <AuthContainer
        title={mockTitle}
        onSubmit={mockHandleSubmit}
        SubmitButtonProps={mockSubmitButtonProps}
        error={mockApiError}
      >
        {mockChildren}
      </AuthContainer>
    );
    expect(screen.getByText(mockApiError.data.message)).toBeTruthy();
  });

  it('renders footer', () => {
    const mockFooter = 'footer';
    render(
      <AuthContainer
        title={mockTitle}
        onSubmit={mockHandleSubmit}
        SubmitButtonProps={mockSubmitButtonProps}
        footer={mockFooter}
      >
        {mockChildren}
      </AuthContainer>
    );
    expect(screen.getByText(mockFooter)).toBeTruthy();
  });

  it('submits form when clicking on submit button', async () => {
    render(
      <AuthContainer
        title={mockTitle}
        onSubmit={mockHandleSubmit}
        SubmitButtonProps={mockSubmitButtonProps}
      >
        {mockChildren}
      </AuthContainer>
    );
    await userEvent.click(screen.getByText(mockSubmitButtonProps.children));
    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});
