defmodule Api.Repo.Migrations.AddPayloadToMessage do
  use Ecto.Migration

  def change do
    alter table("messages") do
      add :payload, :jsonb
    end
  end
end
