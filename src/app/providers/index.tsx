import { ConvexClientProvider } from './convex-provider'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <ConvexClientProvider>{children}</ConvexClientProvider>
}
