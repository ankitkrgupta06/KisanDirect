import React from "react";
import "./AdminDashboard.css";

const farmers = [
  {
    id: 1,
    name: "Ramesh Kumar",
    location: "Patna, Bihar",
    products: 4,
    orders: 8,
    sales: "₹14,500",
    status: "Active",
  },
  {
    id: 2,
    name: "Sunita Devi",
    location: "Nalanda, Bihar",
    products: 3,
    orders: 6,
    sales: "₹11,200",
    status: "Active",
  },
  {
    id: 3,
    name: "Amit Kumar",
    location: "Vaishali, Bihar",
    products: 5,
    orders: 10,
    sales: "₹17,150",
    status: "Active",
  },
];

const buyers = [
  {
    id: 1,
    name: "FreshMart",
    location: "Patna, Bihar",
    orders: 9,
    purchases: "₹18,500",
    status: "Active",
  },
  {
    id: 2,
    name: "Local Basket",
    location: "Muzaffarpur, Bihar",
    orders: 7,
    purchases: "₹12,850",
    status: "Active",
  },
  {
    id: 3,
    name: "Green Grocery",
    location: "Gaya, Bihar",
    orders: 8,
    purchases: "₹11,500",
    status: "Active",
  },
];

const recentOrders = [
  {
    id: "#KD1024",
    buyer: "FreshMart",
    farmer: "Ramesh Kumar",
    product: "Tomato",
    quantity: "100 kg",
    amount: "₹3,200",
    status: "Delivered",
  },
  {
    id: "#KD1023",
    buyer: "Local Basket",
    farmer: "Sunita Devi",
    product: "Potato",
    quantity: "75 kg",
    amount: "₹2,100",
    status: "In Transit",
  },
  {
    id: "#KD1022",
    buyer: "Green Grocery",
    farmer: "Amit Kumar",
    product: "Onion",
    quantity: "80 kg",
    amount: "₹2,800",
    status: "Pending",
  },
  {
    id: "#KD1021",
    buyer: "FreshMart",
    farmer: "Amit Kumar",
    product: "Wheat",
    quantity: "120 kg",
    amount: "₹3,720",
    status: "Delivered",
  },
];

const activities = [
  {
    icon: "👨‍🌾",
    text: "New farmer registered",
    name: "Amit Kumar",
    time: "10 minutes ago",
  },
  {
    icon: "🛒",
    text: "New order received",
    name: "#KD1024",
    time: "32 minutes ago",
  },
  {
    icon: "🚚",
    text: "Delivery updated",
    name: "#DL2041",
    time: "1 hour ago",
  },
  {
    icon: "💰",
    text: "Payment received",
    name: "₹3,200",
    time: "2 hours ago",
  },
];

