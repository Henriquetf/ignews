import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';

import PostsPage, { getStaticProps, Post } from '../../pages/posts';
import { getPrismicClient } from '../../services/prismic';

jest.mock('../../services/prismic');

const posts: Post[] = [
  {
    slug: 'post-slug',
    title: 'Attack on Slug',
    excerpt: 'Big slug takes over Tokyo',
    updatedAt: '2021-01-01',
  },
];

describe('Posts page', () => {
  it('renders correctly', () => {
    render(<PostsPage posts={posts} />);

    expect(screen.getByText('Attack on Slug')).toBeInTheDocument();
  });

  it('loads initial data', async () => {
    const getPrismicClientMock = mocked(getPrismicClient);

    getPrismicClientMock.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'post-slug',
            data: {
              title: [{ type: 'heading', text: 'Post title' }],
              content: [{ type: 'paragraph', text: 'Post content' }],
            },
            last_publication_date: '01-01-2021',
          },
        ],
      }),
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'post-slug',
              title: 'Post title',
              excerpt: 'Post content',
              updatedAt: 'January 01, 2021',
            },
          ],
        },
      }),
    );
  });
});
