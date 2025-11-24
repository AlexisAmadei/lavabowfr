import { Box, Container, Heading, Link, List, Text, Stack } from '@chakra-ui/react'
import React from 'react'

export default function Privacy() {
  return (
    <Container maxW="800px" py={12} px={6} textAlign={'left'}>
      <Stack gap={8}>
        <Box>
          <Heading as="h1" size="2xl" mb={2}>
            Privacy & Legal Notice
          </Heading>
          <Text fontSize="sm" color="fg.muted">
            Last updated: November 25, 2024
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Who We Are
          </Heading>
          <Text color="fg.muted">
            We are [Your Band Name], a music band. This is our official website.
          </Text>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            What We Collect
          </Heading>
          <Text color="fg.muted" mb={3}>
            We use Vercel Analytics to understand how many people visit our site. This service collects:
          </Text>
          <List.Root mb={4}>
            <List.Item color="fg.muted">Page views and visitor counts</List.Item>
            <List.Item color="fg.muted">Device type and browser information</List.Item>
            <List.Item color="fg.muted">General location (country/city level only)</List.Item>
          </List.Root>

          <Text fontWeight="semibold" mb={3}>
            We do NOT collect:
          </Text>
          <List.Root>
            <List.Item color="fg.muted">Personal information (names, emails, etc.)</List.Item>
            <List.Item color="fg.muted">Cookies</List.Item>
            <List.Item color="fg.muted">IP addresses</List.Item>
            <List.Item color="fg.muted">Any data that identifies you personally</List.Item>
          </List.Root>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Why We Collect This
          </Heading>
          <Text color="fg.muted">
            We use this information solely to understand our audience and improve our website.
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
            Your Rights
          </Heading>
          <Text color="fg.muted">
            Since we don't collect personal data, there's nothing to delete or access. If you have concerns, you can contact us at contact@lavabow.fr
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
            All music, images, and content © 2025 LAVA BOW. All rights reserved.
          </Text>
        </Box>
      </Stack>
    </Container>
  )
}