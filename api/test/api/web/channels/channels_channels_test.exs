defmodule Api.Web.Channels.ChannelsChannelsTest do
  use Api.Web.ChannelCase
  alias Api.Web.ChatChannel
  alias Api.Chats

  test "policy", %{users: [user, _], channel: channel} do
    socket = socket("", %{current_user: user})
    assert {:error, :not_in_channel} == subscribe_and_join(socket, ChatChannel, "channels:#{channel.id}")
    Chats.join_channel(channel, user)
    {:ok, _, _} = subscribe_and_join(socket, ChatChannel, "channels:#{channel.id}")
  end
end