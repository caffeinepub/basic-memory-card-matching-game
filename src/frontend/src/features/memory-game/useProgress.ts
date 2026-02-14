import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Level } from './types';

export function useProgress() {
  const { actor, isFetching: isActorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity && !isInitializing;
  const principal = identity?.getPrincipal();

  // Query completed levels count
  const {
    data: completedCount = 0,
    isLoading: isLoadingProgress,
    error: progressError,
  } = useQuery({
    queryKey: ['progress', principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return 0;
      const count = await actor.getCompletedLevelsCount(principal);
      return Number(count);
    },
    enabled: !!actor && !!principal && !isActorFetching,
  });

  // Query badge status
  const {
    data: isBadgeMinted = false,
    isLoading: isLoadingBadge,
  } = useQuery({
    queryKey: ['badge', principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return false;
      return await actor.isBadgeMinted(principal);
    },
    enabled: !!actor && !!principal && !isActorFetching,
  });

  // Mutation to complete a level
  const completeLevelMutation = useMutation({
    mutationFn: async (level: Level) => {
      if (!actor || !principal) {
        throw new Error('Not authenticated');
      }
      return await actor.completeLevel(principal, BigInt(level));
    },
    onSuccess: () => {
      // Invalidate progress queries
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      queryClient.invalidateQueries({ queryKey: ['badge'] });
    },
  });

  // Mutation to mint badge
  const mintBadgeMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !principal) {
        throw new Error('Not authenticated');
      }
      // The backend doesn't have a mintBadge method yet, but we'll call completeLevel for level 10
      // as a workaround to trigger badge eligibility
      return await actor.completeLevel(principal, BigInt(10));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['badge'] });
    },
  });

  const canMint = isAuthenticated && completedCount >= 10 && !isBadgeMinted;

  return {
    isAuthenticated,
    completedCount,
    isBadgeMinted,
    canMint,
    isLoading: isLoadingProgress || isLoadingBadge || isActorFetching || isInitializing,
    error: progressError,
    completeLevel: completeLevelMutation.mutate,
    isCompletingLevel: completeLevelMutation.isPending,
    mintBadge: mintBadgeMutation.mutate,
    isMintingBadge: mintBadgeMutation.isPending,
  };
}
