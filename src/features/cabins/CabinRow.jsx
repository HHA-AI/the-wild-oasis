import styled from "styled-components";

import { useDeleteCabin } from "./useDeleteCabin";
import { formatCurrency } from "../../utils/helpers";

import CreateEditCabinForm from "./CreateEditCabinForm";
import { useCreateCabin } from "./useCreateCabin";

import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

function CabinRow({ cabin }) {
  const { isDeleting, deleteCabin } = useDeleteCabin();
  const { id, image, name, regularPrice, maxCapacity, discount, description } =
    cabin;
  const { createMutate, isCreating } = useCreateCabin();
  function handleDuplicate() {
    createMutate({
      image,
      name: `Copy of ${name}`,
      regularPrice,
      maxCapacity,
      discount,
      description,
    });
  }
  return (
    <>
      <Table.Row>
        <Img src={image} />
        <Cabin>{name}</Cabin>
        <div>Fits up to {maxCapacity} guests</div>
        <Price>{formatCurrency(regularPrice)}</Price>
        {discount ? (
          <Discount>{formatCurrency(discount)}</Discount>
        ) : (
          <span>&mdash;</span>
        )}
        <div>
          {/* 
          //编辑和删除需要用到Modal窗口
          // 步骤：
          // 1. 按Modal  Modal.Open  Modal.Windows将组件解构写出来
          // 2. 写好Open 和 Window对应的名称属性
          // 3. 将Modal.Window传给子组件的closeModal属性--子组件中接收并使用
          // 检查Modal.Window的子组件，看是否有其他本身需要传递的属性 */}
          <Modal>
            <Menus.Toggle id={id} />
            <Menus.Menu>
              <Menus.List id={id}>
                <Menus.Button onClick={handleDuplicate}>复制</Menus.Button>
                <Modal.Open openTableName="editCabin" disabled={isCreating}>
                  <Menus.Button>编辑</Menus.Button>
                </Modal.Open>

                <Modal.Open openTableName="deleteConfirm" disabled={isDeleting}>
                  <Menus.Button>删除</Menus.Button>
                </Modal.Open>
              </Menus.List>
            </Menus.Menu>
            <Modal.Window name="editCabin">
              <CreateEditCabinForm cabinToEdit={cabin} />
            </Modal.Window>
            <Modal.Window name="deleteConfirm">
              <ConfirmDelete
                onConfirm={() => deleteCabin(id)}
                disabled={isDeleting}
                resourceName={name}
              />
            </Modal.Window>
          </Modal>
        </div>
      </Table.Row>
      {/* 点击编辑后出现cabin表格--复用--但是需要显示对应cabin的属性，传入cabin属性 */}
    </>
  );
}

export default CabinRow;
