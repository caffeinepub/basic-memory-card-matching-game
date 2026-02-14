import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryGameView } from './features/memory-game/MemoryGameView';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryGameView />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
