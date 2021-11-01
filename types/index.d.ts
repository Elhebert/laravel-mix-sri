/**
 * Extend the Laravel Mix API interface.
 */
export interface Api {
    /**
     * Generate an integrity hash.
     */
    generateIntegrityHash(): Api;
}
