import LavaTypo from '@/components/Design/LavaTypo';
import { Box, Flex, Text, Link, Spinner, Accordion } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

export default function CloudStatus() {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRSSFeed();
  }, []);

  const getStatusFromTitle = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('resolved') || lowerTitle.includes('completed') || lowerTitle.includes('operational')) {
      return 'resolved';
    } else if (lowerTitle.includes('investigating') || lowerTitle.includes('identified') || lowerTitle.includes('monitoring')) {
      return 'investigating';
    } else if (lowerTitle.includes('issue') || lowerTitle.includes('outage') || lowerTitle.includes('degraded')) {
      return 'issue';
    }
    return 'neutral';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'green.500';
      case 'investigating':
        return 'orange.500';
      case 'issue':
        return 'red.500';
      default:
        return 'gray.400';
    }
  };

  const fetchRSSFeed = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://status.supabase.com/history.rss');

      if (!response.ok) {
        throw new Error('Failed to fetch RSS feed');
      }

      const text = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');

      const items = xmlDoc.querySelectorAll('item');
      const parsedItems = Array.from(items).slice(0, 5).map(item => {
        const title = item.querySelector('title')?.textContent || '';
        return {
          title,
          link: item.querySelector('link')?.textContent || '',
          pubDate: item.querySelector('pubDate')?.textContent || '',
          description: item.querySelector('description')?.textContent || '',
          status: getStatusFromTitle(title)
        };
      });

      setFeedItems(parsedItems);
      setError(null);
    } catch (err) {
      console.error('Error fetching RSS feed:', err);
      setError('Failed to load Supabase status feed');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box flexDirection={'column'} display={'flex'} gap={8} pr={2} mt={4}>
        <Box>
          <LavaTypo variant={'h3'} styles={{ color: 'black', marginBottom: '16px', textAlign: 'left' }}>
            Supabase Status
          </LavaTypo>
          <Flex justifyContent={'center'} alignItems={'center'} py={8}>
            <Spinner size="lg" />
          </Flex>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box flexDirection={'column'} display={'flex'} gap={8} pr={2} mt={4}>
        <Box>
          <LavaTypo variant={'h3'} styles={{ color: 'black', marginBottom: '16px', textAlign: 'left' }}>
            Supabase Status
          </LavaTypo>
          <Text color="red.500">{error}</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection={'column'} display={'flex'} gap={8} pr={2} mt={4}>
      <Box>
        <Flex mb={4} justifyContent={'space-between'} alignItems={'center'}>
          <LavaTypo variant={'h3'} styles={{ color: 'black', marginBottom: '8px', textAlign: 'left' }}>
            Supabase Status
          </LavaTypo>
          <Link
            href="https://status.supabase.com"
            target="_blank"
            color="blue.500"
            fontSize="sm"
            textDecoration="underline"
          >
            View full status
          </Link>
        </Flex>

        <Accordion.Root collapsible variant="outline" textAlign={'left'}>
          {feedItems.map((item, index) => (
            <Accordion.Item key={index} value={`item-${index}`}>
              <Accordion.ItemTrigger
                p={4}
                borderRadius={'md'}
                _hover={{ backgroundColor: 'gray.100' }}
              >
                <Flex alignItems={'center'} gap={3} flex="1">
                  <Box
                    width={'12px'}
                    height={'12px'}
                    borderRadius={'full'}
                    backgroundColor={getStatusColor(item.status)}
                    flexShrink={0}
                  />
                  <Flex direction={'column'} gap={2} flex="1" textAlign="left">
                    <Text
                      fontWeight={'bold'}
                      color={'black'}
                      fontSize={'md'}
                    >
                      {item.title}
                    </Text>
                    <Text fontSize={'xs'} color={'gray.600'}>
                      {formatDate(item.pubDate)}
                    </Text>
                  </Flex>
                </Flex>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody p={4}>
                  {item.description && (
                    <Text
                      fontSize={'sm'}
                      color={'gray.700'}
                      dangerouslySetInnerHTML={{ __html: item.description }}
                      sx={{
                        '& p': { margin: 0 },
                        '& a': { color: 'blue.500', textDecoration: 'underline' }
                      }}
                    />
                  )}
                  <Link
                    href={item.link}
                    target="_blank"
                    color="blue.500"
                    fontSize="sm"
                    textDecoration="underline"
                    mt={2}
                    display="block"
                  >
                    Read more →
                  </Link>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </Box>
    </Box>
  );
}
