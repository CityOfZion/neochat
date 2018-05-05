defmodule Api.ChatsTest do
  use Api.DataCase

  alias Api.Chats
  alias Ecto.Changeset

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

    test "priv pub direct_message channels", %{users: [user_1, user_2], channel: channel} do
      Chats.join_channel(channel, user_1)
      {:ok, channel2} = Chats.create_channel(%{type: :private, name: "hello"})
      Chats.join_channel(channel2, user_1)
      {:ok, channel3} = Chats.create_direct_message_channel()
      Chats.join_channel(channel3, user_1)
      Chats.join_channel(channel3, user_2)
      username = user_2.username
      assert length(Chats.get_user_channels(user_1)) == 3
      [%{type: :direct_message, name: ^username}] = Chats.get_user_direct_messages(user_1)
      [%{type: :public}, %{type: :private, name: "hello"}] = Chats.get_user_priv_pub_channels(user_1)
    end

    test "find direct message channel", %{users: [user_1, user_2], channel: channel} do
      assert Chats.find_direct_message(user_1.id, user_2.id) == nil
      channel = Changeset.change(channel, %{type: :direct_message})
      |> Repo.update!()
      Chats.join_channel(channel, user_1)
      Chats.join_channel(channel, user_2)

      %{type: :direct_message} = Chats.find_direct_message(user_1.id, user_2.id)
    end

    test "delete", %{users: [user_1, user_2], channel: channel} do
      {:ok, %{id: id}} = Chats.create_message(channel, user_1, %{text: "HI"})
      assert {:error, :not_allowed} == Chats.delete_message(id, user_2)
      assert Kernel.match?({:ok, _}, Chats.delete_message(id, user_1))
    end
  end
end
