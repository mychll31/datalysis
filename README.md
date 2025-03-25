🛠 Prerequisites

Make sure you have the following installed:

Node.js (v16 or above)

npm (comes with Node.js) 

npm -v

Python (for the Django backend) 

pip (Python package manager) - Check by running:

pip -V

📦 1. Install Frontend Dependencies (React)

Run the following command inside the frontend directory:

yarn install

This will install all packages listed in package.json, including:

axios

datatables.net-dt

datatables.net-react

papaparse

react

tailwindcss

vite

🐍 2. Install Backend Dependencies (Django)

Run this command in the backend directory:

pip install -r requirements.txt

This will install all the Python packages listed in requirements.txt.

🚀 3. Run the Project

Start Django Backend

python manage.py runserver

Start React Frontend

yarn start

#Setting Up with .env file NOTE: Do not commit the .env file, secret lang dapat kasi astig tayo
Step 1 : Navigate to the Datalysis/Backend directory
Step 2:Create a new file called .env in this directory
Step 3: Copy the env.example content, replace the placeholder values 

if you will error saying about utc-8 or something like this 'utf-8' codec can't decode byte 0xff in position 0'
Step 1. Create a new file running code . or ctrl+ n in the same directory 
Step 2. Paste the following code in the env.example file and save it as .env as name and no extension if asking..

this should duplicate the .env.example file make sure to edit the .env file with your own secret key and other settings
basta gumagana 'to sa end ko...

check if you have this
#python-dotenv file

run this if no package found:
#pip install python-dotenv   




