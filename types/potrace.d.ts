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

  interface PosterizeOptions extends PotraceOptions {
    steps?: number
    fillStrategy?: 'dominant' | 'mean' | 'median' | 'spread'
    rangeDistribution?: 'auto' | 'equal'
  }

  function trace(
    file: string | Buffer,
    options?: PotraceOptions,
    callback?: (err: Error | null, svg?: string) => void
  ): void

  function posterize(
    file: string | Buffer,
    options?: PosterizeOptions,
    callback?: (err: Error | null, svg?: string) => void
  ): void

  namespace potrace {
    export { trace, posterize, PotraceOptions, PosterizeOptions }
  }

  export = potrace
}
