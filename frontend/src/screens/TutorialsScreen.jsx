import { useState, useMemo } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import Meta from '../components/Meta';
import { useGetTutorialsQuery } from '../slices/tutorialsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

const getEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('youtube.com/watch')) {
    const urlObj = new URL(url);
    const v = urlObj.searchParams.get('v');
    return v ? `https://www.youtube.com/embed/${v}?rel=0` : '';
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split(/[?&]/)[0];
    return id ? `https://www.youtube.com/embed/${id}?rel=0` : '';
  }
  if (url.includes('facebook.com')) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
  }
  return '';
};

const TutorialsScreen = () => {
  const { data: tutorials, isLoading, error } = useGetTutorialsQuery();
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => {
    if (!tutorials) return [];
    const term = search.trim().toLowerCase();
    if (!term) return tutorials;
    return tutorials.filter((t) => t.title.toLowerCase().includes(term));
  }, [tutorials, search]);
  const metaDesc =
    tutorials && tutorials.length > 0
      ? `Machine tutorials from Surgical Mart Nepal covering ${tutorials.length} videos.`
      : 'Machine tutorials from Surgical Mart Nepal.';

  return (
    <>
      <Meta title='Tutorials | Surgical Mart Nepal' description={metaDesc} />
      <div className='content-container py-4'>
        <div className='section-header mb-3 text-center'>
          <h1>Machine Tutorials</h1>
          <p>Watch step-by-step videos on using medical devices and equipment.</p>
        </div>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error?.data?.message || error.error}</Message>
        ) : (
          <>
            <Form className='d-flex gap-2 mb-3 justify-content-center'>
              <Form.Control
                type='text'
                placeholder='Search tutorials by title'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ maxWidth: 320 }}
              />
              <Button variant='outline-secondary' onClick={() => setSearch('')}>
                Clear
              </Button>
            </Form>
            <Row className='g-3'>
              {filtered.map((tutorial) => {
                const embedUrl = getEmbedUrl(tutorial.videoUrl);
                return (
                  <Col key={tutorial._id} xs={12} md={6} lg={4}>
                    <Card className='h-100'>
                      <div className='ratio ratio-16x9'>
                      {embedUrl ? (
                        <iframe
                          src={embedUrl}
                          title={tutorial.title}
                          allowFullScreen
                          loading='lazy'
                        ></iframe>
                      ) : (
                        <div className='p-3'>Invalid video URL</div>
                      )}
                    </div>
                    <Card.Body>
                      <Card.Title className='fs-6'>{tutorial.title}</Card.Title>
                      {tutorial.description && (
                        <Card.Text className='text-muted small mb-0'>
                          {tutorial.description}
                        </Card.Text>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              );
              })}
            </Row>
          </>
        )}
      </div>
    </>
  );
};

export default TutorialsScreen;
