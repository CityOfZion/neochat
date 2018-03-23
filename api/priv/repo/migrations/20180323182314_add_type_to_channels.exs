defmodule Api.Repo.Migrations.AddTypeToChannels do
  use Ecto.Migration

  def change do
    ChannelType.create_type
    alter table("channels") do
      add :type, :channel_type
    end
  end
end
