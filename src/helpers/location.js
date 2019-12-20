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

export const getHash = (link) => {
    const hash = link.split('#')[1];

    if (hash) {
        return hash.replace('#', '');
    }

    return '';
};

export const getHashParam = (link, param) => {
    if (!link || !param) {
        return null;
    }

    const params = getHash(link).split('&');

    for (let i = 0; i < params.length; i++) {
        const [key, value] = params[i].split('=');

        if (key === param) {
            return value;
        }
    }

    return null;
};