import { askQuestion } from "./io.js";
import {
    getAllPassengers,
    getPassengerById,
    addPassenger,
} from "../services/PassengerServices.js";
import { AddNewPassengerCli, getAllPassengersCli, getPassengerByIdCli, removePassengerCli, updatePassengerCli } from "./cliHelper.js";


export async function showPassengerMenu(): Promise<void> {
    let exit: boolean = false;
    while (!exit) {
        console.log("\n==- PASSENGER MENU -==");
        console.log("Please select an option:");
        console.log("1. List all passengers");
        console.log("2. Add a new passenger");
        console.log("3. Get passenger by id");
        console.log("4. Update passenger");
        console.log("5. Remove passenger");
        console.log("6. Back to main menu");
        console.log("================");

        const choice = await askQuestion("Enter your choice: ");

        switch (choice) {
            case "1":
                await getAllPassengersCli();
                break;
            case "2":
                await AddNewPassengerCli();
                break;
            case "3":
                await getPassengerByIdCli();
                break;
            case "4":
                await updatePassengerCli();
                break;
            case "5":
                await removePassengerCli();
                break;
            case "6":
                exit = true;
                break;
            default:
                console.log("Invalid choice, try again");
        }
    }
}

