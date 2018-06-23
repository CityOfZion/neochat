defmodule Api.Web.ChatChannel do
  @moduledoc false
  use Api.Web, :channel
  alias Api.Chats
  alias Api.Helpers.Pagination
  alias Api.Web.ChangesetView
  alias Api.Web.ChannelView
  alias Api.Web.MessageView
  alias Api.Web.Presence
  alias Api.Web.UserView
  alias Phoenix.View
  require Logger

  def join("channels:" <> channel_id, _params, socket) do
    user = socket.assigns.current_user

    channel =
      Chats.get_channel!(channel_id)
      |> Chats.rename_channel(user)

    if Bodyguard.permit(Chats, :access, channel, user) == :ok do
      Logger.info(fn -> "channel #{channel.id} joinned" end)

      paged_messages = Chats.list_messages(channel)
      users = Chats.list_users(channel)

      response = %{
        userList: View.render_many(users, UserView, "user_summary.json"),
        channel: View.render_one(channel, ChannelView, "channel.json"),
        messages: View.render_many(paged_messages.entries, MessageView, "message.json"),
        pagination: Pagination.pagination(paged_messages)
      }

      send(self(), :after_join)
      {:ok, response, assign(socket, :channel, channel)}
    else
      {:error, :not_in_channel}
    end
  end

  def join(unknown_channel, _, _) do
    Logger.warn("tried to join #{unknown_channel} failled")
    {:error, %{reason: "unauthorized"}}
  end

  def handle_info(:after_join, socket) do
    user = socket.assigns.current_user
    Presence.track(socket, user.id, %{user: View.render_one(user, UserView, "user_summary.json")})
    push(socket, "presence_state", Presence.list(socket))
    {:noreply, socket}
  end

  def handle_in("new_message", params, socket) do
    channel = socket.assigns.channel
    user = socket.assigns.current_user

    case Chats.create_message(channel, user, params) do
      {:ok, message} ->
        broadcast_message(socket, user, message)
        {:reply, :ok, socket}

      {:error, changeset} ->
        {:reply, {:error, View.render(ChangesetView, "error.json", changeset: changeset)}, socket}
    end
  end

  def handle_in("delete_message", %{"id" => id}, socket) do
    user = socket.assigns.current_user

    case Chats.delete_message(id, user) do
      {:ok, _} ->
        broadcast_message_deleted(socket, id)
        {:reply, :ok, socket}

      {:error, _} ->
        {:reply, :error, socket}
    end
  end

  defp broadcast_message(socket, user, message) do
    message = %{message | user: user}
    rendered_message = View.render_one(message, MessageView, "message.json")
    broadcast!(socket, "message_created", rendered_message)
  end

  def broadcast_message_deleted(socket, id) do
    broadcast!(socket, "message_deleted", %{id: id})
  end

  def terminate(_reason, socket) do
    {:ok, socket}
  end
end
