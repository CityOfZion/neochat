defmodule Api.Web.Router do
  use Api.Web, :router
  alias Api.Web.AuthPipeline

  pipeline :authed_api do
    plug :accepts, ["json"]
    plug AuthPipeline
  end

  post("/api/sessions", Api.Web.SessionController, :create)
  resources("/api/users", Api.Web.UserController, only: [:create])

  scope "/api", Api.Web do
    pipe_through(:authed_api)

    delete("/sessions", SessionController, :delete)
    post("/sessions/refresh", SessionController, :refresh)

    get("/users", UserController, :index)
    get("/users/channels", UserController, :channels)
    get("/users/direct_messages", UserController, :direct_messages)

    resources("/channels", ChannelController, only: [:index, :create])
    post("/channels/:id/join", ChannelController, :join)
    get("/channels/:id/opted_out", ChannelController, :opted_out_users)
    post("/channels/:id/opt_in", ChannelController, :opt_in_user)

  end
end
