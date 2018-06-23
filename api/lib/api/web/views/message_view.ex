defmodule Api.Web.MessageView do
  use Api.Web, :view
  alias Api.Web.MessageView

  def render("index.json", %{messages: messages}) do
    %{data: render_many(messages, MessageView, "message.json")}
  end

  def render("show.json", %{message: message}) do
    %{data: render_one(message, MessageView, "message.json")}
  end

  def render("message.json", %{message: message}) do
    %{
      id: message.id,
      inserted_at: message.inserted_at,
      text: message.text,
      payload: message.payload,
      user: %{
        email_hash:
          :crypto.hash(:md5, message.user.email) |> Base.encode16() |> String.downcase(),
        username: message.user.username,
        id: message.user.id
      }
    }
  end
end
