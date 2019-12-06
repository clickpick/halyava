import React, { useState, useEffect } from 'react';
import { string, number } from 'prop-types';
import classNames from 'classnames';

import './Timetable.css';

import connect from '@vkontakte/vk-connect';
import { VK_APP_ID } from 'constants/vk';
import { getTimezoneOffset, timetableParse } from 'helpers/dates';

import Row from 'components/Row';

const Timetable = ({ className, groupId: group_id, addressId }) => {
    const [timetable, setTimetable] = useState(null);

    useEffect(() => {
        async function fetchTimetable() {
            const { access_token } = await connect.sendPromise('VKWebAppGetAuthToken', {
                app_id: VK_APP_ID,
                scope: ''
            });

            const v = '5.103';

            const { response: { items: addresses } } = await connect.sendPromise('VKWebAppCallAPIMethod', {
                method: 'groups.getAddresses',
                params: {
                    group_id,
                    access_token,
                    v
                }
            });

            const currentAddress = addresses.find((address) => address.id === addressId);

            if (currentAddress && currentAddress.timetable) {
                setTimetable(timetableParse(currentAddress.timetable, currentAddress.time_offset, getTimezoneOffset()));
            }
        }

        fetchTimetable();
    }, [group_id, addressId]);

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
    groupId: number.isRequired,
    addressId: number.isRequired
};

export default Timetable;