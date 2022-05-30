/* eslint-disable react/no-array-index-key */
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) return <h1>Carregando...</h1>;
  const totalWordsCount = post.data.content.reduce((previus, current) => {
    const headingArray = current.heading.split(' ');
    const bodyArray = RichText.asText(current.body).split(' ');
    const wordCount = previus + headingArray.length + bodyArray.length;
    return wordCount;
  }, 0);

  const timeInMinutes = totalWordsCount / 200;

  return (
    <div>
      <h1>{post.data.title}</h1>
      <span>{post.data.author}</span>
      <span>
        {format(new Date(post.first_publication_date), 'dd LLL yyyy', {
          locale: ptBR,
        })}
      </span>
      <span>{Math.ceil(timeInMinutes)} min</span>

      {post.data.content.map(({ body, heading }, index) => (
        <div key={index}>
          <h2>{heading}</h2>
          <span>{RichText.asText(body)}</span>
        </div>
      ))}
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');

  const paths = posts.results.map(({ uid }) => ({ params: { slug: uid } }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (req: any) => {
  const prismic = getPrismicClient(req);
  const post = await prismic.getByUID('posts', req.params.slug);

  return {
    props: { post },
  };
};
