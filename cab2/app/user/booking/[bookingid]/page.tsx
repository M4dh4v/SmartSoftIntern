

export default async function Booking ({params} : {params: Promise<{bookingid : string}>}){
    const {bookingid}= await params
    return(
        <>

        <p>
        booking with id {bookingid}
        </p>
        </>
    )
}