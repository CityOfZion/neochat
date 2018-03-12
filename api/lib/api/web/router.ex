defmodule Api.Web.Router do
  use Api.Web, :router
  alias Api.Web.AuthPipeline

  post("/api/sessions", Api.Web.SessionController, :create)
  resources("/api/users", Api.Web.UserController, only: [:create])

  scope "/api", Api.Web do
    pipe_through(AuthPipeline)

    delete("/sessions", SessionController, :delete)
    post("/sessions/refresh", SessionController, :refresh)

    get("/users/channels", UserController, :channels)

    resources("/channels", ChannelController, only: [:index, :create])
    post("/channels/:id/join", ChannelController, :join)
  end
end
