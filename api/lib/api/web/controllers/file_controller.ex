defmodule Api.Web.FileController do
  use Api.Web, :controller
  alias Api.Web.Endpoint
  alias Api.Web.MessageView
  alias Api.Chats
  alias Api.Web.Guardian.Plug, as: GPlug
  alias Phoenix.View

  def upload(conn, %{"file" => upload, "channel_id" => channel_id}) do
    user = GPlug.current_resource(conn)
    channel = Chats.get_channel!(channel_id)
    if Bodyguard.permit(Chats, :access, channel, user) == :ok do
      filename = copy_file(user, upload)
      {:ok, message} = Chats.create_upload_message(channel, user, filename)

      message = %{message | user: user}
      rendered_message = View.render_one(message, MessageView, "message.json")
      Endpoint.broadcast("channels:#{channel.id}", "message_created", rendered_message)
    end
    conn
    |> json(%{})
  end

  defp copy_file(user, upload) do
    extension = Path.extname(upload.filename)
    code = File.stream!(upload.path, [], 2048)
           |> Enum.reduce(
                :crypto.hash_init(:sha256),
                fn (line, acc) ->
                  :crypto.hash_update(acc, line)
                end
              )
           |> :crypto.hash_final
           |> Base.encode16
    new_filename = "#{code}#{user.id}#{extension}"
    File.cp!(upload.path, "#{:code.priv_dir(:api)}/static/uploads/#{new_filename}")
    new_filename
  end

end
