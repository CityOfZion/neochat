defmodule Api.Web.UserController do
  use Api.Web, :controller

  alias Api.Accounts
  alias Api.Web.Guardian.Plug, as: GPlug
  alias Api.Web.SessionView
  alias Api.Web.ChangesetView
  alias Api.Web.ChannelView
  alias Api.Chats

  action_fallback(Api.Web.FallbackController)
  #
  #  def index(conn, _params) do
  #    users = Accounts.list_users()
  #    render(conn, "index.json", users: users)
  #  end

  def create(conn, user_params) do
    case Accounts.create_user(user_params) do
      {:ok, user} ->
        new_conn = GPlug.sign_in(conn, user)
        jwt = GPlug.current_token(new_conn)

        conn
        |> put_status(:created)
        |> render(SessionView, "show.json", user: user, jwt: jwt)

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(ChangesetView, "error.json", changeset: changeset)
    end
  end

  def channels(conn, _) do
    current_user = GPlug.current_resource(conn)
    channels = Chats.get_user_channels(current_user)
    render(conn, ChannelView, "index.json", %{channels: channels})
  end

  #
  #  def show(conn, %{"id" => id}) do
  #    user = Accounts.get_user!(id)
  #    render(conn, "show.json", user: user)
  #  end
  #
  #  def update(conn, %{"id" => id, "user" => user_params}) do
  #    user = Accounts.get_user!(id)
  #
  #    with {:ok, %User{} = user} <- Accounts.update_user(user, user_params) do
  #      render(conn, "show.json", user: user)
  #    end
  #  end
  #
  #  def delete(conn, %{"id" => id}) do
  #    user = Accounts.get_user!(id)
  #    with {:ok, %User{}} <- Accounts.delete_user(user) do
  #      send_resp(conn, :no_content, "")
  #    end
  #  end
end
