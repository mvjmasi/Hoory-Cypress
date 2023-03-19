describe('Testing hoory', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/visitor.VisitorService/GetVisitor').as('getVisitor')
    cy.intercept('POST', '**/visitor.VisitorService/GetVisitorConversation').as(
      'getVisitorConversation',
    )
    cy.visit('https://hoory.ai/hoory')
    cy.wait('@getVisitor')
    cy.getHooryElementClass()
    cy.getMyElementClass()
  })

  it('Send a message and check hoory response', () => {
    cy.sendMessage('I need your help')
    cy.theLastHooryMessageShouldBe(
      '🚀 Hoory will help businesses automate their customer support experience. When ' +
        'integrated into a website, users receive fast answers to their queries and 24/7 assistance. With AI at its' +
        ' core, Hoory can crawl an entire website and share knowledge about a business in human-like conversations.' +
        ' It stocks all interactions with users in a smart Inbox that uncovers valuable behavior insights. ' +
        'It involves no coding and can easily be embedded into multiple websites.',
    )
  })

  it('Language detection persian', () => {
    cy.sendMessage('سلام')
    cy.theLastHooryMessageShouldBe('سلام')
  })

  it('Language detection spanish', () => {
    cy.sendMessage('gracias')
    cy.theLastHooryMessageShouldBe('De nada')
  })

  it('Language detection french', () => {
    cy.sendMessage("j'ai besoin d'aide")
    cy.theLastHooryMessageShouldBe('Bonjour')
  })

  it('Language detection italian', () => {
    cy.sendMessage('Ho bisogno di aiuto')
    cy.theLastHooryMessageShouldBe('Ciao')
  })

  it('Language detection russian', () => {
    cy.sendMessage('Привет')
    cy.theLastHooryMessageShouldBe('Здравствуйте')
  })

  it('Language detection chinese', () => {
    cy.sendMessage('你好')
    cy.theLastHooryMessageShouldBe('你好')
  })

  it('Language detection germany', () => {
    cy.sendMessage('Ich brauche Hilfe')
    cy.theLastHooryMessageShouldBe('Hallo')
  })

  it('Language detection arabic', () => {
    cy.sendMessage('أهلاً')
    cy.theLastHooryMessageShouldBe('أهلاً')
  })

  it('Multi Language detection', () => {
    cy.sendMessage('你好')
    cy.theLastHooryMessageShouldBe('你好')
    cy.sendMessage('Ich brauche Hilfe')
    cy.theLastHooryMessageShouldBe('Hallo')
    cy.sendMessage('أهلاً')
    cy.theLastHooryMessageShouldBe('أهلاً')
  })

  it('Send a message with special characters and typo and check pricing flow', () => {
    cy.sendMessage('@Can you tell % me about $$ your ** product prricing?#*!')
    cy.theLastHooryMessageShouldBe(
      "Glad you're interested! Please visit our pricing page to know more about the plans we offer. 💜 ",
    )
    cy.findByText('pricing')
      .should('have.attr', 'href')
      .and('include', 'https://www.hoory.com/pricing')
    cy.get('#actions-wrapper').children().should('contain.text', 'Pricing Plans')
  })

  it('Send special characters', () => {
    cy.sendMessage('213!@#!@$%#^^%&(()_')
    cy.theLastHooryMessageShouldBe("I'm sorry")
  })

  it('Send chunk message', () => {
    cy.sendMessage('pr')
    cy.sendMessage('icing?')
    cy.theLastHooryMessageShouldBe(
      "Glad you're interested! Please visit our pricing page to know more about the plans we offer. 💜 ",
    )
  })

  it('Check action wrapper suggested options', () => {
    cy.sendMessage('I want to buy the assistant for my online shop')
    cy.theLastHooryMessageShouldBe('Hoory is compatible with any website')
    cy.get('@hooryClass').then((element) => {
      cy.get(`.${element}`)
        .its('length')
        .then((hooryLength) => {
          cy.get('@myClass').then((element2) => {
            cy.get(`.${element2}`)
              .its('length')
              .then((myLength) => {
                cy.findByText('Learn more', { exact: false }).click()
                cy.get(`.${element}`).should('have.length', hooryLength + 1)
                cy.get(`.${element2}`).should('have.length', myLength + 1)
                cy.get(`.${element2}`).last().children().should('contain', 'Learn more')
              })
          })
        })
    })
  })

  it('Check support flow', () => {
    cy.sendMessage('support?')
    cy.theLastHooryMessageShouldBe('get in touch with our Support team:')
    cy.get('#actions-wrapper').children().should('contain.text', 'Connect to Support')
    cy.findByText('Connect to Support', { exact: false }).click()
    cy.get('#actions-wrapper').should('not.exist')
    cy.findByText(
      'Would you please fill in your contact details so we can connect with you? Lets start with your first name.',
    ).should('be.visible')
    cy.get('input[placeholder="Name"]').should('be.visible')
    cy.findByText('Confirm').parent().should('be.disabled')
    cy.get('input[placeholder="Name"]').type('test')
    cy.findByText('Confirm').parent().should('be.enabled')
    cy.findByText('Cancel').as('CancelButton').click()
    cy.get('@CancelButton').should('not.be.visible')
  })

  it('Send a long message and check max length', () => {
    const maxLongMessage = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sit amet dapibus ex." +
        " Donec convallis sapien vitae tincidunt consequat. Suspendisse consectetur purus at bibendum lacinia." +
        " Fusce vel dui blandit, vehicula purus quis, blandit lacus. Nullam quis diam tincidunt, imperdiet " +
        "velit quis, mattis lorem. Fusce a sapien id ipsum laoreet congue sit amet vitae metus. Aenean nec" +
        " ipsum et dolor pretium pellentesque. Sed sit amet luctus justo. Nam ac leo ut nunc placerat faucibus" +
        ". Nulla facilisiNu"
    const longMessage =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sit amet dapibus ex. ' +
      'Donec convallis sapien vitae tincidunt consequat. Suspendisse consectetur purus at bibendum lacinia. Fusce ' +
      'vel dui blandit, vehicula purus quis, blandit lacus. Nullam quis diam tincidunt, imperdiet velit quis, ' +
      'mattis lorem. Fusce a sapien id ipsum laoreet congue sit amet vitae metus. Aenean nec ipsum et dolor pretium' +
      ' pellentesque. Sed sit amet luctus justo. Nam ac leo ut nunc placerat faucibus. Nulla facilisiNullam' +
      ' rhoncus sapien ut dui blandit, eget gravida metus malesuada. Ut consequat lectus non ex semper, vel ' +
      'eleifend sapien dapibus. Pellentesque eget ullamcorper lorem. Suspendisse sed vestibulum nulla.' +
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sit amet dapibus ex. ' +
      'Donec convallis sapien vitae tincidunt consequat. Suspendisse consectetur purus at bibendum lacinia. Fusce ' +
      'vel dui blandit, vehicula purus quis, blandit lacus. Nullam quis diam tincidunt, imperdiet velit quis, ' +
      'mattis lorem. Fusce a sapien id ipsum laoreet congue sit amet vitae metus. Aenean nec ipsum et dolor pretium' +
      ' pellentesque. Sed sit amet luctus justo. Nam ac leo ut nunc placerat faucibus. Nulla facilisi. Nullam' +
      ' rhoncus sapien ut dui blandit, eget gravida metus malesuada. Ut consequat lectus non ex semper, vel ' +
      'eleifend sapien dapibus. Pellentesque eget ullamcorper lorem. Suspendisse sed vestibulum nulla.' +
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sit amet dapibus ex. ' +
      'Donec convallis sapien vitae tincidunt consequat. Suspendisse consectetur purus at bibendum lacinia. Fusce ' +
      'vel dui blandit, vehicula purus quis, blandit lacus. Nullam quis diam tincidunt, imperdiet velit quis, ' +
      'mattis lorem. Fusce a sapien id ipsum laoreet congue sit amet vitae metus. Aenean nec ipsum et dolor pretium' +
      ' pellentesque. Sed sit amet luctus justo. Nam ac leo ut nunc placerat faucibus. Nulla facilisi. Nullam' +
      ' rhoncus sapien ut dui blandit, eget gravida metus malesuada. Ut consequat lectus non ex semper, vel ' +
      'eleifend sapien dapibus. Pellentesque eget ullamcorper lorem. Suspendisse sed vestibulum nulla.' +
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sit amet dapibus ex. ' +
      'Donec convallis sapien vitae tincidunt consequat. Suspendisse consectetur purus at bibendum lacinia. Fusce ' +
      'vel dui blandit, vehicula purus quis, blandit lacus. Nullam quis diam tincidunt, imperdiet velit quis, ' +
      'mattis lorem. Fusce a sapien id ipsum laoreet congue sit amet vitae metus. Aenean nec ipsum et dolor pretium' +
      ' pellentesque. Sed sit amet luctus justo. Nam ac leo ut nunc placerat faucibus. Nulla facilisi. Nullam' +
      ' rhoncus sapien ut dui blandit, eget gravida metus malesuada. Ut consequat lectus non ex semper, vel ' +
      'eleifend sapien dapibus. Pellentesque eget ullamcorper lorem. Suspendisse sed vestibulum nulla.'
    cy.sendMessage(longMessage)
    cy.findByText(maxLongMessage)
  })

  it('Send empty message with whitespaces', () => {
    cy.get('@hooryClass').then((element) => {
      cy.get(`.${element}`)
        .its('length')
        .then((hooryLength) => {
          cy.get('@myClass').then((element2) => {
            cy.get(`.${element2}`)
              .its('length')
              .then((myLength) => {
                cy.get('textarea.ant-input').type(`   {enter}`)
                cy.get(`.${element}`).should('have.length', hooryLength)
                cy.get(`.${element2}`).should('have.length', myLength)
              })
          })
        })
    })
  })

  it('Illegal activities', () => {
    cy.sendMessage('I want to sell drugs')
    cy.theLastHooryMessageShouldBe("I'm sorry, but I cannot assist you")
  })
})

