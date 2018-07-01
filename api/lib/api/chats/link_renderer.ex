defmodule Api.Chats.LinkRenderer do
  @moduledoc """
    Worker to render links
  """
  alias Api.Chats.LinkRenderer.Default
  alias Api.Repo
  alias Api.Web.Endpoint
  alias Api.Web.MessageView
  alias Ecto.Changeset
  alias Phoenix.View
  use GenServer
  require Logger
  @url ~r/(http|https):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/

  def start_link do
    GenServer.start_link(__MODULE__, %{}, name: __MODULE__)
  end

  def init(state) do
    {:ok, state}
  end

  def handle_cast({:process, message}, state) do
    run(message)
    {:noreply, state}
  end

  def run(message) do
    case Regex.run(@url, message.text, capture: :first) do
      [link] ->
        render(link)
        |> update(message)
        |> broadcast

      _ ->
        nil
    end
  end

  def render(link) do
    case HTTPoison.get(link, [{"Accept-Language", "en-US"}], follow_redirect: true) do
      {:ok, %HTTPoison.Response{body: body}} ->
        Default.parse(body, link)

      error ->
        Logger.error(fn -> inspect(error) end)
        nil
    end
  end

  def update({:ok, link_meta}, message) do
    link_meta = Map.put(link_meta, :type, :link)

    Changeset.change(message, %{payload: link_meta})
    |> Repo.update()
  end

  def update(_, _), do: nil

  def broadcast({:ok, message}) do
    message = Repo.preload(message, :user)
    rendered_message = View.render_one(message, MessageView, "message.json")
    Endpoint.broadcast!("channels:#{message.channel_id}", "message_updated", rendered_message)
  end

  def broadcast(_), do: nil

  def process({:ok, message}) do
    GenServer.cast(__MODULE__, {:process, message})
  end

  def process(_), do: nil
end
