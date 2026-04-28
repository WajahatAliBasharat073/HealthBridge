import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    const response = await axios.post(`${API_URL}/api/query`, body);
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Proxy error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to fetch from backend' },
      { status: error.response?.status || 500 }
    );
  }
}
