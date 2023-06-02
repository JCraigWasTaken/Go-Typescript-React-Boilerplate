describe('Health Endpoints', () => {
  it('GET /health', () => {
    cy.request('GET', 'http://localhost:8080/api/health').then(response => {
      console.log(response);
      expect(response.status).to.eq(200);
      expect(response.body.status).to.eq('OK');
    });
  });
});

export {};
