import { useState } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

function AddReview() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <span onClick={handleOpen}>Open modal</span>
      <Modal open={open} onClose={handleClose}>
        <div>marzo gay</div>
      </Modal>
    </>
  );
}

export default AddReview;
