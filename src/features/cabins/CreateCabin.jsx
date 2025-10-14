import Modal from "../../ui/Modal";
import CreateEditCabinForm from "./CreateEditCabinForm";
import Button from "../../ui/Button";

// import CabinTable from "./CabinTable";

function CreateCabin() {
  // 使用的结构：按钮 + 窗口
  // 可以同时容纳两个表单，但是只有一个表单展示
  // 思考：可以同时容纳多个表格，点击哪个表格对应的按钮，显示哪个表格。关闭功能一样，不用区分

  // 1. 需要区分两个表格和按钮--展示对应的表单内容
  // 2.
  return (
    <>
      <Modal>
        <Modal.Open openTableName="createCabin">
          <Button>Create Cabin</Button>
        </Modal.Open>
        <Modal.Window name="createCabin">
          <CreateEditCabinForm />
        </Modal.Window>

        {/* <Modal.Open openTableName="cabinTable">
          <Button>CabinTable</Button>
        </Modal.Open>
        <Modal.Window name="cabinTable">
          <CabinTable />
        </Modal.Window> */}
      </Modal>
    </>
  );
}

export default CreateCabin;
