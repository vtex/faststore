import { onServer } from '../utils';

export function useScroll(scrollbarId: string): void {
  if (!onServer()) {
    window.onscroll = function () {
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      document.getElementById(scrollbarId).style.width = scrolled + '%';
    };
  }
}
