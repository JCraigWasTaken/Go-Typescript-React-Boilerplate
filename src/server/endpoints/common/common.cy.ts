describe('Common Endpoints', () => {
  it('GET /health', () => {
    cy.request('GET', 'http://localhost:8080/api/common/health').then(
      response => {
        console.log(response);
        expect(response.status).to.eq(200);
        expect(response.body.status).to.eq('OK');
      }
    );
  });
  it('POST /common/sum', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8080/api/common/sum',
      body: {
        numbers: [1, 2, 3],
      },
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body.result).to.eq(6);
    });
  });
});

export {};
