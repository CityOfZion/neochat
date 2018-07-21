defmodule Api.Web.ChannelControllerTest do
  use Api.Web.ConnCase

  alias Api.Chats
  alias Ecto.Changeset

  test "list channels", %{users: [user, _], channel: channel, conn: conn} do
    Changeset.change(channel, %{type: :private})
    |> Repo.update!()

    resp = get(conn, "/api/channels/")
    assert json_response(resp, 200) == %{"data" => []}

    Chats.join_channel(channel, user)
    resp = get(conn, "/api/channels/")
    %{"data" => [%{"id" => _}]} = json_response(resp, 200)
  end

  test "user optedOut", %{users: [user_1, user_2], channel: channel, conn: conn} do
    Chats.join_channel(channel, user_1)
    conn = get(conn, "/api/channels/#{channel.id}/opted_out")

    assert json_response(conn, 200)["data"]
           |> List.first()
           |> Map.get("id") == user_2.id
  end

  test "optIn user", %{users: [user_1, user_2], channel: channel, conn: conn} do
    Chats.join_channel(channel, user_1)
    conn = post(conn, "/api/channels/#{channel.id}/opt_in", %{user_id: user_2.id})
    assert json_response(conn, 201) == %{"message" => "ok"}
  end

  test "join policy", %{conn: conn, channel: channel} do
    channel =
      Changeset.change(channel, %{type: :private})
      |> Repo.update!()

    resp = post(conn, "/api/channels/#{channel.id}/join")
    assert resp.status == 403

    Changeset.change(channel, %{type: :public})
    |> Repo.update()

    resp = post(conn, "/api/channels/#{channel.id}/join")
    assert resp.status == 201
  end

  test "invite in private channel", %{conn: conn, channel: channel, users: [user, user_2]} do
    Changeset.change(channel, %{type: :private})
    |> Repo.update!()

    resp = post(conn, "/api/channels/#{channel.id}/opt_in", %{user_id: user_2.id})
    assert resp.status == 403

    Chats.join_channel(channel, user)
    conn = post(conn, "/api/channels/#{channel.id}/opt_in", %{user_id: user_2.id})
    assert json_response(conn, 201) == %{"message" => "ok"}
  end

  test "create direct message channel", %{conn: conn, users: [_, user_2]} do
    resp = post(conn, "/api/channels/direct_messages", %{user_id: user_2.id})

    %{
      "data" => %{
        "id" => id,
        "name" => name
      }
    } = json_response(resp, 201)

    assert name == user_2.username
    channel = Chats.get_channel!(id)
    assert channel.type == :direct_message
  end

  test "invite in direct_message isn't possible", %{
    conn: conn,
    channel: channel,
    users: [user, user_2]
  } do
    Changeset.change(channel, %{type: :direct_message})
    |> Repo.update!()

    Chats.join_channel(channel, user)
    resp = post(conn, "/api/channels/#{channel.id}/opt_in", %{user_id: user_2.id})
    assert resp.status == 403
  end

  test "user leave", %{
    conn: conn,
    channel: channel,
    users: [user, user_2]
  } do
    Chats.join_channel(channel, user)
    conn = post(conn, "/api/channels/#{channel.id}/leave")
    assert resp.status == 200
  end
end
