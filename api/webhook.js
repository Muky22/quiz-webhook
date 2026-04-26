export default async function handler(req, res) {
  const event = req.body

  if (event.type === "checkout.session.completed") {
    const session = event.data.object

    console.log("PAID:", session.customer_email)
  }

  res.status(200).json({ ok: true })
}
