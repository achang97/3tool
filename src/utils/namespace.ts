export const validateVariableName = (newName: string): string | undefined => {
  if (!newName.match(/^[\w_$]+$/)) {
    return 'Name can only contain letters, numbers, _, or $';
  }

  if (!newName.match(/^[a-zA-Z_]/)) {
    return 'Name must start with a letter or "_"';
  }

  return undefined;
};
