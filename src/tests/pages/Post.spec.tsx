import { render, screen } from '@testing-library/react';
import { getSession } from 'next-auth/client';
import { mocked } from 'ts-jest/utils';

import PostPage, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';

jest.mock('next-auth/client');
jest.mock('../../services/prismic');

describe('Posts page', () => {
  it('renders correctly', () => {
    render(
      <PostPage
        post={{
          slug: 'post-slug',
          title: 'Attack on Slug',
          content: '<p>Big slug takes over Tokyo</p>',
          updatedAt: '2021-01-01',
        }}
      />,
    );

    expect(screen.getByText('Attack on Slug')).toBeInTheDocument();
    expect(screen.getByText('Big slug takes over Tokyo')).toBeInTheDocument();
  });

  it('redirects user if no subscription is found', async () => {
    const getSessionMock = mocked(getSession);

    getSessionMock.mockResolvedValueOnce(null);

    const response = await getServerSideProps({} as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/',
        }),
      }),
    );
  });

  it('loads initial data', async () => {
    const getSessionMock = mocked(getSession);
    const getPrismicClientMock = mocked(getPrismicClient);

    getSessionMock.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription',
    });

    getPrismicClientMock.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading', text: 'Post title' }],
          content: [{ type: 'paragraph', text: 'Post content' }],
        },
        last_publication_date: '01-01-2021',
      }),
    } as any);

    const response = await getServerSideProps({
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
