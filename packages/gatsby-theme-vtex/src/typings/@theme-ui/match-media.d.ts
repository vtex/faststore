declare module '@theme-ui/match-media' {
  interface Options {
    defaultIndex: number
  }

  export const useResponsiveValue: <T = any>(args: T[], options: Options) => T
}
