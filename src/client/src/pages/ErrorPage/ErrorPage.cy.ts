describe('ErrorPage', () => {
  beforeEach(() => {
    // This assumes you're running your app on localhost:3000, adjust as needed
    cy.visit('http://localhost:3000/error/adsf');
  });

  it('should display error message', () => {
    cy.get('[data-testid="errorMessage"]').should('exist');
    cy.get('[data-testid="errorMessage"]').should('contain', 'Error');
  });
});

export {};
