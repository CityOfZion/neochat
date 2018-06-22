defmodule Api.Chats.Message do
  @moduledoc false
  use Ecto.Schema
  import Ecto.Changeset
  alias Api.Chats.Message
  alias Api.Chats.Channel
  alias Api.Accounts.User

  schema "messages" do
    field(:text, :string)
    field(:payload, :map)
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

  def upload_changeset(%Message{} = message, attrs) do
    message
    |> cast(attrs, [:payload, :channel_id, :user_id])
    |> validate_required([:payload, :channel_id, :user_id])
  end
end
