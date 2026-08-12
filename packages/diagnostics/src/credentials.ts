import { type ChannelCredentials, credentials } from '@grpc/grpc-js'

/**
 * The VTEX collectors are reached over plaintext gRPC (port 80), so transport
 * security is opt-in via an explicit `https://` endpoint rather than inferred
 * from the environment.
 */
export function createChannelCredentials(endpoint: string): ChannelCredentials {
  return endpoint.startsWith('https://')
    ? credentials.createSsl()
    : credentials.createInsecure()
}
