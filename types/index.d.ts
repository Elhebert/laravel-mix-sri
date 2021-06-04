export type Options = {
  algorithm?: 'sha256' | 'sha384' | 'sha512'
  enabled?: boolean
}

export interface Api {
  /** Enable SRI integrity hash generation. */
  generateIntegrityHash(options?: Options): Api;
}
