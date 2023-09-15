/// <reference types="cypress" />

describe('Network Requests - XMLHttpRequests', () => {

    //XMLHttpRequest (XHR) objects are used to interact with servers.
    //You can retrieve data from a URL without having to do a full page refresh.
    //This enables a Web page to update just part of a page without disrupting what the user is doing.


    let message = "Unable to find comment!";

    beforeEach(() => {
        cy.visit("https://example.cypress.io/commands/network-requests");
    })

    it('GET Request', () => {
        //listening for GET requests
        //whole url - https://jsonplaceholder.cypress.io/comments/1
        cy.intercept({
            method: "GET",
            url: "**/comments/*"
        }).as("getComment");

        cy.get(".network-btn").click();

        cy.wait("@getComment").its('response.statusCode').should("eq", 200);
    });

    it('GET Request - mocking requests', () => {
        //listening for GET requests
        //whole url - https://jsonplaceholder.cypress.io/comments/1
        cy.intercept({
            method: "GET",
            url: "**/comments/*", },
            {
                body: {
                    postId: 1,
                    id: 1,
                    name: "test name 123",
                    email: "test@example.com",
                    body: "lorem ipsum test mocking hello world"
                }
        }).as("getComment");

        cy.get(".network-btn").click();

        cy.wait("@getComment").its('response.statusCode').should("eq", 200);
    });

    it('POST requests', () => {
        cy.intercept("POST", "/comments").as("postComment");

        cy.get('.network-post').click();

        cy.wait('@postComment').should(({request, response}) => {
            console.log(request);

            expect(request.body).to.include("email")

            console.log(response);
            expect(response.body).to.have.property("name", "Using POST in cy.intercept()");
            expect(request.headers).to.have.property("content-type");
            expect(request.headers).to.have.property("origin", "https://example.cypress.io");
        })
    });

    it('PUT Request', () => {
        cy.intercept({
            method: "PUT",
            url: "**/comments/*",
        },
        {
            statusCode: 404,
            body: { error: message },
            delay: 500
        }).as("putComment");

        cy.get('.network-put').click();

        cy.wait("@putComment")
        
        cy.get('.network-put-comment').should('contain', message);
    });
});