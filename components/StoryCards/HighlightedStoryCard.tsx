import Image from '@prezly/uploadcare-image';
import { format } from 'date-fns';
import Link from 'next/link';
import type { FunctionComponent } from 'react';

import { StoryWithImage } from '@/modules/Stories';
import { getCategoryUrl } from '@/utils/prezly';

import styles from './HighlightedStoryCard.module.scss';

type Props = {
    story: StoryWithImage;
};

const HighlightedStoryCard: FunctionComponent<Props> = ({ story }) => {
    const { categories, header_image, published_at, title, subtitle } = story;

    const image = JSON.parse(header_image as string);
    const publishedDate = format(new Date(published_at as string), 'MMMM d, y');

    return (
        <div className={styles.container}>
            <Link href={`/${story.slug}`} passHref>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a className={styles.imageContainer}>
                    {image && (
                        <Image
                            imageDetails={image}
                            alt={story.title}
                            layout="fill"
                            objectFit="cover"
                            className={styles.image}
                        />
                    )}
                </a>
            </Link>
            <div className={styles.content}>
                <div className={styles.dateAndCategory}>
                    <span className={styles.date}>{publishedDate}</span>
                    {!!categories.length && <>&middot;</>}
                    {categories.map((category) => (
                        <Link key={category.id} href={getCategoryUrl(category)} passHref>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a className={styles.category}>{category.display_name}</a>
                        </Link>
                    ))}
                </div>

                <h2 className={styles.title}>{title}</h2>

                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
        </div>
    );
};

export default HighlightedStoryCard;
