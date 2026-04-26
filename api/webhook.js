const admin = require("firebase-admin")

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)

  admin.initializeApp({
    credential: admin.credential.cert({
      ...serviceAccount,
      private_key: serviceAccount.private_key.replace(/\\n/g, "\n"),
    }),
  })
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