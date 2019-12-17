import React, { useState, useCallback } from 'react';
import { string, func } from 'prop-types';
import classNames from 'classnames';

import './Search.css';

const Search = ({ className, name, value, onChange, onReset }) => {
    const [q, setQ] = useState(value);
    const [focus, setFocus] = useState(false);

    const handleFocus = useCallback(() => setFocus(true), []);
    const handleBlur = useCallback(() => setFocus(false), []);

    const handleChange = useCallback((e) => {
        const { value } = e.target;

        setQ(value);

        if (onChange) {            
            onChange(value, e);
        }
    }, [onChange]);

    const reset = useCallback(() => {
        setQ('');

        if (onChange) {
            onChange('');
        }

        if (onReset) {
            onReset();
        }
    }, [onChange, onReset]);

    return (
        <div className={classNames(className, 'Search', { 'Search--focus': Boolean(q.trim()) || focus })}>
            <input
                className="Search__input"
                type="text"
                autoComplete="off"
                name={name}
                placeholder="Поиск по местам"
                value={q}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange} />
            <button
                className="Search__reset"
                children="Отменить"
                onClick={reset} />
        </div>
    );
};

Search.propTypes = {
    className: string,
    name: string,
    value: string,
    onChange: func,
    onReset: func
};

Search.defaultProps = {
    value: '',
};

export default Search;