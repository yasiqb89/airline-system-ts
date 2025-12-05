import { askQuestion } from "./io.js";
import { bookSeatCli, cancelBookingCli, listBookingsCli, bookingSummaryByPassengerCli, bookingSummaryByFlightCli } from "./cliHelper.js";


export async function showBookingMenu(): Promise<void> {

    let exit = false;

    while (!exit) {
        console.log("\n==- BOOKING MENU -==");

        console.log("Please select an option:");
        console.log("1. Book a seat");
        console.log("2. Cancel a booking");
        console.log("3. List all bookings");
        console.log("4. Booking summary by passenger");
        console.log("5. Booking summary by flight");
        console.log("6. Back to main menu");
        console.log("================");

        const choice = (await askQuestion("Enter your choice: ")).trim();

        switch (choice) {
            case "1":
                await bookSeatCli();
                break;
            case "2":
                await cancelBookingCli();
                break;
            case "3":
                await listBookingsCli();
                break;
            case "4":
                await bookingSummaryByPassengerCli();
                break;
            case "5":
                await bookingSummaryByFlightCli();
                break;
            case "6":
                exit = true;
                break;
            default:
                console.log("Invalid choice");
                break;
        }
    }
}

