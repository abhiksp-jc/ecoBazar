const Table = ({
  columns,
  data,
  emptyMessage = "No data found"
}) => {
  return (
    <div className="overflow-x-auto">

      <table className="w-full text-sm">

        <thead>
          <tr className="border-b bg-gray-50">
            {columns.map((column) => (
              <th
                key={column.key}
                className="text-left px-4 py-3 font-semibold text-gray-600"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>

          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-10 text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={item._id || index}
                className="border-b hover:bg-gray-50"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-4"
                  >
                    {column.render
                      ? column.render(item)
                      : item[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}

        </tbody>

      </table>

    </div>
  );
};

export default Table;