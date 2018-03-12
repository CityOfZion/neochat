defmodule Api.Web.SessionController do
  @moduledoc "Controller handling login and logout"

  use Api.Web, :controller
  alias Api.Web.Guardian.Plug, as: GPlug
  alias Api.Web.Guardian
  alias Api.Accounts
  alias Comeonin.Argon2

  def create(conn, params) do
    case authenticate(params) do
      {:ok, user} ->
        new_conn = GPlug.sign_in(conn, user)
        jwt = GPlug.current_token(new_conn)

        new_conn
        |> put_status(:created)
        |> render("show.json", user: user, jwt: jwt)

      :error ->
        conn
        |> put_status(:unauthorized)
        |> render("error.json")
    end
  end

  def delete(conn, _) do
    jwt = GPlug.current_token(conn)
    Guardian.revoke(jwt, %{})

    conn
    |> put_status(:ok)
    |> render("delete.json")
  end

  def refresh(conn, _params) do
    user = GPlug.current_resource(conn)

    jwt = GPlug.current_token(conn)

    case Guardian.refresh(jwt) do
      {:ok, {_, _}, {new_token, _}} ->
        conn
        |> put_status(:ok)
        |> render("show.json", user: user, jwt: new_token)

      {:error, _reason} ->
        conn
        |> put_status(:unauthorized)
        |> render("forbidden.json", error: "Not authenticated")
    end
  end

  def unauthenticated(conn, _params) do
    conn
    |> put_status(:forbidden)
    |> render(ChatApi.SessionView, "forbidden.json", error: "Not Authenticated")
  end

  defp authenticate(%{"email" => email, "password" => password}) do
    user = Accounts.get_user_by_email(email)

    case check_password(user, password) do
      true -> {:ok, user}
      _ -> :error
    end
  end

  defp check_password(user, password) do
    case user do
      nil -> Argon2.dummy_checkpw()
      _ -> Argon2.checkpw(password, user.password_hash)
    end
  end
end
