import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import { fetchGraphql } from 'react-tinacms-strapi';
import { useCMS, useForm, usePlugin } from 'tinacms';
import { InlineForm } from 'react-tinacms-inline';
import Container from '../../components/container';
import PostBody from '../../components/post-body';
import Header from '../../components/header';
import PostHeader from '../../components/post-header';
import Layout from '../../components/layout';
import PostTitle from '../../components/post-title';
import Head from 'next/head';
import { CMS_NAME } from '../../lib/constants';

export default function Post({ post: initialPost, preview }) {
  const cms = useCMS();
  const formConfig = {
    id: initialPost.id,
    label: 'Blog Post',
    initialValues: initialPost,
    onSubmit: async (values) => {
      const saveMutation = `
      mutation UpdatePost(
        $id: ID!
        $title: String
        $content: String
        $coverId: ID
      ) {
        updatePost(
          input: {
            where: { id: $id }
            data: { title: $title, content: $content, cover: $coverId}
          }
        ) {
          post {
            id
          }
        }
      }`;
      const response = await cms.api.strapi.fetchGraphql(saveMutation, {
        id: values.id,
        title: values.title,
        content: values.content,
        coverId: cms.media.store.getFileId(values.cover.url),
      });
      if (response.data) {
        cms.alerts.success('Changes Saved');
      } else {
        cms.alerts.error('Error saving changes');
      }
    },
    fields: [],
  };
  const [post, form] = useForm(formConfig);
  usePlugin(form);
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-32">
              <Head>
                <title>
                  {post.title} | Next.js Blog Example with {CMS_NAME}
                </title>
                <meta
                  property="og:image"
                  content={process.env.STRAPI_URL + post.cover.url}
                />
              </Head>
              <InlineForm form={form} initialStatus={'active'}>
                <PostHeader
                  title={post.title}
                  coverImage={process.env.STRAPI_URL + post.cover.url}
                  date={post.date}
                  author={post.author}
                />
                <PostBody content={post.content} />
              </InlineForm>
            </article>
          </>
        )}
      </Container>
    </Layout>
  );
}

export async function getStaticProps({ params, preview, previewData }) {
  const postResults = await fetchGraphql(
    process.env.STRAPI_URL,
    `
    query{
      posts(where: {slug: "${params.slug}"}){
        id
        title
        date
        slug
        content
        author {
          name
          picture { 
            url
          }
        }
        cover {
          url
        }
      }
    }
  `
  );
  const post = postResults.data.posts[0];

  if (preview) {
    return {
      props: {
        post: {
          ...post,
        },
        preview,
        ...previewData,
      },
    };
  }

  return {
    props: {
      post: {
        ...post,
      },
      preview: false,
    },
  };
}

export async function getStaticPaths() {
  const postResults = await fetchGraphql(
    process.env.STRAPI_URL,
    `
    query{
      posts{
        slug
      }
    }
  `
  );

  return {
    paths: postResults.data.posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
