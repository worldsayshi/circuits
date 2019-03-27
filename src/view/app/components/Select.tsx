import { Box } from 'rebass';
import * as React from "react";


const Select = props => (
  <Box
    as='select'
    p={2}
    {...props}
  />
);

export default Select;