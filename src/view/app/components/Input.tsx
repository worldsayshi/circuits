import { Box } from 'rebass';
import * as React from "react";


const Input = props => (
    <Box
      as='input'
      p={2}
      {...props}
    />
  );

export default Input;