import dotenv from 'dotenv';

dotenv.config();

// Mock identity service based on Northwind employees

// Wire up middleware
export async function initializeIdentityService(app) {

    // console.log ("initialized IS");
    // Web service validates a user login
    app.post('/api/validateEmployeeLogin', async (req, res) => {
        try {
            const username = req.body.username;
            const password = req.body.password;
            const employeeId = await validateEmployeeLogin(username, password);
            res.send(JSON.stringify({ "employeeId": employeeId }));
        }
        catch (error) {
            console.log(`Error in /api/validateEmployeeLogin handling: ${error}`);
            res.status(500).json({ status: 500, statusText: error });
        }

    });

    // Middleware to validate all other API requests
    app.use('/api/', validateApiRequest);

}

async function validateApiRequest(req, res, next) {
    try {
    //     if (req.cookies.employeeId && parseInt(req.cookies.employeeId) > 0) {
            console.log(`Validated authentication on /api${req.path}`);
            next();
    //     } else {
    //         console.log(`Invalid authentication on /api${req.path}`);
    //         res.status(401).json({ status: 401, statusText: "Access denied" });
        }
    // }
    catch (error) {
        res.status(401).json({ status: 401, statusText: error });
    }
}

async function validateEmployeeLogin(username, password) {

    // Trim the username and capitalize the first letter only
    let lastName = username.trim();
    lastName = lastName.substring(0, 1).toUpperCase() +
        lastName.substring(1).toLowerCase();

    // This is so insecure! We just throw away the password and the username
    // is the last name of any employee. The "token" will be the employee ID.
    // const employee = await getEmployeeByLastName(lastName);
    const employee = 'fuller';
    if (employee) {
        return 1;
    } else {
        return 1;
    }
}

