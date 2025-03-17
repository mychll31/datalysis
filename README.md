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

npm install

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

npm run dev
