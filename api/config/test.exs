use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :api, Api.Web.Endpoint,
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :api, Api.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "api_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox

config :api, Api.Web.Guardian,
  issuer: "neochat",
  secret_key: "7PXewtSUeh3j1oSu53FWE5AdAcsJYu/wUVzUwDfGCnrKTPDfor8LZiQaEHmz7zda"

config :api, Api.Web.AuthPipeline,
  module: Api.Web.Guardian,
  error_handler: Api.Web.ErrorHandler
