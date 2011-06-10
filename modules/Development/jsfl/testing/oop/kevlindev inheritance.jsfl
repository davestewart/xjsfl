/**
 * inheritance
 * 
 * @author Kevin Lindsey
 * @version 1.0
 * 
 * copyright 2006, Kevin Lindsey
 * 
 */

// namespace placeholder
KevLinDev = {};

/**
 * A function used to extend one class with another
 * 
 * @param {Object} subClass
 * 		The inheriting class, or subclass
 * @param {Object} baseClass
 * 		The class from which to inherit
 */
KevLinDev.extend = function(subClass, baseClass) {
   function inheritance() {}
   inheritance.prototype = baseClass.prototype;

   subClass.prototype = new inheritance();
   subClass.prototype.constructor = subClass;
   subClass.baseConstructor = baseClass;
   subClass.superClass = baseClass.prototype;
}

/*
 * Person class
 */

/**
 * Person constructor
 * 
 * @param {String} first
 * 		The person's first name
 * @param {String} last
 * 		The person's last name
 */
function Person(first, last) {
	this.first = first;
	this.last = last;
}

/**
 * Create a string representation of this object
 * 
 * @return {String} A string representation of this object
 */
Person.prototype.toString = function() {
	return this.first + " " + this.last;
};

/*
 * Employee class
 */

/**
 * Employee constructor
 * 
 * @param {String} first
 * 		The employee's first name
 * @param {String} last
 * 		The employee's last name
 * @param {Number} id
 * 		The employee's number
 */
function Employee(first, last, id) {
	Employee.baseConstructor.call(this, first, last);
	this.id = id;
}

// subclass Person
KevLinDev.extend(Employee, Person);

/**
 * Create a string representation of this object
 * 
 * @return {String} A string representation of this object
 */
Employee.prototype.toString = function() {
	return Employee.superClass.toString.call(this) + ": " + this.id;
};

/*
 * Manager
 */

/**
 * Manager constructor
 * 
 * @param {String} first
 * 		The manager's first name
 * @param {String} last
 * 		The manager's last name
 * @param {Number} id
 * 		The manager's employee number
 * @param {String} department
 * 		This manager's department
 */
function Manager(first, last, id, department) {
	Manager.baseConstructor.call(this, first, last, id);
	this.department = department;
}

// subclass Employee
KevLinDev.extend(Manager, Employee);

/**
 * Create a string representation of this object
 * 
 * @return {String} A string representation of this object
 */
Manager.prototype.toString = function() {
	return Manager.superClass.toString.call(this) + ": " + this.department;
};


xjsfl.init(this);

// create objects
var person = new Person("John", "Dough");
var employee = new Employee("Bill", "Joi", 10);
var manager = new Manager("Bob", "Bark", 20, "Accounting");

// show values
fl.trace(person);
fl.trace(employee);
fl.trace(manager);



trace(xjsfl.utils.getClass(person))
trace(xjsfl.utils.getClass(employee))
trace(xjsfl.utils.getClass(manager))