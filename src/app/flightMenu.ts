import { askQuestion } from "./io.js";
import { getFlightByIdCli, addFlightCli, updateFlightCli, removeFlightCli, getAllFlightsCli } from "./cliHelper.js";


export async function showFlightMenu(): Promise<void> {
    let exit = false;
    while (!exit) {
        console.log("\n==- FLIGHT MENU -==");
        console.log("Please select an option:");
        console.log("1. Get all flights");
        console.log("2. Get flight by id");
        console.log("3. Add flight");
        console.log("4. Update flight");
        console.log("5. Remove flight");
        console.log("6. Back to main menu");
        console.log("================");

        const choice = (await askQuestion("Enter your choice: ")).trim();

        switch (choice) {
            case "1":
                await getAllFlightsCli();
                break;
            case "2":
                await getFlightByIdCli();
                break;
            case "3":
                await addFlightCli();
                break;
            case "4":
                await updateFlightCli();
                break;
            case "5":
                await removeFlightCli();
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

