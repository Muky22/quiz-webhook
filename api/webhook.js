const admin = require("firebase-admin")

if (!admin.apps.length) {
  admin.initializeApp()
}

const db = admin.firestore()

module.exports = async (req, res) => {
  try {
    const event = req.body

    console.log("EVENT:", event?.type)

    if (event?.type === "checkout.session.completed") {
      const session = event.data.object
      const email = session?.customer_details?.email

      console.log("PAID USER:", email)

      if (email) {
        await db.collection("players").doc(email).set({
          paid: true
        })
      }
    }

    res.status(200).json({ received: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "fail" })
  }
}