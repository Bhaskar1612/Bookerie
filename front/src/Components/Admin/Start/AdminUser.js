
import './AdminUser.css';
import { Link } from 'react-router-dom';

function AdminUser() {
  

  return (
  <div className="admin-container">
    <h5> Welcome Admin</h5>
     <Link to="/admin/genre" className="add-link">Genres</Link>
     <Link to="/admin/admin" className="add-link">Admins</Link>
     <Link to="/admin/customer" className="add-link">Customers</Link>
     <Link to="/admin/book" className="add-link">Books</Link>
     <Link to="/admin/supplier" className="add-link">Suppliers</Link>
     <Link to="/admin/supplies" className="add-link">Supplies</Link>
     <Link to="/admin/order" className="add-link">Orders</Link>
     <Link to="/admin/partner" className="add-link">Partners</Link>
  </div>
);


}

export default AdminUser;
