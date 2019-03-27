import { Box } from 'rebass';
import * as React from "react";


const Option = props => (
  <Box
    as='option'
    p={2}
    {...props}
  />
);

export default Option;