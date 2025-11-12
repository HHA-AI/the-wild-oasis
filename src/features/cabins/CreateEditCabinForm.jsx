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

function CreateEditCabinForm({ cabinToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValue } = cabinToEdit;
  const isEditSession = Boolean(editId);
  const { createMutate, isCreating } = useCreateCabin();
  const { editMutate, isEditing } = useEditCabin();
  const isWorking = isEditing || isCreating;
  // ❌一个一个input加入默认值 -->
  // ✔️react-hook-form提供的useForm()，直接向useForm()传入一个对象，包括defaultValues
  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValue : {},
  });
  const { errors } = formState;

  // 创建或编辑成功后，如果onCloseModal存在--执行：onCloseModal?.();
  function onSubmit(data) {
    const image = typeof data.image === "string" ? data.image : data.image[0];
    if (isEditSession) {
      editMutate(
        { newCabin: { ...data, image }, id: editId },
        {
          onSuccess: (updateData) => {
            reset(updateData);
            onCloseModal?.();
          },
        }
      );
    } else {
      createMutate(
        { ...data, image },
        {
          onSuccess: () => {
            onCloseModal?.();
            reset();
          },
        }
      );
    }
  }

  function onError(error) {
    console.log(error);
  }

  return (
    <>
      <Form
        onSubmit={handleSubmit(onSubmit, onError)}
        $type={onCloseModal ? "modal" : "regular"}
      >
        <FormROw error={errors?.name?.message} label="Cabin name">
          <Input
            type="text"
            id="name"
            disabled={isWorking}
            {...register("name", { required: "This field is required" })}
          />
        </FormROw>
        <FormROw error={errors?.maxCapacity?.message} label="Maximum capacity">
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

        <FormROw error={errors?.regularPrice?.message} label="Regular price">
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

        <FormROw error={errors?.discount?.message} label="Discount">
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
          label="Description for website"
        >
          <Textarea
            type="number"
            id="description"
            disabled={isWorking}
            {...register("description", { required: "This field is required" })}
          />
        </FormROw>

        <FormROw error={errors?.image?.message} label="Cabin photo">
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
          <Button
            $variation="secondary"
            type="reset"
            onClick={() => {
              onCloseModal?.();
            }}
          >
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
