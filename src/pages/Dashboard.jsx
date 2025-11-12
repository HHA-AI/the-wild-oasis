import { useQueryClient } from "@tanstack/react-query";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import { getBookings } from "../services/apiBookings";
import { getCabins } from "../services/apiCabins";
// import { getSettings } from "../services/apiSettings";

function Dashboard() {
  // 预获取bookings、cabins、settings
  const queryClient = useQueryClient();
  queryClient.prefetchQuery({
    queryKey: [
      "bookings",
      null,
      { direction: "desc", sortField: "startDate" },
      1,
    ],
    queryFn: () => getBookings({ page: 1 }),
  });
  queryClient.prefetchQuery({ queryKey: ["cabins"], queryFn: getCabins });
  // queryClient.prefetchQuery({
  //   queryKey: ["settings"],
  //   queryFn: getSettings,
  // });
  return (
    <Row type="horizontal">
      <Heading as="h1">Dashboard</Heading>
      <p>TEST</p>
    </Row>
  );
}

export default Dashboard;
