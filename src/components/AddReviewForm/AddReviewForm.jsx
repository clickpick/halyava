import React, { useState, useCallback, useMemo } from 'react';
import { string, func } from 'prop-types';
import classNames from 'classnames';

import './AddReviewForm.css';

import { FormLayout, Textarea } from '@vkontakte/vkui';
import Tag from 'components/Tag';
import Button from 'components/Button';

import { ReactComponent as IconLike } from 'svg/like.svg';

const MARK_LIKE = 'like';
const MARK_DISLIKE = 'dislike';

const AddReviewForm = ({ className, onSubmit }) => {
    const [review, setReview] = useState({ value: '', status: 'default' });
    const [mark, setMark] = useState({ value: null, error: false });
    const [loading, setLoading] = useState(false);

    const handleChange = useCallback((e) => setReview({ value: e.target.value, status: 'default' }), []);

    const markIsLike = useMemo(() => (mark.value === MARK_LIKE), [mark.value]);
    const markIsDislike = useMemo(() => (mark.value === MARK_DISLIKE), [mark.value]);

    const handleMarkChange = useCallback((e) => setMark({
        value: e.currentTarget.dataset.mark,
        error: false
    }), []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const text = review.value.trim();

        if (!text) {
            setReview({ value: text, status: 'error' });
            return;
        }

        const markValue = mark.value;
        if (!markValue) {
            setMark({ value: null, error: 'Пожалуйста, поставь оценку заведению.'});
            return;
        }

        if (onSubmit) {
            setLoading(true);
            onSubmit({ text, mark: markValue });
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
            <div className="AddReviewForm__marks">
                <button
                    type="button"
                    className="AddReviewForm__mark"
                    aria-pressed={markIsLike}
                    data-mark={MARK_LIKE}
                    onClick={handleMarkChange}>
                    <Tag
                        className="AddReviewForm__Tag"
                        theme={(markIsLike) ? 'green' : undefined}>
                        <IconLike className="AddReviewForm__IconLike" />Нравится
                    </Tag>
                </button>
                <button
                    type="button"
                    className="AddReviewForm__mark"
                    aria-pressed={markIsDislike}
                    data-mark={MARK_DISLIKE}
                    onClick={handleMarkChange}>
                    <Tag
                        className="AddReviewForm__Tag"
                        theme={(markIsDislike) ? 'red' : undefined}>
                        <IconLike className="AddReviewForm__IconLike  AddReviewForm__IconLike--dislike" />Не нравится
                    </Tag>
                </button>
            </div>

            {(mark.error) && <p className="AddReviewForm__error-message" children={mark.error} />}

            <Button
                type="submit"
                className="AddReviewForm__Button"
                theme="primary"
                size="medium"
                children="Отправить"
                disabled={loading || !Boolean(review.value.trim())}
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