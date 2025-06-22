'use client'
import fs from "fs";
import Papa from "papaparse";
import locationsList from "./locationsList";


export async function distance(loc1:string, loc2:string )
{
    const locations=locationsList()

    // Function 1: Get pincode from location
    function getPincodeFromLocation(location: string) {
    const match = locations.find((loc) => loc.location.toLowerCase() === location.toLowerCase());
    return match?.pincode;
    }

    // Function 2: Get index from pincode
    function getIndexFromPincode(pincode: string): number {
    return locations.findIndex((loc) => loc.pincode === pincode);
    }

    const l1 = getIndexFromPincode(loc1.toString());
    const l2 = getIndexFromPincode((loc2).toString());


     const response = await fetch("/locations.csv");
    const csvText = await response.text();
  // Parse CSV
  const result: any = Papa.parse(csvText, {
    header: false,
    dynamicTyping: true,
  });
  console.log('1',l1,'\tl2:',l2,loc2,'\t',result)

    return(result.data[l1][l2]);

}
