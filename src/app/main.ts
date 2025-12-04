import { askQuestion, clearScreen, closeInput } from "./io.js";
import { showPassengerMenu } from "./passengerMenu.js";
import { showFlightMenu } from "./flightMenu.js";
import { showBookingMenu } from "./bookingMenu.js";

export async function main() {
    let exit = false;

    while (!exit) {
        clearScreen();
        console.log("\n==- MENU -==");
        console.log("Please select an option:");
        console.log("1. Manage Passengers");
        console.log("2. Manage Flights");
        console.log("3. Manage Bookings");
        console.log("4. Exit");
        console.log("================");

        const choice = (await askQuestion("Enter your choice: ")).trim();

        switch (choice) {
            case "1":
                await showPassengerMenu();
                break;
            case "2":
                await showFlightMenu();
                break;
            case "3":
                await showBookingMenu();
                break;
            case "4":
                closeInput();
                exit = true;
                break;
            default:
                console.log("Invalid choice");
                break;
        }
    }
    closeInput();
    console.log("Goodbye!");
}

main();