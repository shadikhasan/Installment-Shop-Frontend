import React, { useEffect, useState } from 'react';
import { authAxios, publicAxios } from '../../axiosConfig';
import PurchaseHistory from './PurchaseHistory';
import { CButton } from '@coreui/react';
import { toast } from 'react-toastify'; // Import toast

const AddPurchaseForm = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    product: '',
    quantity: 1,
    purchase_date: new Date().toISOString().split('T')[0],
    purchase_time: new Date().toTimeString().slice(0, 5),
    first_installment_amount: 0,
    installment_count: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    publicAxios
      .get('products/')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Failed to fetch products:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      purchase_date: `${formData.purchase_date}T${formData.purchase_time}`,
    };

    try {
      await authAxios.post('purchases/create/', data);
      toast.success('Purchase added successfully!'); // Success message with Toastify
      setShowForm(false);
    } catch (error) {
      console.error('Error adding purchase:', error);

      if (error.response && error.response.status === 400) {
        setErrorMessage(
          error.response.data.installment_count ||
            error.response.data.first_installment_amount ||
            'An error occurred'
        );
        toast.error(errorMessage); // Error message with Toastify
      } else {
        setErrorMessage('Something went wrong while creating the purchase.');
        toast.error('Something went wrong while creating the purchase.'); // General error message
      }
    }
  };

  const selectedProduct = products.find(
    (p) => p.id === parseInt(formData.product)
  );
  const totalPrice = selectedProduct ? selectedProduct.price * formData.quantity : 0;

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <CButton color="success" onClick={() => setShowForm(true)}>
          + Create New Purchase
        </CButton>
      </div>

      {/* Modal */}
      {showForm && (
        <>
          <div className="modal show fade d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Purchase</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowForm(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Product</label>
                      <select
                        className="form-select"
                        name="product"
                        value={formData.product}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a product</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} (৳{product.price})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        name="quantity"
                        value={formData.quantity}
                        min="1"
                        onChange={handleChange}
                      />
                    </div>

                    {/* 💰 Total Price */}
                    {selectedProduct && (
                      <div className="mb-3 mt-3 ">
                        <label className="form-label fw-bold text-success">
                          Total Price:
                        </label>
                        <div className="">৳{selectedProduct.price} x {formData.quantity}</div>
                        <div className="text-danger fs-4">
                          <label> = ৳</label>
                          <label>{totalPrice}</label>
                        </div>
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="form-label">Purchase Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="purchase_date"
                        value={formData.purchase_date}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Purchase Time</label>
                      <input
                        type="time"
                        className="form-control"
                        name="purchase_time"
                        value={formData.purchase_time}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">First Installment Amount</label>
                      <input
                        type="number"
                        className="form-control"
                        name="first_installment_amount"
                        value={formData.first_installment_amount}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Installment Count</label>
                      <input
                        type="number"
                        className="form-control"
                        name="installment_count"
                        value={formData.installment_count}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Error message */}
                    {errorMessage && (
                      <div className="alert alert-danger" role="alert">
                        {errorMessage}
                      </div>
                    )}

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowForm(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Submit Purchase
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Backdrop */}
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      <PurchaseHistory />
    </>
  );
};

export default AddPurchaseForm;
