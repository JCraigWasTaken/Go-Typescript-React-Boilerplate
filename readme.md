# Go-Typescript-React-Boilerplate

## Description

This is a Boilerplate project for a full stack web application using Go, Typescript, and React. It is intended to be used as a starting point for new projects. It includes the following:

- A Go server with a REST API, the source code is located in the `src/server` directory.
- A React client, the source code is located in the `src/client` directory.
- Cypress for end-to-end testing.
- A Dockerfile for containerization.
- A Github Actions workflow for CI/CD.

## Table of Contents

- [Development Requirements](#development-requirements)
- [Setup](#setup)
- [Running the App in Development](#running-the-app-in-development)
- [Building the Production App](#building-the-production-app)
- [Containerization](#containerization)
- [Running Unit Tests](#running-unit-tests)
- [Running Cypress Tests](#running-cypress-tests)

## Development Requirements

- Node.js (v18+ recommended)
- NPM (v9+ recommended)
- Golang (v1.20+ recommended)
- Docker (v20+ recommended)
- Visual Studio Code
- Golang Extension for Visual Studio Code
- Prettier Extension for Visual Studio Code
- BabelEdit

## Setup

### Development Environment

1. Install Visual Studio Code, if not already installed.
2. Install the Go extension for Visual Studio Code, if not already installed.
3. Install the prettier extension for vscode, if not already installed.
4. Open settings (File > Preferences > Settings or Ctrl + ,).
5. Search for "go.formatTool" and select "gofmt" from the dropdown.
6. Search for "Editor: Default Formatter" and select "Prettier - Code formatter" from the dropdown.
7. Search for "editor.formatOnSave" and enable it.
8. Save your settings.
9. Run `npm run setup` from the project root directory.

### Github Actions (If cloning this repo)

1. Go to GitHub and sign into your account.
2. Click on your profile picture in the top-right corner of the page.
3. Select "Settings" from the dropdown menu.
4. From the left-hand navigation, select "Developer settings".
5. Select "Personal access tokens" from the left-hand navigation again.
6. Click on the "Generate new token" -> "Generate new token (classic)" button.
7. In the "Note" field, you can put a description for what this token will be used for, for example, "GitHub Actions Deployment".
8. In the "Select scopes" section, check the boxes for the repo, read:packages, write:packages, and delete:packages scopes. This will give the token the necessary permissions to interact with repositories and manage packages.
9. Click on the "Generate token" button at the bottom of the page.
10. Navigate to the main page of the repository where you're setting up your workflow.
11. Click on "Settings" in the navigation bar at the top of the page.
12. From the left-hand navigation, select "Secrets and variables" -> "Actions".
13. Click on the "New repository secret" button.
14. Enter GH_TOKEN as the name for the secret in the "Name" field.
15. In the "Value" field, paste the token that you generated in Steps 1-9.
16. Click on the "Add secret" button.

## Running the App in Development

To start the app in development mode, use the following commands:

- To start the client: `npm run dev:client`, it should be availabe at localhost:3000
  - If you want to run the client without the server, you will need to run `npm run build:apiSchema` first to generate the api schema.
- To start the server: `npm run dev:server`, it should be availabe at localhost:8080 however it will be proxied through the client so it is also available at localhost:3000
  - The server will automatically build the api schema when it starts.

## Building the Production App

To create a production build, use the following command:

`npm run build`

## Containerization

To containerize the app locally, run the following command:

`npm run container`

To pull the docker container, you must have a github account. You first have to be added to the github package registry that contains the container. Once you have been added, you then need to create a github personal access token with the read:packages scope. Then you can run the following command:

`docker login ghcr.io -u <GITHUB_USERNAME> -p <TOKEN>`

Replace GITHUB_USERNAME with your github username and TOKEN with your personal access token. Then you can pull the container with the command listed in the github package registry.

You can run the container with the following command:

`docker run -p 8080:8080 <container-name>`

Replace container-name with the name of the container.

Or you can use docker desktop to run the container. When you run the container, set Optional settings -> Host port to 8080.

## Running Unit Tests

To run unit tests, use the following commands:

- For server unit tests: `npm run test:unit:server`
- For client unit tests: `npm run test:unit:client`
- For all unit tests: `npm run test:unit`

## Running Cypress Tests

To develop Cypress tests you must run the following three commands in parallel, use the following command:

`npm run dev:client`
`npm run dev:server`
`npm run dev:test:e2e`

To run Cypress tests, use the following command:

`npm run test:e2e`
