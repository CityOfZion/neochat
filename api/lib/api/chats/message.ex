defmodule Api.Chats.Message do
  @moduledoc false
  use Ecto.Schema
  import Ecto.Changeset
  alias Api.Chats.Message
  alias Api.Chats.Channel
  alias Api.Accounts.User

  schema "messages" do
    field(:text, :string)
    belongs_to(:channel, Channel)
    belongs_to(:user, User)

    timestamps()
  end

  @doc false
  def changeset(%Message{} = message, attrs) do
    message
    |> cast(attrs, [:text, :channel_id, :user_id])
    |> validate_required([:text, :channel_id, :user_id])
  end
end
