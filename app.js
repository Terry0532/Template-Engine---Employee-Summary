const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

class EmployeeInfo {
    //array to store employee info and object of current emloyee that user is adding
    constructor() {
        this.employees = [];
        this.currentEmployee = {
            name: "",
            id: "",
            email: "",
        }
    }
    //get all the basic employee info from user
    addEmployee() {
        inquirer.prompt([
            {
                type: "input",
                message: "Name?",
                name: "name"
            }, {
                type: "input",
                message: "ID?",
                name: "id"
            }, {
                type: "input",
                message: "Email?",
                name: "email"
            }, {
                type: "list",
                message: "Employee role?",
                name: "role",
                choices: ["Manager", "Engineer", "Intern"]
            }
        ]).then(response => {
            //store all the basic info to currentEmployee object
            this.currentEmployee.name = response.name;
            this.currentEmployee.id = response.id;
            this.currentEmployee.email = response.email;
            //according to the role add more info
            switch (response.role) {
                case "Manager":
                    this.addManagerInfo();
                    break;
                case "Engineer":
                    this.addEngineerInfo();
                    break;
                case "Intern":
                    this.addInternInfo();
            }
        })
    }
    //add specific info for employee and push all info to employees array
    //then ask the user if they want to continue
    addManagerInfo() {
        inquirer.prompt([
            {
                type: "input",
                message: "Office number?",
                name: "officeNumber"
            }
        ]).then(response => {
            const manager = new Manager(this.currentEmployee.name, this.currentEmployee.id, this.currentEmployee.email, response.officeNumber);
            this.employees.push(manager);
            this.askToContinue();
        });
    }
    addEngineerInfo() {
        inquirer.prompt([
            {
                type: "input",
                message: "GitHub username?",
                name: "github"
            }
        ]).then(response => {
            const engineer = new Engineer(this.currentEmployee.name, this.currentEmployee.id, this.currentEmployee.email, response.github);
            this.employees.push(engineer);
            this.askToContinue();
        });
    }
    addInternInfo() {
        inquirer.prompt([
            {
                type: "input",
                message: "School?",
                name: "school"
            }
        ]).then(response => {
            const intern = new Intern(this.currentEmployee.name, this.currentEmployee.id, this.currentEmployee.email, response.school);
            this.employees.push(intern);
            this.askToContinue();
        });
    }

    askToContinue() {
        inquirer.prompt([
            {
                type: "confirm",
                message: "Continue?",
                name: "confirm"
            }
        ]).then(response => {
            if (response.confirm) {
                this.addEmployee();
            } else {
                this.quit();
            }
        })
    }

    render(path, data) {
        fs.writeFileSync(path, data, (error) => {
            if (error) throw error;
        });
    }

    quit() {
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR);
            this.render(outputPath, render(this.employees));
        } else {
            this.render(outputPath, render(this.employees));
        }
        console.log("Done.");
        process.exit(0);
    }
}

const addEmployee = new EmployeeInfo();
addEmployee.addEmployee();

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```