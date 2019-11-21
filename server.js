var express = require("express");
var app = express();

app.use(express.static("public"));

app.set("views", "views");
app.set("view engine", "ejs");

app.get("/", (request, response) => response.render('package'));

app.get("/getRate", calculateRate);

function calculateRate(request, response) {
    // Setup variables
    var packageWeight = Number(request.query.weight);
    var packageType = request.query.packageType;
    var packageCost = 0;
    var errorMess;
    var check = true;


    // Calculate postage cost depending on type of package
    // Loops so it can move up in package type on a higher weight
    while (check) {
        switch (packageType) {
            case "stamped letter":
                if (packageWeight > 3.5) {
                    packageType = "large envelope"

                    // Creates an error message
                    errorMess = "Your stamped letter weighs too much (> 3.5 oz) and will be treated as a large envelope.";
                } else {
                    // Base rate is $0.55 and then it adds $0.15 for every additional ounce
                    packageCost = 0.55 + ((Math.ceil(packageWeight) - 1) * 0.15);

                    

                    check = false; // exit loop
                }
                break;
            case "metered letter":
                if (packageWeight > 3.5) {
                    packageType = "large envelope"

                    // Creates an error message
                    errorMess = "Your metered letter weighs too much (> 3.5 oz) and will be treated as a large envelope.";
                } else {
                    // Base rate is $0.50 and then it adds $0.15 for every additional ounce
                    packageCost = 0.50 + ((Math.ceil(packageWeight) - 1) * 0.15);

                    

                    check = false; // exit loop
                }
                break;
            case "large envelope":
                // Base rate is $1.00 and then it adds $0.15 for every additional ounce
                packageCost = 1.00 + ((Math.ceil(packageWeight) - 1) * 0.15);

                check = false; // exit loop

                break;
            case "first-class package":
                // Only 4 rates and nothing available over 13 ounces in this catagory
                // No pattern to package costs based on increase in ounces like other catagories
                if (packageWeight > 13) {
                    packageCost = 0;
                    // Generates an error message
                    errorMess = "Weights over 13 oz are not allowed in this catagory and other shipping options must be explored.";

                    packageType = "overweight first-class package"
                } else if (packageWeight <= 4) {
                    packageCost = 3.66;
                } else if (packageWeight <= 8) {
                    packageCost = 4.39;
                } else if (packageWeight <= 12) {
                    packageCost = 5.19;
                } else {
                    packageCost = 5.17;
                }

                check = false; // exit loop
                break;
            default:
                packageCost = -1;
                errorMess = "Something went horribly wrong!"
                check = false; // exit loop
                break;
        }
    }

    // Changes the cost to show only two digits
    renderedCost = packageCost.toLocaleString(undefined, { minimumFractionDigits: 2 });

    // Setup parameters to be passed to the ejs file
    var param = { weight: packageWeight, type: packageType, cost: renderedCost, errorM: errorMess };

    // Call ejs file and send it specified parameters
    response.render("getRate", param);
}

app.listen(5000, function () {
    console.log("The server is up and listening on port 5000")
});