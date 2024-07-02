# Bookerie
Bookerie is an online bookstore application that allows customers to browse and purchase books, while administrators can manage books, delivery partners, supplies, and complete orders. The backend is built using FastAPI with SQLite, and the frontend is developed using React.js.

## Table of Contents
- Features
- Demo
- Installation
- Usage
- API Endpoints
- Technologies Used
- Contributing
- License
- Contact


## Features
- Admin and customer authentication
- Admin can add books, delivery partners, supplies, and complete orders
- Customers can add books to their cart and place orders


## Installation

### Prerequisites
- Python 3.7+
- Node.js
- npm
- Backend Setup
- Clone the repository:

sh
- git clone https://github.com/yourusername/Bookerie.git
- cd Bookerie/backend
- Create and activate a virtual environment:

sh
- python -m venv venv
- source venv/bin/activate   # On Windows use `venv\Scripts\activate`
- Install the required packages:

sh
- pip install -r requirements.txt
- Set up the SQLite database:

sh
- python setup_database.py  # Make sure this script sets up your readit.db database
- Run the FastAPI server:

sh
- uvicorn main:app --reload
- Frontend Setup
- Navigate to the frontend directory:

sh
- cd ../frontend
- Install the required packages:

sh
- npm install
- Start the React development server:

sh
- npm start
- Usage
- Open your browser and navigate to http://localhost:3000.
- Admins can log in to manage books, delivery partners, supplies, and complete orders.
- Customers can browse books, add them to their cart, and place orders.


### Technologies Used
- Backend: FastAPI, SQLite
- Frontend: React.js, HTML, CSS, JavaScript
- Middleware: CORSMiddleware

## Contributing
Contributions are welcome! Please follow these steps to contribute:

- Fork the repository.
- Create a new branch:
sh
- git checkout -b feature/your-feature-name
- Make your changes.
- Commit your changes:
sh
- git commit -m 'Add some feature'
- Push to the branch:
sh
- git push origin feature/your-feature-name
- Open a pull request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
Bhaskar - bhaskarkashyap1612@gmail.com

## Project Link: https://github.com/Bhaskar1612/Bookerie
