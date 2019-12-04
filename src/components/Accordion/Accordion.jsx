import React, { useState, useCallback } from 'react';
import { string, arrayOf, node, oneOfType } from 'prop-types';
import classNames from 'classnames';

import './Accordion.css';

import { ReactComponent as IconArrow } from 'svg/arrow.svg';

const Accordion = ({ className, title, items }) => {
    const [show, setShow] = useState(false);

    const toggleAccordion = useCallback(() => setShow(state => !state), []);

    const renderItem = useCallback((item, index) =>
        <li key={index} className="Accordion__item" children={item} />, []);

    return (
        <div className={classNames(className, 'Accordion')}>
            <button className="Accordion__toggle" aria-pressed={show} onClick={toggleAccordion}>
                <div className="Accordion__group">
                    <small className="Accordion__title" children={title} />
                    <span className="Accordion__hint" children="Посмотреть филиалы" />
                </div>
                <IconArrow className="Accordion__IconArrow" />
            </button>

            <ul className="Accordion__list" children={items.map(renderItem)} />
        </div>
    );
};

Accordion.propTypes = {
    className: string,
    title: string.isRequired,
    items: arrayOf(oneOfType([string, node])).isRequired
};

export default Accordion;