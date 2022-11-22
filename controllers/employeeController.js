const mongoose = require('mongoose')
const Employee = require('../models/employee')

const service = require('../services')

function signUp(req, res) {
    const employee = new Employee({
        employeeName: req.body.name,
        employeeSurname: req.body.surname,
        dni: req.body.dni,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
        genre: req.body.genre,
        contractDate: req.body.contractDate,
        contractType: req.body.contractType,
        employment: req.body.employment,
        phoneExtension: req.body.phoneExtension,
        employeeImage: req.body.employeeImage,
        accesLevel: req.body.accesLevel,
        bankAccount: req.body.bankAccount,
        reparations: req.body.reparations
    })

    try {
        employee.save((err) => {

            if (err) {
                res.status(500).send({ message: `There has been an error creating the new employee: ${err}` })

            } else (
                res.status(200).send({
                    message: `The employees ${employee.dni}, has been created`,
                    token: service.createToken(employee)
                })
            )
        })

    } catch (error) {
        res.status(500).send({ message: `There has been an error creating the new employee: ${error}` })

    }
}

function signIn(req, res) {

    try {
        Employee.find(
            {
                dni: req.body.dni,
                password: req.body.password
            },
            ((err, employee) => {

                if (err) {
                    res.status(500).send({ message: err })

                } else if (!employee) {
                    res.status(404).send({ message: 'The emplooyee does not exist' })

                } else {
                    req.employee = employee
                    res.status(200).send({
                        message: 'You have been logged succesfully',
                        token: service.createToken(employee)
                    })
                }
            })
        )

    } catch (error) {
        res.status(500).send({ message: error })
    }
}

function getEmployees(req, res) {
    Employee.find({}, (err, employees) => {
        if (err) {
            res.status(500).send({ message: `There has been an error getting the employees: ${err}` })

        } else {
            if (employees.length == 0) {
                return res.status(404).send({ message: `There is not any employee` })
            } else {
                res.status(200).send({ employees })
            }
        }
    }).populate(
        { path: 'reparations', model: 'ReparationData' }
    )
}

function getEmployeesByAge(req, res) {
    Employee.find({ age: { $gte: 45 } }, (err, employees) => {
        if (err) {
            res.status(500).send({ message: `There has been an error getting the employees: ${err}` })

        } else {
            if (employees.length == 0) {
                return res.status(404).send({ message: `There is not any employee` })
            } else {
                res.status(200).send({ employees })
            }
        }
    })
}

function updateEmployee(req, res) {
    let employeeId = req.params.employeeId
    let update = req.body

    Employee.findByIdAndUpdate(employeeId, update, (err, employeeUpdated) => {
        if (err) {
            res.status(500).send({ message: `Error updating the employee data: ${err}` })

        } else {
            res.status(200).send({ employee: employeeUpdated })
        }
    })
}

function deleteEmployee(req, res) {
    let employeeId = req.params.employeeId

    Employee.findById(employeeId, (err, employee) => {

        if (err) {
            res.status(500).send({ message: `There has been an error removing the employee: ${err}` })
        } else {
            employee.remove(err => {
                if (err) res.status(500).send({ message: `There has been an error removing the employee: ${err}` })
                res.status(200).send({ message: `${employee.name} has been removed` })
            })
        }
    })
}

module.exports = {
    signUp,
    signIn,
    getEmployees,
    updateEmployee,
    deleteEmployee,
    getEmployeesByAge
}