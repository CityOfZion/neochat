defmodule Api.LinkRendererTest do
  use Api.DataCase
  use Phoenix.ChannelTest
  alias Api.Chats
  alias Api.Chats.LinkRenderer
  alias Api.Web.ChatChannel
  import Mock

  test "detect no link", %{users: [user_1, _], channel: channel} do
    Chats.join_channel(channel, user_1)

    {:ok, message} =
      with_mock LinkRenderer, process: fn _ -> nil end do
        Chats.create_message(channel, user_1, %{text: "HI"})
      end

    LinkRenderer.run(message)
  end

  test "detect link", %{users: [user_1, _], channel: channel} do
    Chats.join_channel(channel, user_1)

    {:ok, _, _} =
      socket("user:id", %{current_user: user_1})
      |> subscribe_and_join(ChatChannel, "channels:#{channel.id}")

    {:ok, message} =
      with_mock LinkRenderer, process: fn _ -> nil end do
        Chats.create_message(channel, user_1, %{text: "Go check this link https://github.com/"})
      end

    LinkRenderer.run(message)
    id = message.id

    assert_push("message_updated", %{id: ^id})
  end
end
