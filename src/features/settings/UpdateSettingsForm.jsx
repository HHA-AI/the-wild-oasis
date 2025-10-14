import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";
import useSettings from "./useSettings";
import { useUpdateSetting } from "./useUpdateSetting";

function UpdateSettingsForm() {
  // 初次渲染时，useSettings未返回，settings为undefined，解构会报错，设置默认值
  const { settings = {}, isPending } = useSettings();
  const {
    minBookingLength,
    maxBookingLength,
    maxGuestsPersons,
    breakfastPrice,
  } = settings;
  const { updateSetting, isUpdatingSetting } = useUpdateSetting();
  if (isPending) return <Spinner />;

  function handleUpdate(e, field) {
    const value = e.target.value;
    updateSetting({ [field]: value });
  }
  return (
    <Form>
      <FormRow labelName="Minimum nights/booking">
        <Input
          type="number"
          id="min-nights"
          disabled={isUpdatingSetting}
          defaultValue={minBookingLength}
          onBlur={(e) => handleUpdate(e, "minBookingLength")}
        />
      </FormRow>
      <FormRow labelName="Maximum nights/booking">
        <Input
          type="number"
          id="max-nights"
          disabled={isUpdatingSetting}
          defaultValue={maxBookingLength}
        />
      </FormRow>
      <FormRow labelName="Maximum guests/booking">
        <Input
          type="number"
          id="max-guests"
          disabled={isUpdatingSetting}
          defaultValue={maxGuestsPersons}
        />
      </FormRow>
      <FormRow labelName="Breakfast price">
        <Input
          type="number"
          id="breakfast-price"
          disabled={isUpdatingSetting}
          defaultValue={breakfastPrice}
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
