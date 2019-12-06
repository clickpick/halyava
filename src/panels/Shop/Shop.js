import React, { useState, useCallback, useEffect } from 'react';
import { string, shape, oneOf, func } from 'prop-types';

import './Shop.css';

import API from 'services/api';
import useFetchDataList from 'hooks/use-fetch-data-list';

import connect from '@vkontakte/vk-connect';
import { VK_APP_ID } from 'constants/vk';
import { useDispatch } from 'react-redux';
import { showPopup } from 'actions/popup-actions';
import * as POPUP from 'constants/popup';
import { TABS } from 'constants/shop';

import { getTimezoneOffset, timetableParse } from 'helpers/dates';

import {
    Panel, PanelHeader, HeaderButton, FixedLayout,
    platform, IOS
} from '@vkontakte/vkui';
import Wrapper from 'components/Wrapper';
import ShopCard from 'components/ShopCard';
import Loader from 'components/Loader';
import Tabs from 'components/Tabs';
import Gallery from 'components/Gallery';
import Timetable from 'components/Timetable';
import Row from 'components/Row';
import Accordion from 'components/Accordion';
import Link from 'components/Link';
import Button from 'components/Button';
import ReviewsList from 'components/ReviewsList';
import PopupContainer from 'components/PopupContainer';
import Popup from 'components/Popup';
import AddReviewForm from 'components/AddReviewForm';
import Success from 'components/Success';

import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import { ReactComponent as IconVk } from 'svg/vk.svg';
import { ReactComponent as IconMessage } from 'svg/message.svg';

const isIOS = platform() === IOS;

function findReview(review) {
    return review.id === this.id;
}

function filterReview(review) {
    return review.id !== this.id;
}

const Shop = ({ id, shop, activeTab, goBack }) => {
    const getReviews = useCallback((page) => API.getReviews(shop.id, page), [shop]);
    const reviews = useFetchDataList(getReviews);
    const [userReviews, setUserReviews] = useState([]);

    const [tab, setTab] = useState(activeTab);
    const [loading, setLoading] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [timetable, setTimetable] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [group, setGroup] = useState(null);

    const [showForm, setShowForm] = useState(false);

    const dispatch = useDispatch();

    const changeTab = useCallback((e) => setTab(e.target.dataset.index), []);

    const renderAddress = useCallback((item) =>
        <Link href="#" children={item.address} icon="point" />, []);

    const toggleForm = useCallback(() => setShowForm(state => !state), []);

    const sendReview = useCallback(async (text) => {
        try {
            const newReview = await API.createReview(shop.id, text);
            
            setShowForm(false);
            setUserReviews(state => [newReview].concat(state));
            setTimeout(() => dispatch(showPopup(POPUP.CREATE_REVIEW_SUCCESS, {
                children: <Success className="Shop__Success" />
            })), POPUP.POPUP_LEAVE);
        } catch (e) {
            setShowForm(false);
            setTimeout(() => dispatch(showPopup(POPUP.CREATE_REVIEW_ERROR)), POPUP.POPUP_LEAVE);
        }
    }, [shop, dispatch]);

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

    useEffect(() => {
        let nextUserReviews = userReviews;
        reviews.data.forEach((review) => {
            if (nextUserReviews.find(findReview, review)) {
                nextUserReviews = nextUserReviews.filter(filterReview, review);
            }
        });

        if (nextUserReviews.length !== userReviews.length) {
            setUserReviews(nextUserReviews);
        }
    }, [userReviews, reviews.data]);

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

                <Tabs
                    className="Shop__Tabs"
                    items={TABS}
                    activeItem={tab}
                    onClick={changeTab} />

                <details className="Shop__details" open={tab === 'description'}>
                    <summary />
                    {(loading)
                        ? <Loader className="Shop__Loader" center />
                        : <>
                            {(photos && photos.length > 0) &&
                                <Gallery className="Shop__Gallery" photos={photos} />}

                            {(currentAddress) && <>
                                {(timetable) &&
                                    <Timetable className="Shop__Timetable" initialTimetable={timetable} />}

                                {(currentAddress.address) &&
                                    <Row
                                        className="Shop__Row"
                                        title="Адрес"
                                        children={currentAddress.address} />}

                                {(addresses && addresses.length > 0)
                                    ? (addresses.length === 1)
                                        ? <Row
                                            className="Shop__Row"
                                            title="Филиалы"
                                            children={renderAddress(addresses[0])} />
                                        : <Accordion
                                            className="Shop__Accordion"
                                            title="Филиалы"
                                            items={addresses.map(renderAddress)} />
                                    : null}

                                {(currentAddress.phone) &&
                                    <Row className="Shop__Row" title="Номер телефона">
                                        <a href={`tel:${currentAddress.phone}`} children={currentAddress.phone} />
                                    </Row>}
                            </>}

                            {(group) && <>
                                {(group.site) &&
                                    <Row className="Shop__Row" title="Сайт">
                                        <a
                                            href={group.site}
                                            children={group.site}
                                            target="_blank"
                                            rel="noopener noreferrer" />
                                    </Row>}

                                {(group.description) &&
                                    <Row
                                        className="Shop__Row"
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
                </details>

                <details className="Shop__details" open={tab === 'reviews'}>
                    <summary />
                    {(!reviews.loading && userReviews.concat(reviews.data).length === 0) &&
                        <p
                            className="Shop__no-reviews"
                            children="Никто ещё не оставлял отзывы. Будь первым!"
                            onClick={toggleForm} />}

                    <ReviewsList className="Shop__ReviewsList" reviews={userReviews.concat(reviews.data)} />

                    {(!reviews.isLastPage && !reviews.loading) &&
                        <Button
                            className="Shop__show-more"
                            theme="secondary"
                            children="Показать ещё..."
                            onClick={reviews.loadingNext} />}

                    {(loading) && <Loader className="Shop__Loader" center />}

                    <FixedLayout
                        className="Shop__FixedLayout"
                        vertical="bottom">
                        <Button
                            className="Shop__Button"
                            theme="primary"
                            size="medium"
                            children="Оставить отзыв"
                            before={<IconMessage />}
                            full
                            backlight
                            onClick={toggleForm} />
                    </FixedLayout>
                </details>
            </Wrapper>

            <PopupContainer>
                <Popup visible={showForm} onClose={toggleForm}>
                    <AddReviewForm className="Shop__AddReviewForm" onSubmit={sendReview} />
                </Popup>
            </PopupContainer>
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
    activeTab: oneOf(TABS.map((item) => item.index)),
    goBack: func.isRequired
};

Shop.defaultProps = {
    activeTab: (TABS[0]) ? TABS[0].index : undefined
};

export default Shop;