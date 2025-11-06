/// <reference types="cypress" />

/**
 * E2E Tests for Namespaced Icons
 * Tests icons organized in folders (social, brands, etc.)
 */

describe('Namespaced Icons - Social Namespace', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render social namespaced icons section', () => {
    cy.contains('h2', 'Namespaced Icons').should('be.visible');
  });

  it('should render social:facebook icon', () => {
    cy.contains('div', 'social:facebook').parent().within(() => {
      cy.get('svg use').should('have.attr', 'href').and('include', '/icons/social#facebook');
    });
  });

  it('should render social:twitter icon', () => {
    cy.contains('div', 'social:twitter').parent().within(() => {
      cy.get('svg use').should('have.attr', 'href').and('include', '/icons/social#twitter');
    });
  });

  it('should load social icons from correct sprite URL', () => {
    cy.contains('h2', 'Namespaced Icons').parent().within(() => {
      cy.get('svg use[href*="/icons/social"]').should('have.length.at.least', 2);
    });
  });

  it('should render social icons with correct size', () => {
    cy.contains('div', 'social:facebook').parent().within(() => {
      cy.get('svg').should('have.attr', 'width', '32');
      cy.get('svg').should('have.attr', 'height', '32');
    });
  });
});

describe('Namespaced Icons - Brands Namespace', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render brands:apple icon', () => {
    cy.contains('div', 'brands:apple').parent().within(() => {
      cy.get('svg use').should('have.attr', 'href').and('include', '/icons/brands#apple');
    });
  });

  it('should render brands:google icon', () => {
    cy.contains('div', 'brands:google').parent().within(() => {
      cy.get('svg use').should('have.attr', 'href').and('include', '/icons/brands#google');
    });
  });

  it('should load brand icons from correct sprite URL', () => {
    cy.contains('h2', 'Namespaced Icons').parent().within(() => {
      cy.get('svg use[href*="/icons/brands"]').should('have.length.at.least', 2);
    });
  });
});

describe('Namespaced Icons - Sprite Separation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load different namespaces from separate sprite files', () => {
    // Default namespace
    cy.get('svg use[href^="/icons#"]').should('exist');
    
    // Social namespace
    cy.get('svg use[href^="/icons/social#"]').should('exist');
    
    // Brands namespace
    cy.get('svg use[href^="/icons/brands#"]').should('exist');
  });

  it('should not mix icons from different namespaces', () => {
    // Social icons should use /icons/social
    cy.contains('div', 'social:facebook').parent().within(() => {
      cy.get('svg use').should('have.attr', 'href').and('not.include', '/icons#');
      cy.get('svg use').should('have.attr', 'href').and('not.include', '/icons/brands#');
    });

    // Brand icons should use /icons/brands
    cy.contains('div', 'brands:apple').parent().within(() => {
      cy.get('svg use').should('have.attr', 'href').and('not.include', '/icons#');
      cy.get('svg use').should('have.attr', 'href').and('not.include', '/icons/social#');
    });
  });
});

describe('Namespaced Icons - Display', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display namespace labels correctly', () => {
    cy.contains('div', 'social:facebook').should('be.visible');
    cy.contains('div', 'social:twitter').should('be.visible');
    cy.contains('div', 'brands:apple').should('be.visible');
    cy.contains('div', 'brands:google').should('be.visible');
  });

  it('should render all namespaced icons in the same section', () => {
    cy.contains('h2', 'Namespaced Icons').parent().within(() => {
      // Should have 4 namespaced icons total (2 social + 2 brands)
      cy.contains('div', 'social:facebook').should('exist');
      cy.contains('div', 'social:twitter').should('exist');
      cy.contains('div', 'brands:apple').should('exist');
      cy.contains('div', 'brands:google').should('exist');
    });
  });
});
