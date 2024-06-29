from fastapi import FastAPI, HTTPException, Depends,status
from databases import Database
from pydantic import BaseModel
from typing import Optional
from typing import List
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from jose import jwt,JWTError
from passlib.context import CryptContext
from translate import Translator
import requests
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

DATABASE_URL = "sqlite:///./readit.db"  # Change this to your actual database URL

SECRET_KEY ="bfc881917fb293f6406d0379f4810a573341dad45c908a32334ccd3826e42e4a"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30

class Token(BaseModel):
    access_token:str
    token_type:str

class TokenData(BaseModel):
    username: Optional[str] = None

pwd_context =  CryptContext(schemes=["bcrypt"],deprecated="auto")
oauth_2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


database = Database(DATABASE_URL)

create_table_queries = [
    """
    CREATE TABLE Customer(
    Customer_ID int NOT NULL PRIMARY KEY,
    Customer_Name varchar(45) NOT NULL,
    Customer_Email varchar(45) UNIQUE,
    Customer_Password varchar(45) NOT NULL,
    Customer_Phone char(12) NOT NULL,
    Customer_Address varchar(45) NOT NULL
)""","""CREATE TABLE Admin(
    Admin_ID int NOT NULL PRIMARY KEY,
    Admin_Name varchar(45) NOT NULL,
    Admin_Password varchar(45) NOT NULL
)""","""CREATE TABLE Genre(
    Genre_ID int NOT NULL PRIMARY KEY,
    Genre_Name varchar(45) NOT NULL,
    Genre_Discount int NOT NULL DEFAULT 0,
    CHECK (Genre_Discount >= 0)
)""","""CREATE TABLE Book(
    Book_ID int NOT NULL PRIMARY KEY,
    Book_Name varchar(45) NOT NULL,
    Book_Author varchar(45) NOT NULL,
    Book_Price int NOT NULL,
    Book_Genre int NOT NULL,
    Book_Rating Decimal NOT NULL DEFAULT 0,
    CHECK (Book_Price >= 0),
    CHECK (
        Book_Rating >= 0
        AND Book_Rating <= 5
    ),
    FOREIGN KEY (Book_Genre) REFERENCES Genre(Genre_ID) ON DELETE CASCADE ON UPDATE CASCADE
)""","""CREATE TABLE Supplier(
    Supplier_ID int NOT NULL PRIMARY KEY,
    Supplier_Name varchar(45) NOT NULL,
    Supplier_Email varchar(45) UNIQUE,
    Supplier_Phone char(12) NOT NULL
)""","""CREATE TABLE Supplies(
    Supplier_ID int NOT NULL,
    Book_ID int NOT NULL,
    Date_Supplied date NOT NULL,
    Book_Quantity int NOT NULL DEFAULT 0,
    Buy_Cost int NOT NULL DEFAULT 0,
    PRIMARY KEY (Supplier_ID, Book_ID, Date_Supplied),
    FOREIGN KEY (Supplier_ID) REFERENCES Supplier(Supplier_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Book_ID) REFERENCES Book(Book_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    CHECK (Book_Quantity >= 0),
    CHECK (Buy_Cost >= 0)
)""","""CREATE TABLE Delivery_Partner(
    Partner_ID int NOT NULL PRIMARY KEY,
    Partner_Name varchar(45) NOT NULL,
    Partner_Email varchar(45) UNIQUE,
    Partner_Phone char(12) NOT NULL,
    Partner_Password varchar(45) NOT NULL,
    Partner_Rating double DEFAULT 0
)""","""CREATE TABLE Cart(
    Customer_ID int NOT NULL,
    Book_ID int NOT NULL,
    Quantity int NOT NULL,
    PRIMARY KEY (Customer_ID, Book_ID),
    FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Book_ID) REFERENCES Book(Book_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    CHECK (Quantity >= 1)
)""","""CREATE TABLE Orders(
    Order_ID int NOT NULL,
    Customer_ID int NOT NULL,
    Delivery_Partner_ID int,
    Order_Status varchar(45) NOT NULL,
    Order_Total int NOT NULL DEFAULT 0,
    Delivery_Cost int NOT NULL DEFAULT 0,
    Order_Date date NOT NULL,
    Book_ID int NOT NULL,
    Quantity int NOT NULL,
    PRIMARY KEY (Order_ID, Customer_ID),
    FOREIGN KEY (Delivery_Partner_ID) REFERENCES Delivery_Partner(Partner_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Book_ID) REFERENCES Book(Book_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    CHECK (Order_Total >= 0),
    CHECK (Quantity >1)
)"""
    
]

