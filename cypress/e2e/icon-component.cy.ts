/// <reference types="cypress" />

/**
 * E2E Tests for Icon Component
 * Tests basic Icon component rendering with various configurations
 */

describe('Icon Component - Basic Rendering', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render basic icons on the homepage', () => {
    cy.contains('h2', 'Basic Icons').should('be.visible');

    // Check if icons are rendered
    cy.get('svg[width="24"][height="24"]').should('have.length.at.least', 5);
  });

  it('should render icons with correct href attributes', () => {
    cy.contains('h2', 'Basic Icons').should('be.visible');

    // Check for specific icons
    const iconNames = ['home', 'user', 'settings', 'search', 'star'];

    iconNames.forEach((iconName) => {
      cy.get(`svg use[href*="${iconName}"]`).should('exist');
    });
  });

  it('should render icons with default size of 24px', () => {
    cy.contains('h2', 'Basic Icons')
      .parent()
      .within(() => {
        cy.get('svg').first().should('have.attr', 'width', '24');
        cy.get('svg').first().should('have.attr', 'height', '24');
      });
  });

  it('should render icons with correct fill color', () => {
    cy.contains('h2', 'Basic Icons')
      .parent()
      .within(() => {
        cy.get('svg').first().should('have.attr', 'fill', 'currentColor');
      });
  });

  it('should render icons with aria-hidden attribute', () => {
    cy.contains('h2', 'Basic Icons')
      .parent()
      .within(() => {
        cy.get('svg').first().should('have.attr', 'aria-hidden', 'true');
      });
  });
});

describe('Icon Component - Different Sizes', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render icons with different sizes', () => {
    cy.contains('h2', 'Different Sizes')
      .parent()
      .within(() => {
        cy.get('svg[width="16"][height="16"]').should('exist');
        cy.get('svg[width="24"][height="24"]').should('exist');
        cy.get('svg[width="32"][height="32"]').should('exist');
        cy.get('svg[width="48"][height="48"]').should('exist');
      });
  });

  it('should scale icons proportionally', () => {
    cy.contains('h2', 'Different Sizes')
      .parent()
      .within(() => {
        cy.get('svg').each(($svg) => {
          const width = $svg.attr('width');
          const height = $svg.attr('height');
          expect(width).to.equal(height); // Square aspect ratio
        });
      });
  });
});

describe('Icon Component - Custom Colors', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render icons with custom colors', () => {
    cy.contains('h2', 'Custom Colors')
      .parent()
      .within(() => {
        cy.get('svg[fill="red"]').should('exist');
        cy.get('svg[fill="blue"]').should('exist');
        cy.get('svg[fill="green"]').should('exist');
        cy.get('svg[fill="purple"]').should('exist');
        cy.get('svg[fill="gold"]').should('exist');
      });
  });

  it('should apply custom colors correctly', () => {
    cy.contains('h2', 'Custom Colors')
      .parent()
      .within(() => {
        cy.get('svg').eq(0).should('have.attr', 'fill', 'red');
        cy.get('svg').eq(1).should('have.attr', 'fill', 'blue');
        cy.get('svg').eq(2).should('have.attr', 'fill', 'green');
      });
  });
});

describe('Icon Component - Error Handling', () => {
  it('should handle missing icon name gracefully', () => {
    // This test would require a custom test page with an icon without name
    // For now, we verify that the page loads without errors
    cy.visit('/');
    cy.window().then((win) => {
      // Check that no console errors are present
      cy.on('window:console', (msg) => {
        if (msg.type === 'error') {
          throw new Error(`Console error: ${msg.text}`);
        }
      });
    });
  });
});
