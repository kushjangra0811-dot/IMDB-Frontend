import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import MovieCarouselIsland from '../../src/components/MovieCarouselIsland';
import AccessibleDialog from '../../src/components/AccessibleDialog';

expect.extend(toHaveNoViolations);

const mockMedia = [
  { id: '1', type: 'image' as const, url: 'test.jpg', title: 'Test Image' },
  { id: '2', type: 'video' as const, url: 'test-video.mp4', title: 'Test Video' }
];

describe('Accessibility Tests', () => {
  it('MovieCarouselIsland should have no accessibility violations', async () => {
    const { container } = render(<MovieCarouselIsland media={mockMedia} />);
    
    // The axe check handles asynchronous rules
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });

  it('AccessibleDialog should have no accessibility violations when open', async () => {
    const { container } = render(
      <AccessibleDialog isOpen={true} onClose={() => {}} title="Test Dialog">
        <div>Content</div>
      </AccessibleDialog>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('AccessibleDialog traps focus (simulated via roles/labels check)', () => {
    render(
      <AccessibleDialog isOpen={true} onClose={() => {}} title="Focus Test Dialog">
        <div>Content</div>
      </AccessibleDialog>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'dialog-title');
    
    const title = screen.getByText('Focus Test Dialog');
    expect(title).toHaveAttribute('id', 'dialog-title');
  });
});