async def create_tables():
    async with database.transaction():
        try:
            q="SELECT * FROM CUSTOMER"
            await database.fetch_one(q)
        except:
            for query in create_table_queries:
                await database.execute(query)


class Customer(BaseModel):
    Customer_ID: int
    Customer_Name: str
    Customer_Email: str
    Customer_Password: str
    Customer_Phone: str
    Customer_Address: str

    class Config:
        orm_mode = True
    

async def create_customer(customer: Customer):
    # Hash the password before storing it in the database
    hashed_password = get_pwd_hash(customer.Customer_Password)
    
    query = """
    INSERT INTO Customer (Customer_ID, Customer_Name, Customer_Email, Customer_Password, Customer_Phone, Customer_Address)
    VALUES (:Customer_ID, :Customer_Name, :Customer_Email, :Customer_Password, :Customer_Phone, :Customer_Address)
    """
    
    await database.execute(query, {"Customer_ID":customer.Customer_ID,"Customer_Name":customer.Customer_Name,"Customer_Email":customer.Customer_Email,"Customer_Password":hashed_password,"Customer_Phone":customer.Customer_Phone,"Customer_Address":customer.Customer_Address})
    return customer

class Admin(BaseModel):
    Admin_ID: int
    Admin_Name: str
    Admin_Password: str

async def create_admin(admin: Admin):
    hashed_password = get_pwd_hash(admin.Admin_Password)

    query = """
    INSERT INTO Admin (Admin_ID, Admin_Name, Admin_Password)
    VALUES (:Admin_ID, :Admin_Name, :Admin_Password)
    """
    await database.execute(query, {"Admin_ID":admin.Admin_ID,"Admin_Name":admin.Admin_Name,"Admin_Password":hashed_password})
    return admin

class Genre(BaseModel):
    Genre_ID: int
    Genre_Name: str
    Genre_Discount: int

async def create_genre(genre: Genre):
    query = """
    INSERT INTO Genre (Genre_ID, Genre_Name, Genre_Discount)
    VALUES (:Genre_ID, :Genre_Name, :Genre_Discount)
    """
    await database.execute(query, genre.dict())
    return genre

class Book(BaseModel):
    Book_ID: int
    Book_Name: str
    Book_Author: str
    Book_Price: int
    Book_Genre: int
    Book_Rating: float

async def create_book(book: Book):
          query = """

          INSERT INTO Book (Book_ID, Book_Name, Book_Author, Book_Price, Book_Genre, Book_Rating)
          VALUES (:Book_ID, :Book_Name, :Book_Author, :Book_Price, :Book_Genre, :Book_Rating)
          """

          await database.execute(query, book.dict())
          return book
    
        

class Supplier(BaseModel):
    Supplier_ID: int
    Supplier_Name: str
    Supplier_Email: str
    Supplier_Phone: str

async def create_supplier(supplier: Supplier):
    query = """
    INSERT INTO Supplier (Supplier_ID, Supplier_Name, Supplier_Email, Supplier_Phone)
    VALUES (:Supplier_ID, :Supplier_Name, :Supplier_Email, :Supplier_Phone)
    """
    await database.execute(query, supplier.dict())
    return supplier

class Supplies(BaseModel):
    Supplier_ID: int
    Book_ID: int
    Date_Supplied: str
    Book_Quantity: int
    Buy_Cost: int

async def create_supplies(supplies: Supplies):
    query = """
    INSERT INTO Supplies (Supplier_ID, Book_ID, Date_Supplied, Book_Quantity, Buy_Cost)
    VALUES (:Supplier_ID, :Book_ID, :Date_Supplied, :Book_Quantity, :Buy_Cost) 
    """
    await database.execute(query, supplies.dict())
    return supplies

