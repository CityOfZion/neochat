
## NeoChat

[![Build Status](https://travis-ci.org/CityOfZion/neochat.svg?branch=master)](https://travis-ci.org/CityOfZion/neochat)

Chat for the Neo community.

### Prerequisites
- [docker](https://www.docker.com/)
- [nodejs](https://nodejs.org/en/)
- [yarn](https://yarnpkg.com/en/)
- [elixir](https://elixir-lang.org/)

### Getting Started

- add postgres to your /etc/hosts `127.0.0.1 postgresql`
- `docker-compose up -d`
- to start the api: `cd api/; mix deps.get; iex -S mix phx.server`
- to start the frontend `cd frontend/; yarn; npm start`
- access `http://localhost:8080/`

### Roadmap

Please read the [Roadmap.md](https://github.com/CityOfZion/neochat/blob/master/Roadmap.md)

### License

This project is licensed under the MIT License
