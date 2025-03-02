/// <reference types="cypress" />
describe('Конструктор бургеров', () => {
  beforeEach(() => {
    cy.intercept('api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('http://localhost:4000');
  });
  it('Открытие модального окна с проверкой данных ингредиента', () => {
    cy.get('[data-cy=modal]').should('not.exist');
    // Получаем данные ингредиента из карточки (перед кликом)
    cy.get('[data-cy=burger-constructor__ingredient]')
      .eq(0)
      .then(($ingredient) => {
        const ingredientName = $ingredient
          .find('[data-cy=ingredient-name]')
          .text();
        // Кликаем на ингредиент
        cy.get('[data-cy=burger-constructor__ingredient]').eq(0).click();
        cy.get('[data-cy=modal]').should('exist');
        cy.get('[data-cy=modal]').within(() => {
          cy.get('[data-cy=modal-ingredient-name]', { timeout: 5000 }).should(
            'have.text',
            ingredientName
          );
        });
      });
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
