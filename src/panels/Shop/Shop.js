import React from 'react';
import { string, func } from 'prop-types';

import './Shop.css';

import { Panel, PanelHeader, HeaderButton, platform, IOS } from '@vkontakte/vkui';

import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';

const isIOS = platform() === IOS;

const Shop = ({ id, goBack }) => {

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
        </Panel>
    );
};

Shop.propTypes = {
    id: string.isRequired,
    goBack: func.isRequired
};

export default Shop;