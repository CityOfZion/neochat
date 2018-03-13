defmodule Api.Chats.ChannelUser do
  @moduledoc false
  use Ecto.Schema
  alias Api.Chats.Channel
  alias Api.Accounts.User

  @primary_key false
  schema "channel_users" do
    belongs_to(:channel, Channel)
    belongs_to(:user, User)
  end
end
