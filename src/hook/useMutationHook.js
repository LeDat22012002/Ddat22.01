import { useMutation } from 'react-query';

export const useMutationHooks = (fnCallback) => {
    // Call Api
    const mutation = useMutation({
        mutationFn: fnCallback,
    });
    return mutation;
};
