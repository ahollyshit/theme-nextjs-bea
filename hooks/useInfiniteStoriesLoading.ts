import { useCallback, useEffect, useState } from 'react';
import { Category, Story } from '@prezly/sdk/dist/types';
import { PaginationProps } from 'types';

async function fetchStories(
    page: number,
    pageSize: number,
    category?: Category,
): Promise<{ stories: Story[] }> {
    const result = await fetch('/api/fetch-stories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            page,
            pageSize,
            category,
        }),
    });

    if (result.status !== 200) {
        const { message } = await result.json();
        throw new Error(message);
    }

    return result.json();
}

export const useInfiniteStoriesLoading = (
    initialStories: Story[],
    pagination: PaginationProps,
    category?: Category,
) => {
    const [displayedStories, setDisplayedStories] = useState<Story[]>(initialStories);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const { itemsTotal, pageSize, currentPage: currentQueryPage } = pagination;
    const totalPages = Math.ceil(itemsTotal / pageSize);

    // This also disabled infinite loading if query pagination is active
    const canLoadMore = currentQueryPage === 1 && currentPage < totalPages;

    useEffect(() => {
        setDisplayedStories(initialStories);
    }, [initialStories]);

    const loadMoreStories = useCallback(async () => {
        if (!canLoadMore) {
            return;
        }

        try {
            setIsLoading(true);

            const { stories: newStories } = await fetchStories(currentPage + 1, pageSize, category);
            setDisplayedStories((stories) => stories.concat(newStories));
            setCurrentPage((page) => page + 1);
            setIsLoading(false);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [canLoadMore, currentPage, category]);

    return {
        canLoadMore,
        displayedStories,
        isLoading,
        loadMoreStories,
    };
};
