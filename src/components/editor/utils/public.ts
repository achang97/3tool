const openUrl = (url: string, { newTab }: { newTab: boolean }) => {
  window.open(url, newTab ? '_blank' : '_self');
};

export const utils = {
  openUrl,
};
