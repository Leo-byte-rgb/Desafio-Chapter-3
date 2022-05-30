import { useState } from 'react';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { format } from 'date-fns';
import { AiOutlineCalendar } from 'react-icons/ai';
import { BsPerson } from 'react-icons/bs';
import { ptBR } from 'date-fns/locale';

import { getPrismicClient } from '../services/prismic';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  total_pages: number;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(props: HomeProps): JSX.Element {
  const { postsPagination } = props;
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [posts, setPosts] = useState(postsPagination.results);

  const getMorePosts = async (): Promise<void> => {
    const response = await fetch(nextPage, {
      method: 'GET',
    });
    const data = await response.json();
    setNextPage(data.next_page);
    setPosts(p => [...p, ...data.results]);
  };
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        {posts?.map(
          ({
            data: { title, subtitle, author },
            first_publication_date,
            uid,
          }) => (
            <Link href={`/post/${uid}`} key={uid}>
              <div className={styles.card}>
                <h1>{title}</h1>
                <h6>{subtitle}</h6>
                <div>
                  <span>
                    <AiOutlineCalendar />
                    {format(new Date(first_publication_date), 'dd LLL yyyy', {
                      locale: ptBR,
                    })}
                  </span>
                  <span>
                    <BsPerson />
                    {author}
                  </span>
                </div>
              </div>
            </Link>
          )
        )}
        {nextPage && (
          <button
            type="button"
            className={styles.loadMorePosts}
            onClick={getMorePosts}
          >
            Carregar mais posts
          </button>
        )}
      </div>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async (req: unknown) => {
  const prismic = getPrismicClient(req);
  const postsPagination = await prismic.getByType('posts');

  return { props: { postsPagination } };
};
