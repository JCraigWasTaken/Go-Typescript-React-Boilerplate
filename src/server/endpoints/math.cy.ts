describe('Math Endpoints', () => {
  it('POST /math/sum', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8080/api/math/sum',
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
