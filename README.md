
# Installment Shop Frontend (final version 1.0)

## Description

Installment Shop is a comprehensive and user-friendly platform that allows users to shop for products on installments. With a modern, intuitive interface, it enables customers to browse products, track their orders, and manage installment payments effectively.

This is the **Frontend** of the Installment Shop, developed using React.js. It interfaces with the backend API to provide a smooth user experience, displaying product catalogs, customer profiles, and payment history.

---

## Features

- **User Registration & Login**: Create an account and securely log in.
- **Product Browsing**: Browse a wide range of products available for installment purchases.
- **Installment Management**: View and manage installment payments.
- **Real-Time Payment Tracking**: Track your installment payments and due amounts.
- **Responsive Design**: Fully responsive for mobile, tablet, and desktop views.

---

## Technologies Used

- **React.js**: For building the UI and handling state management.
- **Redux**: For global state management across the app.
- **Axios**: To make HTTP requests to the backend API.
- **React-Router**: For client-side routing.
- **CoreUI**: A UI library for building the admin dashboard and other components.
- **Chart.js**: For displaying graphical data representations.

---

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/shadikhasan/Installment-Shop-Frontend.git
   ```

2. **Navigate into the project directory**:

   ```bash
   cd Installment-Shop-Frontend
   ```

3. **Install the dependencies**:

   ```bash
   npm install
   ```

4. **Start the development server**:

   ```bash
   npm start
   ```

   This will start the React app on [http://localhost:3000](http://localhost:3000).

---

## API Integration

This frontend application interacts with the following API endpoints:

- **/api/products**: To fetch the list of products.
- **/api/users**: For user registration, login, and profile management.
- **/api/installments**: For managing installment payments.

Make sure the backend is running and accessible at the correct endpoint.

---

## Folder Structure

```
/src
  /assets                # Images, icons, and other assets
  /components            # Reusable UI components
  /pages                 # Page-level components (e.g., ProductPage, LoginPage)
  /redux                 # Redux state management (actions, reducers)
  /utils                 # Utility functions and helper methods
  /styles                # Global styles and theming
  /hooks                 # Custom React hooks
  /api                   # API service calls (Axios setup)
```

---

## Contribution Guidelines

1. **Fork the repository**: If you want to contribute, fork the repo to your GitHub account.
2. **Create a new branch**: Create a branch from the `main` branch for your changes.
3. **Make your changes**: Implement your feature or fix the issue.
4. **Commit your changes**: Make meaningful commit messages.
5. **Submit a pull request**: Open a pull request with a detailed explanation of your changes.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgements

- **CoreUI**: A great React UI component library used in this project.
- **Chart.js**: Used to display statistical charts in the dashboard.
- **React**: The core library that powers this project.
- **Redux**: For state management across the application.

---

## Contact

For any questions or issues, feel free to open an issue on GitHub or reach out to the project maintainers.

- **Author**: Shadik Hasan
- **GitHub**: [shadikhasan](https://github.com/shadikhasan)