class DeliveryPartner(BaseModel):
    Partner_ID: int
    Partner_Name: str
    Partner_Email: str
    Partner_Phone: str
    Partner_Password: str
    Partner_Rating: float

async def create_delivery_partner(partner: DeliveryPartner):
    query = """
    INSERT INTO Delivery_Partner (Partner_ID, Partner_Name, Partner_Email, Partner_Phone, Partner_Password, Partner_Rating)
    VALUES (:Partner_ID, :Partner_Name, :Partner_Email, :Partner_Phone, :Partner_Password, :Partner_Rating)
    """
    await database.execute(query, partner.dict())
    return partner

class Cart(BaseModel):
    Customer_ID: int
    Book_ID: int
    Quantity: int

async def create_cart(cart: Cart):
    query = """
    INSERT INTO Cart (Customer_ID, Book_ID, Quantity)
    VALUES (:Customer_ID, :Book_ID, :Quantity)
    """
    await database.execute(query, cart.dict())
    return cart

class Order(BaseModel):
    Order_ID: int
    Customer_ID: int
    Delivery_Partner_ID: int
    Order_Status: str
    Order_Total: int
    Delivery_Cost: int
    Order_Date: str
    Book_ID: int
    Quantity: int

async def create_order(order: Order):
    query = """
    INSERT INTO Orders (Order_ID, Customer_ID, Delivery_Partner_ID, Order_Status, Order_Total, Delivery_Cost, Order_Date, Book_ID, Quantity)
    VALUES (:Order_ID, :Customer_ID, :Delivery_Partner_ID, :Order_Status, :Order_Total, :Delivery_Cost, :Order_Date, :Book_ID, :Quantity)
    """
    await database.execute(query, order.dict())
    return order



def verify_pwd(plain_pwd,hashed_pwd):
    return pwd_context.verify(plain_pwd,hashed_pwd)

def get_pwd_hash(password):
    return pwd_context.hash(password)

async def get_user(email: str):
    query = "SELECT * FROM Customer WHERE Customer_Email = :email"
    user = await database.fetch_one(query, {"email": email})
    if user:
        return Customer(Customer_ID=user[0], Customer_Name=user[1], Customer_Email=user[2], Customer_Password=user[3], Customer_Phone=user[4], Customer_Address=user[5])
    return None
    
