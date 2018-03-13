defmodule Api.Accounts.User do
  @moduledoc false
  use Ecto.Schema
  import Ecto.Changeset
  alias Comeonin.Argon2
  alias Api.Chats.Channel
  alias Api.Chats.Message

  schema "users" do
    field(:email, :string)
    field(:password_hash, :string)
    field(:username, :string)
    field(:password, :string, virtual: true)
    many_to_many(:channels, Channel, join_through: "channel_users")
    has_many(:messages, Message)

    timestamps()
  end

  @doc false
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:username, :email])
    |> validate_required([:username, :email])
    |> unique_constraint(:username)
    |> unique_constraint(:email)
  end

  @doc false
  def registration_changeset(struct, params) do
    struct
    |> changeset(params)
    |> cast(params, [:password])
    |> validate_length(:password, min: 8, max: 100)
    |> put_password_hash()
  end

  @doc false
  defp put_password_hash(changeset) do
    case changeset do
      %Ecto.Changeset{valid?: true, changes: %{password: password}} ->
        put_change(changeset, :password_hash, Argon2.hashpwsalt(password))

      _ ->
        changeset
    end
  end
end
