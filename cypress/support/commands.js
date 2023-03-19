import '@testing-library/cypress/add-commands'

Cypress.Commands.add('getHooryElementClass', () => {
    cy.findByText("Hi, I'm Hoory, your customer support AI. How can I assist you today?").parents("#messages-wrapper")
        .children().eq(1).invoke('attr', 'class').then(classes=>{
      const classList = classes.split(' ');
      const hooryClass = classList[1];
      cy.wrap(hooryClass).as('hooryClass');
    })
})

Cypress.Commands.add('getMyElementClass', () => {
    cy.get('textarea.ant-input').type('!{enter}');
    cy.get('textarea.ant-input').should('be.empty');
    cy.wait('@getVisitorConversation')
    cy.findByText('!').parents("#messages-wrapper").children().eq(2).invoke('attr', 'class').then(classes=>{
      const classList = classes.split(' ');
      const myClass = classList[1];
      cy.wrap(myClass).as('myClass');
      cy.get('@hooryClass').then(element => {
      cy.get(`.${element}`).should('have.length',2)})
    })
})

Cypress.Commands.add('sendMessage', (message) => {
    cy.get('@hooryClass').then(element => {
      cy.get(`.${element}`).its('length').then(hooryLength => {
        cy.get('@myClass').then(element2 => {
          cy.get(`.${element2}`).its('length').then(myLength => {
            cy.get('textarea.ant-input').type(`${message}{enter}`);
            cy.get(`.${element}`).should('have.length',hooryLength+1)
            cy.get(`.${element2}`).should('have.length',myLength+1)
            cy.get(`.${element2}`).last().within(()=>{
                cy.findByText(message, {exact: false})
            })
        })
      })
    })
  })
})

Cypress.Commands.add('getTheLastHooryMessage', () => {
    cy.get('@hooryClass').then(element => {
    cy.get(`.${element}`).last().children().invoke('text').then(text=>{
        cy.wrap(text)
    })
    })
})

Cypress.Commands.add('theLastHooryMessageShouldBe', (text) => {
    cy.getTheLastHooryMessage().as('message')
    cy.get('@message').should('contains',text)
})
