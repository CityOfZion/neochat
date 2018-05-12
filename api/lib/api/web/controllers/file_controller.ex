defmodule Api.Web.FileController do
  use Api.Web, :controller

  def upload(conn, %{"file" => upload}) do
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
    new_file_name = "#{code}#{extension}"
    result = File.cp(upload.path, "#{:code.priv_dir(:api)}/static/uploads/#{new_file_name}")
    render(conn, "file.json", filename: upload.filename, path: "uploads/#{new_file_name}")
  end

end
