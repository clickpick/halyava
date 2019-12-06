import React, { useState, useEffect } from 'react';
import { string, number, shape, bool } from 'prop-types';
import classNames from 'classnames';

import './Timetable.css';

import API from 'services/api';
import { getTimezoneOffset, timetableParse } from 'helpers/dates';

import Row from 'components/Row';

const Timetable = ({ className, initialTimetable, groupId: group_id, addressId }) => {
    const [timetable, setTimetable] = useState(initialTimetable);

    useEffect(() => {
        if (!initialTimetable) {
            async function fetchTimetable() {
                const { response: { items: addresses } } = await API.callAPI('groups.getAddresses', { group_id, address_ids: [addressId] });

                if (addresses[0] && addresses[0].timetable) {
                    setTimetable(timetableParse(addresses[0].timetable, addresses[0].time_offset, getTimezoneOffset()));
                }
            }

            fetchTimetable();
        }
    }, [initialTimetable, group_id, addressId]);

    return (
        <div className={classNames(className, 'Timetable', {
            'Timetable--show': Boolean(timetable)
        })}>
            {(timetable) &&
                <Row className="Timetable__Row" title="Режим работы">
                    <span
                        className={classNames('Timetable__timetable', {
                            'Timetable__timetable--opened': timetable.isOpened
                        })}
                        children={(timetable.isOpened) ? 'Открыто' : 'Закрыто'} />
                    {`, ${timetable.helpString}`}
                </Row>}
        </div>
    );
};

Timetable.propTypes = {
    className: string,
    initialTimetable: shape({
        isOpened: bool,
        helpString: string
    }),
    groupId: number,
    addressId: number
};

Timetable.defaultProps = {
    initialTimetable: undefined
};

export default Timetable;