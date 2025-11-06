// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to check if an SVG icon is rendered correctly
       * @example cy.checkIconRendered('home', 24)
       */
      checkIconRendered(iconName: string, size?: number): Chainable<JQuery<HTMLElement>>;
      
      /**
       * Custom command to verify SVG sprite route
       * @example cy.verifySpriteRoute('/icons')
       */
      verifySpriteRoute(route: string): Chainable<Response<any>>;
    }
  }
}

Cypress.Commands.add('checkIconRendered', (iconName: string, size: number = 24) => {
  cy.get(`svg[width="${size}"][height="${size}"]`).should('exist');
  cy.get('svg use').should('have.attr', 'href').and('include', iconName);
});

Cypress.Commands.add('verifySpriteRoute', (route: string) => {
  cy.request(route).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.headers['content-type']).to.include('image/svg+xml');
    expect(response.body).to.include('<svg');
    expect(response.body).to.include('<symbol');
  });
});

export {};
