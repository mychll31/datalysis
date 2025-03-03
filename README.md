🛠 Prerequisites

Make sure you have the following installed:

Node.js (v16 or above) - Download here

npm (comes with Node.js) - Check by running:

npm -v

Python (for the Django backend) - Download here

pip (Python package manager) - Check by running:

pip -V

📥 1. Clone the Repository

git clone <your-repository-url>
cd <repository-name>

📦 2. Install Frontend Dependencies (React)

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

🐍 3. Install Backend Dependencies (Django)

Run this command in the backend directory:

pip install -r requirements.txt

This will install all the Python packages listed in requirements.txt.

🚀 4. Run the Project

Start Django Backend

python manage.py runserver

Start React Frontend

npm run dev

📚 Additional Notes

Ensure the Django server URL matches the Axios endpoints in React.

Use .env files for managing API keys and secrets.