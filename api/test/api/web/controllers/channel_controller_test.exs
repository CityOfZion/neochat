defmodule Api.Web.ChannelControllerTest do
  use Api.Web.ConnCase

  alias Api.Chats

  test "user optedOut", %{users: [user_1, user_2], channel: channel, conn: conn} do
    Chats.join_channel(channel, user_1)
    conn = get(conn, "/api/channels/#{channel.id}/opted_out")
    assert json_response(conn, 200)["data"]
           |> List.first
           |> Map.get("id") == user_2.id
  end

  test "optIn user", %{users: [user_1, user_2], channel: channel, conn: conn} do
    Chats.join_channel(channel, user_1)
    conn = post(conn, "/api/channels/#{channel.id}/opt_in", %{user_id: user_2.id})
    assert json_response(conn, 201) == %{"message" => "ok"}
  end
end