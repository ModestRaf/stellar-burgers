///<reference types="cypress"/>
describe('Конструктор бургеров', () => {
  beforeEach(() => {
    cy.intercept('api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('http://localhost:4000');
  });
  it('Открытие модального окна', () => {
    cy.get('[data-cy=modal]').should('not.exist');
    cy.get('[data-cy=burger-constructor__ingredient]').eq(0).click();
    cy.get('[data-cy=modal]');
  });

  it('Закрытие модального окна на крестик', () => {
    cy.get('[data-cy=burger-constructor__ingredient]').eq(0).click();
    cy.get('[data-cy=modal]');
    cy.get('[data-cy=modal__close-button]').eq(0).click();
    cy.get('[data-cy=modal]').should('not.exist');
  });

  it('Закрытие модального окна на Esc', () => {
    cy.get('[data-cy=burger-constructor__ingredient]').eq(0).click();
    cy.get('[data-cy=modal]');
    cy.get('body').type('{esc}');
    cy.get('[data-cy=modal]').should('not.exist');
  });

  it('Закрытие модального окна по клику на оверлей', () => {
    cy.get('[data-cy=burger-constructor__ingredient]').eq(0).click();
    cy.get('[data-cy=modal]');
    cy.get('[data-cy=modal-overlay]').eq(0).click({ force: true });
    cy.get('[data-cy=modal]').should('not.exist');
  });
});
