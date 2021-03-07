import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

export default function Title(props) {
  return (
    <Typography color="primary" component="h2" gutterBottom variant="h6">
      {props.children}
    </Typography>
  );
}

Title.propTypes = {
  children: PropTypes.node,
};
