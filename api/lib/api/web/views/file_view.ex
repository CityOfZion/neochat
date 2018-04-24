defmodule Api.Web.FileView do
  use Api.Web, :view

  def render("file.json", %{filename: filename, path: path}) do
    %{filename: filename, path: path}
  end
end
