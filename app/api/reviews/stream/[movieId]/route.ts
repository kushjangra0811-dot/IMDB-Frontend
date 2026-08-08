import { reviewEvents } from '../../../../../src/lib/reviews/store';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { movieId: string } }
) {
  const { movieId } = params;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      
      const sendEvent = (event: string, data: any) => {
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        } catch (e) {
          // Stream might be closed
        }
      };

      const onNewReview = (data: any) => sendEvent('new-review', data);
      const onUpdateReview = (data: any) => sendEvent('update-review', data);
      const onDeleteReview = (data: any) => sendEvent('delete-review', data);

      reviewEvents.on(`new-review-${movieId}`, onNewReview);
      reviewEvents.on(`update-review-${movieId}`, onUpdateReview);
      reviewEvents.on(`delete-review-${movieId}`, onDeleteReview);

      // Keep connection alive
      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': keepalive\n\n'));
        } catch (e) {
          clearInterval(interval);
        }
      }, 30000);

      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        reviewEvents.off(`new-review-${movieId}`, onNewReview);
        reviewEvents.off(`update-review-${movieId}`, onUpdateReview);
        reviewEvents.off(`delete-review-${movieId}`, onDeleteReview);
        try {
          controller.close();
        } catch (e) {}
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
