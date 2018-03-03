defmodule Api.Web.ChatChannel do
  @moduledoc false
  use Api.Web, :channel
  alias Api.Chats
  alias Api.Helpers.Pagination
  require Logger

  def join("channels:" <> channel_id, _params, socket) do
    channel = Chats.get_channel!(channel_id)

    Logger.info fn ->
      "channel #{channel.id} joinned"
    end

    paged_messages = Chats.list_messages(channel)
    response = %{
      channel: Phoenix.View.render_one(channel, Api.Web.ChannelView, "channel.json"),
      messages: Phoenix.View.render_many(paged_messages.entries, Api.Web.MessageView, "message.json"),
      pagination: Pagination.pagination(paged_messages)
    }

    {:ok, response, assign(socket, :channel, channel)}
  end

  def join(unknown_channel, _, _) do
    Logger.warn("tried to join #{unknown_channel} failled")
    {:error, %{reason: "unauthorized"}}
  end

  def handle_in("new_message", params, socket) do
    IO.inspect(params)

    channel = socket.assigns.channel
    user = socket.assigns.current_user

    case Chats.create_message(channel, user, params) do
      {:ok, message} ->
        broadcast_message(socket, user, message)
        {:reply, :ok, socket}
      {:error, changeset} ->
        {:reply, {:error, Phoenix.View.render(Api.Web.ChangesetView, "error.json", changeset: changeset)}, socket}
    end
  end

  defp broadcast_message(socket, user, message) do
    message = %{message | user: user}
    rendered_message = Phoenix.View.render_one(message, Api.Web.MessageView, "message.json")
    broadcast!(socket, "message_created", rendered_message)
  end

  def terminate(_reason, socket) do
    {:ok, socket}
  end
end
