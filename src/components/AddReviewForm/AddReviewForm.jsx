import React, { useState, useCallback } from 'react';
import { string, func } from 'prop-types';
import classNames from 'classnames';

import './AddReviewForm.css';

import { FormLayout, Textarea } from '@vkontakte/vkui';
import Button from 'components/Button';

const AddReviewForm = ({ className, onSubmit }) => {
    const [review, setReview] = useState({ value: '', status: 'default' });
    const [loading, setLoading] = useState(false);

    const handleChange = useCallback((e) => setReview({ value: e.target.value, status: 'default' }), []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const text = review.value.trim();

        if (!text) {
            setReview({ value: text, status: 'error' });
            return;
        }

        if (onSubmit) {
            setLoading(true);
            onSubmit(text);
        }
    };

    return (
        <FormLayout className={classNames(className, 'AddReviewForm')} onSubmit={handleSubmit}>
            <Textarea
                className="AddReviewForm__Textarea"
                top="Твой отзыв"
                placeholder="Напиши здесь что думаешь об этом месте"
                {...review}
                onChange={handleChange} />
            <Button
                type="submit"
                className="AddReviewForm__Button"
                theme="primary"
                size="medium"
                children="Отправить"
                disabled={loading}
                full
                backlight />
        </FormLayout>
    );
};

AddReviewForm.propTypes = {
    className: string,
    onSubmit: func
};

export default AddReviewForm;