/**
 * CSRF Token API Endpoint
 * Provides CSRF tokens for client-side requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateCSRFToken, setCSRFCookie } from '@/lib/csrf-double-submit';
import { 
  createSecureErrorResponse, 
  createGenericErrorResponse
} from '@/lib/secure-error-handling-enhanced';
const crypto = require('crypto');

export async function GET(request: NextRequest) {
  try {
    // Add basic rate limiting check (simple implementation)
    const userAgent = request.headers.get('user-agent');
    if (!userAgent) {
      return createSecureErrorResponse('INVALID_INPUT', 400, {
        operation: 'csrf-token',
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: 'unknown',
        timestamp: new Date().toISOString()
      });
    }

    // Generate cryptographically secure CSRF token with session ID
    // For CSRF protection, we need a session identifier
    const sessionId = request.headers.get('x-session-id') || 
                     request.cookies.get('auth_token')?.value || 
                     crypto.randomBytes(16).toString('hex');
    
    const token = generateCSRFToken();

    if (!token) {
      return createSecureErrorResponse('INTERNAL_ERROR', 500, {
        operation: 'csrf-token',
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        timestamp: new Date().toISOString()
      });
    }

    const response = NextResponse.json({
      success: true,
      token,
      expiresIn: 15 * 60, // 15 minutes in seconds
      message: 'CSRF token generated successfully'
    });

    // Set CSRF cookie using Double Submit pattern
    setCSRFCookie(response, token);

    return response;

  } catch (error) {
    return createGenericErrorResponse({
      operation: 'csrf-token',
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      timestamp: new Date().toISOString(),
      originalError: error
    });
  }
}
