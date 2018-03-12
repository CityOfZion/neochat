defmodule Api.Web.Guardian do
  @moduledoc false
  use Guardian, otp_app: :api

  alias Api.Accounts
  alias Api.Accounts.User

  def subject_for_token(%User{} = user, _) do
    {:ok, "User:#{user.id}"}
  end

  def subject_for_token(_, _), do: {:error, "Unknown resource type"}

  def resource_from_claims(%{"sub" => "User:" <> id}) do
    {:ok, Accounts.get_user!(String.to_integer(id))}
  end

  def resource_from_claims(_) do
    {:error, "Unknown resource type"}
  end
end
