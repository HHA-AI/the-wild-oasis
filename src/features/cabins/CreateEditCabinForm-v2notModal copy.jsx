import styled from "styled-components";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import { useForm } from "react-hook-form";

import FormROw from "../../ui/FormRow";
import { useCreateCabin } from "./useCreateCabin";
import { useEditCabin } from "./useEditCabin";

const StyledFormRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 24rem 1fr 1.2fr;
  gap: 2.4rem;

  padding: 1.2rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:has(button) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

function CreateEditCabinForm({ cabinToEdit = {} }) {
  // 思考：传入editCabin后，解构，判断是否有id，不对，cabin不存在时，解构会报错，直接传入id和cabin，先根据是否有id判断是否是编辑表格，是的话在解构
  // 正确方式：editCabin参数默认值为{}，可以解构空对象，解构的id不存在是值为undfined

  const { id: editId, ...editValue } = cabinToEdit;
  const isEditSession = Boolean(editId);
  const { createMutate, isCreating } = useCreateCabin();
  const { editMutate, isEditing } = useEditCabin();
  // ❌一个一个input加入默认值 -->
  // ✔️react-hook-form提供的useForm()，直接向useForm()传入一个对象，包括defaultValues
  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValue : {},
  });
  const { errors } = formState;

  // 综合状态
  const isWorking = isEditing || isCreating;

  function onSubmit(data) {
    console.log(data);
    // 1) 根据image类型，选择传入data的image数据
    const image = typeof data.image === "string" ? data.image : data.image[0];
    // 2) 判断是更新还是创建，执行各自的函数
    if (isEditSession) {
      editMutate(
        { newCabin: { ...data, image }, id: editId },
        { onSuccess: (updateData) => reset(updateData) }
      ); //id不能从data中获取，这里只有注册到表格中的数据
    } else {
      createMutate({ ...data, image }, { onSuccess: () => reset() });
    }
  }

  function onError(error) {
    console.log(error);
  }

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <FormROw error={errors?.name?.message} labelName="Cabin name">
          <Input
            type="text"
            id="name"
            disabled={isWorking}
            {...register("name", { required: "This field is required" })}
          />
        </FormROw>
        <FormROw
          error={errors?.maxCapacity?.message}
          labelName="Maximum capacity"
        >
          <Input
            type="number"
            id="maxCapacity"
            disabled={isWorking}
            {...register("maxCapacity", {
              required: "This field is required",
              min: { value: 1, message: "least capacity one person" },
            })}
          />
        </FormROw>

        <FormROw
          error={errors?.regularPrice?.message}
          labelName="Regular price"
        >
          <Input
            type="number"
            id="regularPrice"
            disabled={isWorking}
            {...register("regularPrice", {
              required: "This field is required",
              message: "price should greater than 1",
            })}
          />
        </FormROw>

        <FormROw error={errors?.discount?.message} labelName="Discount">
          <Input
            type="number"
            id="discount"
            disabled={isWorking}
            defaultValue={0}
            {...register("discount", {
              required: "This field is required",
              validate: (value) =>
                Number(value) <= Number(getValues().regularPrice) ||
                "discount should be less than regular price",
            })}
          />
        </FormROw>

        <FormROw
          error={errors?.description?.message}
          labelName="Description for website"
        >
          <Textarea
            type="number"
            id="description"
            disabled={isWorking}
            {...register("description", { required: "This field is required" })}
          />
        </FormROw>

        <FormROw error={errors?.image?.message} labelName="Cabin photo">
          {/* 将文件上传到supabase：
        1. type=file  应该本身包含在FileIput组件内部，封装成上传file的input组件
        2. register*/}
          <FileInput
            id="image"
            accept="image/*"
            {...register("image", {
              // 验证规则：
              // 1. isEditSession=== false  返回required:"This field is required"  一个普通的必填规则
              // 2. isEditSession=== true   返回required:false  不要求必填
              required: isEditSession ? false : "This field is required",
            })}
          />
        </FormROw>

        <StyledFormRow>
          {/* type is an HTML attribute! */}
          <Button $variation="secondary" type="reset">
            Cancel
          </Button>
          {/* 创建时禁用button */}
          <Button disabled={isWorking}>
            {isEditSession ? "Edit" : "Create"} cabin
          </Button>
        </StyledFormRow>
      </Form>
    </>
  );
}

export default CreateEditCabinForm;
