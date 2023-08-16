declare module '*.scss';
declare module '*.png';

interface Window extends Window {
  dataLayer: any[];
  VTEX_METADATA: {
    account: string,
    renderer: "faststore"
  };
  sendrc: (eventName: string, eventValues?: any) => void
}
