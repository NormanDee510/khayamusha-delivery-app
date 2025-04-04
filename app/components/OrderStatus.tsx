export default function OrderStatus({ order, driver }) {
  return (
    <div className="bg-green-100 p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">KhayaMusha Order Status</h2>
      <p>
        <strong>Delivery Address:</strong> {order.address}
      </p>
      <p>
        <strong>Order Items:</strong> {order.items}
      </p>
      <p>
        <strong>KhayaMusha Driver:</strong> {driver.name}
      </p>
      <p>
        <strong>Estimated Delivery Time:</strong> 30 minutes
      </p>
    </div>
  )
}

