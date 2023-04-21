import { Rubik } from '@next/font/google';

const rubik = Rubik({
  subsets: ['latin'],
});

export const baseFont = [rubik.style.fontFamily, 'BlinkMacSystemFont', 'sans-serif'].join(',');
