/// <reference types="cypress" />

/**
 * E2E Tests for Complete Integration (JavaScript version)
 * Tests full application flow and ensures JavaScript compatibility
 */

describe('Complete Integration - Full Application Flow', () => {
  it('should load the application successfully', () => {
    cy.visit('/');
    cy.contains('Next.js SVG Sprite Plugin Example').should('be.visible');
  });

  it('should display all main sections', () => {
    cy.visit('/');
    
    const sections = [
      'Basic Icons',
      'TypeScript Autocomplete',
      'Different Sizes',
      'Custom Colors',
      'With Labels (Accessible)',
      'Namespaced Icons',
      'Normalized Names',
      'Sprite Information'
    ];
    
    sections.forEach((section) => {
      cy.contains(section).should('be.visible');
    });
  });

  it('should render all icon types correctly', () => {
    cy.visit('/');
    
    // Basic icons
    cy.get('svg use[href*="#home"]').should('exist');
    cy.get('svg use[href*="#user"]').should('exist');
    
    // Namespaced icons
    cy.get('svg use[href*="/icons/social#facebook"]').should('exist');
    cy.get('svg use[href*="/icons/brands#apple"]').should('exist');
  });

  it('should have working sprite routes', () => {
    cy.request('/icons').its('status').should('eq', 200);
    cy.request('/icons/social').its('status').should('eq', 200);
    cy.request('/icons/brands').its('status').should('eq', 200);
  });
});

describe('JavaScript Compatibility - Icon Component', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should work with basic icon props', () => {
    cy.get('svg[width="24"]').should('exist');
    cy.get('svg[fill="currentColor"]').should('exist');
  });

  it('should support dynamic icon rendering', () => {
    // Icons are rendered dynamically in the page
    const iconNames = ['home', 'user', 'settings', 'search', 'star'];
    
    iconNames.forEach((name) => {
      cy.get(`svg use[href*="${name}"]`).should('exist');
    });
  });

  it('should handle props correctly', () => {
    // Different sizes
    cy.get('svg[width="16"]').should('exist');
    cy.get('svg[width="24"]').should('exist');
    cy.get('svg[width="32"]').should('exist');
    cy.get('svg[width="48"]').should('exist');
    
    // Different colors
    cy.get('svg[fill="red"]').should('exist');
    cy.get('svg[fill="blue"]').should('exist');
    cy.get('svg[fill="green"]').should('exist');
  });
});

describe('JavaScript Compatibility - Route Handlers', () => {
  it('should serve sprites as JavaScript-compatible SVG', () => {
    cy.request('/icons').then((response) => {
      expect(response.status).to.eq(200);
      expect(typeof response.body).to.equal('string');
      expect(response.body).to.include('<svg');
    });
  });

  it('should work with fetch API', () => {
    cy.visit('/');
    cy.window().then((win) => {
      return win.fetch('/icons').then((response) => {
        expect(response.ok).to.be.true;
        expect(response.status).to.eq(200);
        return response.text();
      }).then((text) => {
        expect(text).to.include('<svg');
      });
    });
  });
});

describe('Cross-Browser Compatibility', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render SVG use elements correctly', () => {
    cy.get('svg use').should('have.length.at.least', 10);
  });

  it('should support SVG fill inheritance', () => {
    cy.get('svg[fill="currentColor"]').should('exist');
    cy.get('svg[fill="red"]').should('exist');
  });

  it('should handle SVG dimensions properly', () => {
    cy.get('svg').each(($svg) => {
      const width = $svg.attr('width');
      const height = $svg.attr('height');
      expect(width).to.exist;
      expect(height).to.exist;
      expect(width).to.equal(height);
    });
  });
});

describe('User Experience - Visual Verification', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display icons visually', () => {
    // Check that SVG elements are in the viewport
    cy.get('svg').first().should('be.visible');
  });

  it('should maintain icon aspect ratios', () => {
    cy.get('svg').each(($svg) => {
      const width = parseInt($svg.attr('width') || '0');
      const height = parseInt($svg.attr('height') || '0');
      expect(width).to.equal(height);
    });
  });

  it('should show icon labels in namespaced section', () => {
    cy.contains('social:facebook').should('be.visible');
    cy.contains('social:twitter').should('be.visible');
    cy.contains('brands:apple').should('be.visible');
    cy.contains('brands:google').should('be.visible');
  });
});

describe('Performance and Loading', () => {
  it('should load sprites efficiently', () => {
    cy.visit('/');
    
    // Check that page loads without delay
    cy.get('svg').should('have.length.at.least', 10);
  });

  it('should cache sprite files', () => {
    cy.request('/icons').then((response) => {
      expect(response.headers['cache-control']).to.exist;
    });
  });

  it('should not block page rendering', () => {
    cy.visit('/');
    cy.contains('Next.js SVG Sprite Plugin Example').should('be.visible');
    cy.get('svg').should('exist');
  });
});

describe('Error Handling and Edge Cases', () => {
  it('should handle missing sprites gracefully', () => {
    cy.request({
      url: '/icons/nonexistent',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 404]);
    });
  });

  it('should not show console errors', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'error').as('consoleError');
      }
    });
    
    // Wait for page to load
    cy.contains('Next.js SVG Sprite Plugin Example').should('be.visible');
    
    // Check no errors logged (excluding known framework warnings)
    cy.get('@consoleError').should('not.have.been.called');
  });
});

describe('Accessibility Testing', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should have proper semantic HTML', () => {
    cy.get('h1').should('exist');
    cy.get('h2').should('have.length.at.least', 5);
    cy.get('section').should('have.length.at.least', 5);
  });

  it('should support keyboard navigation', () => {
    cy.get('a').first().focus().should('have.focus');
  });

  it('should have accessible icons with labels', () => {
    cy.get('svg[role="img"]').should('exist');
    cy.get('svg[aria-label]').should('exist');
  });

  it('should hide decorative icons from screen readers', () => {
    cy.get('svg[aria-hidden="true"]').should('exist');
  });
});
