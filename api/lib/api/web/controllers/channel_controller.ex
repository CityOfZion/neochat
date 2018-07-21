defmodule Api.Web.ChannelController do
  use Api.Web, :controller

  alias Api.Chats
  alias Api.Chats.Channel
  alias Api.Web.Endpoint
  alias Api.Web.Guardian.Plug, as: GPlug
  alias Api.Web.ChangesetView
  alias Api.Web.UserView

  @user_joined_channel "USER_JOINED_CHANNEL"
  @user_left_channel "USER_LEFT_CHANNEL"

  action_fallback(Api.Web.FallbackController)

  def index(conn, _params) do
    current_user = GPlug.current_resource(conn)

    channels = Chats.list_channels(current_user)
    render(conn, "index.json", channels: channels)
  end

  def create(conn, channel_params) do
    current_user = GPlug.current_resource(conn)

    with {:ok, %Channel{} = channel} <- Chats.create_channel(channel_params),
         {:ok, _user_channel} = Chats.join_channel(channel, current_user) do
      conn
      |> put_status(:created)
      |> render("show.json", channel: channel)
    end
  end

  def create_direct_message(conn, %{"user_id" => user_id}) do
    current_user = GPlug.current_resource(conn)
    if user_id == current_user.id, do: raise("can't create chat with self")

    channel =
      case Chats.find_direct_message(current_user.id, user_id) do
        nil ->
          with {:ok, %Channel{} = channel} <- Chats.create_direct_message_channel(),
               {:ok, _} = Chats.join_channel(channel, current_user),
               {:ok, _} = Chats.join_channel(channel.id, user_id) do
            channel
          end

        channel ->
          channel
      end

    channel = Chats.rename_channel(channel, current_user)

    conn
    |> put_status(:created)
    |> render("show.json", channel: channel)
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

    if Bodyguard.permit(Chats, :can_join, channel, current_user) == :ok do
      case Chats.join_channel(channel, current_user) do
        {:ok, _user_channel} ->
          Endpoint.broadcast!(
            "channels:" <> channel_id,
            @user_joined_channel,
            UserView.render("user_summary.json", %{user: current_user})
          )

          conn
          |> put_status(:created)
          |> render("show.json", %{channel: channel})

        {:error, changeset} ->
          conn
          |> put_status(:unprocessable_entity)
          |> render(ChangesetView, "error.json", changeset: changeset)
      end
    else
      {:error, :forbidden}
    end
  end

  def leave(conn, %{"id" => channel_id}) do
    current_user = GPlug.current_resource(conn)
    channel = Chats.get_channel!(channel_id)
    Chats.leave_channel(channel, current_user)

    Endpoint.broadcast!(
      "channels:" <> channel_id,
      @user_left_channel,
      UserView.render("user_summary.json", %{user: current_user})
    )

    conn
    |> json(%{})
  end

  def opted_out_users(conn, %{"id" => channel_id}) do
    channel = Chats.get_channel!(channel_id)
    current_user = GPlug.current_resource(conn)

    if Bodyguard.permit(Chats, :access, channel, current_user) == :ok do
      users = Chats.opted_out_users(channel.id)
      render(conn, UserView, "index.json", users: users)
    else
      {:error, :forbidden}
    end
  end

  def opt_in_user(conn, %{"id" => channel_id, "user_id" => user_id}) do
    channel = Chats.get_channel!(channel_id)
    current_user = GPlug.current_resource(conn)

    if channel.type != :direct_message and
         Bodyguard.permit(Chats, :access, channel, current_user) == :ok do
      Chats.join_channel(channel.id, user_id)

      conn
      |> put_status(:created)
      |> json(%{message: "ok"})
    else
      {:error, :forbidden}
    end
  end
end
