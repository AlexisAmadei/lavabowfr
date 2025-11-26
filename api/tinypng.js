export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const TINIFY_API_KEY = process.env.VITE_TINIFY_API_KEY;

  if (!TINIFY_API_KEY) {
    return res.status(500).json({ error: 'TinyPNG API key not configured' });
  }

  try {
    const { imageData } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Convert base64 to buffer
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Step 1: Upload to TinyPNG for compression
    const uploadResponse = await fetch('https://api.tinify.com/shrink', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${TINIFY_API_KEY}`).toString('base64')}`,
      },
      body: buffer,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('TinyPNG upload failed:', errorText);
      return res.status(uploadResponse.status).json({ error: 'TinyPNG upload failed', details: errorText });
    }

    const uploadData = await uploadResponse.json();
    const locationUrl = uploadResponse.headers.get('Location');

    if (!locationUrl) {
      return res.status(500).json({ error: 'No location header from TinyPNG' });
    }

    console.log(`Image compressed. Original: ${uploadData.input.size}B, Compressed: ${uploadData.output.size}B`);

    // Step 2: Request conversion to WebP
    const webpResponse = await fetch(locationUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${TINIFY_API_KEY}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        convert: {
          type: ['image/webp']
        }
      }),
    });

    if (!webpResponse.ok) {
      console.error('WebP conversion failed, falling back to compressed image');
      // Fallback: download compressed image without WebP conversion
      const fallbackResponse = await fetch(uploadData.output.url);
      const fallbackBuffer = await fallbackResponse.arrayBuffer();
      const fallbackBase64 = Buffer.from(fallbackBuffer).toString('base64');
      
      return res.status(200).json({
        imageData: fallbackBase64,
        isWebP: false,
        originalSize: uploadData.input.size,
        compressedSize: uploadData.output.size
      });
    }

    const webpBuffer = await webpResponse.arrayBuffer();
    const webpBase64 = Buffer.from(webpBuffer).toString('base64');

    return res.status(200).json({
      imageData: webpBase64,
      isWebP: true,
      originalSize: uploadData.input.size,
      compressedSize: webpBuffer.byteLength
    });

  } catch (error) {
    console.error('Error in TinyPNG serverless function:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}