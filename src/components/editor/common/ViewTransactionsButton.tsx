import { MenuItem } from '@app/components/common/MenuItem';
import { useMenuState } from '@app/hooks/useMenuState';
import { Button, Menu } from '@mui/material';
import { useCallback, MouseEvent } from 'react';

type ViewTransactionsButtonProps = {
  urls: string[];
};

export const ViewTransactionsButton = ({ urls }: ViewTransactionsButtonProps) => {
  const { menuAnchor, isMenuOpen, onMenuOpen, onMenuClose } = useMenuState();

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (urls.length > 1) {
        onMenuOpen(e);
        return;
      }

      window.open(urls[0]);
    },
    [onMenuOpen, urls]
  );

  if (urls.length === 0) {
    return null;
  }

  return (
    <>
      {urls.length > 1 && (
        <Menu
          anchorEl={menuAnchor}
          open={isMenuOpen}
          onClose={onMenuClose}
          onClick={onMenuClose}
          sx={{ zIndex: 1500 }} // NOTE: The z-index of the notistack container is 1400
        >
          {urls.map((url, i) => (
            <MenuItem
              key={url}
              href={url}
              target="_blank"
              label={`Transaction ${i + 1}`}
              testId={`view-transactions-menu-option-${i}`}
            />
          ))}
        </Menu>
      )}
      <Button variant="text" size="small" onClick={handleClick}>
        View transaction{urls.length > 1 && '(s)'}
      </Button>
    </>
  );
};
