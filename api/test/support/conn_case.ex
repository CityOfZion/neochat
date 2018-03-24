defmodule Api.Web.ConnCase do
  @moduledoc """
  This module defines the test case to be used by
  tests that require setting up a connection.

  Such tests rely on `Phoenix.ConnTest` and also
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
      # Import conveniences for testing with connections
      use Phoenix.ConnTest
      import Api.Web.Router.Helpers
      alias Api.Repo

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

    conn = build_conn()
           |> put_req_header("accept", "application/json")
           |> put_req_header("authorization", "Bearer: #{jwt}")

    %{users: [user, generate_user()], channel: channel, conn: conn}
  end

  def generate_user do
    name = "user_#{:rand.uniform(1_000_000)}"
    {:ok, user} = Accounts.create_user(%{username: name, email: "#{name}@mail.com", password: name})
    user
  end
end