function StatCard({ icon, title, value, subtitle, className }) {
  return (
    <div className={`stat-card ${className || ""}`}>
      <div className="stat-card-top">
        <div className="stat-icon">{icon}</div>
        <span className="stat-menu">•••</span>
      </div>

      <div className="stat-title">{title}</div>

      <div className="stat-value">{value}</div>

      <div className="stat-subtitle">{subtitle}</div>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="admin-page">
      {/* ================= SIDEBAR ================= */}

      <aside className="admin-sidebar">
        <div className="admin-logo">
          <div className="logo-icon">🌾</div>

          <div>
            <h2>KisanDirect</h2>
            <span>Admin Portal</span>
          </div>
        </div>

        <nav className="admin-nav">
          <div className="nav-section-title">MAIN</div>

          <a href="#" className="nav-item active">
            <span>📊</span>
            Dashboard
          </a>

          <a href="#" className="nav-item">
            <span>👨‍🌾</span>
            Farmers
          </a>

          <a href="#" className="nav-item">
            <span>👥</span>
            Buyers
          </a>

          <div className="nav-section-title">MARKETPLACE</div>

          <a href="#" className="nav-item">
            <span>📦</span>
            Products
          </a>

          <a href="#" className="nav-item">
            <span>🛒</span>
            Orders
          </a>

          <a href="#" className="nav-item">
            <span>🚚</span>
            Logistics
          </a>

          <div className="nav-section-title">ANALYTICS</div>

          <a href="#" className="nav-item">
            <span>📈</span>
            Price Forecast
          </a>

          <a href="#" className="nav-item">
            <span>📊</span>
            Reports
          </a>

          <div className="nav-section-title">SYSTEM</div>

          <a href="#" className="nav-item">
            <span>⚙️</span>
            Settings
          </a>
        </nav>

        <div className="admin-profile">
          <div className="profile-avatar">A</div>

          <div className="profile-info">
            <strong>Admin</strong>
            <span>KisanDirect</span>
          </div>

          <span className="profile-more">•••</span>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="admin-main">
        {/* HEADER */}

        <header className="admin-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, Admin. Here's what's happening on KisanDirect.</p>
          </div>

          <div className="header-actions">
            <button className="notification-btn">
              🔔
              <span></span>
            </button>

            <button className="admin-user">
              <div className="header-avatar">A</div>

              <div>
                <strong>Admin</strong>
                <small>Administrator</small>
              </div>

              <span>⌄</span>
            </button>
          </div>
        </header>

        {/* ================= OVERVIEW ================= */}

        <section className="stats-grid">
          <StatCard
            icon="👨‍🌾"
            title="Total Farmers"
            value="3"
            subtitle="+1 this month"
            className="farmer-card"
          />

          <StatCard
            icon="👥"
            title="Total Buyers"
            value="12"
            subtitle="+4 this month"
            className="buyer-card"
          />

          <StatCard
            icon="📦"
            title="Active Products"
            value="8"
            subtitle="Across 3 farmers"
          />

          <StatCard
            icon="🛒"
            title="Total Orders"
            value="24"
            subtitle="+18% this month"
          />

          <StatCard
            icon="💰"
            title="Total Revenue"
            value="₹42,850"
            subtitle="+12.5% this month"
          />

          <StatCard
            icon="🚚"
            title="Active Deliveries"
            value="5"
            subtitle="2 arriving today"
          />
        </section>

        {/* ================= FARMER + BUYER SUMMARY ================= */}

        <section className="summary-grid">
          {/* FARMER SUMMARY */}

          <div className="dashboard-card">
            <div className="card-header">
              <div>
                <h2>Farmer Summary</h2>
                <p>Registered farmers on KisanDirect</p>
              </div>

              <button className="view-btn">View All →</button>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Farmer</th>
                    <th>Location</th>
                    <th>Products</th>
                    <th>Orders</th>
                    <th>Sales</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {farmers.map((farmer) => (
                    <tr key={farmer.id}>
                      <td>
                        <div className="person-cell">
                          <div className="person-avatar farmer-avatar">
                            {farmer.name.charAt(0)}
                          </div>

                          <strong>{farmer.name}</strong>
                        </div>
                      </td>

                      <td>{farmer.location}</td>

                      <td>{farmer.products}</td>

                      <td>{farmer.orders}</td>

                      <td className="money">{farmer.sales}</td>

                      <td>
                        <span className="status active-status">
                          ● {farmer.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* BUYER SUMMARY */}

          <div className="dashboard-card">
            <div className="card-header">
              <div>
                <h2>Buyer Summary</h2>
                <p>Active buyers on the marketplace</p>
              </div>

              <button className="view-btn">View All →</button>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Buyer</th>
                    <th>Location</th>
                    <th>Orders</th>
                    <th>Purchases</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {buyers.map((buyer) => (
                    <tr key={buyer.id}>
                      <td>
                        <div className="person-cell">
                          <div className="person-avatar buyer-avatar">
                            {buyer.name.charAt(0)}
                          </div>

                          <strong>{buyer.name}</strong>
                        </div>
                      </td>

                      <td>{buyer.location}</td>

                      <td>{buyer.orders}</td>

                      <td className="money">{buyer.purchases}</td>

                      <td>
                        <span className="status active-status">
                          ● {buyer.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ================= LOWER SECTION ================= */}

        <section className="lower-grid">
          {/* RECENT ORDERS */}

          <div className="dashboard-card orders-card">
            <div className="card-header">
              <div>
                <h2>Recent Orders</h2>
                <p>Latest marketplace transactions</p>
              </div>

              <button className="view-btn">View All →</button>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Buyer</th>
                    <th>Product</th>
                    <th>Farmer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <strong>{order.id}</strong>
                      </td>

                      <td>{order.buyer}</td>

                      <td>
                        <div>
                          <strong>{order.product}</strong>
                          <small className="quantity">{order.quantity}</small>
                        </div>
                      </td>

                      <td>{order.farmer}</td>

                      <td className="money">{order.amount}</td>

                      <td>
                        <span
                          className={`status ${
                            order.status === "Delivered"
                              ? "delivered-status"
                              : order.status === "In Transit"
                                ? "transit-status"
                                : "pending-status"
                          }`}
                        >
                          ● {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ACTIVITY */}

          <div className="dashboard-card activity-card">
            <div className="card-header">
              <div>
                <h2>Recent Activity</h2>
                <p>Latest system activity</p>
              </div>
            </div>

            <div className="activity-list">
              {activities.map((activity, index) => (
                <div className="activity-item" key={index}>
                  <div className="activity-icon">{activity.icon}</div>

                  <div className="activity-content">
                    <strong>{activity.text}</strong>

                    <span>{activity.name}</span>

                    <small>{activity.time}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FOOTER ================= */}

        <footer className="admin-footer">
          <span>© 2026 KisanDirect Admin Portal</span>

          <span>Direct • Transparent • Efficient</span>
        </footer>
      </main>
    </div>
  );
}

export default AdminDashboard;
