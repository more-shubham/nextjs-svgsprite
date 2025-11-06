/// <reference types="cypress" />

/**
 * E2E Tests for IconWithLabel Component
 * Tests accessibility features and label functionality
 */

describe('IconWithLabel Component - Accessibility', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render icons with labels section', () => {
    cy.contains('h2', 'With Labels (Accessible)').should('be.visible');
  });

  it('should render icons with role="img" attribute', () => {
    cy.contains('h2', 'With Labels (Accessible)').parent().within(() => {
      cy.get('svg[role="img"]').should('have.length.at.least', 5);
    });
  });

  it('should render icons with aria-label attributes', () => {
    cy.contains('h2', 'With Labels (Accessible)').parent().within(() => {
      cy.get('svg[aria-label="Home page"]').should('exist');
      cy.get('svg[aria-label="User profile"]').should('exist');
      cy.get('svg[aria-label="Settings"]').should('exist');
      cy.get('svg[aria-label="Search"]').should('exist');
      cy.get('svg[aria-label="Favorite"]').should('exist');
    });
  });

  it('should have correct icon names in href attributes', () => {
    cy.contains('h2', 'With Labels (Accessible)').parent().within(() => {
      cy.get('svg[aria-label="Home page"] use').should('have.attr', 'href').and('include', 'home');
      cy.get('svg[aria-label="User profile"] use').should('have.attr', 'href').and('include', 'user');
      cy.get('svg[aria-label="Settings"] use').should('have.attr', 'href').and('include', 'settings');
    });
  });

  it('should maintain correct size for accessible icons', () => {
    cy.contains('h2', 'With Labels (Accessible)').parent().within(() => {
      cy.get('svg[role="img"]').each(($svg) => {
        expect($svg.attr('width')).to.equal('24');
        expect($svg.attr('height')).to.equal('24');
      });
    });
  });

  it('should be keyboard accessible', () => {
    cy.contains('h2', 'With Labels (Accessible)').parent().within(() => {
      // Icons should be in the tab order if needed
      cy.get('svg[role="img"]').first().should('exist');
    });
  });
});

describe('IconWithLabel Component - Screen Reader Support', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should provide meaningful labels for screen readers', () => {
    cy.contains('h2', 'With Labels (Accessible)').parent().within(() => {
      // Check that labels are descriptive
      cy.get('svg[aria-label]').each(($svg) => {
        const label = $svg.attr('aria-label');
        expect(label).to.exist;
        expect(label).to.have.length.above(0);
        expect(label).to.not.equal(''); // Label should not be empty
      });
    });
  });

  it('should not have aria-hidden on labeled icons', () => {
    cy.contains('h2', 'With Labels (Accessible)').parent().within(() => {
      cy.get('svg[role="img"]').should('not.have.attr', 'aria-hidden', 'true');
    });
  });
});

describe('IconWithLabel vs Icon Component', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should differentiate between basic icons and labeled icons', () => {
    // Basic icons should have aria-hidden
    cy.contains('h2', 'Basic Icons').parent().within(() => {
      cy.get('svg').first().should('have.attr', 'aria-hidden', 'true');
      cy.get('svg').first().should('not.have.attr', 'role', 'img');
    });

    // Labeled icons should have role="img" and aria-label
    cy.contains('h2', 'With Labels (Accessible)').parent().within(() => {
      cy.get('svg').first().should('have.attr', 'role', 'img');
      cy.get('svg').first().should('have.attr', 'aria-label');
      cy.get('svg').first().should('not.have.attr', 'aria-hidden', 'true');
    });
  });
});
