import { ConvexClientProvider } from './convex-provider'
import { JotaiProvider } from './jotai-provider'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConvexClientProvider>
      <JotaiProvider>{children}</JotaiProvider>
    </ConvexClientProvider>
  )
}
