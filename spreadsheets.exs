defmodule Cell do
  defstruct [:type, :data]

  def cell_type(cell) do
    cond do
      String.starts_with?(cell, "!") -> "label"
      String.starts_with?(cell, "=") -> "expression"
      true -> "plain"
    end
  end
end

defmodule Parser do
  def parse_file(file_name) do
    file_name
    |> File.stream!()
    |> Stream.map(&parse_line/1)
    |> Enum.into([])
  end

  defp parse_line(line) do
    line
    |> String.split("|")
    |> Enum.map(&parse_cell/1)
  end

  defp parse_cell(cell) do
    data = String.trim(cell)
    type = Cell.cell_type(data)
    %Cell{type: type, data: data}
  end

  def dump_file(file_name, data) do
    lines = data |> Enum.map(&dump_line/1)
    File.write(file_name, Enum.join(lines, "\n"))
  end

  defp dump_line(line) do
    line
    |> Enum.map(&dump_cell/1)
    |> Enum.join("|")
  end

  defp dump_cell(%Cell{data: data}), do: data
end

data = Parser.parse_file("transactions.csv")
Parser.dump_file("output", data)
