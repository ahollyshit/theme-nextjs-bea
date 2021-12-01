import type { Category } from '@prezly/sdk';
import translations from '@prezly/themes-intl-messages';
import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { Dropdown } from '@/components';
import { useCurrentLocale } from '@/hooks';
import { getCategoryHasTranslation } from '@/utils/prezly';

import CategoryItem from './CategoryItem';

type Props = {
    categories: Category[];
    buttonClassName?: string;
    navigationItemClassName?: string;
};

const CategoriesDropdown: FunctionComponent<Props> = ({
    categories,
    buttonClassName,
    navigationItemClassName,
}) => {
    const currentLocale = useCurrentLocale();

    const filteredCategories = categories.filter(
        (category) =>
            category.stories_number > 0 && getCategoryHasTranslation(category, currentLocale),
    );

    if (filteredCategories.length === 0) {
        return null;
    }

    return (
        <li className={navigationItemClassName}>
            <Dropdown
                label={<FormattedMessage {...translations.categories.title} />}
                buttonClassName={buttonClassName}
                withMobileDisplay
            >
                {filteredCategories.map((category) => (
                    <CategoryItem category={category} key={category.id} />
                ))}
            </Dropdown>
        </li>
    );
};

export default CategoriesDropdown;
