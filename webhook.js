export default async function handler(req, res) {
  try {
    const event = req.body

    if (event.type === "checkout.session.completed") {
      const session = event.data.object

      const email = session.customer_email

      console.log("PAID USER:", email)
    }

    res.status(200).json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Webhook failed" })
  }
}
