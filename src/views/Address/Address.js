import React from 'react';
import { string, shape, func } from 'prop-types';

import { View } from '@vkontakte/vkui';

import Shop from 'panels/Shop';

const Address = ({ id, shop, goMain }) =>
    <View id={id} activePanel="shop">
        <Shop id="shop" shop={shop} textBack="Закрыть" goBack={goMain} />
    </View>;

Address.propTypes = {
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
    goMain: func
};

export default Address;