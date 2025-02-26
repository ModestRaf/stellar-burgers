///<reference types="cypress"/>
describe('Конструктор бургеров', () => {
  beforeEach(() => {
    cy.intercept('api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('http://localhost:4000');
  });
  it('Создание заказа', () => {
    // мок
    cy.intercept('api/auth/login', { fixture: 'login.json' });
    cy.intercept('api/orders', { fixture: 'order.json' });
    // добавление
    cy.get('[data-cy=burger-constructor__ingredient]')
      .filter(':contains("Краторная булка N-200i")')
      .contains(/Добавить/i)
      .click();
    cy.get('[data-cy=burger-constructor__ingredient]')
      .filter(':contains("Биокотлета из марсианской Магнолии")')
      .contains(/Добавить/i)
      .click();
    // создать заказ
    cy.get('[data-cy=burger-constructor__block]')
      .contains(/Оформить заказ/i)
      .click();
    // вход в аккаунт
    cy.get('button').contains(/Войти/i).click();
    // создать заказ
    cy.get('[data-cy=burger-constructor__block]')
      .contains(/Оформить заказ/i)
      .click();
    // проверка модального окна
    cy.get('[data-cy=modal]').get('[data-cy=order-number]').contains(/12345/i);
    // закрытие модального окна
    cy.get('body').type('{esc}');
    // проверка
    cy.get('[data-cy=modal]').should('not.exist');
    // очистка
    cy.get('[data-cy=burger-constructor__top-bun]')
      .should('have.length', 1)
      .contains(/Выберите булки/i);
    cy.get('[data-cy=burger-constructor__list]').contains(/Выберите начинку/i);
    cy.get('[data-cy=burger-constructor__bottom-bun]')
      .should('have.length', 1)
      .contains(/Выберите булки/i);
  });
});
