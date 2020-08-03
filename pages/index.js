import { fetchGraphql } from 'react-tinacms-strapi';
import Container from '../components/container';
import MoreStories from '../components/more-stories';
import HeroPost from '../components/hero-post';
import Intro from '../components/intro';
import Layout from '../components/layout';
import Head from 'next/head';
import { CMS_NAME } from '../lib/constants';

export default function Index({ allPosts }) {
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);
  return (
    <>
      <Layout>
        <Head>
          <title>Next.js Blog Example with {CMS_NAME}</title>
        </Head>
        <Container>
          <Intro />
          {heroPost && (
            <HeroPost
              title={heroPost.title}
              coverImage={process.env.STRAPI_URL + heroPost.cover.url}
              date={heroPost.date}
              author={heroPost.author}
              slug={heroPost.slug}
              excerpt={heroPost.excerpt}
            />
          )}
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        </Container>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  const postResults = await fetchGraphql(
    process.env.STRAPI_URL,
    `
    query{
      posts {
        title
        date
        slug
        author {
          name
          picture { 
            url
          }
        }
        excerpt
        cover {
          url
        }
      }
    }
  `
  );

  return {
    props: { allPosts: postResults.data.posts },
  };
}