async def authenticate_user(email: str, password: str):
    user = await get_user(email)
    if not user:
        return False
    if not verify_pwd(password, user.Customer_Password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth_2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = await get_user(username)
    if user is None:
        raise credentials_exception
    return user

@app.post("/token",response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.Customer_Email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}



async def get_admin(name: str):
    query = "SELECT * FROM Admin WHERE Admin_Name = :name"
    user = await database.fetch_one(query, {"name": name})
    if user:
        return Admin(Admin_ID=user[0], Admin_Name=user[1], Admin_Password=user[2])
    return None
    
async def authenticate_admin(name: str, password: str):
    user = await get_admin(name)
    if not user:
        return False
    if not verify_pwd(password, user.Admin_Password):
        return False
    return user

def create_admin_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_admin(token: str = Depends(oauth_2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = await get_admin(username)
    if user is None:
        raise credentials_exception
    return user

@app.post("/token_admin",response_model=Token)
async def login_admin_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_admin(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_admin_access_token(
        data={"sub": user.Admin_Name}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}



@app.get("/customers/me", response_model=Customer)
async def read_users_me(current_user: Customer = Depends(get_current_user)):
    return current_user

@app.on_event("startup")
async def startup():
    await database.connect()
    await create_tables()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.post("/customers/")
async def create_customer_endpoint(customer: Customer):
    created_customer = await create_customer(customer)
    return created_customer

@app.post("/admins/")
async def create_admin_endpoint(admin: Admin):
    created_admin = await create_admin(admin)
    return created_admin

@app.post("/genres/")
async def create_genre_endpoint(genre: Genre):
    created_genre = await create_genre(genre)
    return created_genre

@app.post("/books/")
async def create_book_endpoint(book: Book):
    created_book = await create_book(book)
    return created_book

@app.post("/suppliers/")
async def create_supplier_endpoint(supplier: Supplier):
    created_supplier =     await create_supplier(supplier)
    return created_supplier

@app.post("/supplies/")
async def create_supplies_endpoint(supplies: Supplies):
    created_supplies = await create_supplies(supplies)
    return created_supplies

@app.post("/delivery-partners/")
async def create_delivery_partner_endpoint(partner: DeliveryPartner):
    created_partner = await create_delivery_partner(partner)
    return created_partner

@app.post("/carts/")
async def create_cart_endpoint(cart: Cart):
    created_cart = await create_cart(cart)
    return created_cart

@app.post("/orders/")
async def create_order_endpoint(order: Order):
    created_order = await create_order(order)
    return created_order

@app.get("/customers/")
async def get_customers():
    query = """SELECT * FROM Customer"""
    customers = await database.fetch_all(query)
    return customers

@app.get("/admins/")
async def get_admins():
    query = "SELECT * FROM Admin"
    admins = await database.fetch_all(query)
    return admins

@app.get("/genres/")
async def get_genres():
    query = "SELECT * FROM Genre"
    genres = await database.fetch_all(query)
    return genres

@app.get("/books/")
async def get_books():
    query = "SELECT * FROM Book"
    books = await database.fetch_all(query)
    return books

@app.get("/suppliers/")
async def get_suppliers():
    query = "SELECT * FROM Supplier"
    suppliers = await database.fetch_all(query)
    return suppliers


@app.get("/supplies/")
async def get_supplies():
    query = "SELECT * FROM Supplies"
    supplies = await database.fetch_all(query)
    return supplies

@app.get("/suppliesIndividual/{book_ID}")
async def get_supplies(book_ID):
    query = """SELECT * FROM Supplies WHERE BOOK_ID =:BOOK_ID
    """
    values={"BOOK_ID" :book_ID
    }
    supplies = await database.fetch_all(query=query,values=values)
    return supplies

@app.get("/delivery-partners/")
async def get_delivery_partners():
    query = "SELECT * FROM Delivery_Partner"
    delivery_partners = await database.fetch_all(query)
    return delivery_partners

@app.get("/carts/{customer_id}")
async def get_carts(customer_id:int):
    query = "SELECT * FROM Cart WHERE Customer_ID = :customer_id"
    carts = await database.fetch_all(query,values={"customer_id": customer_id})
    return carts

@app.get("/orders/")
async def get_orders():
    query = "SELECT * FROM Orders"
    orders = await database.fetch_all(query)
    return orders

@app.get("/ordersIndividual/{customer_id}")
async def get_orders(customer_id:int):
    query = "SELECT * FROM Orders WHERE Customer_ID = :Customer_id"
    orders = await database.fetch_all(query,values={"Customer_id": customer_id})
    return orders




# Update function for Customer table
@app.put("/customers/{customer_id}")
async def update_customer(customer_id: int, customer: Customer):
    query = """
    UPDATE Customer
    SET Customer_Name = :Customer_Name,
        Customer_Email = :Customer_Email,
        Customer_Password = :Customer_Password,
        Customer_Phone = :Customer_Phone,
        Customer_Address = :Customer_Address
    WHERE Customer_ID = :Customer_ID
    """
    values = {
        "Customer_ID": customer_id,
        "Customer_Name": customer.Customer_Name,
        "Customer_Email": customer.Customer_Email,
        "Customer_Password": customer.Customer_Password,
        "Customer_Phone": customer.Customer_Phone,
        "Customer_Address": customer.Customer_Address
    }
    await database.execute(query=query, values=values)

# Update function for Admin table
@app.put("/admins/{admin_id}")
async def update_admin(admin_id: int, admin: Admin):
    query = """
    UPDATE Admin
    SET Admin_Name = :Admin_Name,
        Admin_Password = :Admin_Password
    WHERE Admin_ID = :Admin_ID
    """
    values = {
        "Admin_ID": admin_id,
        "Admin_Name": admin.Admin_Name,
        "Admin_Password": admin.Admin_Password
    }
    await database.execute(query=query, values=values)

# Update function for Genre table
@app.put("/genres/{genre_id}")
async def update_genre(genre_id: int, genre: Genre):
    query = """
    UPDATE Genre
    SET Genre_Name = :Genre_Name,
        Genre_Discount = :Genre_Discount
    WHERE Genre_ID = :Genre_ID
    """
    values = {
        "Genre_ID": genre_id,
        "Genre_Name": genre.Genre_Name,
        "Genre_Discount": genre.Genre_Discount
    }
    await database.execute(query=query, values=values)

# Update function for Book table
@app.put("/books/{book_id}")
async def update_book(book_id: int, book: Book):
    query = """
    UPDATE Book
    SET Book_Name = :Book_Name,
        Book_Author = :Book_Author,
        Book_Price = :Book_Price,
        Book_Genre = :Book_Genre,
        Book_Rating = :Book_Rating
    WHERE Book_ID = :Book_ID
    """
    values = {
        "Book_ID": book_id,
        "Book_Name": book.Book_Name,
        "Book_Author": book.Book_Author,
        "Book_Price": book.Book_Price,
        "Book_Genre": book.Book_Genre,
        "Book_Rating": book.Book_Rating
    }
    await database.execute(query=query, values=values)

# Update function for Supplier table
@app.put("/suppliers/{supplier_id}")
async def update_supplier(supplier_id: int, supplier: Supplier):
    query = """
    UPDATE Supplier
    SET Supplier_Name = :Supplier_Name,
        Supplier_Email = :Supplier_Email,
        Supplier_Phone = :Supplier_Phone
    WHERE Supplier_ID = :Supplier_ID
    """
    values = {
        "Supplier_ID": supplier_id,
        "Supplier_Name": supplier.Supplier_Name,
        "Supplier_Email": supplier.Supplier_Email,
        "Supplier_Phone": supplier.Supplier_Phone
    }
    await database.execute(query=query, values=values)

# Update function for Supplies table
@app.put("/supplies/{supplier_id}/{book_id}")
async def update_supplies(supplier_id: int, book_id: int, supplies: Supplies):
    query = """
    UPDATE Supplies
    SET Date_Supplied = :Date_Supplied,
        Book_Quantity = :Book_Quantity,
        Buy_Cost = :Buy_Cost
    WHERE Supplier_ID = :Supplier_ID AND Book_ID = :Book_ID
    """
    values = {
        "Supplier_ID": supplier_id,
        "Book_ID": book_id,
        "Date_Supplied": supplies.Date_Supplied,
        "Book_Quantity": supplies.Book_Quantity,
        "Buy_Cost": supplies.Buy_Cost
    }
    await database.execute(query=query, values=values)
    

# Update function for Delivery_Partner table
@app.put("/delivery-partners/{partner_id}")
async def update_delivery_partner(partner_id: int, partner: DeliveryPartner):
    query = """
    UPDATE Delivery_Partner
    SET Partner_Name = :Partner_Name,
        Partner_Email = :Partner_Email,
        Partner_Phone = :Partner_Phone,
        Partner_Password = :Partner_Password,
        Partner_Rating = :Partner_Rating
    WHERE Partner_ID = :Partner_ID
    """
    values = {
        "Partner_ID": partner_id,
        "Partner_Name": partner.Partner_Name,
        "Partner_Email": partner.Partner_Email,
        "Partner_Phone": partner.Partner_Phone,
        "Partner_Password": partner.Partner_Password,
        "Partner_Rating": partner.Partner_Rating
    }
    await database.execute(query=query, values=values)

# Update function for Cart table
@app.put("/carts/{customer_id}/{book_id}")
async def update_cart(customer_id: int, book_id: int, cart: Cart):
    query = """
    UPDATE Cart
    SET Quantity = :Quantity
    WHERE Customer_ID = :Customer_ID AND Book_ID = :Book_ID
    """
    values = {
        "Customer_ID": customer_id,
        "Book_ID": book_id,
        "Quantity": cart.Quantity
    }
    await database.execute(query=query, values=values)

# Update function for Orders table
@app.put("/orders/{order_id}/{customer_id}")
async def update_order(order_id: int, customer_id: int, order: Order):
    query = """
    UPDATE Orders
    SET Delivery_Partner_ID = :Delivery_Partner_ID,
        Order_Status = :Order_Status,
        Order_Total = :Order_Total,
        Delivery_Cost = :Delivery_Cost,
        Order_Date = :Order_Date,
        Book_ID = :Book_ID,
        Quantity = :Quantity

    WHERE Order_ID = :Order_ID AND Customer_ID = :Customer_ID
    """
    values = {
        "Order_ID": order_id,
        "Customer_ID": customer_id,
        "Delivery_Partner_ID": order.Delivery_Partner_ID,
        "Order_Status": order.Order_Status,
        "Order_Total": order.Order_Total,
        "Delivery_Cost": order.Delivery_Cost,
        "Order_Date": order.Order_Date,
        "Book_ID": order.Book_ID,
        "Quantity": order.Quantity
    }
    await database.execute(query=query, values=values)




# Delete function for Customer table
@app.delete("/customers/{customer_id}")
async def delete_customer(customer_id: int):
    query = """
    DELETE FROM Customer WHERE Customer_ID = :Customer_ID
    """
    values = {"Customer_ID": customer_id}
    await database.execute(query=query, values=values)

# Delete function for Admin table
@app.delete("/admins/{admin_id}")
async def delete_admin(admin_id: int):
    query = """
    DELETE FROM Admin WHERE Admin_ID = :Admin_ID
    """
    values = {"Admin_ID": admin_id}
    await database.execute(query=query, values=values)

# Delete function for Genre table
@app.delete("/genres/{genre_id}")
async def delete_genre(genre_id: int):
    query = """
    DELETE FROM Genre WHERE Genre_ID = :Genre_ID
    """
    values = {"Genre_ID": genre_id}
    await database.execute(query=query, values=values)

# Delete function for Book table
@app.delete("/books/{book_id}")
async def delete_book(book_id: int):
    query = """
    DELETE FROM Book WHERE Book_ID = :Book_ID
    """
    values = {"Book_ID": book_id}
    await database.execute(query=query, values=values)

# Delete function for Supplier table
@app.delete("/suppliers/{supplier_id}")
async def delete_supplier(supplier_id: int):
    query = """
    DELETE FROM Supplier WHERE Supplier_ID = :Supplier_ID
    """
    values = {"Supplier_ID": supplier_id}
    await database.execute(query=query, values=values)

# Delete function for Supplies table
@app.delete("/supplies/{supplier_id}/{book_id}")
async def delete_supplies(supplier_id: int, book_id: int, date_supplied: str):
    query = """
    DELETE FROM Supplies WHERE Supplier_ID = :Supplier_ID AND Book_ID = :Book_ID AND Date_Supplied = :Date_Supplied
    """
    values = {
        "Supplier_ID": supplier_id,
        "Book_ID": book_id,
        "Date_Supplied": date_supplied
    }
    await database.execute(query=query, values=values)

# Delete function for Delivery_Partner table
@app.delete("/delivery-partners/{partner_id}")
async def delete_delivery_partner(partner_id: int):
    query = """
    DELETE FROM Delivery_Partner WHERE Partner_ID = :Partner_ID
    """
    values = {"Partner_ID": partner_id}
    await database.execute(query=query, values=values)

# Delete function for Cart table
@app.delete("/carts/{customer_id}/{book_id}")
async def delete_cart(customer_id: int, book_id: int):
    query = """
    DELETE FROM Cart WHERE Customer_ID = :Customer_ID AND Book_ID = :Book_ID
    """
    values = {"Customer_ID": customer_id, "Book_ID": book_id}
    await database.execute(query=query, values=values)

# Delete function for Orders table
@app.delete("/orders/{order_id}/{customer_id}")
async def delete_order(order_id: int,customer_id:int):
    query = """
    DELETE FROM Orders WHERE Order_ID = :Order_ID AND Customer_ID= :Customer_ID
    """
    values = {"Order_ID": order_id,"Customer_ID": customer_id}
    await database.execute(query=query, values=values)



