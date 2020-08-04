import { useCMS } from 'tinacms';
import { InlineImage, InlineText } from 'react-tinacms-inline';
import Avatar from '../components/avatar';
import DateFormater from '../components/date-formater';
import PostTitle from '../components/post-title';

export default function PostHeader({ title, coverImage, date, author }) {
  const cms = useCMS();
  // console.log('coverImage: ', coverImage);
  return (
    <>
      <PostTitle>
        <InlineText name="title" />
      </PostTitle>
      <div className="hidden md:block md:mb-12">
        <Avatar
          name={author.name}
          picture={process.env.STRAPI_URL + author.picture.url}
        />
      </div>
      <div className="mb-8 md:mb-16 -mx-5 sm:mx-0">
        <InlineImage
          name="coverImage.url"
          previewSrc={(formValues) => {
            return (
              process.env.STRAPI_URL +
              cms.media.store.getFilePath(formValues.cover.url)
            );
          }}
          uploadDir={() => '/uploads'}
          parse={(filename) => {
            return `/uploads/${filename}`;
          }}
        >
          {() => <img src={coverImage} alt={`Cover Image for ${title}`} />}
        </InlineImage>
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="block md:hidden mb-6">
          <Avatar
            name={author.name}
            picture={process.env.STRAPI_URL + author.picture.url}
          />
        </div>
        <div className="mb-6 text-lg">
          <DateFormater dateString={date} />
        </div>
      </div>
    </>
  );
}
