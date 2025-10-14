import { useState } from "react";
import Modal from "../../ui/Modal";
import CreateEditCabinForm from "./CreateEditCabinForm";
import Button from "../../ui/Button";

function CreateCabin() {
  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <>
      <Button
        $size="large"
        $variations="primary"
        onClick={() => setIsOpenModal((show) => !show)}
      >
        create cabin
      </Button>
      {isOpenModal && (
        <Modal onCloseModal={() => setIsOpenModal(false)}>
          <CreateEditCabinForm onCloseModal={() => setIsOpenModal(false)} />
        </Modal>
      )}
    </>
  );
}

export default CreateCabin;
