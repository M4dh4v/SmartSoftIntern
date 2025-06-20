import fs from "fs";
import Papa from "papaparse";


export default function distance(loc1:string, loc2:string )
{
    const locations = [
    { location: "Hitec City", pincode: "500081" },
    { location: "Gachibowli", pincode: "500032" },
    { location: "Nanakramguda", pincode: "500032" },
    { location: "Ameerpet", pincode: "500038" },
    { location: "Panjagutta", pincode: "500082" },
    { location: "Begumpet", pincode: "500016" },
    { location: "Sanath Nagar", pincode: "500018" },
    { location: "Rasoolpura", pincode: "500003" },
    { location: "Prakash Nagar", pincode: "500016" },
    { location: "RTC X Roads", pincode: "500020" },
    { location: "Secunderabad", pincode: "500007" },
    { location: "Chikkadpally", pincode: "500020" },
    { location: "Irrum Manzil", pincode: "500004" },
    { location: "Miyapur", pincode: "500049" },
    { location: "Kukatpally", pincode: "500072" },
    { location: "Nampally", pincode: "500001" },
    { location: "Narayanaguda", pincode: "500029" },
    { location: "Parade Ground", pincode: "500003" },
    { location: "Malakpet", pincode: "500036" },
    { location: "Dilsukhnagar", pincode: "500060" },
    { location: "L B Nagar", pincode: "500074" },
    { location: "Nagole", pincode: "500035" },
    { location: "Uppal", pincode: "500051" },
    { location: "Madhapur", pincode: "500081" },
    { location: "KPHB", pincode: "500072" },
    ];

    // Function 1: Get pincode from location
    function getPincodeFromLocation(location: string) {
    const match = locations.find((loc) => loc.location.toLowerCase() === location.toLowerCase());
    return match?.pincode;
    }

    // Function 2: Get index from pincode
    function getIndexFromPincode(pincode: string): number {
    return locations.findIndex((loc) => loc.pincode === pincode);
    }

    
    const l1 = getIndexFromPincode(getPincodeFromLocation(loc1) ?? "");
    const l2 = getIndexFromPincode(getPincodeFromLocation(loc2) ?? "");


    const file = fs.readFileSync("locations.csv", "utf8");

    const result : any = Papa.parse(file, {
    header: false,
    dynamicTyping: true,
    }); 


    return(result.data[l1][l2]);

}
