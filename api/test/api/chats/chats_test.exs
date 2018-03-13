defmodule Api.ChatsTest do
  use Api.DataCase

  alias Api.Chats

  #  describe "messages" do
  #    alias Api.Chats.Message
  #  end

  describe "channels" do
    alias Api.Chats

    test "user not optedIn", %{users: [user_1, user_2], channel: channel} do
      Chats.join_channel(channel, user_1)
      [opted_out] = Chats.opted_out_users(channel.id)
      assert opted_out.id == user_2.id
    end
  end
end
