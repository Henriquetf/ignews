import { render, screen } from '@testing-library/react';
import { getSession, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { mocked } from 'ts-jest/utils';

import PostPreviewPage, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic';

jest.mock('next/router');
jest.mock('next-auth/client');
jest.mock('../../services/prismic');

const post = {
  slug: 'post-slug',
  title: 'Attack on Slug',
  content: '<p>Big slug takes over Tokyo</p>',
  updatedAt: '2021-01-01',
};

describe('Posts page', () => {
  it('renders correctly', () => {
    const useSessionMock = mocked(useSession);

    useSessionMock.mockReturnValueOnce([null, false]);

    render(<PostPreviewPage post={post} />);

    expect(screen.getByText('Attack on Slug')).toBeInTheDocument();
    expect(screen.getByText('Big slug takes over Tokyo')).toBeInTheDocument();
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
  });

  it('redirects user to full post when user is subscribed', async () => {
    const useSessionMock = mocked(useSession);
    const useRouterMock = mocked(useRouter);

    useSessionMock.mockReturnValueOnce([
      {
        activeSubscription: 'fake-active-subscription',
      },
      true,
    ]);

    const pushMock = jest.fn();

    useRouterMock.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<PostPreviewPage post={post} />);

    expect(pushMock).toHaveBeenCalledWith('/posts/post-slug');
  });

  it('loads initial data', async () => {
    const getPrismicClientMock = mocked(getPrismicClient);

    getPrismicClientMock.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading', text: 'Post title' }],
          content: [{ type: 'paragraph', text: 'Post content' }],
        },
        last_publication_date: '01-01-2021',
      }),
    } as any);

    const response = await getStaticProps({
      params: { slug: 'post-slug' },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'post-slug',
            title: 'Post title',
            content: '<p>Post content</p>',
            updatedAt: 'January 01, 2021',
          },
        },
      }),
    );
  });
});
