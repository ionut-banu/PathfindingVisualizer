import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 500,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function SimpleModal() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id='simple-modal-title'>Path Finder Instructions</h2>
      <p> &#8226; Drag the start square (green) and finish square (red) to the desired locations </p>
      <p> &#8226; Click on an empty square and drag across the grid to build walls </p>
      <p> &#8226; Select the algorithm you want to visualize from the "Pick algorithm" dropdown </p>
      <p> &#8226; If you choose the Djkstra algorithm you can add random costs for going through each node by clicking "Randomize Cost" </p>
      <p> &#8226; Tap on the button that displays the algorithm name to start the visualization </p>
      <p> &#8226; When visualization is done click "Clear" to wipe the grid </p>
    </div>
  );

  return (
    <div>
      <button type='button' onClick={handleOpen}>
        Help
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
      >
        {body}
      </Modal>
    </div>
  );
}
