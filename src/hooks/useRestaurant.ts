import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantsApi } from '../api/restaurants';
import { Table } from '../types';
import { apiClient } from '../api/client';

export const useRestaurant = (restaurantId?: string) => {
  const queryClient = useQueryClient();

  // Get restaurant details
  const { data: restaurant, isLoading: isLoadingRestaurant } = useQuery({
    queryKey: ['restaurant', restaurantId],
    queryFn: () => restaurantsApi.getById(restaurantId!),
    enabled: !!restaurantId,
  });

  // Get restaurant tables
  const { data: tables, isLoading: isLoadingTables, refetch: refetchTables } = useQuery({
    queryKey: ['tables', restaurantId],
    queryFn: () => restaurantsApi.getTables(restaurantId!),
    enabled: !!restaurantId,
  });

  // Get availability
  const getAvailability = (date: string) => {
    return useQuery({
      queryKey: ['availability', restaurantId, date],
      queryFn: () => restaurantsApi.getAvailability(restaurantId!, date),
      enabled: !!restaurantId && !!date,
    });
  };

  // Update table availability (for admin)
  const updateTableMutation = useMutation({
    mutationFn: ({ tableId, data }: { tableId: string; data: Partial<Table> }) => {
      return apiClient.patch(`/tables/${tableId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables', restaurantId] });
    },
  });

  return {
    restaurant,
    tables,
    isLoading: isLoadingRestaurant || isLoadingTables,
    refetchTables,
    getAvailability,
    updateTable: updateTableMutation.mutate,
    isUpdating: updateTableMutation.isPending,
  };
};