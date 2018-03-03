defmodule Api.Web.SessionView do
  use Api.Web, :view
  alias Api.Web.UserView

  def render("show.json", %{user: user, jwt: jwt}) do
    %{
      data: render_one(user, UserView, "user.json"),
      meta: %{token: jwt}
    }
  end

  def render("error.json", _) do
    %{error: "Invalid email or password"}
  end

  def render("delete.json", _) do
    %{ok: true}
  end

  def render("forbidden.json", %{error: error}) do
    %{error: error}
  end
end
