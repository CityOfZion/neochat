defmodule Api.Web.AuthPipeline do
  @moduledoc false
  use Guardian.Plug.Pipeline, otp_app: :api

  plug(Guardian.Plug.VerifyHeader, realm: "Bearer:")
  plug(Guardian.Plug.EnsureAuthenticated, handler: Api.Web.ErrorHandler)
  plug(Guardian.Plug.LoadResource)
end
