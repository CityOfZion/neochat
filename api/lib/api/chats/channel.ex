defmodule Api.Chats.Channel do
  @moduledoc false
  use Ecto.Schema
  import Ecto.Changeset
  alias Api.Chats.Channel
  alias Api.Accounts.User
  alias Api.Chats.Message

  schema "channels" do
    field(:name, :string)
    field(:type, ChannelType, default: :public)
    many_to_many(:users, User, join_through: "channel_users")
    has_many(:messages, Message)
    timestamps()
  end

  @doc false
  def changeset(%Channel{} = channel, attrs) do
    channel
    |> cast(attrs, [:name, :type])
    |> validate_required([:name])
  end
end
