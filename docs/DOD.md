# Definition of Done for User Stories

1. **User Story Acceptance Criteria:** All user story acceptance criteria are met.
2. **Code Implementation:** The code for the user story is written, reviewed, and approved by peer developers.
3. **Unit Testing:** The unit tests for the user story have been authored and successfully passed. Jest was employed for backend testing in Node.js, while Jest was utilized for unit testing on the frontend, with Cypress handling end-to-end testing. A prerequisite for considering the tests complete is achieving an 80% code coverage.
4. **Integration Testing:** The user story has been integrated with the existing codebase and passes integration tests.
5. **Code Quality and Code Coverage:** The code follows coding standards and best practices ([Best Practices - NextJs](https://nextjs.org/docs/pages/building-your-application/deploying/production-checklist), [Standards and Best Practices - JS](https://www.w3schools.com/js/js_best_practices.asp)) with Unit Tests covering more than 80%.
6. **Documentation:** Any required documentation, such as code comments, needs to be added.
    - For example:
    ```javascript
    /**
     * @param {string} email user's email address
     * @returns string Hashed email address
     */
    const hash = (email) => crypto.createHash('sha256').update(email).digest('hex');
    ```
7. **User Acceptance Testing (UAT):** The user story has been tested and validated by the product owner.
8. **Dependencies:** Any external dependencies or third-party integrations are verified to work correctly.

# Definition of Done for Sprints

1. **User Stories:** All user stories planned for the sprint are completed and meet their respective DoDs.
2. **Sprint Goal:** The sprint goal is achieved, and all planned work is finished.
3. **Demo:** A sprint demo has been conducted to showcase the completed user stories to stakeholders.
4. **Review:** A sprint review meeting has taken place to gather feedback and make necessary adjustments.
5. **Retrospective:** A sprint retrospective has been held to identify improvements and plan for the next sprint.
6. **Documentation:** Sprint-related documentation, including sprint notes and updated sprint backlog, is maintained.
7. **Backlog Grooming:** The product backlog is reviewed and adjusted, and the next sprint backlog is prepared.
8. **Continuous Integration:** All code is integrated into the main branch of the version control system.
9. **Testing:** Testing is performed to ensure the sprint's work does not introduce new issues.
10. **Deployment:** If applicable, the sprint work is ready for deployment to the production environment.