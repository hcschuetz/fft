import { FC } from "react";
import styled from "styled-components";

const TableElem = styled.table`
  margin: 1em 0;
  borderCollapse: collapse;
  border: 1em 0;
`;

const ParameterTable: FC = ({children}) => (
  <TableElem>
    <tbody>
      {children}
    </tbody>
  </TableElem>
);

export default ParameterTable;