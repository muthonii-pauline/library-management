import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-0 ">
      <div className="container my-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold">Library Management System</h1>
          <p className="lead">
            Easily manage books, users, and borrowing records with just a few
            clicks.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          <div className="col-md-3">
            <div className="card shadow-sm h-100 text-center p-3">
              <h5 className="card-title">Books</h5>
              <p className="card-text">
                View and manage all books available in the library.
              </p>
              <Link to="/books" className="btn btn-outline-primary">
                Manage Books
              </Link>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm h-100 text-center p-3">
              <h5 className="card-title">Users</h5>
              <p className="card-text">
                Register and update information for library users.
              </p>
              <Link to="/users" className="btn btn-outline-primary">
                Manage Users
              </Link>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm h-100 text-center p-3">
              <h5 className="card-title">Borrows</h5>
              <p className="card-text">
                Track which users have borrowed which books.
              </p>
              <Link to="/borrows" className="btn btn-outline-primary">
                View Borrows
              </Link>
            </div>
          </div>
        </div>

        {/* New Featured Books Section */}
        <div className="mt-5">
          <h2 className="text-center mb-4">Featured Books</h2>
          <div className="row g-4 justify-content-center">
            <div className="col-md-3">
              <div className="card shadow-sm h-100 p-3">
                <h5 className="card-title">The Great Gatsby</h5>
                <p className="card-text">
                  A classic novel by F. Scott Fitzgerald about the American dream.
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card shadow-sm h-100 p-3">
                <h5 className="card-title">To Kill a Mockingbird</h5>
                <p className="card-text">
                  Harper Lee's timeless story of racial injustice in the Deep South.
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card shadow-sm h-100 p-3">
                <h5 className="card-title">1984</h5>
                <p className="card-text">
                  George Orwell's dystopian novel about totalitarianism and surveillance.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;
