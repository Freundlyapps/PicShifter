declare module 'potrace' {
  interface PotraceOptions {
    turdSize?: number
    turnPolicy?: 'black' | 'white' | 'left' | 'right' | 'minority' | 'majority'
    alphaMax?: number
    optCurve?: boolean
    optTolerance?: number
    threshold?: number
    blackOnWhite?: boolean
    color?: string
    background?: string
  }

  function trace(
    file: string | Buffer,
    options?: PotraceOptions,
    callback?: (err: Error | null, svg?: string) => void
  ): void

  namespace potrace {
    export { trace, PotraceOptions }
  }

  export = potrace
}
