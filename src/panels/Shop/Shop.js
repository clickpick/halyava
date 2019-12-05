import React, { useState, useCallback, useEffect } from 'react';
import { string, shape, func } from 'prop-types';
import classNames from 'classnames';

import './Shop.css';

import connect from '@vkontakte/vk-connect';
import { VK_APP_ID } from 'constants/vk';
import { useDispatch } from 'react-redux';
import { showPopup } from 'actions/popup-actions';
import * as POPUP from 'constants/popup';

import { getTimezoneOffset, timetableParse } from 'helpers/dates';

import { Panel, PanelHeader, HeaderButton, platform, IOS } from '@vkontakte/vkui';
import Wrapper from 'components/Wrapper';
import ShopCard from 'components/ShopCard';
import Loader from 'components/Loader';
import Gallery from 'components/Gallery';
import { InfoRow, FixedLayout } from '@vkontakte/vkui';
import Accordion from 'components/Accordion';
import Link from 'components/Link';
import Button from 'components/Button';

import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import { ReactComponent as IconVk } from 'svg/vk.svg';

const isIOS = platform() === IOS;

const Shop = ({ id, shop, goBack }) => {
    const [loading, setLoading] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [timetable, setTimetable] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [group, setGroup] = useState(null);

    const dispatch = useDispatch();

    const renderAddress = useCallback((item) =>
        <Link href="#" children={item.address} icon="point" />, []);

    useEffect(() => {
        async function fetchInfo() {
            setLoading(true);

            try {
                const { access_token } = await connect.sendPromise('VKWebAppGetAuthToken', {
                    app_id: VK_APP_ID,
                    scope: ''
                });

                const v = '5.103';

                const { response: { items: photos } } = await connect.sendPromise('VKWebAppCallAPIMethod', {
                    method: 'photos.get',
                    params: {
                        owner_id: `-${shop.properties.group.id}`,
                        album_id: shop.properties.group.album_id || 'wall',
                        count: 20,
                        access_token,
                        v
                    }
                });

                const { response: { items: addresses } } = await connect.sendPromise('VKWebAppCallAPIMethod', {
                    method: 'groups.getAddresses',
                    params: {
                        group_id: shop.properties.group.id,
                        access_token,
                        v
                    }
                });
                

                const { response: [group] } = await connect.sendPromise('VKWebAppCallAPIMethod', {
                    method: 'groups.getById',
                    params: {
                        group_id: shop.properties.group.id,
                        fields: ['can_message', 'description', 'place', 'site'],
                        access_token,
                        v
                    }
                });
                
                const currentAddress = addresses.find((address) => address.id === shop.id);

                if (currentAddress && currentAddress.timetable) {
                    setTimetable(timetableParse(currentAddress.timetable, currentAddress.time_offset, getTimezoneOffset()));
                }
                
                setPhotos(photos);
                setCurrentAddress(currentAddress);
                setAddresses(addresses.filter((address) => address.id !== shop.id));
                setGroup(group);
            } catch (e) {
                if (e.error_data.error_code === 4) {
                    dispatch(showPopup(POPUP.TOKEN_DENIED));
                }
            }

            setLoading(false);
        }

        fetchInfo();
    }, [dispatch, shop]);

    return (
        <Panel id={id} className="Shop">
            <PanelHeader
                noShadow={true}
                left={
                    <HeaderButton onClick={goBack}>
                        {(isIOS) ? <Icon28ChevronBack /> : <Icon24Back />}
                        Карта
                    </HeaderButton>
                } />

            <Wrapper className="Shop__Wrapper">
                <ShopCard
                    className="Shop__ShopCard"
                    name={shop.properties.group.name}
                    activity={shop.properties.group.activity}
                    photo={shop.properties.iconContent}
                    cashback={shop.properties.group.cashback_value} />

                {(loading)
                    ? <Loader className="Shop__Loader" center />
                    : <>
                        {(photos && photos.length > 0) &&
                            <Gallery className="Shop__Gallery" photos={photos} />}

                        {(currentAddress) && <>
                            {(timetable) &&
                                <InfoRow className="Shop__InfoRow" title="Режим работы">
                                    <span
                                        className={classNames('Shop__timetable', {
                                            'Shop__timetable--opened': timetable.isOpened
                                        })}
                                        children={(timetable.isOpened) ? 'Открыто' : 'Закрыто'} />
                                    {(timetable.needShow) && `, ${timetable.nextChangeDate}`}
                                </InfoRow>}

                            {(currentAddress.address) &&
                                <InfoRow
                                    className="Shop__InfoRow"
                                    title="Адрес"
                                    children={currentAddress.address} />}

                            {(addresses && addresses.length > 0) &&
                                (addresses.length === 1)
                                    ? <InfoRow
                                        className="Shop__InfoRow"
                                        title="Филиалы"
                                        children={renderAddress(addresses[0])} />
                                    : <Accordion
                                        className="Shop__Accordion"
                                        title="Филиалы"
                                        items={addresses.map(renderAddress)} />}

                            {(currentAddress.phone) &&
                                <InfoRow className="Shop__InfoRow" title="Номер телефона">
                                    <a href={`tel:${currentAddress.phone}`} children={currentAddress.phone} />
                                </InfoRow>}
                        </>}

                        {(group) && <>
                            {(group.site) &&
                                <InfoRow className="Shop__InfoRow" title="Сайт">
                                    <a
                                        href={group.site}
                                        children={group.site}
                                        target="_blank"
                                        rel="noopener noreferrer" />
                                </InfoRow>}

                            {(group.description) &&
                                <InfoRow
                                    className="Shop__InfoRow"
                                    title="Описание из группы"
                                    children={group.description} />}

                            {(Boolean(group.can_message)) &&
                                <FixedLayout
                                    className="Shop__FixedLayout"
                                    vertical="bottom">
                                    <Button
                                        className="Shop__Button"
                                        theme="primary"
                                        size="medium"
                                        href={`https://vk.me/${group.screen_name}`}
                                        children="Написать сообщение"
                                        before={<IconVk />}
                                        full
                                        backlight />
                                </FixedLayout>}
                        </>}
                    </>}
            </Wrapper>
        </Panel>
    );
};

Shop.propTypes = {
    id: string.isRequired,
    shop: shape({
        properties: shape({
            group: shape({
                name: string,
                activity: string
            }),
            iconContent: string
        })
    }),
    goBack: func.isRequired
};

export default Shop;