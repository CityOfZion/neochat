defmodule Api.Web.UserView do
  use Api.Web, :view
  alias Api.Web.UserView

  def render("index.json", %{users: users}) do
    %{data: render_many(users, UserView, "user.json")}
  end

  def render("show.json", %{user: user}) do
    %{data: render_one(user, UserView, "user.json")}
  end

  def render("user.json", %{user: user}) do
    %{
      id: user.id,
      username: user.username,
      email_hash: :crypto.hash(:md5, user.email)
                  |> Base.encode16()
    }
  end

  def render("user_summary.json", %{user: user}) do
    %{id: user.id, username: user.username}
  end
end
