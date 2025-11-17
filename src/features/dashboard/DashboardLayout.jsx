import styled from "styled-components";
import { useRecentBookings } from "./useRecentBookings";
import { useRecentStays } from "./useRecentStays";
import Stats from "./Stats";
import Spinner from "../../ui/Spinner";
import { useCabins } from "../cabins/useCabins";
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";
import TodayActivity from "../check-in-out/TodayActivity";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  /* grid-template-rows: auto 34rem auto; */
  grid-template-rows: auto;
  gap: 2.4rem;
`;
function DashboardLayout() {
  const { isLoading: isLoadingBoookings, bookings } = useRecentBookings();
  const {
    isLoading: isLoadingStays,
    stays: confirmedStays,
    numDays,
  } = useRecentStays();
  const { cabins, isLoading: isLoadingCabins } = useCabins();

  if (isLoadingBoookings || isLoadingStays || isLoadingCabins)
    return <Spinner />;
  return (
    <StyledDashboardLayout>
      <Stats
        bookings={bookings}
        confirmedStays={confirmedStays}
        numDays={numDays}
        canbinCount={cabins.length}
      />
      <SalesChart numDays={numDays} bookings={bookings} />
      <TodayActivity />
      <DurationChart confirmedStays={confirmedStays} />
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
