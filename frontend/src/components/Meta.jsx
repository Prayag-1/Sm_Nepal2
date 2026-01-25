import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  const pageTitle =
    title && !title.includes('Surgical Mart Nepal')
      ? `${title} | Surgical Mart Nepal`
      : title;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Surgical Mart Nepal | Medical Supplies',
  description:
    'Trusted medical and surgical supplies for clinics, hospitals, and caregivers across Nepal.',
  keywords: 'medical supplies Nepal, surgical equipment, hospital essentials',
};

export default Meta;
