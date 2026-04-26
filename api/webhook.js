export default function handler(req, res) {
  try {
    const event = req.body

    console.log("Webhook received:", event?.type)

    // Stripe payment success event
    if (event?.type === "checkout.session.completed") {
      const session = event.data.object

      const email = session?.customer_email

      console.log("💰 PAID USER:", email)
    }

    res.status(200).json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    res.status(500).json({ error: "Webhook failed" })
  }
}