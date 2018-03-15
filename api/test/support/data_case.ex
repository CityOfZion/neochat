defmodule Api.DataCase do
  @moduledoc """
  This module defines the setup for tests requiring
  access to the application's data layer.

  You may define functions here to be used as helpers in
  your tests.

  Finally, if the test case interacts with the database,
  it cannot be async. For this reason, every test runs
  inside a transaction which is reset at the beginning
  of the test unless the test case is marked as async.
  """

  use ExUnit.CaseTemplate
  alias Ecto.Adapters.SQL.Sandbox
  alias Ecto.Changeset
  alias Api.Accounts
  alias Api.Chats

  using do
    quote do
      alias Api.Repo

      import Ecto
      import Ecto.Changeset
      import Ecto.Query
      import Api.DataCase
    end
  end

  setup tags do
    :ok = Sandbox.checkout(Api.Repo)

    unless tags[:async] do
      Sandbox.mode(Api.Repo, {:shared, self()})
    end

    {:ok, channel} = Chats.create_channel(%{name: "chat_#{:rand.uniform(1_000_000)}"})

    %{users: [generate_user(), generate_user()], channel: channel}
  end

  def generate_user do
    name = "user_#{:rand.uniform(1_000_000)}"
    {:ok, user} = Accounts.create_user(%{username: name, email: "#{name}@mail.com", password: name})
    user
  end

  @doc """
  A helper that transform changeset errors to a map of messages.

      assert {:error, changeset} = Accounts.create_user(%{password: "short"})
      assert "password is too short" in errors_on(changeset).password
      assert %{password: ["password is too short"]} = errors_on(changeset)

  """
  def errors_on(changeset) do
    Changeset.traverse_errors(
      changeset,
      fn {message, opts} ->
        Enum.reduce(
          opts,
          message,
          fn {key, value}, acc ->
            String.replace(acc, "%{#{key}}", to_string(value))
          end
        )
      end
    )
  end
end
