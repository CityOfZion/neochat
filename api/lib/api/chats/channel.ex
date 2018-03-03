defmodule Api.Chats.Channel do
  use Ecto.Schema
  import Ecto.Changeset
  alias Api.Chats.Channel
  alias Api.Accounts.User
  alias Api.Chats.Message

  schema "channels" do
    field :name, :string
    many_to_many :users, User, join_through: "channel_users"
    has_many :messages, Message
    timestamps()
  end

  @doc false
  def changeset(%Channel{} = channel, attrs) do
    channel
    |> cast(attrs, [:name])
    |> validate_required([:name])
  end
end
