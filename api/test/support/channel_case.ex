defmodule Api.Web.ChannelCase do
  @moduledoc """
  This module defines the test case to be used by
  channel tests.

  Such tests rely on `Phoenix.ChannelTest` and also
  import other functionality to make it easier
  to build common datastructures and query the data layer.

  Finally, if the test case interacts with the database,
  it cannot be async. For this reason, every test runs
  inside a transaction which is reset at the beginning
  of the test unless the test case is marked as async.
  """

  alias Ecto.Adapters.SQL.Sandbox
  alias Api.Accounts
  alias Api.Chats
  alias Api.Web.Guardian
  use ExUnit.CaseTemplate
  use Phoenix.ConnTest

  using do
    quote do
      # Import conveniences for testing with channels
      use Phoenix.ChannelTest

      # The default endpoint for testing
      @endpoint Api.Web.Endpoint
    end
  end

  setup tags do
    :ok = Sandbox.checkout(Api.Repo)

    unless tags[:async] do
      Sandbox.mode(Api.Repo, {:shared, self()})
    end

    {:ok, channel} = Chats.create_channel(%{name: "chat_#{:rand.uniform(1_000_000)}"})

    user = generate_user()

    {:ok, jwt, _} = Guardian.encode_and_sign(user, %{})

    %{users: [user, generate_user()], channel: channel, jwt: jwt}
  end

  def generate_user do
    name = "user_#{:rand.uniform(1_000_000)}"
    {:ok, user} = Accounts.create_user(%{username: name, email: "#{name}@mail.com", password: name})
    user
  end
end
