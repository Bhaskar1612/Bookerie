// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import AdminPage from './Components/Admin/Start/AdminPage.js';
import CustomerPage from './Components/Customer/CustomerPage';
import Home from './Components/Home';
import ASignIn from './Components/Admin/Start/ASignIn.js';
import ASignUp from './Components/Admin/Start/ASignUp.js';
import CSignIn from './Components/Customer/CSignIn';
import CSignUp from './Components/Customer/CSignUp';
import CustomerUser from './Components/Customer/CustomerUser';
import AdminUser from './Components/Admin/Start/AdminUser.js';
import Cart from './Components/Customer/Cart';
import BookAdd from './Components/Admin/Component/Change/BookAdd.js';
import GenreAdd from './Components/Admin/Component/Change/GenreAdd.js';
import PartnerAdd from './Components/Admin/Component/Change/PartnerAdd.js';
import SupplierAdd from './Components/Admin/Component/Change/SupplierAdd.js';
import OrderDelete from './Components/Admin/Component/Change/OrderDelete.js';
import Orders from './Components/Customer/Orders';
import SuppliesAdd from './Components/Admin/Component/Change/SuppliesAdd.js';
import Admins from './Components/Admin/Component/Admins.js'
import Customers from './Components/Admin/Component/Customers.js'
import Books from './Components/Admin/Component/Books.js'
import Genres from './Components/Admin/Component/Genres.js'
import AOrders from './Components/Admin/Component/AOrders.js'
import Partners from './Components/Admin/Component/Partners.js'
import Suppliers from './Components/Admin/Component/Suppliers.js'
import Supplies from './Components/Admin/Component/Supplies.js'

function App() {
  return (
    <div className="background-container">
    <Router>
      <Routes >
        <Route path='/' element={<Home/>} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path='/customer' element={<CustomerPage />} />
        <Route path='/admin/signin' element={<ASignIn/>} />
        <Route path='/admin/signup' element={<ASignUp/>} />
        <Route path='/customer/signin' element={<CSignIn/>} />
        <Route path='/customer/signup' element={<CSignUp/>} />
        <Route path='/customer/user' element={<CustomerUser/>} />
        <Route path='/admin/user' element={<AdminUser/>} />
        <Route path='/Cart/:userId' element={<Cart/>} />
        <Route path='/addBook' element={<BookAdd/>} />
        <Route path='/addSupplies' element={<SuppliesAdd/>} />
        <Route path='/addGenre' element={<GenreAdd/>} />
        <Route path='/addSupplier' element={<SupplierAdd/>} />
        <Route path='/addPartner' element={<PartnerAdd/>} />
        <Route path='/deleteOrder' element={<OrderDelete/>} />
        <Route path='/orders/:userId' element={<Orders/>} />
        <Route path='/admin/admin' element={<Admins/>} />
        <Route path='/admin/customer' element={<Customers/>} />
        <Route path='/admin/book' element={<Books/>} />
        <Route path='/admin/partner' element={<Partners/>} />
        <Route path='/admin/supplier' element={<Suppliers/>} />
        <Route path='/admin/genre' element={<Genres/>} />
        <Route path='/admin/supplies' element={<Supplies/>} />
        <Route path='/admin/order' element={<AOrders/>} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
