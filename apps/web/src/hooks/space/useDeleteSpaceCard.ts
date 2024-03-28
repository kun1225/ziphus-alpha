import axiosInstance from '@/utils/axios';
import {
    UseMutationResult,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

async function fetchDeleteSpaceCard(spaceId: string, spaceCardId: string) {
    return await axiosInstance.delete(
        `/space/${spaceId}/space-card/${spaceCardId}`,
    );
}

function useDeleteSpaceCard(): UseMutationResult<
    AxiosResponse<void>,
    unknown,
    { spaceId: string; spaceCardId: string },
    unknown
> {
    const queryClient = useQueryClient();
    const mutate = useMutation({
        mutationFn: ({
            spaceId,
            spaceCardId,
        }: {
            spaceId: string;
            spaceCardId: string;
        }) => fetchDeleteSpaceCard(spaceId, spaceCardId),
        onSuccess: (data) => {
            if (queryClient.getQueryData(['space', data.data.spaceCard.targetSpaceId])) {
                queryClient.setQueryData(['space', data.data.spaceCard.targetSpaceId], (space: any) => {
                    return {
                        ...space,
                        spaceCards: space.spaceCards.filter(
                            (spaceCard: any) => spaceCard.id !== data.data.spaceCard.id,
                        ),
                    };
                });
            }
            if (queryClient.getQueryData(['spaces'])) {
                queryClient.setQueryData(['spaces'], (spaces: any) => {
                    return spaces.map((space: any) => {
                        if (space.id === data.data.spaceCard.targetSpaceId) {
                            return {
                                ...space,
                                spaceCards: space.spaceCards.filter(
                                    (spaceCard: any) => spaceCard.id !== data.data.spaceCard.id,
                                ),
                            };
                        }
                        return space;
                    });
                });
            }

        },
    });
    return mutate;
}

export default useDeleteSpaceCard;
