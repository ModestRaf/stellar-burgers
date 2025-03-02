///<reference types="cypress"/>
describe('Конструктор бургеров', () => {
  beforeEach(() => {
    cy.intercept('api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('http://localhost:4000');
  });

  it('Добавление ингредиентов', () => {
    cy.get('[data-cy=burger-constructor__top-bun]')
      .should('have.length', 1)
      .contains(/Выберите булки/i);
    cy.get('[data-cy=burger-constructor__list]').contains(/Выберите начинку/i);
    cy.get('[data-cy=burger-constructor__bottom-bun]')
      .should('have.length', 1)
      .contains(/Выберите булки/i);

    // булка
    cy.get('[data-cy=burger-constructor__ingredient]')
      .filter(':contains("Краторная булка N-200i")')
      .contains(/Добавить/i)
      .click();
    cy.get('[data-cy=burger-constructor__top-bun]')
      .should('have.length', 1)
      .contains(/Краторная булка N-200i/i);
    cy.get('[data-cy=burger-constructor__bottom-bun]')
      .should('have.length', 1)
      .contains(/Краторная булка N-200i/i);

    // начинка
    cy.get('[data-cy=burger-constructor__ingredient]')
      .filter(':contains("Биокотлета из марсианской Магнолии")')
      .contains(/Добавить/i)
      .click();
    cy.get('[data-cy=burger-constructor__list]')
      .children()
      .should('have.length', 1)
      .contains(/Биокотлета из марсианской Магнолии/i);
    cy.get('[data-cy=burger-constructor__ingredient]')
      .filter(':contains("Мясо бессмертных моллюсков Protostomia")')
      .contains(/Добавить/i)
      .click();
    cy.get('[data-cy=burger-constructor__list]')
      .children()
      .should('have.length', 2)
      .contains(/Мясо бессмертных моллюсков Protostomia/i);
  });
});
