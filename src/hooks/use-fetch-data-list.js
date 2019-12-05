import { useState, useEffect } from 'react';

const INITIAL_RESPONSE = {
    data: [],
    meta: {
        current_page: 1,
        last_page: 1
    },
};

export default function useFetchDataList(request, initialResponse = INITIAL_RESPONSE) {
    if (!initialResponse || typeof initialResponse !== 'object') {
        initialResponse = INITIAL_RESPONSE;
    }

    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(initialResponse);
    const [page, setPage] = useState(initialResponse.meta.current_page);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            try {
                const { data } = await request(page);

                setResponse(state => ({
                    data: state.data.concat(data.data),
                    meta: data.meta
                }));
                setLoading(false);
            } catch (err) {
                setError('e');
                setLoading(false);
            }
        }

        fetchData();
    }, [request, page]);

    function loadingNext() {
        const nextPage = page + 1;

        if (response.meta.last_page >= nextPage) {
            setPage(nextPage);
        }
    }

    return {
        loading,
        data: response.data,
        error,
        isLastPage: response.meta.last_page === response.meta.current_page,
        loadingNext,
        response
    };
}