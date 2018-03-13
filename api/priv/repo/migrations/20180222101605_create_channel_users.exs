defmodule Api.Repo.Migrations.CreateChannelsUsers do
  use Ecto.Migration

  def change do
    create table(:channel_users, primary_key: false) do
      add :channel_id, references(:channels)
      add :user_id, references(:users)
    end
    create index(:channel_users, [:user_id])
    create index(:channel_users, [:channel_id])
    create unique_index(:channel_users, [:channel_id, :user_id], concurrently: false)
  end
end
