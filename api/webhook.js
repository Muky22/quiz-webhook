module.exports = async (req, res) => {
  try {
    const event = req.body

    console.log("EVENT:", event?.type)

    if (event?.type === "checkout.session.completed") {
      const session = event.data.object

      const email = session?.customer_email

      console.log("PAID USER:", email)

      // sem potom dáme Firestore save
    }

    res.status(200).json({ received: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "fail" })
  }
}