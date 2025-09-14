import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the authorization header
    const authorization = request.headers.get('authorization');
    const { id } = await params;
    
    // Forward the request to the FastAPI backend
    const response = await fetch(`${BACKEND_URL}/api/v1/statements/${id}`, {
      method: 'GET',
      headers: {
        ...(authorization && { 'Authorization': authorization }),
      },
    });

    // Get the response data
    const data = await response.json();

    // Return the response with the same status code
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}
