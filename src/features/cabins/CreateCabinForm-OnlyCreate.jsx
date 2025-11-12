import styled from "styled-components";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import { useForm } from "react-hook-form";
import { createCabin } from "../../services/apiCabins";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CreateCabinFormRow from "./CreateCabinFormRow";
import { useState } from "react";

const FormRow = styled.div`
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
const Label = styled.label`
  font-weight: 500;
`;

function CreateCabinForm() {
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, getValues, formState } = useForm();
  const { errors } = formState;

  const { mutate, isPending: isCreating } = useMutation({
    mutationFn: createCabin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
      reset();
    },
  });

  function onSubmit(data) {
    console.log(data);
    // 将数据库中的名称和上传的数据对应
    mutate({ ...data, image: data.image[0] });
  }

  function onError(error) {
    console.log(error);
  }

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <CreateCabinFormRow error={errors?.name?.message} label="Cabin name">
          <Input
            type="text"
            id="name"
            disabled={isCreating}
            {...register("name", { required: "This field is required" })}
          />
        </CreateCabinFormRow>
        <CreateCabinFormRow
          error={errors?.maxCapacity?.message}
          label="Maximum capacity"
        >
          <Input
            type="number"
            id="maxCapacity"
            disabled={isCreating}
            {...register("maxCapacity", {
              required: "This field is required",
              min: { value: 1, message: "least capacity one person" },
            })}
          />
        </CreateCabinFormRow>

        <CreateCabinFormRow
          error={errors?.regularPrice?.message}
          label="Regular price"
        >
          <Input
            type="number"
            id="regularPrice"
            disabled={isCreating}
            {...register("regularPrice", {
              required: "This field is required",
              message: "price should greater than 1",
            })}
          />
        </CreateCabinFormRow>

        <CreateCabinFormRow error={errors?.discount?.message} label="Discount">
          <Input
            type="number"
            id="discount"
            disabled={isCreating}
            defaultValue={0}
            {...register("discount", {
              required: "This field is required",
              validate: (value) =>
                Number(value) <= Number(getValues().regularPrice) ||
                "discount should be less than regular price",
            })}
          />
        </CreateCabinFormRow>

        <CreateCabinFormRow
          error={errors?.description?.message}
          label="Description for website"
        >
          <Textarea
            type="number"
            id="description"
            disabled={isCreating}
            defaultValue=""
            {...register("description", { required: "This field is required" })}
          />
        </CreateCabinFormRow>

        <FormRow>
          <Label htmlFor="image">Cabin photo</Label>

          {/* 将文件上传到supabase：
        1. type=file  应该本身包含在FileIput组件内部，封装成上传file的input组件
        2. register*/}
          <FileInput
            id="image"
            accept="image/*"
            {...register("image", { required: "This field is required" })}
          />
        </FormRow>

        <FormRow>
          {/* type is an HTML attribute! */}
          <Button $variation="secondary" type="reset">
            Cancel
          </Button>
          {/* 创建时禁用button */}
          <Button disabled={isCreating}>Edit cabin</Button>
        </FormRow>
      </Form>
    </>
  );
}

export default CreateCabinForm;
