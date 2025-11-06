/// <reference types="cypress" />

/**
 * E2E Tests for Server Routes
 * Tests sprite serving routes (/icons, /icons/[namespace])
 */

describe('Server Routes - Default Sprite Route', () => {
  it('should serve the default sprite at /icons', () => {
    cy.request('/icons').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.headers['content-type']).to.include('image/svg+xml');
    });
  });

  it('should return valid SVG content', () => {
    cy.request('/icons').then((response) => {
      expect(response.body).to.include('<svg');
      expect(response.body).to.include('xmlns="http://www.w3.org/2000/svg"');
    });
  });

  it('should contain symbol elements for icons', () => {
    cy.request('/icons').then((response) => {
      expect(response.body).to.include('<symbol');
      expect(response.body).to.include('id=');
    });
  });

  it('should contain default namespace icons', () => {
    cy.request('/icons').then((response) => {
      // Check for specific icon IDs
      expect(response.body).to.include('id="home"');
      expect(response.body).to.include('id="user"');
      expect(response.body).to.include('id="settings"');
      expect(response.body).to.include('id="search"');
      expect(response.body).to.include('id="star"');
    });
  });

  it('should have proper cache headers', () => {
    cy.request('/icons').then((response) => {
      expect(response.headers['cache-control']).to.exist;
      expect(response.headers['cache-control']).to.include('public');
      expect(response.headers['cache-control']).to.include('max-age');
    });
  });

  it('should be accessible from the frontend', () => {
    cy.visit('/');
    cy.request('/icons').then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});

describe('Server Routes - Social Namespace Route', () => {
  it('should serve the social sprite at /icons/social', () => {
    cy.request('/icons/social').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.headers['content-type']).to.include('image/svg+xml');
    });
  });

  it('should return valid SVG content for social sprite', () => {
    cy.request('/icons/social').then((response) => {
      expect(response.body).to.include('<svg');
      expect(response.body).to.include('xmlns="http://www.w3.org/2000/svg"');
      expect(response.body).to.include('<symbol');
    });
  });

  it('should contain social namespace icons', () => {
    cy.request('/icons/social').then((response) => {
      expect(response.body).to.include('id="facebook"');
      expect(response.body).to.include('id="twitter"');
    });
  });

  it('should not contain icons from other namespaces', () => {
    cy.request('/icons/social').then((response) => {
      // Should not contain default namespace icons
      expect(response.body).to.not.include('id="home"');
      expect(response.body).to.not.include('id="user"');
      // Should not contain brands namespace icons
      expect(response.body).to.not.include('id="apple"');
      expect(response.body).to.not.include('id="google"');
    });
  });

  it('should have proper cache headers', () => {
    cy.request('/icons/social').then((response) => {
      expect(response.headers['cache-control']).to.exist;
      expect(response.headers['cache-control']).to.include('public');
    });
  });
});

describe('Server Routes - Brands Namespace Route', () => {
  it('should serve the brands sprite at /icons/brands', () => {
    cy.request('/icons/brands').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.headers['content-type']).to.include('image/svg+xml');
    });
  });

  it('should return valid SVG content for brands sprite', () => {
    cy.request('/icons/brands').then((response) => {
      expect(response.body).to.include('<svg');
      expect(response.body).to.include('<symbol');
    });
  });

  it('should contain brands namespace icons', () => {
    cy.request('/icons/brands').then((response) => {
      expect(response.body).to.include('id="apple"');
      expect(response.body).to.include('id="google"');
    });
  });

  it('should not contain icons from other namespaces', () => {
    cy.request('/icons/brands').then((response) => {
      // Should not contain default namespace icons
      expect(response.body).to.not.include('id="home"');
      expect(response.body).to.not.include('id="user"');
      // Should not contain social namespace icons
      expect(response.body).to.not.include('id="facebook"');
      expect(response.body).to.not.include('id="twitter"');
    });
  });
});

describe('Server Routes - Error Handling', () => {
  it('should handle non-existent namespace gracefully', () => {
    cy.request({
      url: '/icons/nonexistent',
      failOnStatusCode: false,
    }).then((response) => {
      // Should return 404 or empty SVG
      expect(response.status).to.be.oneOf([404, 200]);
      if (response.status === 200) {
        // Should return empty SVG placeholder
        expect(response.body).to.include('<svg');
      }
    });
  });
});

describe('Server Routes - Static Generation (SSG)', () => {
  it('should serve sprites as static files', () => {
    // Test that routes are pre-generated and fast
    const startTime = Date.now();
    cy.request('/icons').then((response) => {
      const endTime = Date.now();
      expect(response.status).to.eq(200);
      // Should be fast (< 100ms) since it's static
      expect(endTime - startTime).to.be.lessThan(100);
    });
  });

  it('should have consistent responses', () => {
    let firstResponse: string;
    
    cy.request('/icons').then((response) => {
      firstResponse = response.body;
      expect(firstResponse).to.include('<svg');
    }).then(() => {
      // Make second request
      cy.request('/icons').then((response) => {
        // Should return identical content
        expect(response.body).to.equal(firstResponse);
      });
    });
  });
});

describe('Server Routes - Integration with Components', () => {
  it('should serve sprites that work with Icon component', () => {
    cy.visit('/');
    
    // Verify sprite route is accessible
    cy.request('/icons').then((response) => {
      expect(response.status).to.eq(200);
    });
    
    // Verify icons are rendered
    cy.get('svg use[href^="/icons#"]').should('exist');
  });

  it('should serve namespace sprites that work with namespaced icons', () => {
    cy.visit('/');
    
    // Verify social sprite route
    cy.request('/icons/social').then((response) => {
      expect(response.status).to.eq(200);
    });
    
    // Verify social icons are rendered
    cy.get('svg use[href^="/icons/social#"]').should('exist');
  });
});
