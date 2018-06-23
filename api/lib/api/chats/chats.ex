defmodule Api.Chats do
  @moduledoc """
  The Chats context.
  """

  import Ecto.Query, warn: false
  alias Api.Accounts.User
  alias Api.Chats.Channel
  alias Api.Chats.ChannelUser
  alias Api.Repo
  @behaviour Bodyguard.Policy

  @doc """
  Returns the list of channels.

  ## Examples

      iex> list_channels()
      [%Channel{}, ...]

  """
  def list_channels(current_user) do
    from(
      c in Channel,
      where: c.type == ^:public,
      or_where:
        fragment(
          "? IN (SELECT channel_id from channel_users WHERE user_id = ?)",
          c.id,
          ^current_user.id
        ) and c.type == ^:private
    )
    |> Repo.all()
  end

  @doc """
  Gets a single channel.

  Raises `Ecto.NoResultsError` if the Channel does not exist.

  ## Examples

      iex> get_channel!(123)
      %Channel{}

      iex> get_channel!(456)
      ** (Ecto.NoResultsError)

  """
  def get_channel!(id), do: Repo.get!(Channel, id)

  @doc """
  Creates a channel.

  ## Examples

      iex> create_channel(%{field: value})
      {:ok, %Channel{}}

      iex> create_channel(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_channel(attrs \\ %{}) do
    %Channel{}
    |> Channel.changeset(attrs)
    |> Repo.insert()
  end

  def create_direct_message_channel do
    %Channel{}
    |> Channel.changeset(%{name: UUID.uuid1(), type: :direct_message})
    |> Repo.insert()
  end

  @doc """
  Updates a channel.

  ## Examples

      iex> update_channel(channel, %{field: new_value})
      {:ok, %Channel{}}

      iex> update_channel(channel, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_channel(%Channel{} = channel, attrs) do
    channel
    |> Channel.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Channel.

  ## Examples

      iex> delete_channel(channel)
      {:ok, %Channel{}}

      iex> delete_channel(channel)
      {:error, %Ecto.Changeset{}}

  """
  def delete_channel(%Channel{} = channel) do
    Repo.delete(channel)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking channel changes.

  ## Examples

      iex> change_channel(channel)
      %Ecto.Changeset{source: %Channel{}}

  """
  def change_channel(%Channel{} = channel) do
    Channel.changeset(channel, %{})
  end

  def join_channel(channel, user) when is_integer(channel) and is_integer(user) do
    Repo.insert(%ChannelUser{channel_id: channel, user_id: user})
  end

  def join_channel(channel, user), do: join_channel(channel.id, user.id)

  def get_user_channels(user) do
    user
    |> Repo.preload(:channels)
    |> Map.get(:channels)
  end

  def get_user_priv_pub_channels(user) do
    all =
      get_user_channels(user)
      |> Enum.group_by(& &1.type)

    Map.get(all, :public, []) ++ Map.get(all, :private, [])
  end

  def get_user_direct_messages(user) do
    get_user_channels(user)
    |> Enum.group_by(& &1.type)
    |> Map.get(:direct_message, [])
    |> rename_channels(user)
  end

  def rename_channel(channel = %{type: type}, user) when type == :direct_message do
    channel = Repo.preload(channel, :users)

    user =
      Enum.find(channel.users, fn u ->
        u.id != user.id
      end)

    Map.put(channel, :name, user.username)
  end

  def rename_channel(channel, _), do: channel

  defp rename_channels([], _), do: []

  defp rename_channels(direct_messages, user) do
    Repo.preload(direct_messages, :users)
    |> Enum.map(fn channel ->
      user =
        Enum.find(channel.users, fn u ->
          u.id != user.id
        end)

      Map.put(channel, :name, user.username)
    end)
  end

  def find_direct_message(user_1, user_2) do
    from(
      c in Channel,
      join: cu in ChannelUser,
      where:
        c.id == cu.channel_id and c.type == ^:direct_message and cu.user_id == ^user_1 and
          fragment(
            "? IN (SELECT channel_id from channel_users WHERE user_id = ?)",
            cu.channel_id,
            ^user_2
          )
    )
    |> Repo.one()
  end

  alias Api.Chats.Message

  @doc """
  Returns the list of users from a channel.

  ## Examples

      iex> list_users(channel)
      [%User{}, ...]

  """
  def list_users(channel) do
    channel
    |> Repo.preload(:users)
    |> Map.get(:users)
  end

  @doc """
  Returns the list of messages from a channel.

  ## Examples

      iex> list_messages(channel)
      [%Message{}, ...]

  """
  def list_messages(channel) do
    Message
    |> where([m], m.channel_id == ^channel.id)
    |> order_by(desc: :inserted_at, desc: :id)
    |> preload(:user)
    |> Repo.paginate()
  end

  @doc """
  Gets a single message.

  Raises `Ecto.NoResultsError` if the Message does not exist.

  ## Examples

      iex> get_message!(123)
      %Message{}

      iex> get_message!(456)
      ** (Ecto.NoResultsError)

  """
  def get_message!(id), do: Repo.get!(Message, id)

  @doc """
  Creates a message.

  ## Examples

      iex> create_message(%{field: value})
      {:ok, %Message{}}

      iex> create_message(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_message(channel, user, attrs) do
    channel
    |> Ecto.build_assoc(:messages, user_id: user.id)
    |> Message.changeset(attrs)
    |> Repo.insert()
  end

  def create_upload_message(channel, user, filename) do
    channel
    |> Ecto.build_assoc(:messages, user_id: user.id)
    |> Message.upload_changeset(%{payload: %{type: :file, filename: filename}})
    |> Repo.insert()
  end

  @doc """
  Updates a message.

  ## Examples

      iex> update_message(message, %{field: new_value})
      {:ok, %Message{}}

      iex> update_message(message, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_message(%Message{} = message, attrs) do
    message
    |> Message.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Message.

  ## Examples

      iex> delete_message(message)
      {:ok, %Message{}}

      iex> delete_message(message)
      {:error, %Ecto.Changeset{}}

  """
  def delete_message(message_id, user) do
    message =
      Message
      |> where([m], m.id == ^message_id)
      |> preload(:user)
      |> Repo.one()

    if message.user.id == user.id do
      Repo.delete(message)
    else
      {:error, :not_allowed}
    end
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking message changes.

  ## Examples

      iex> change_message(message)
      %Ecto.Changeset{source: %Message{}}

  """
  def change_message(%Message{} = message) do
    Message.changeset(message, %{})
  end

  def opted_out_users(channel_id) do
    from(
      u in User,
      where:
        fragment(
          "? NOT IN (SELECT user_id from channel_users WHERE channel_id = ?)",
          u.id,
          ^channel_id
        )
    )
    |> select([:username, :id, :email])
    |> Repo.all()
  end

  def authorize(:access, channel, user) do
    if get_user_channels(user)
       |> Enum.find(fn c -> c.id == channel.id end) do
      :ok
    else
      {:error, :not_in_channel}
    end
  end

  def authorize(:can_join, channel, _) do
    if channel.type == :public do
      :ok
    else
      {:error, :not_public_channel}
    end
  end
end
