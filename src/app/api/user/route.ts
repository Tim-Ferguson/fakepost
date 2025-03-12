import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

    // Navigate to main profile to get display name and verification status
    await page.goto(`https://twitter.com/${username}`, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Get the display name and verification status with emoji support
    const userData = await page.evaluate(() => {
      const nameElement = document.querySelector('h2[aria-level="2"]');
      const displayName = nameElement?.textContent || null;
      
      const verificationSelectors = [
        'svg[aria-label*="Verified"]',
        'svg[aria-label*="verified"]',
        '[data-testid="icon-verified"]',
        '[data-testid="verificationBadge"]'
      ];
      
      let verificationElement = null;
      for (const selector of verificationSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          verificationElement = element;
          break;
        }
      }

      const verifiedType = verificationElement?.getAttribute('aria-label') || null;
      
      let verificationType = null;
      if (verifiedType?.includes('government')) {
        verificationType = 'government';
      } else if (verifiedType?.includes('business')) {
        verificationType = 'business';
      } else if (verifiedType?.includes('Verified') || verifiedType?.includes('verified')) {
        verificationType = 'verified';
      }

      return {
        displayName,
        verificationType
      };
    });

    // Navigate to photo page to get profile image
    await page.goto(`https://twitter.com/${username}/photo`, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Get the profile image
    const profileImage = await page.evaluate(() => {
      const img = document.querySelector('img');
      return img ? img.src : null;
    });

    await browser.close();

    return NextResponse.json({
      profileImage: profileImage || null,
      displayName: userData.displayName || username,
      verificationType: userData.verificationType
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });

  } catch (error) {
    console.error('Error fetching user data:', error);
    
    return NextResponse.json({
      profileImage: null,
      displayName: username,
      verificationType: null,
      error: 'Failed to fetch user data'
    }, { status: 500 });
  }
} 