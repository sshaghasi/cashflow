import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchOverview } from "../redux/thunks/fetchOverview";

const DetailedTable = () => {
  return (
    <Sheet sx={{ height: 250, overflow: "auto" }}>
      <Table stickyHeader aria-label="Detailed Table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
          </tr>
        </thead>
      </Table>
    </Sheet>
  );
};

export default DetailedTable;