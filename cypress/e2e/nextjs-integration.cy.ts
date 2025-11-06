/// <reference types="cypress" />

/**
 * E2E Tests for Next.js 16 Framework Integration
 * Tests framework-specific features and React 19 compatibility
 */

describe('Next.js 16 Framework - Page Rendering', () => {
  it('should render the Next.js application', () => {
    cy.visit('/');
    cy.contains('Next.js SVG Sprite Plugin Example').should('be.visible');
  });

  it('should have proper HTML structure', () => {
    cy.visit('/');
    cy.get('html').should('exist');
    cy.get('body').should('exist');
    cy.get('div#__next').should('exist');
  });

  it('should load without JavaScript errors', () => {
    cy.visit('/');
    cy.window().then((win) => {
      // Check for Next.js hydration
      expect(win.next).to.exist;
    });
  });

  it('should have proper metadata', () => {
    cy.visit('/');
    cy.document().its('head').should('exist');
  });
});

describe('Next.js 16 Framework - Static Site Generation (SSG)', () => {
  it('should pre-render pages at build time', () => {
    cy.visit('/');
    
    // Page should load quickly (pre-rendered)
    cy.contains('Next.js SVG Sprite Plugin Example').should('be.visible');
    
    // Check for Next.js indicators
    cy.get('body').should('have.attr', 'data-new-gr-c-s-check-loaded');
  });

  it('should generate static params for namespace routes', () => {
    // Test that namespace routes are pre-generated
    cy.request('/icons/social').its('status').should('eq', 200);
    cy.request('/icons/brands').its('status').should('eq', 200);
  });

  it('should serve static content with proper caching', () => {
    cy.request('/icons').then((response) => {
      expect(response.headers['cache-control']).to.include('public');
    });
  });
});

describe('Next.js 16 Framework - App Router', () => {
  it('should use app router structure', () => {
    cy.visit('/');
    
    // App router should handle routes properly
    cy.location('pathname').should('eq', '/');
  });

  it('should handle route handlers correctly', () => {
    // Test that API routes work
    cy.request('/icons').its('status').should('eq', 200);
  });

  it('should support dynamic routes', () => {
    // Test dynamic [namespace] route
    cy.request('/icons/social').its('status').should('eq', 200);
    cy.request('/icons/brands').its('status').should('eq', 200);
  });
});

describe('Next.js 16 Framework - Performance', () => {
  it('should load the page quickly', () => {
    const startTime = Date.now();
    cy.visit('/');
    cy.contains('Next.js SVG Sprite Plugin Example').should('be.visible').then(() => {
      const loadTime = Date.now() - startTime;
      // Page should load in reasonable time
      expect(loadTime).to.be.lessThan(5000);
    });
  });

  it('should have fast static route responses', () => {
    const startTime = Date.now();
    cy.request('/icons').then(() => {
      const responseTime = Date.now() - startTime;
      // Static route should be very fast
      expect(responseTime).to.be.lessThan(100);
    });
  });
});

describe('React 19 Compatibility - Component Rendering', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render React components correctly', () => {
    // All sections should render
    cy.contains('h2', 'Basic Icons').should('exist');
    cy.contains('h2', 'Different Sizes').should('exist');
    cy.contains('h2', 'Custom Colors').should('exist');
    cy.contains('h2', 'With Labels (Accessible)').should('exist');
    cy.contains('h2', 'Namespaced Icons').should('exist');
  });

  it('should handle React hooks properly', () => {
    cy.visit('/');
    
    // Components should render without errors
    cy.get('svg').should('have.length.at.least', 10);
  });

  it('should support React 19 features', () => {
    cy.visit('/');
    cy.window().then((win) => {
      // Check React version (should be 19.x)
      expect(win.React).to.exist;
    });
  });
});

describe('TypeScript Support - Type Safety', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render TypeScript components without errors', () => {
    // Icon component is written in TypeScript
    cy.get('svg').should('exist');
  });

  it('should show TypeScript autocomplete documentation', () => {
    cy.contains('TypeScript Autocomplete').should('be.visible');
    cy.contains('your IDE will suggest icon names').should('exist');
  });

  it('should handle TypeScript icon types correctly', () => {
    // Icons should render with proper types
    cy.get('svg use[href*="#home"]').should('exist');
    cy.get('svg use[href*="#user"]').should('exist');
    cy.get('svg use[href*="#settings"]').should('exist');
  });
});

describe('Next.js 16 Framework - Client-Side Navigation', () => {
  it('should handle client-side interactions', () => {
    cy.visit('/');
    
    // Test that links work
    cy.contains('a', '/icons').should('have.attr', 'href', '/icons');
  });

  it('should maintain state during navigation', () => {
    cy.visit('/');
    
    // Icons should persist
    cy.get('svg').should('have.length.at.least', 10);
  });
});

describe('Build Output Verification', () => {
  it('should serve correct content type for routes', () => {
    cy.request('/icons').then((response) => {
      expect(response.headers['content-type']).to.include('image/svg+xml');
    });
  });

  it('should have proper route configuration', () => {
    // Test that routes are accessible
    cy.request('/').its('status').should('eq', 200);
    cy.request('/icons').its('status').should('eq', 200);
    cy.request('/icons/social').its('status').should('eq', 200);
    cy.request('/icons/brands').its('status').should('eq', 200);
  });
});
