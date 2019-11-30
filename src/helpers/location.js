export const parseQueryString = (string) =>
    string.slice(1).split('&')
        .map((queryParam) => {
            const [key, value] = queryParam.split('=');

            return { key, value };
        })
        .reduce((query, kvp) => {
            query[kvp.key] = kvp.value;

            return query;
        }, {});