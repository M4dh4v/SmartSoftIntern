import WaitingForCabPage from "@/components/waitingUser";

interface Props {
  params: {
    bookingId: string;
  };
}

export default function Page({ params }: Props) {
  // console.log(params.bookingId)
  return <WaitingForCabPage bookingId={params.bookingId} />;
}
