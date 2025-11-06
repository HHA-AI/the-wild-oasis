import styled from "styled-components";
import BookingDataBox from "../../features/bookings/BookingDataBox";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import useBooking from "../bookings/useBooking";
import Spinner from "../../ui/Spinner";
import Checkbox from "../../ui/Checkbox";
import { useEffect, useState } from "react";
import { useCheckin } from "./useCheckin";
import { formatCurrency } from "../../utils/helpers";
import useSettings from "../settings/useSettings";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const moveBack = useMoveBack();
  const [confirmPaid, setConfirmPaid] = useState(false);
  const [addBreakfast, setAddBreakfast] = useState(false);
  const { booking, isLoading } = useBooking();
  const { isCheckingin, checkin } = useCheckin();
  const { settings, isPending: isLoadingSetting } = useSettings();

  useEffect(() => setConfirmPaid(booking?.isPaid), [booking]);

  if (isLoading || isCheckingin || isLoadingSetting) return <Spinner />;

  const {
    id: bookingId,
    numGuests,
    cabinPrice,
    extrasPrice,
    totalPrice,
    status,
    hasBreakfast,
    isPaid,
    numNights,
    guests,
  } = booking;
  const optionalBreakfastPrice =
    settings.breakfastPrice * numGuests * numNights;
  function handlerAddBreakfast() {
    setAddBreakfast((add) => !add);
    setConfirmPaid(false);
  }
  function handleCheckin() {
    if (!confirmPaid) return;
    if (addBreakfast) {
      checkin({
        bookingId,
        breakfast: {
          extrasPrice: optionalBreakfastPrice,
          totalPrice: cabinPrice + extrasPrice,
          hasBreakfast: true,
        },
      });
    } else checkin({ bookingId });
  }
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />
      {!hasBreakfast && (
        <Box>
          <Checkbox
            checked={addBreakfast}
            onChange={handlerAddBreakfast}
            disabled={isCheckingin}
            id="breakfast"
          >
            Add breakfast
          </Checkbox>
        </Box>
      )}

      <Box>
        <Checkbox
          checked={confirmPaid}
          onChange={() => setConfirmPaid((confirmPaid) => !confirmPaid)}
          disabled={
            (!addBreakfast && isPaid) || status === "checked-in" || isCheckingin
          }
          id="confirm"
        >
          I confirm that {guests.fullName} has paid the total price{" "}
          {addBreakfast
            ? `${formatCurrency(
                totalPrice + optionalBreakfastPrice
              )} ( ${formatCurrency(totalPrice)} + ${formatCurrency(
                optionalBreakfastPrice
              )} )`
            : formatCurrency(totalPrice)}
        </Checkbox>
      </Box>

      <ButtonGroup>
        <Button
          onClick={handleCheckin}
          disabled={!confirmPaid || status !== "unconfirmed" || isCheckingin}
        >
          Check in booking #{bookingId}
        </Button>
        <Button $variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
