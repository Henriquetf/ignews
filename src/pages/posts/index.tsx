import { GetStaticProps } from 'next';
import Head from 'next/head';
import Prismic from '@prismicio/client';

import { RichText } from 'prismic-dom';
import Link from 'next/link';

import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

interface PostsPageProps {
  posts: Post[];
}

export default function PostsPage({ posts }: PostsPageProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.postsList}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>

                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<PostsPageProps> = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(Prismic.predicates.at('document.type', 'post'), {
    fetch: ['title', 'content'],
    pageSize: 100,
  });

  const posts: Post[] = response.results.map((post) => {
    const except: string =
      post.data.content.find((content) => content.type === 'paragraph')?.text ?? '';

    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt: except,
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    };
  });

  return {
    props: {
      posts,
    },
  };
};
