import { useState, useCallback, useEffect } from 'react';

export default function useFetch(instance) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);

        try {
            const data = await instance();

            setData(data);
            setLoading(false);
        } catch (err) {
            setError('Ошибка загрузки');
            setLoading(false);
        }
    }, [instance]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return [loading, data, fetchData, error];
}