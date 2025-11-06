/// <reference types="cypress" />

/**
 * E2E Tests for Normalized Icon Names
 * Tests that icons with different naming conventions are normalized correctly
 */

describe('Normalized Icon Names - Kebab-case Normalization', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display normalized names section', () => {
    cy.contains('h2', 'Normalized Names').should('be.visible');
  });

  it('should render sun-moon icon with normalized name', () => {
    cy.contains('div', 'sun-moon').should('be.visible');
  });

  it('should render sun-moon icon correctly', () => {
    cy.contains('div', 'sun-moon')
      .parent()
      .within(() => {
        cy.get('svg').should('exist');
        cy.get('svg use').should('have.attr', 'href').and('include', 'sun-moon');
      });
  });

  it('should display normalization examples', () => {
    cy.contains('(from sunMoon, SunMoon, sun_moon, etc.)').should('be.visible');
  });

  it('should normalize icon name to kebab-case in href', () => {
    cy.contains('h2', 'Normalized Names')
      .parent()
      .within(() => {
        cy.get('svg use')
          .should('have.attr', 'href')
          .then((href) => {
            // Verify the icon name is in kebab-case format
            expect(href).to.match(/#[a-z]+(-[a-z]+)*$/);
          });
      });
  });
});

describe('Normalized Icon Names - Consistency', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should handle icon names consistently across the app', () => {
    // All icon hrefs should use kebab-case
    cy.get('svg use[href*="#"]').each(($use) => {
      const href = $use.attr('href');
      const iconName = href?.split('#')[1];

      if (iconName && !iconName.includes(':')) {
        // Should be lowercase
        expect(iconName).to.equal(iconName.toLowerCase());

        // Should not contain underscores or spaces
        expect(iconName).to.not.include('_');
        expect(iconName).to.not.include(' ');

        // If it contains multiple words, should use hyphens
        if (iconName.includes('-')) {
          expect(iconName).to.match(/^[a-z]+(-[a-z]+)*$/);
        }
      }
    });
  });

  it('should apply normalization to all namespaces', () => {
    // Check default namespace icons
    cy.get('svg use[href^="/icons#"]').each(($use) => {
      const href = $use.attr('href');
      const iconName = href?.split('#')[1];

      if (iconName) {
        // Should be kebab-case
        expect(iconName).to.match(/^[a-z]+(-[a-z]+)*$/);
      }
    });

    // Check namespaced icons
    cy.get('svg use[href*="/icons/"]').each(($use) => {
      const href = $use.attr('href');
      const iconName = href?.split('#')[1];

      if (iconName) {
        // Should be kebab-case
        expect(iconName).to.match(/^[a-z]+(-[a-z]+)*$/);
      }
    });
  });
});

describe('Normalized Icon Names - Sprite Content', () => {
  it('should use normalized names in default sprite', () => {
    cy.request('/icons').then((response) => {
      expect(response.status).to.eq(200);

      // Check that symbol IDs use kebab-case
      const body = response.body;

      // Should contain sun-moon (normalized)
      expect(body).to.include('id="sun-moon"');

      // Other icons should also be normalized
      expect(body).to.include('id="home"');
      expect(body).to.include('id="user"');
      expect(body).to.include('id="settings"');
      expect(body).to.include('id="search"');
      expect(body).to.include('id="star"');
    });
  });

  it('should use normalized names in namespace sprites', () => {
    cy.request('/icons/social').then((response) => {
      expect(response.status).to.eq(200);

      // Check that symbol IDs use kebab-case
      const body = response.body;
      expect(body).to.include('id="facebook"');
      expect(body).to.include('id="twitter"');
    });

    cy.request('/icons/brands').then((response) => {
      expect(response.status).to.eq(200);

      const body = response.body;
      expect(body).to.include('id="apple"');
      expect(body).to.include('id="google"');
    });
  });
});

describe('Normalized Icon Names - Documentation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should show normalization information to users', () => {
    cy.contains('All icon names are automatically normalized to kebab-case').should('be.visible');
  });

  it('should provide examples of normalization', () => {
    cy.contains('h2', 'Normalized Names')
      .parent()
      .within(() => {
        cy.contains('sunMoon').should('exist');
        cy.contains('SunMoon').should('exist');
        cy.contains('sun_moon').should('exist');
      });
  });
});
