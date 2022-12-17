export const silenceConsoleError = (...silencedErrors: string[]) => {
  // eslint-disable-next-line no-console
  const originalConsoleError = console.error;

  jest.spyOn(console, 'error').mockImplementation((...origArgs: unknown[]) => {
    const isSilenced = silencedErrors.some(
      (error) => typeof origArgs[0] === 'string' && origArgs[0].includes(error)
    );

    if (isSilenced) {
      return;
    }

    originalConsoleError(...origArgs);
  });
};
