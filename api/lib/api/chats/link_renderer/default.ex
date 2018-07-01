defmodule Api.Chats.LinkRenderer.Default do
  @moduledoc """
  Default link renderer
"""
  def parse(body, url) do
    {:ok,
     %{
       title: get_title(body),
       description: get_description(body),
       images: get_images(body) |> add_images_base_url(url),
       url: url,
       real_url: get_real_url(body, url)
     }}
  end

  defp get_real_url(html, url) do
    (Floki.attribute(html, "meta[property=\"og:url\"]", "content") ++ [url])
    |> remove_empty_list_items
    |> Enum.at(0)
  end

  defp add_images_base_url(image_urls, base_url) do
    parsed_url = Fuzzyurl.from_string(base_url)

    Enum.map(image_urls, fn x ->
      x |> append_protocol_and_host(parsed_url)
    end)
  end

  defp append_protocol_and_host(url, parsed_url) do
    if Regex.match?(~r/^(http:\/\/|https:\/\/)/, url) == false do
      if Regex.match?(~r/^\/\//, url) == false do
        if String.at(url, 0) == "/" do
          "#{parsed_url.protocol}://#{parsed_url.hostname}#{url}"
        else
          "#{parsed_url.protocol}://#{parsed_url.hostname}/#{url}"
        end
      else
        "#{parsed_url.protocol}:#{url}"
      end
    else
      url
    end
  end

  defp get_description(html) do
    (Floki.attribute(html, "meta[property=\"og:description\"]", "content") ++
       Floki.attribute(html, "meta[name=\"description\"]", "content"))
    |> remove_empty_list_items
    |> Enum.at(0)
  end

  defp get_title(html) do
    (Floki.attribute(html, "meta[property=\"og:site_name\"]", "content") ++
       [Floki.find(html, "title") |> Floki.text()])
    |> remove_empty_list_items
    |> Enum.at(0)
  end

  defp get_images(html) do
    (Floki.attribute(html, "meta[property=\"og:image\"]", "content") ++
       Floki.attribute(html, "meta[property=\"twitter:image\"]", "content") ++
       Floki.attribute(html, "meta[itemprop='image']", "content"))
    |> remove_empty_list_items
  end

  defp remove_empty_list_items(list) do
    Enum.filter(list, fn x -> x != nil and x != "" end)
  end
end
