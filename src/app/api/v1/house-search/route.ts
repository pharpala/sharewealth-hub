import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE || process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authorization = request.headers.get('authorization');
    
    // Get the request body
    const body = await request.json();
    
    // Validate required fields
    const { location, downpayment, leverage } = body;
    if (!location || !downpayment) {
      return NextResponse.json(
        { error: 'Missing required fields: location, downpayment' },
        { status: 400 }
      );
    }

    // Forward request to FastAPI backend
    const response = await fetch(`${BACKEND_URL}/api/v1/house-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authorization && { 'Authorization': authorization }),
      },
      body: JSON.stringify({
        location: location,
        downpayment: parseFloat(downpayment),
        leverage: leverage || 5
      }),
      // Increase timeout for Zillow API calls
      signal: AbortSignal.timeout(120000), // 2 minute timeout for house search
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || `Backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('House search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
