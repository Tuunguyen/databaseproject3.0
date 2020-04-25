Project Management Database Demo

Constructed by Team 12 for class COSC 3380 in spring 2020

Overview:
		This project is a database setup for any company that would like to keep track of the workflow of their
	projects. The database can track Projects, Tasks, Meetings, and Transactions company wide.
	
How to run locally:

	1. Navigate to the folder where you have saved the project in your Command Prompt (cd file_path)
	2. Do command "npm install" and wait for all of the files to download.
	3. Turn on the server with command "node server.js".
	4. Open a web browser and go to "localhost:4000".
	
How to run hosted website:
	1. Open "https://team12.azurewebsites.net/" in a web browser
	
Sample Logins:
	Admin:
		Username - "12345@uh.edu"
		Password - "1234567Jotaro"
		
		Username - "otonashi@gmail.com"
		Password - "814034Otonashi"
		
	Project Lead: 
		Username - "Dio@uh.edu"
		Password - "1444155Dio"
		
		Username - "Johnathan@uh.edu"
		Password - "9876543Johnathan"
		
	Employee: 
		Username - "Hol@uh.edu"
		Password - "9998855Hol"
		
		Username - "jenna@jennaswebsite.com"
		Password - "8675309Jenna"
		
Navigation:
	Home Page:
		General employees will have the following on their home page in the side bar:
			Projects - Shows the projects that the employee is currently listed on 
			Profile - Employees can check that their info in the system is correct and they can also change 
				their password and email.
			Due Today - Shows all of the tasks assigned to them that are due today.
			Meetings - Shows all meetings and future meetings for the employee.
		Project Leads get an additional page:
			Finances - Observe and make transactions on projects they are assigned to.
		Admins get all of the above plus these:
			Account Creation - A quick link to adding a new employee.
			Admin View - A report of all employees, projects, and departments in the database. All things 
				listed can have new additions, be edited, or deleted.
			Reports - A tab where one can generate reports for projects or transactions between dates picked
				out by the user.
	
	Project Page:
		One can navigate to the projects page when it is clicked on by a user. This takes you to a project home 
		page where one can see and interact with in more detail. It is not user type restriced, so all of
		the following are able to be seen with any account.
			Task View: See tasks organized by their status in the project. Click on one to open/edit details of 
				said task.
			Add New Task: Add a new task to the project.
			Organize a Meeting: Add a new meeting for the current project.
			Meeting Log: View previous meetings and future ones for crrent project.
			
Important Files: 
	server.js: Javascript that handles the API to connect our Azure Database to our front end html.
	Dump20200424.sql: Database Dump file.
	views/home.ejs: Where the html for the home page is stored.
	public/index.html: Where the html for the login page is stored.
	views/register.ejs: Where the html for the Account Creation page is stored.
	public/project.html: Where the html for the project page is stored.
	public/js/setup.js: Where the javascript for all of the pages is stored.
	public/css/stylesheet.js: Where the css for all of the pages are stored.
	
	
	The rest are either for GitHub, Node.js, or unused/older files not in use.