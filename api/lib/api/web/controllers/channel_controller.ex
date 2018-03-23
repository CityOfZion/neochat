defmodule Api.Web.ChannelController do
  use Api.Web, :controller

  alias Api.Chats
  alias Api.Chats.Channel
  alias Api.Web.Guardian.Plug, as: GPlug
  alias Api.Web.ChangesetView
  alias Api.Web.UserView

  action_fallback(Api.Web.FallbackController)

  def index(conn, _params) do
    channels = Chats.list_channels()
    render(conn, "index.json", channels: channels)
  end

  def create(conn, channel_params) do
    current_user = GPlug.current_resource(conn)

    with {:ok, %Channel{} = channel} <- Chats.create_channel(channel_params),
         {:ok, _user_channel} = Chats.join_channel(channel, current_user) do
      conn
      |> put_status(:created)
        # |> put_resp_header("location", channel_path(conn, :show, channel))
      |> render("show.json", channel: channel)
    end
  end

  def update(conn, %{"id" => id, "channel" => channel_params}) do
    channel = Chats.get_channel!(id)

    with {:ok, %Channel{} = channel} <- Chats.update_channel(channel, channel_params) do
      render(conn, "show.json", channel: channel)
    end
  end

  def delete(conn, %{"id" => id}) do
    channel = Chats.get_channel!(id)

    with {:ok, %Channel{}} <- Chats.delete_channel(channel) do
      send_resp(conn, :no_content, "")
    end
  end

  def join(conn, %{"id" => channel_id}) do
    current_user = GPlug.current_resource(conn)
    channel = Chats.get_channel!(channel_id)

    case Chats.join_channel(channel, current_user) do
      {:ok, _user_channel} ->
        conn
        |> put_status(:created)
        |> render("show.json", %{channel: channel})

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(ChangesetView, "error.json", changeset: changeset)
    end
  end

  def opted_out_users(conn, %{"id" => channel_id}) do
    channel_id = String.to_integer(channel_id)
    users = Chats.opted_out_users(channel_id)

    render(conn, UserView, "index.json", users: users)
  end

  def opt_in_user(conn, %{"id" => channel_id, "user_id" => user_id}) do
    channel_id = String.to_integer(channel_id)
    Chats.join_channel(channel_id, user_id)
    conn
    |> put_status(:created)
    |> json(%{message: "ok"})
  end
end
