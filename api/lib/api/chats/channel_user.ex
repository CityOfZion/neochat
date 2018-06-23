defmodule Api.Chats.ChannelUser do
  @moduledoc false
  use Ecto.Schema
  alias Api.Accounts.User
  alias Api.Chats.Channel

  @primary_key false
  schema "channel_users" do
    belongs_to(:channel, Channel)
    belongs_to(:user, User)
  end
end
