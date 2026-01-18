import { Box, Container, Heading, Link, List, Text, Stack } from '@chakra-ui/react'
import TextFuzzy from '@/components/react-bits/TextFuzzy'

export default function Privacy() {
  return (
    <Container maxW="800px" py={12} px={6} textAlign={'left'}>
      <Box mx={'auto'} mt={1} mb={10} width={'fit-content'} textAlign={'center'}>
        <TextFuzzy children="LAVA BOW" />
      </Box>

      <Stack gap={8}>
        <Box>
          <Text fontSize="sm" color="fg.muted">
            Last updated: November 27, 2024
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Who We Are
          </Heading>
          <Text color="fg.muted">
            We are LAVA BOW, a music band. This is our official website.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            What We Collect (nothing about you!)
          </Heading>
          <Text color="fg.muted" mb={3}>
            We use Vercel Analytics to understand how our site runs. This service collects:
          </Text>
          <List.Root mb={4}>
            <List.Item color="fg.muted">Page views</List.Item>
            <List.Item color="fg.muted">Performance insights</List.Item>
            <List.Item color="fg.muted">Country</List.Item>
          </List.Root>

          <Text fontWeight="semibold" mb={3}>
            We do NOT collect (because we don't care):
          </Text>
          <List.Root>
            <List.Item color="fg.muted">Personal information (except as provided voluntarily on the newsletter form)</List.Item>
            <List.Item color="fg.muted">Cookies</List.Item>
            <List.Item color="fg.muted">IP addresses</List.Item>
            <List.Item color="fg.muted">And any data that identifies you personally</List.Item>
          </List.Root>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Why We Collect This ?
          </Heading>
          <Text color="fg.muted">
            Just want to know if we have to fire the dev because the site is slow or broken !
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Privacy-Friendly Analytics
          </Heading>
          <Text color="fg.muted">
            Our analytics are provided by Vercel and are fully GDPR compliant. No cookies are used, and no personal data is collected. Learn more at{' '}
            <Link href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" color="blue.600" textDecoration="underline" _hover={{ textDecoration: 'underline', color: 'blue.700' }}>
              Vercel's Privacy Policy
            </Link>.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Data Access
          </Heading>
          <Text color="fg.muted">
            Since we don't collect personal data, there's nothing to delete or access. If you have concerns, you can contact us at contact@lavabow.fr
          </Text>
          <Text color="fg.muted">
            If you wish to unsubscribe from our newsletter, please use the unsubscribe link provided in the emails or contact us directly.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Contact & Booking
          </Heading>
          <Text color="fg.muted">
            For booking inquiries or questions: booking@lavabow.fr
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Copyright
          </Heading>
          <Text color="fg.muted">
            All music, images, and content © 2026 LAVA BOW. All rights reserved.
          </Text>
        </Box>
      </Stack>
    </Container>
  )
}