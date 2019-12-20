import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { string, shape, oneOf, func } from 'prop-types';

import './Shop.css';

import API from 'services/api';
import connect from '@vkontakte/vk-connect';
import useFetchDataList from 'hooks/use-fetch-data-list';
import useFetch from 'hooks/use-fetch';

import { parseQueryString } from 'helpers/location';

import { useDispatch } from 'react-redux';
import { showPopup } from 'actions/popup-actions';
import * as POPUP from 'constants/popup';
import { TABS } from 'constants/shop';
import { VK_APP_ID } from 'constants/vk';
import { clearSearchQuery } from 'actions/search-actions';
import { updateMapState } from 'actions/map-actions';

import { getTimezoneOffset, timetableParse } from 'helpers/dates';

import { Panel, PanelHeader, PanelHeaderBack, HeaderButton, FixedLayout } from '@vkontakte/vkui';
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

import { ReactComponent as IconVk } from 'svg/vk.svg';
import { ReactComponent as IconMessage } from 'svg/message.svg';

function findUserReview(review) {    
    return review.user.id === this;
}

const VK_USER_ID = Number(parseQueryString(window.location.search).vk_user_id);

const Shop = ({ id, shop, activeTab, textBack, goBack }) => {
    const [tab, setTab] = useState(activeTab);
    const [loading, setLoading] = useState(false);

    const changeTab = useCallback((e) => setTab(e.target.dataset.index), []);

    const dispatch = useDispatch();

    /**
     * Описание
     */
    const [photos, setPhotos] = useState([]);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [timetable, setTimetable] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [group, setGroup] = useState(null);

    const showAddressPoint = useCallback((e) => {
        dispatch(clearSearchQuery());
        dispatch(updateMapState({
            center: [
                Number(e.currentTarget.dataset.lat),
                Number(e.currentTarget.dataset.lng),
            ],
            zoom: 16
        }));
        goBack();
    }, [goBack, dispatch]);

    const renderAddress = useCallback((item) =>
        <Link
            children={item.address}
            icon="point"
            data-lat={item.latitude}
            data-lng={item.longitude}
            onClick={showAddressPoint} />, [showAddressPoint]);

    useEffect(() => {
        async function fetchInfo() {
            setLoading(true);

            try {
                const { response: { items: photos } } = await API.callAPI('photos.get', {
                    owner_id: `-${shop.properties.group.id}`,
                    album_id: shop.properties.group.album_id || 'wall',
                    count: 20
                });

                const { response: { items: addresses } } = await API.callAPI('groups.getAddresses', {
                    group_id: shop.properties.group.id
                });

                const { response: [group] } = await API.callAPI('groups.getById', {
                    group_id: shop.properties.group.id,
                    fields: ['can_message', 'description', 'place', 'site']
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
                dispatch(showPopup(POPUP.SERVER_ERROR));
            }

            setLoading(false);
        }

        fetchInfo();
    }, [dispatch, shop]);

    /**
     * Отзывы
     */
    const getReviews = useCallback((page) => API.getReviews(shop.id, page), [shop.id]);
    let getFriendReviews = useCallback(() => API.getFriendReviews(shop.id), [shop.id]);

    const reviews = useFetchDataList(getReviews);
    const [loadingFriendReviews, friendsReviews, reloadFriendReviews] = useFetch(getFriendReviews);
    const [userReviews, setUserReviews] = useState([]);

    const emptyReviews = useMemo(() =>
        !reviews.loading && !loadingFriendReviews &&
        Array.isArray(reviews.data) && reviews.data.length === 0 &&
        Array.isArray(friendsReviews) && friendsReviews.length === 0 &&
        userReviews.length === 0,
        [reviews, loadingFriendReviews, friendsReviews, userReviews]);

    const hasCreateReview = useMemo(() => {
        if (userReviews.length > 0) {
            return false;
        }
        
        if (!loadingFriendReviews && Array.isArray(friendsReviews)) {
            if (friendsReviews.length > 0) {
                return !Boolean(friendsReviews.find(findUserReview, VK_USER_ID));
            } else {
                return true;
            }
        }

        return false;
    }, [userReviews, loadingFriendReviews, friendsReviews]);

    const [showForm, setShowForm] = useState(false);

    const toggleForm = useCallback(() => setShowForm(state => !state), []);

    const sendReview = useCallback(async (data) => {
        try {
            const newReview = await API.createReview(shop.id, data);

            setShowForm(false);
            setUserReviews(state => [newReview].concat(state));

            setTimeout(() => dispatch(showPopup(POPUP.CREATE_REVIEW_SUCCESS, {
                children: <Success className="Shop__Success" />,
                actions: [{
                    theme: 'primary',
                    title: 'Опубликовать историю',
                    full: true,
                    backlight: true,
                    action: (e) => {
                        e.currentTarget.disabled = true;

                        connect.send('VKWebAppShowStoryBox', {
                            background_type: 'none',
                            attachment: {
                                text: 'Посмотреть',
                                type: 'url',
                                url: `https://vk.com/app${VK_APP_ID}`
                            },
                            stickers: [
                                {
                                    sticker_type: 'renderable',
                                    sticker: {
                                        content_type: 'image',
                                        url: `https://vkpayer.ezavalishin.ru/reviews/${newReview.id}/story`,
                                        can_delete: false,
                                        transform: {
                                            translation_y: 0.08,
                                            relation_width: 0.8,
                                            gravity: 'center_top'
                                        },
                                        clickable_zones: [{
                                            action_type: 'link',
                                            action: {
                                                link: `https://vk.com/app${VK_APP_ID}#address=${shop.id}`
                                            },
                                        }]
                                    }
                                },
                                {
                                    sticker_type: 'renderable',
                                    sticker: {
                                        content_type: 'image',
                                        url: `https://vkpayer.ezavalishin.ru/storage/sign.png`,
                                        can_delete: false,
                                        transform: {
                                            translation_y: -0.08,
                                            relation_width: 0.8,
                                            gravity: 'center_bottom'
                                        },
                                        clickable_zones: [{
                                            action_type: 'link',
                                            action: {
                                                link: `https://vk.com/app${VK_APP_ID}`
                                            },
                                            clickable_area: [
                                                { x: 0, y: 0},
                                                { x: 1064, y: 0 },
                                                { x: 1064, y: 208 },
                                                { x: 0, y: 208 }
                                            ]
                                        }]
                                    }
                                },
                            ]
                        })
                    }
                }]
            }, 0)), POPUP.POPUP_LEAVE);
        } catch (e) {
            setShowForm(false);
            setTimeout(() => dispatch(showPopup(POPUP.CREATE_REVIEW_ERROR)), POPUP.POPUP_LEAVE);
        }
    }, [shop, dispatch]);

    const removeReview = useCallback(async (reviewId) => {
        try {
            await API.deleteReview(reviewId);
            if (userReviews.length > 0) {
                setUserReviews([]);
                return;
            }

            reloadFriendReviews();
        } catch (e) {}
    }, [userReviews, reloadFriendReviews]);

    return (
        <Panel id={id} className="Shop">
            <PanelHeader
                left={
                    (textBack)
                        ? <HeaderButton children={textBack} onClick={goBack} />
                        : <PanelHeaderBack onClick={goBack} />}
                noShadow={true} />

            <Wrapper className="Shop__Wrapper">
                <ShopCard
                    className="Shop__ShopCard"
                    name={shop.properties.group.name}
                    activity={shop.properties.group.activity}
                    photo={shop.properties.iconContent}
                    cashback={shop.properties.group.cashback_value}
                    rating={shop.properties.address.rating || undefined} />

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
                                </FixedLayout>
                            </>}
                        </>}
                </details>

                <details className="Shop__details" open={tab === 'reviews'}>
                    <summary />
                    {(emptyReviews) &&
                        <p
                            className="Shop__no-reviews"
                            children="Никто ещё не оставлял отзывы. Будь первым!"
                            onClick={toggleForm} />}

                    {(Array.isArray(friendsReviews) && Array.isArray(reviews.data)) &&
                        <ReviewsList
                            className="Shop__ReviewsList"
                            reviews={userReviews.concat(friendsReviews).concat(reviews.data)}
                            userId={VK_USER_ID}
                            onRemove={removeReview} />}

                    {(!reviews.isLastPage && !reviews.loading) &&
                        <Button
                            className="Shop__show-more"
                            theme="secondary"
                            children="Показать ещё..."
                            onClick={reviews.loadingNext} />}

                    {(loading) && <Loader className="Shop__Loader" center />}

                    {(hasCreateReview) &&
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
                        </FixedLayout>}
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
    textBack: string,
    goBack: func.isRequired
};

Shop.defaultProps = {
    activeTab: (TABS[0]) ? TABS[0].index : undefined
};

export default Shop;