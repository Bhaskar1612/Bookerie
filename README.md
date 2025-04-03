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

### Backend Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/Bookerie.git
   cd Bookerie/backend
   ```

2. Create and activate a virtual environment:
   ```sh
   python -m venv venv
   source venv/bin/activate   # On Windows use `venv\Scripts\activate`
   ```

3. Install the required packages:
   ```sh
   pip install -r requirements.txt
   ```

4. Set up the SQLite database:
   ```sh
   python setup_database.py  # Make sure this script sets up your readit.db database
   ```

5. Run the FastAPI server:
   ```sh
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```sh
   cd ../frontend
   ```

2. Install the required packages:
   ```sh
   npm install
   ```

3. Start the React development server:
   ```sh
   npm start
   ```

### Usage
- Open your browser and navigate to `http://localhost:3000`.
- Admins can log in to manage books, delivery partners, supplies, and complete orders.
- Customers can browse books, add them to their cart, and place orders.

### Technologies Used
- Backend: FastAPI, SQLite
- Frontend: React.js, HTML, CSS, JavaScript
- Middleware: CORSMiddleware

## Contributing
Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:
   ```sh
   git checkout -b feature/your-feature-name
   ```
3. Make your changes.
4. Commit your changes:
   ```sh
   git commit -m 'Add some feature'
   ```
5. Push to the branch:
   ```sh
   git push origin feature/your-feature-name
   ```
6. Open a pull request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
Bhaskar - bhaskarkashyap1612@gmail.com

## Project Link: [https://github.com/Bhaskar1612/Bookerie](https://github.com/Bhaskar1612/Bookerie)
